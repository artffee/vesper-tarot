/* =====================================================================
   VESPER — The Frequency Reader
   Measures the "frequency" you're carrying using two real signals:
     1. Body  — fingertip over the camera (photoplethysmography): the
                average red channel oscillates with your pulse.
     2. Voice — a few seconds of speech through the mic (Web Audio):
                loudness + pitch centroid.
   Both feed a single frequency value on a Solfeggio-flavored scale,
   which maps to a named band, a colour, a reading, and a live
   constellation you can drag / zoom / tap.

   Sensors are optional — every step has "Skip", and if a browser blocks
   the camera/mic (e.g. opened from file://) the reading still completes
   from interaction entropy. Nothing is uploaded; it all stays on-device.
   For reflection, not medicine.
   ===================================================================== */

(function () {
  "use strict";

  const app = document.getElementById("freq-app");

  /* ---- Frequency bands ------------------------------------------ */
  const BANDS = [
    { min: 0,   name: "Ember",        tone: 174, color: "#c07a45", kw: ["grounding", "rest", "repair"],
      read: "You're running quiet tonight — an ember, not a bonfire, and there's no shame in that. This is the frequency of rest and repair, of a body asking to be tended rather than driven. Don't mistake low for lost; embers are how fires keep.",
      tip: "Attune upward with warmth — sunlight, a slow breath, one small kindness toward yourself." },
    { min: 300, name: "Stirring",     tone: 396, color: "#d29a41", kw: ["courage", "release", "first light"],
      read: "Something in you is waking. This is the frequency of courage finding its feet — the moment before the leap, when fear and readiness feel almost identical. The heaviness is loosening. Trust the stir.",
      tip: "Name one fear out loud, then take a single step toward it. Momentum loves you here." },
    { min: 417, name: "Open",         tone: 417, color: "#d8b56e", kw: ["willingness", "change", "acceptance"],
      read: "You're open — willing to let the day rearrange you without a fight. A supple, honest frequency, neither clinging nor pushing. Things move easily for people vibrating here; doors that were stuck give way.",
      tip: "Say yes to one thing you'd normally overthink. See where the current takes you." },
    { min: 528, name: "Luminous",     tone: 528, color: "#82c793", kw: ["love", "coherence", "the heart"],
      read: "This is the number the old mystics called the frequency of love — 528, the tone of repair and heart-coherence. You're generous tonight, and it shows. What you send out on this frequency tends to find its way home.",
      tip: "Send the message you've been drafting in your head. Love travels well on 528." },
    { min: 639, name: "Radiant",      tone: 639, color: "#6fb6cf", kw: ["joy", "connection", "flow"],
      read: "You're radiant — connection and joy are moving through you with almost no friction. This is a frequency others can feel across a room. It's not the time to hoard the glow; it's the time to spill it.",
      tip: "Share it outward — call someone, make something, let the brightness overflow." },
    { min: 741, name: "Serene",       tone: 741, color: "#7c8fd4", kw: ["peace", "clarity", "stillness"],
      read: "A serene, clear frequency — the still water that reflects the whole sky. Little rattles you here. Decisions come cleanly because the noise has dropped away. This calm is a resource; treat it like one.",
      tip: "Protect it. Guard your calendar and your yes, and stay in the quiet a while longer." },
    { min: 852, name: "Transcendent", tone: 963, color: "#b195da", kw: ["unity", "insight", "the crown"],
      read: "You're up near the crown tonight — 963, the frequency of unity and wide, quiet awareness. Boundaries feel thin; you can sense how things connect. Rare air. Don't try to explain it while you're in it.",
      tip: "Don't analyse it — witness it. Write down whatever arrives unbidden, then let it go." }
  ];
  function bandFor(freq) {
    let b = BANDS[0];
    for (const band of BANDS) if (freq >= band.min) b = band;
    return b;
  }
  const SOLFEGGIO = [174, 285, 396, 417, 528, 639, 741, 852, 963];
  function nearestTone(freq) {
    return SOLFEGGIO.reduce((a, b) => Math.abs(b - freq) < Math.abs(a - freq) ? b : a);
  }

  /* ---- Reading state -------------------------------------------- */
  const scores = { body: null, voice: null, bpm: null, pitch: null };
  let stream = null;

  function stopStream() {
    if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function avg(a) { return a.reduce((x, y) => x + y, 0) / (a.length || 1); }
  function stdev(a) { const m = avg(a); return Math.sqrt(avg(a.map((v) => (v - m) * (v - m)))); }

  function transition(html, after) {
    app.style.opacity = "0";
    setTimeout(() => {
      app.innerHTML = html;
      app.style.opacity = "1";
      if (after) after();
    }, 260);
  }

  /* ================================================================
     SCREEN: Intro
     ================================================================ */
  function screenIntro() {
    stopStream();
    transition(
      `<div class="freq-screen">
         <span class="eyebrow">The Frequency Reader</span>
         <h1 class="freq-h1">What are you <span class="italic">vibrating</span> at tonight?</h1>
         <p class="freq-lead">Two short readings — a pulse from your fingertip, a moment of your voice —
            and Vesper will name the frequency you're carrying, the tone that matches it, and how to
            move it. Takes under a minute.</p>
         <div class="freq-orb-big"><span>✦</span></div>
         <button class="btn btn-primary" id="freq-begin">Begin the reading</button>
         <p class="freq-fineprint">Camera &amp; microphone are optional and never leave your device.
            This is for reflection, not medicine.</p>
       </div>`,
      () => { document.getElementById("freq-begin").addEventListener("click", screenBody); }
    );
  }

  /* ================================================================
     SCREEN: Body (camera PPG)
     ================================================================ */
  function screenBody() {
    transition(
      `<div class="freq-screen">
         <span class="freq-step">Reading 1 of 2 · Body</span>
         <h2 class="freq-h2">Cover the camera with a fingertip</h2>
         <p class="freq-lead">Rest one fingertip gently over your camera lens — cover it fully, hold still,
            and breathe. I'm listening for your pulse in the light.</p>
         <div class="freq-capture">
           <video id="freq-video" playsinline muted></video>
           <canvas id="freq-wave" width="440" height="120"></canvas>
           <svg class="freq-ring" viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" id="freq-ring-fg" cx="60" cy="60" r="54"/></svg>
           <div class="freq-count" id="freq-count">15</div>
         </div>
         <p class="freq-status" id="freq-status">Preparing the lens…</p>
         <div class="freq-actions">
           <button class="btn btn-primary" id="freq-start" disabled>Start</button>
           <button class="btn btn-ghost" id="freq-skip">Skip this step</button>
         </div>
       </div>`,
      initBody
    );
  }

  async function initBody() {
    const status = document.getElementById("freq-status");
    const startBtn = document.getElementById("freq-start");
    document.getElementById("freq-skip").addEventListener("click", () => { scores.body = null; screenVoice(); });

    const video = document.getElementById("freq-video");
    stopStream();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: 320, height: 240 }, audio: false });
      video.srcObject = stream;
      await video.play();
      status.textContent = "Cover the lens fully, then tap Start.";
      startBtn.disabled = false;
      startBtn.addEventListener("click", () => runBody(video, status), { once: true });
    } catch (e) {
      status.innerHTML = "I couldn't reach the camera — that's alright. <strong>Skip this step</strong> and I'll read you from your voice and the moment itself.";
      startBtn.disabled = true;
    }
  }

  function runBody(video, status) {
    const startBtn = document.getElementById("freq-start");
    startBtn.disabled = true;
    status.textContent = "Hold still… feeling for the pulse in the light.";
    const canvas = document.createElement("canvas");
    canvas.width = 40; canvas.height = 30;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const wave = document.getElementById("freq-wave");
    const wctx = wave.getContext("2d");
    const ringFg = document.getElementById("freq-ring-fg");
    const countEl = document.getElementById("freq-count");
    const R = 54, CIRC = 2 * Math.PI * R;
    ringFg.style.strokeDasharray = CIRC;

    const reds = [], DURATION = 15000;
    const start = performance.now();

    function frame(now) {
      const t = now - start;
      const p = clamp(t / DURATION, 0, 1);
      ringFg.style.strokeDashoffset = CIRC * (1 - p);
      countEl.textContent = Math.ceil((DURATION - t) / 1000);

      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
        reds.push({ r: r / n, other: (g + b) / (2 * n) });
      } catch (e) { /* frame not ready */ }

      // live waveform
      drawWave(wctx, wave, reds);

      if (t < DURATION) { requestAnimationFrame(frame); }
      else { finishBody(reds, status); }
    }
    requestAnimationFrame(frame);
  }

  function drawWave(wctx, wave, reds) {
    wctx.clearRect(0, 0, wave.width, wave.height);
    if (reds.length < 2) return;
    const series = reds.slice(-140).map((x) => x.r);
    const mn = Math.min.apply(null, series), mx = Math.max.apply(null, series);
    const range = (mx - mn) || 1;
    wctx.beginPath();
    series.forEach((v, i) => {
      const x = (i / (series.length - 1)) * wave.width;
      const y = wave.height - ((v - mn) / range) * (wave.height - 16) - 8;
      i ? wctx.lineTo(x, y) : wctx.moveTo(x, y);
    });
    wctx.strokeStyle = "#e4c98a";
    wctx.lineWidth = 2;
    wctx.shadowColor = "rgba(228,201,138,.6)";
    wctx.shadowBlur = 8;
    wctx.stroke();
  }

  function finishBody(reds, status) {
    stopStream();
    if (reds.length < 30) { scores.body = null; screenVoice(); return; }
    const rs = reds.map((x) => x.r);
    // detrend against a short moving average
    const win = 8, det = rs.map((v, i) => {
      let s = 0, c = 0;
      for (let j = Math.max(0, i - win); j <= Math.min(rs.length - 1, i + win); j++) { s += rs[j]; c++; }
      return v - s / c;
    });
    const amp = stdev(det);
    // count pulse peaks
    let peaks = 0;
    for (let i = 1; i < det.length - 1; i++) {
      if (det[i] > det[i - 1] && det[i] >= det[i + 1] && det[i] > amp * 0.55) peaks++;
    }
    const seconds = reds.length / 60; // ~60fps sampling
    const bpm = clamp(Math.round((peaks / seconds) * 60), 48, 120);
    // coverage: finger present => red dominates
    const coverage = clamp(avg(reds.map((x) => (x.r - x.other) / 128)), 0, 1);
    // steadiness of pulse -> higher, calmer frequency
    const steadiness = clamp(1 - Math.abs(bpm - 68) / 60, 0, 1);
    scores.body = clamp(0.35 + steadiness * 0.4 + coverage * 0.25, 0, 1);
    scores.bpm = bpm;
    status.textContent = "Got it.";
    screenVoice();
  }

  /* ================================================================
     SCREEN: Voice
     ================================================================ */
  const PHRASE = "Tonight I am exactly where I need to be, and the light knows my name.";

  function screenVoice() {
    transition(
      `<div class="freq-screen">
         <span class="freq-step">Reading 2 of 2 · Voice</span>
         <h2 class="freq-h2">Say this aloud, slowly</h2>
         <blockquote class="freq-phrase">“${PHRASE}”</blockquote>
         <div class="freq-bars" id="freq-bars"></div>
         <svg class="freq-ring" viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" id="freq-ring-fg" cx="60" cy="60" r="54"/></svg>
         <div class="freq-count" id="freq-count">10</div>
         <p class="freq-status" id="freq-status">Tap Start, then read the line.</p>
         <div class="freq-actions">
           <button class="btn btn-primary" id="freq-start">Start</button>
           <button class="btn btn-ghost" id="freq-skip">Skip this step</button>
         </div>
       </div>`,
      () => {
        // build bars
        const bars = document.getElementById("freq-bars");
        for (let i = 0; i < 28; i++) { const s = document.createElement("span"); bars.appendChild(s); }
        document.getElementById("freq-skip").addEventListener("click", () => { scores.voice = null; screenCalc(); });
        document.getElementById("freq-start").addEventListener("click", startVoice, { once: true });
      }
    );
  }

  async function startVoice() {
    const status = document.getElementById("freq-status");
    const startBtn = document.getElementById("freq-start");
    startBtn.disabled = true;
    stopStream();
    let audioCtx, analyser;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);
    } catch (e) {
      status.innerHTML = "No microphone this time — no matter. I'll read you from the rest.";
      setTimeout(() => { scores.voice = null; screenCalc(); }, 1400);
      return;
    }
    status.textContent = "I'm listening… keep going.";
    const bars = document.getElementById("freq-bars").children;
    const ringFg = document.getElementById("freq-ring-fg");
    const countEl = document.getElementById("freq-count");
    const R = 54, CIRC = 2 * Math.PI * R;
    ringFg.style.strokeDasharray = CIRC;

    const timeBuf = new Float32Array(analyser.fftSize);
    const freqBuf = new Uint8Array(analyser.frequencyBinCount);
    const rmsSamples = [], pitchSamples = [];
    const DURATION = 10000, start = performance.now();

    function frame(now) {
      const t = now - start, p = clamp(t / DURATION, 0, 1);
      ringFg.style.strokeDashoffset = CIRC * (1 - p);
      countEl.textContent = Math.ceil((DURATION - t) / 1000);

      analyser.getFloatTimeDomainData(timeBuf);
      let sum = 0;
      for (let i = 0; i < timeBuf.length; i++) sum += timeBuf[i] * timeBuf[i];
      const rms = Math.sqrt(sum / timeBuf.length);
      rmsSamples.push(rms);

      analyser.getByteFrequencyData(freqBuf);
      let peakBin = 0, peakVal = 0, weighted = 0, wsum = 0;
      for (let i = 2; i < freqBuf.length; i++) {
        if (freqBuf[i] > peakVal) { peakVal = freqBuf[i]; peakBin = i; }
        weighted += i * freqBuf[i]; wsum += freqBuf[i];
      }
      const centroidBin = wsum ? weighted / wsum : 0;
      const hz = centroidBin * (audioCtx.sampleRate / analyser.fftSize);
      if (rms > 0.01) pitchSamples.push(hz);

      // animate bars from live spectrum
      for (let i = 0; i < bars.length; i++) {
        const v = freqBuf[Math.floor((i / bars.length) * (freqBuf.length / 3))] / 255;
        bars[i].style.transform = "scaleY(" + (0.08 + v * 1.6) + ")";
      }

      if (t < DURATION) requestAnimationFrame(frame);
      else finishVoice(rmsSamples, pitchSamples, audioCtx, status);
    }
    requestAnimationFrame(frame);
  }

  function finishVoice(rmsSamples, pitchSamples, audioCtx, status) {
    stopStream();
    try { audioCtx.close(); } catch (e) {}
    if (rmsSamples.length < 20) { scores.voice = null; screenCalc(); return; }
    const loud = clamp(avg(rmsSamples) * 9, 0, 1);           // engagement
    const pitch = pitchSamples.length ? avg(pitchSamples) : 0;
    scores.pitch = Math.round(pitch);
    // warmth of tone: mid pitch reads as balanced/high frequency
    const warmth = pitch ? clamp(1 - Math.abs(pitch - 220) / 400, 0, 1) : 0.5;
    scores.voice = clamp(0.3 + loud * 0.45 + warmth * 0.25, 0, 1);
    status.textContent = "Beautiful. Attuning…";
    screenCalc();
  }

  /* ================================================================
     SCREEN: Calculating
     ================================================================ */
  function screenCalc() {
    stopStream();
    transition(
      `<div class="freq-screen">
         <div class="freq-orb-big pulsing"><span>✦</span></div>
         <h2 class="freq-h2 attune" id="attune">Attuning to your frequency…</h2>
         <p class="freq-lead" id="attune-sub">Weighing pulse against voice against the hour.</p>
       </div>`,
      () => {
        const lines = ["Reading the light in your pulse…", "Listening back through your voice…",
          "Finding the tone that matches…", "Naming the frequency…"];
        let i = 0;
        const sub = document.getElementById("attune-sub");
        const iv = setInterval(() => { sub.textContent = lines[i % lines.length]; i++; }, 700);
        setTimeout(() => { clearInterval(iv); screenResult(); }, 3000);
      }
    );
  }

  function computeFrequency() {
    // neutral 0.5 for any skipped signal
    const body = scores.body == null ? 0.5 : scores.body;
    const voice = scores.voice == null ? 0.5 : scores.voice;
    // interaction entropy so identical inputs still vary a touch
    const jitter = (Math.sin(performance.now()) * 0.5 + 0.5 - 0.5) * 60;
    let freq = 300 + body * 340 + voice * 300 + jitter;
    // small nudge toward the nearest Solfeggio tone for resonance
    const tone = nearestTone(freq);
    freq = freq * 0.82 + tone * 0.18;
    return clamp(Math.round(freq), 150, 963);
  }

  /* ================================================================
     SCREEN: Result
     ================================================================ */
  let constellation = null;
  function screenResult() {
    const freq = computeFrequency();
    const band = bandFor(freq);
    const tone = band.tone; // the band's signature Solfeggio tone (matches the reading prose)
    const bpmLine = scores.bpm ? `Pulse ≈ ${scores.bpm} bpm` : "Pulse not read";
    const pitchLine = scores.pitch ? `Voice ≈ ${scores.pitch} Hz` : "Voice not read";

    transition(
      `<div class="freq-result" style="--band:${band.color}">
         <span class="freq-step">Your reading</span>
         <div class="freq-aura"><div class="freq-number">${freq}<span>Hz</span></div></div>
         <h2 class="freq-band">${band.name}</h2>
         <div class="freq-kw">${band.kw.map((k) => `<span>${k}</span>`).join("")}</div>
         <p class="freq-read">${band.read}</p>
         <div class="freq-meta">
           <span>Resonant tone · <strong>${tone} Hz</strong></span>
           <span>${bpmLine}</span>
           <span>${pitchLine}</span>
         </div>
         <div class="freq-tip"><strong>To shift it:</strong> ${band.tip}</div>

         <div class="freq-const-wrap">
           <canvas id="freq-const"></canvas>
           <span class="freq-const-hint">your live frequency constellation · drag · scroll to zoom · tap to pulse</span>
         </div>

         <div class="freq-actions">
           <button class="btn btn-primary" id="freq-tone">▶ Hear your tone</button>
           <button class="btn btn-ghost" id="freq-again">Read again</button>
           <a class="btn btn-ghost" href="index.html#oracle">Ask Vesper about it →</a>
         </div>
       </div>`,
      () => {
        document.getElementById("freq-again").addEventListener("click", () => { scores.body = scores.voice = scores.bpm = scores.pitch = null; screenIntro(); });
        document.getElementById("freq-tone").addEventListener("click", () => playTone(tone, document.getElementById("freq-tone")));
        constellation = new Constellation(document.getElementById("freq-const"), band.color, freq);
      }
    );
  }

  /* ---- Solfeggio tone player ------------------------------------ */
  function playTone(hz, btn) {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ac.createOscillator(), gain = ac.createGain();
      osc.type = "sine"; osc.frequency.value = hz;
      gain.gain.value = 0;
      osc.connect(gain); gain.connect(ac.destination);
      const now = ac.currentTime;
      gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
      gain.gain.setValueAtTime(0.18, now + 3.6);
      gain.gain.linearRampToValueAtTime(0, now + 4);
      osc.start(now); osc.stop(now + 4.1);
      btn.textContent = "♪ playing…";
      osc.onended = () => { btn.textContent = "▶ Hear your tone"; try { ac.close(); } catch (e) {} };
    } catch (e) { btn.textContent = "audio unavailable"; }
  }

  /* ---- Interactive constellation -------------------------------- */
  function Constellation(canvas, color, freq) {
    const ctx = canvas.getContext("2d");
    let W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
    const nodeCount = clamp(Math.round(freq / 18), 16, 54);
    let nodes = [];
    let view = { x: 0, y: 0, zoom: 1 };
    let drag = null;
    const pulses = [];

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function seed() {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const a = (i / nodeCount) * Math.PI * 2 + (i % 3) * 0.5;
        const rad = 40 + ((i * 53) % 200);
        nodes.push({
          x: Math.cos(a) * rad, y: Math.sin(a) * rad,
          vx: (((i * 37) % 20) - 10) / 900, vy: (((i * 71) % 20) - 10) / 900,
          r: 1 + ((i * 17) % 24) / 10
        });
      }
    }

    function hexA(hex, a) {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2 + view.x, cy = H / 2 + view.y, z = view.zoom;
      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 88) {
            ctx.strokeStyle = hexA(color, (1 - d / 88) * 0.5);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(cx + nodes[i].x * z, cy + nodes[i].y * z);
            ctx.lineTo(cx + nodes[j].x * z, cy + nodes[j].y * z);
            ctx.stroke();
          }
        }
      }
      // nodes
      nodes.forEach((n) => {
        const x = cx + n.x * z, y = cy + n.y * z;
        const g = ctx.createRadialGradient(x, y, 0, x, y, n.r * z * 3);
        g.addColorStop(0, hexA(color, 0.95));
        g.addColorStop(1, hexA(color, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, n.r * z * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f1eadb";
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.6, n.r * z * 0.5), 0, Math.PI * 2); ctx.fill();
      });
      // pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]; p.r += 2.2; p.a -= 0.018;
        if (p.a <= 0) { pulses.splice(i, 1); continue; }
        ctx.strokeStyle = hexA(color, p.a);
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
      }
    }

    function tick() {
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (Math.abs(n.x) > 260) n.vx *= -1;
        if (Math.abs(n.y) > 200) n.vy *= -1;
      });
      draw();
      raf = requestAnimationFrame(tick);
    }

    // interactions
    canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, moved: false }; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointermove", (e) => {
      if (!drag) return;
      view.x += e.clientX - drag.x; view.y += e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY; drag.moved = true;
    });
    canvas.addEventListener("pointerup", (e) => {
      if (drag && !drag.moved) {
        const r = canvas.getBoundingClientRect();
        pulses.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 2, a: 0.9 });
      }
      drag = null;
    });
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      view.zoom = clamp(view.zoom * (e.deltaY < 0 ? 1.08 : 0.93), 0.5, 3);
    }, { passive: false });

    let raf;
    resize(); seed(); tick();
    window.addEventListener("resize", resize);
    this.destroy = () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }

  /* ---- Boot ------------------------------------------------------ */
  // ?preview=result jumps straight to a sensor-free sample reading.
  if (/[?&]preview=result/.test(location.search)) { screenResult(); }
  else { screenIntro(); }

})();
