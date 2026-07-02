/* =====================================================================
   VESPER — App interactions
   Starfield, nav, services, live card-draw widget, the Oracle chat,
   and daily horoscopes.
   ===================================================================== */

(function () {
  "use strict";

  const DECK = window.VESPER_DECK || [];
  const DECKS = window.VESPER_DECKS || { classic: { name: "Classic Tarot", glyph: "✶", kind: "78 cards", blurb: "", cards: DECK } };
  let currentDeckKey = "classic";
  const ORACLE = window.VESPER;

  /* ---- Starfield ------------------------------------------------ */
  (function starfield() {
    const c = document.getElementById("starfield");
    if (!c) return;
    const ctx = c.getContext("2d");
    let stars = [], w, h;
    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      const count = Math.min(180, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.6 + 0.2,
        tw: Math.random() * 0.02 + 0.004,
        dir: Math.random() < 0.5 ? 1 : -1
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.a += s.tw * s.dir;
        if (s.a > 0.85 || s.a < 0.15) s.dir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 210, 170, ${s.a})`;
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener("resize", resize);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) tick();
  })();

  /* ---- Nav scrolled state --------------------------------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav drawer ---------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => { nav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); }));
  }

  /* ---- Reveal on scroll ----------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.style.animationPlayState = "running"; io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  /* ---- Services ------------------------------------------------- */
  const SERVICES = [
    { g: "✦", n: "Daily Card", t: "Free every day", d: "One card to set the tone of your day — a small, honest compass drawn fresh each morning. Your ritual before the world wakes.", act: { type: "spread", kind: "daily" } },
    { g: "❋", n: "Love & Bonds", t: "Matters of the heart", d: "Where a connection has been, where it stands, and where it's quietly heading.", act: { type: "spread", kind: "love" } },
    { g: "†", n: "Career & Coin", t: "Work & worth", d: "Clarity for the crossroads — a role, a risk, a raise, a leap.", act: { type: "spread", kind: "career" } },
    { g: "◈", n: "Yes / No Oracle", t: "Straight answers", d: "One card, one clear leaning. For when you just need the deck to say it plainly.", act: { type: "yesno" } },
    { g: "✧", n: "Celtic Cross", t: "The deep read", d: "Ten cards, the whole landscape of a question — the classic spread, unhurried and complete.", act: { type: "spread", kind: "celtic" } },
    { g: "☾", n: "Horoscopes", t: "Your daily sky", d: "All twelve signs, read fresh with the turning of each day. Find your stars, then let Vesper go deeper.", act: { type: "scroll", target: "horoscopes" } },
    { g: "✺", n: "Numerology", t: "Your numbers", d: "The quiet math beneath a name and a birthday — your life path, laid bare.", act: { type: "numerology" } },
    { g: "⊛", n: "Birth Chart", t: "Your natal sky", d: "The exact sky at your first breath — your Sun, and with birth time and place, your Moon, Rising, and the wandering planets.", act: { type: "astrology" } },
    { g: "☽", n: "Dream Reading", t: "The night's messages", d: "Tell Vesper what you saw while sleeping; she'll draw the card that answers it.", act: { type: "dream" } },
    { g: "◉", n: "Frequency Reader", t: "New · body + voice", d: "A pulse from your fingertip, a moment of your voice — Vesper names the frequency you're carrying tonight, and the tone that matches it.", act: { type: "link", href: "frequency.html" } }
  ];
  const sg = document.getElementById("services-grid");
  SERVICES.forEach((s, i) => {
    const el = document.createElement("article");
    el.className = "svc reveal";
    el.style.setProperty("--d", (i * 0.05) + "s");
    el.style.cursor = "pointer";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.innerHTML =
      `<div class="svc-glyph">${s.g}︎</div>
       <h3 class="svc-name">${s.n}</h3>
       <p class="svc-desc">${s.d}</p>
       <span class="svc-tag">${s.t} →</span>`;
    el.addEventListener("pointermove", (ev) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((ev.clientX - r.left) / r.width * 100) + "%");
      el.style.setProperty("--my", ((ev.clientY - r.top) / r.height * 100) + "%");
    });
    el.addEventListener("click", () => runService(s));
    el.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); runService(s); } });
    sg.appendChild(el);
  });

  /* ---- Deck picker ---------------------------------------------- */
  const deckPicker = document.getElementById("deck-picker");
  const deckBlurb = document.getElementById("deck-blurb");
  if (deckPicker) {
    Object.keys(DECKS).forEach((key) => {
      const d = DECKS[key];
      const el = document.createElement("button");
      el.className = "deck-opt" + (key === "classic" ? " is-active" : "");
      el.dataset.deck = key;
      el.setAttribute("role", "tab");
      el.innerHTML =
        `<span class="deck-glyph">${d.glyph}︎</span>
         <span class="deck-name">${d.name}</span>
         <span class="deck-kind">${d.kind}</span>`;
      deckPicker.appendChild(el);
    });
    deckPicker.addEventListener("click", (e) => {
      const b = e.target.closest(".deck-opt");
      if (b) setDeck(b.dataset.deck);
    });
    setDeck("classic");
  }
  function setDeck(key) {
    if (!DECKS[key]) return;
    currentDeckKey = key;
    if (deckPicker) deckPicker.querySelectorAll(".deck-opt").forEach((b) => b.classList.toggle("is-active", b.dataset.deck === key));
    if (deckBlurb) deckBlurb.textContent = DECKS[key].blurb;
  }

  /* ---- Card-draw widget ----------------------------------------- */
  let spreadCount = 1;
  const toggle = document.getElementById("spread-toggle");
  toggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".spread-opt");
    if (!btn) return;
    toggle.querySelectorAll(".spread-opt").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    spreadCount = parseInt(btn.dataset.spread, 10);
  });

  const POSITIONS = {
    1: ["Your card"],
    3: ["Past", "Present", "Future"],
    5: ["The situation", "The challenge", "The root", "Guidance", "The outcome"]
  };

  function drawDeck(count) {
    const source = (DECKS[currentDeckKey] && DECKS[currentDeckKey].cards) || DECK;
    const pool = source.slice(), out = [];
    for (let i = 0; i < count && pool.length; i++) {
      const card = Object.assign({}, pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      card.reversed = false; // reversals disabled — cards always draw upright
      out.push(card);
    }
    return out;
  }

  function suitLabel(card) {
    if (card.label) return card.label;              // themed oracle decks
    if (card.arcana === "major") return "Major Arcana";
    return `${card.suit} · ${card.element}`;
  }

  // Shared card element with flip animation. `meaning` is revealed on flip.
  function makeCardEl(card, position, index, meaning) {
    const wrap = document.createElement("div");
    wrap.className = "tcard";
    wrap.style.setProperty("--cd", (index * 0.12) + "s");
    // full-art cards carry their text in the image, so they never render reversed
    const reversed = card.reversed && !card.bare;
    wrap.innerHTML =
      `<div class="tcard-pos">${position || ""}</div>
       <div class="tcard-inner">
         <div class="tface tface-back"><span class="tb-star">✶</span></div>
         <div class="tface tface-front ${card.img ? "has-img" : ""} ${card.bare ? "bare" : ""} ${reversed ? "reversed" : ""}">
           ${reversed ? '<span class="tf-rev">Reversed</span>' : ""}
           ${card.img
             ? `<img class="tf-img" src="${card.img}" alt="${escapeHtml(card.name)}" loading="lazy" />`
             : `<span class="tf-glyph">${card.glyph || "✶"}</span>`}
           <span class="tf-name">${card.name}</span>
           <span class="tf-suit">${suitLabel(card)}</span>
         </div>
       </div>
       <p class="tcard-read"></p>`;
    wrap.querySelector(".tcard-inner").addEventListener("click", () => wrap.classList.toggle("flipped"));
    setTimeout(() => {
      wrap.classList.add("flipped");
      wrap.querySelector(".tcard-read").textContent = meaning;
    }, 500 + index * 260);
    return wrap;
  }

  const stage = document.getElementById("draw-stage");
  document.getElementById("draw-btn").addEventListener("click", () => {
    const cards = drawDeck(spreadCount);
    const positions = POSITIONS[spreadCount];
    const intention = document.getElementById("intention").value.trim();
    stage.innerHTML = "";

    cards.forEach((card, i) => {
      stage.appendChild(makeCardEl(card, positions[i], i, card.reversed ? card.rev : card.up));
    });

    if (intention) {
      const note = document.createElement("p");
      note.className = "draw-hint";
      note.style.width = "100%";
      note.style.textAlign = "center";
      note.style.marginTop = "1.4rem";
      note.innerHTML = `<em>Read with your question in mind: “${escapeHtml(intention)}”. Tap any card to turn it back.</em>`;
      stage.appendChild(note);
    }
  });

  /* ---- The Oracle chat ------------------------------------------ */
  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-text");

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }
  // minimal markdown: **bold** and newlines
  function fmt(s) {
    return escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    const el = document.createElement("div");
    el.className = "msg msg-user";
    el.innerHTML = fmt(text);
    log.appendChild(el);
    scrollDown();
  }

  function miniCards(cards) {
    if (!cards || !cards.length) return "";
    return `<div class="chat-cards">` + cards.map((c, i) =>
      `<div class="mini-card ${c.img ? "has-img" : ""} ${c.reversed && !c.bare ? "rev" : ""}" style="--cd:${i * 0.1}s">
         ${c.img
           ? `<img class="mc-img" src="${c.img}" alt="${escapeHtml(c.name)}" loading="lazy" />`
           : `<span class="mc-glyph">${c.glyph || "✶"}</span>
              <span class="mc-name">${c.name}</span>`}
       </div>`).join("") + `</div>`;
  }

  function addVesper(resp, cb) {
    // typing indicator
    const typing = document.createElement("div");
    typing.className = "msg msg-vesper";
    typing.innerHTML = `<span class="msg-name">Vesper</span><span class="typing"><span></span><span></span><span></span></span>`;
    log.appendChild(typing);
    scrollDown();

    const delay = Math.min(1600, 500 + (resp.text.length * 3));
    setTimeout(() => {
      typing.innerHTML =
        `<span class="msg-name">Vesper</span>` +
        miniCards(resp.cards) +
        `<span class="msg-body">${fmt(resp.text)}</span>`;
      scrollDown();
      if (cb) cb();
    }, delay);
  }

  function send(text) {
    addUser(text);
    const resp = ORACLE.respond(text);
    addVesper(resp);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    send(text);
  });

  document.getElementById("chat-suggest").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    send(chip.dataset.msg);
  });

  // Opening greeting when the oracle scrolls into view (once)
  let greeted = false;
  const oracleIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting && !greeted) {
        greeted = true;
        addVesper(ORACLE.greet());
        oracleIO.disconnect();
      }
    });
  }, { threshold: 0.3 });
  oracleIO.observe(document.getElementById("chat"));

  /* ---- Horoscopes ----------------------------------------------- */
  const SIGNS = [
    { n: "Aries", g: "♈", d: "Mar 21 – Apr 19", e: "Fire" },
    { n: "Taurus", g: "♉", d: "Apr 20 – May 20", e: "Earth" },
    { n: "Gemini", g: "♊", d: "May 21 – Jun 20", e: "Air" },
    { n: "Cancer", g: "♋", d: "Jun 21 – Jul 22", e: "Water" },
    { n: "Leo", g: "♌", d: "Jul 23 – Aug 22", e: "Fire" },
    { n: "Virgo", g: "♍", d: "Aug 23 – Sep 22", e: "Earth" },
    { n: "Libra", g: "♎", d: "Sep 23 – Oct 22", e: "Air" },
    { n: "Scorpio", g: "♏", d: "Oct 23 – Nov 21", e: "Water" },
    { n: "Sagittarius", g: "♐", d: "Nov 22 – Dec 21", e: "Fire" },
    { n: "Capricorn", g: "♑", d: "Dec 22 – Jan 19", e: "Earth" },
    { n: "Aquarius", g: "♒", d: "Jan 20 – Feb 18", e: "Air" },
    { n: "Pisces", g: "♓", d: "Feb 19 – Mar 20", e: "Water" }
  ];

  const HORO_OPEN = [
    "The sky tilts toward you today.", "A quiet current runs beneath the hours.",
    "Something long-held is ready to loosen.", "The evening favors the honest.",
    "A door you'd forgotten opens a crack.", "Momentum gathers where you least expect."
  ];
  const HORO_BODY = {
    Fire: "Your energy runs hot — good, but aim it. One decisive act outshines a dozen restless ones. Let someone see the real spark, not just the smoke.",
    Earth: "Steadiness is your gift today; use it to hold ground others are losing. A practical kindness pays back tenfold. Don't mistake patience for passivity.",
    Air: "Ideas move fast — catch one and write it down before it drifts. A conversation reroutes your week. Say the true thing, gently.",
    Water: "Feeling arrives before logic today; trust it, then check it. Someone needs your softness more than your solutions. Protect your own tide, too."
  };
  // deterministic daily seed so a sign reads the same all day
  function daySeed() { const d = new Date(); return d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate(); }

  const sigGrid = document.getElementById("signs-grid");
  SIGNS.forEach((s, i) => {
    const el = document.createElement("button");
    el.className = "sign reveal";
    el.style.setProperty("--d", (i * 0.03) + "s");
    el.innerHTML = `<span class="sign-glyph">${s.g}︎</span><span class="sign-name">${s.n}</span>`;
    el.addEventListener("click", () => showHoro(s, i));
    sigGrid.appendChild(el);
  });

  const readout = document.getElementById("horo-readout");
  function showHoro(sign, i) {
    const seed = (daySeed() + i * 7) % HORO_OPEN.length;
    document.getElementById("horo-glyph").textContent = sign.g + "︎";
    document.getElementById("horo-name").textContent = sign.n;
    document.getElementById("horo-dates").textContent = `${sign.d} · ${sign.e}`;
    document.getElementById("horo-text").textContent = `${HORO_OPEN[seed]} ${HORO_BODY[sign.e]}`;
    readout.hidden = false;
    readout.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  document.getElementById("horo-close").addEventListener("click", () => { readout.hidden = true; });

  /* ---- Service reading modal ------------------------------------ */
  const modal = document.getElementById("svc-modal");
  const modalEyebrow = document.getElementById("modal-eyebrow");
  const modalTitle = document.getElementById("modal-title");
  const modalLead = document.getElementById("modal-lead");
  const modalBody = document.getElementById("modal-body");
  const modalActions = document.getElementById("modal-actions");

  function openModal() { modal.hidden = false; document.body.style.overflow = "hidden"; }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ""; modalBody.innerHTML = ""; modalActions.innerHTML = ""; }
  modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  function setActions(list) {
    modalActions.innerHTML = "";
    list.forEach((a) => {
      const b = document.createElement("button");
      b.className = "btn " + (a.primary ? "btn-primary" : "btn-ghost");
      b.textContent = a.label;
      b.addEventListener("click", a.on);
      modalActions.appendChild(b);
    });
  }

  function prefillChat(text) {
    closeModal();
    document.getElementById("oracle").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { const i = document.getElementById("chat-text"); i.value = text; i.focus(); }, 650);
  }

  function runService(s) {
    const a = s.act;
    if (a.type === "link") { window.location.href = a.href; return; }
    if (a.type === "scroll") { document.getElementById(a.target).scrollIntoView({ behavior: "smooth" }); return; }
    openModal();
    if (a.type === "spread") renderSpread(s);
    else if (a.type === "yesno") renderYesNoForm(s);
    else if (a.type === "numerology") renderNumerologyForm(s);
    else if (a.type === "astrology") renderAstrologyForm(s);
    else if (a.type === "dream") renderDreamForm(s);
  }

  function renderSpread(s) {
    const res = window.VESPER.spread(s.act.kind);
    modalEyebrow.textContent = "Live Reading";
    modalTitle.textContent = s.n;
    modalLead.textContent = res.intro;
    modalBody.innerHTML = "";
    res.items.forEach((it, i) => modalBody.appendChild(makeCardEl(it.card, it.position, i, it.meaning)));
    if (res.items.length > 1) {
      const sum = document.createElement("div");
      sum.className = "modal-summary";
      sum.innerHTML = fmt(res.summary);
      modalBody.appendChild(sum);
    }
    setActions([
      { label: "Draw again", primary: true, on: () => renderSpread(s) },
      { label: "Take it to Vesper →", on: () => prefillChat(`I just drew the ${s.n} reading — help me make sense of it: `) }
    ]);
  }

  function renderYesNoForm(s) {
    modalEyebrow.textContent = "Yes / No Oracle";
    modalTitle.textContent = "Ask, and the deck answers";
    modalLead.textContent = "Frame it as a single yes-or-no question, then turn one card.";
    modalActions.innerHTML = "";
    modalBody.innerHTML =
      `<form class="modal-form" id="yn-form">
         <label for="yn-q">Your question</label>
         <input id="yn-q" type="text" placeholder="e.g. Should I reach out to them?" maxlength="140" autocomplete="off" />
         <button type="submit" class="btn btn-primary">Turn the card</button>
       </form>`;
    document.getElementById("yn-form").addEventListener("submit", (e) => {
      e.preventDefault();
      renderYesNoResult(s, document.getElementById("yn-q").value.trim());
    });
    setTimeout(() => document.getElementById("yn-q").focus(), 100);
  }

  function renderYesNoResult(s, q) {
    const r = window.VESPER.yesno();
    modalEyebrow.textContent = "Yes / No Oracle";
    modalTitle.textContent = "The deck's answer";
    modalLead.textContent = q ? `“${q}”` : "Your yes-or-no, drawn:";
    modalBody.innerHTML = "";
    modalBody.appendChild(makeCardEl(r.card, "The answer", 0, r.meaning));
    const v = document.createElement("div"); v.className = "modal-verdict"; v.textContent = r.verdict; modalBody.appendChild(v);
    const t = document.createElement("div"); t.className = "modal-summary"; t.textContent = r.tone + " " + r.meaning; modalBody.appendChild(t);
    setActions([{ label: "Ask another", primary: true, on: () => renderYesNoForm(s) }]);
  }

  function reduceNum(n) {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      n = String(n).split("").reduce((a, c) => a + (+c), 0);
    }
    return n;
  }
  const NUMO = {
    1: { title: "1 · The Pioneer", text: "You're here to lead and begin. Independence is your engine; the trick is trusting your own direction without steamrolling the people beside you." },
    2: { title: "2 · The Diplomat", text: "Yours is the gift of harmony — you read a room like sheet music. Partnership and patience are your power; guard against losing yourself in others' needs." },
    3: { title: "3 · The Creator", text: "Expression is your medicine. You're meant to make, speak, and delight. Scatter is the shadow — finish what the spark begins." },
    4: { title: "4 · The Builder", text: "Steady hands, solid ground. You turn ideas into structures that last. Let a little wildness in so the walls you build have windows." },
    5: { title: "5 · The Seeker", text: "Freedom and change run in your blood — travel, variety, reinvention. Root a few things deeply so the wind doesn't carry all of you off." },
    6: { title: "6 · The Nurturer", text: "You are the one who tends and holds. Love and responsibility are your themes. Remember to pour some of that care back into your own cup." },
    7: { title: "7 · The Mystic", text: "A seeker of the deep truth beneath appearances. Solitude sharpens you. Don't let the search for perfect understanding keep you from simply living." },
    8: { title: "8 · The Powerhouse", text: "Ambition, mastery, material command. You're built to lead and to build wealth — as long as you wield that power with an open hand." },
    9: { title: "9 · The Humanitarian", text: "The old soul who came to give. Compassion on a wide scale is your calling. Learn to release, to forgive, and to let endings be graceful." },
    11: { title: "11 · The Illuminator", text: "A master number — intuition turned all the way up. You're a channel for insight and inspiration. The gift is real; so is the sensitivity. Ground it." },
    22: { title: "22 · The Master Builder", text: "The rarest path: big visions made real on the earth. You can build things that outlast you. The pressure is heavy — pace yourself, and dream anyway." },
    33: { title: "33 · The Master Teacher", text: "Love made into service and wisdom. You're here to uplift on a grand scale. Lead with the heart; let compassion, not obligation, set your pace." }
  };
  // Short archetype word per number, reused across the name-based numbers
  const NUM_WORD = {
    1: "the Leader", 2: "the Peacemaker", 3: "the Communicator", 4: "the Builder",
    5: "the Free Spirit", 6: "the Nurturer", 7: "the Seeker", 8: "the Powerhouse",
    9: "the Humanitarian", 11: "the Intuitive (Master 11)", 22: "the Master Builder (Master 22)",
    33: "the Master Teacher (Master 33)"
  };
  const NUM_TRAIT = {
    1: "independent, driven, original", 2: "diplomatic, sensitive, cooperative",
    3: "expressive, creative, sociable", 4: "grounded, disciplined, dependable",
    5: "adventurous, adaptable, restless", 6: "caring, responsible, devoted",
    7: "analytical, spiritual, private", 8: "ambitious, capable, commanding",
    9: "compassionate, idealistic, generous", 11: "visionary, inspired, highly intuitive",
    22: "visionary and practical at once", 33: "devoted, healing, uplifting"
  };
  // Pythagorean letter → value
  const LETTERVAL = { a:1,j:1,s:1, b:2,k:2,t:2, c:3,l:3,u:3, d:4,m:4,v:4, e:5,n:5,w:5,
                      f:6,o:6,x:6, g:7,p:7,y:7, h:8,q:8,z:8, i:9,r:9 };
  const VOWELS = "aeiou";

  function letters(name) { return (name || "").toLowerCase().replace(/[^a-z]/g, "").split(""); }
  function sumWhere(name, keep) {
    return letters(name).reduce((a, c) => (keep(c) ? a + (LETTERVAL[c] || 0) : a), 0);
  }
  function nameNumber(name, mode) {
    var raw;
    if (mode === "vowels") raw = sumWhere(name, (c) => VOWELS.indexOf(c) !== -1);
    else if (mode === "consonants") raw = sumWhere(name, (c) => VOWELS.indexOf(c) === -1);
    else raw = sumWhere(name, () => true);
    return raw ? reduceNum(raw) : 0;
  }

  function renderNumerologyForm(s) {
    modalEyebrow.textContent = "Numerology";
    modalTitle.textContent = "Your numbers";
    modalLead.textContent = "Your birth date and full birth name reduce to the numbers that map your life. Name is optional — enter it to unlock the full profile.";
    modalActions.innerHTML = "";
    modalBody.innerHTML =
      `<form class="modal-form" id="numo-form">
         <label for="numo-name">Full birth name <span class="form-hint">(as on your birth certificate)</span></label>
         <input id="numo-name" type="text" placeholder="e.g. Ada Marie Lovelace" autocomplete="off" />
         <label for="numo-date">Your date of birth</label>
         <input id="numo-date" type="date" required max="2026-12-31" />
         <button type="submit" class="btn btn-primary">Reveal my numbers</button>
       </form>`;
    document.getElementById("numo-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = document.getElementById("numo-date").value;
      const nm = document.getElementById("numo-name").value.trim();
      if (v) renderNumerologyResult(s, v, nm);
    });
    setTimeout(() => document.getElementById("numo-name").focus(), 100);
  }

  function numTile(label, num, blurb) {
    if (!num) return "";
    const word = NUM_WORD[num] || "";
    return `<div class="numo-tile">
        <div class="numo-tile-num">${num}</div>
        <div class="numo-tile-body">
          <span class="numo-tile-label">${label}</span>
          <strong class="numo-tile-word">${word}</strong>
          <p class="numo-tile-text">${blurb}</p>
        </div>
      </div>`;
  }

  function renderNumerologyResult(s, dateStr, name) {
    const parts = dateStr.split("-").map(Number); // [yyyy, mm, dd]
    const life = reduceNum(reduceNum(parts[1]) + reduceNum(parts[2]) + reduceNum(parts[0]));
    const birthday = reduceNum(parts[2]);
    const info = NUMO[life] || NUMO[9];

    const expression = nameNumber(name, "all");
    const soul = nameNumber(name, "vowels");
    const persona = nameNumber(name, "consonants");

    const tr = (n) => NUM_TRAIT[n] || "";
    modalEyebrow.textContent = "Numerology";
    modalTitle.textContent = "Your numbers";
    modalLead.textContent = name ? name : "";

    let tiles = "";
    tiles += numTile("Expression · your natural talents", expression, `How you're built to act in the world: ${tr(expression)}. This is the toolkit you were handed.`);
    tiles += numTile("Soul Urge · your heart's craving", soul, `What you secretly want most: to live as someone ${tr(soul)}. It's the quiet engine beneath your choices.`);
    tiles += numTile("Personality · your first impression", persona, `The you that others meet before they know you — you read as ${tr(persona)}.`);
    tiles += numTile("Birthday · your gift", birthday, `A specific talent you carry lightly: the flair of ${tr(birthday)}.`);

    const namePrompt = name ? "" :
      `<p class="numo-nametip">Add your full birth name and draw again to unlock your Expression, Soul Urge & Personality numbers.</p>`;

    modalBody.innerHTML =
      `<div class="numo-result">
         <span class="numo-toplabel">Life Path — the road you're walking</span>
         <div class="numo-number">${life}</div>
         <h4 class="numo-title">${info.title}</h4>
         <p class="numo-text">${info.text}</p>
       </div>
       <div class="numo-grid">${tiles}</div>
       ${namePrompt}`;
    setActions([
      { label: "Try again", primary: true, on: () => renderNumerologyForm(s) },
      { label: "Ask Vesper about it →", on: () => prefillChat(`My life path number is ${life}${name ? `, expression ${expression}, soul urge ${soul}` : ""}. What should I focus on this year?`) }
    ]);
  }

  /* ---- Birth chart / astrology ---------------------------------- */
  // Tropical Sun sign from month/day (standard cusp dates).
  const ZODIAC = [
    { name: "Capricorn", glyph: "♑", from: [12, 22], to: [1, 19] },
    { name: "Aquarius", glyph: "♒", from: [1, 20], to: [2, 18] },
    { name: "Pisces", glyph: "♓", from: [2, 19], to: [3, 20] },
    { name: "Aries", glyph: "♈", from: [3, 21], to: [4, 19] },
    { name: "Taurus", glyph: "♉", from: [4, 20], to: [5, 20] },
    { name: "Gemini", glyph: "♊", from: [5, 21], to: [6, 20] },
    { name: "Cancer", glyph: "♋", from: [6, 21], to: [7, 22] },
    { name: "Leo", glyph: "♌", from: [7, 23], to: [8, 22] },
    { name: "Virgo", glyph: "♍", from: [8, 23], to: [9, 22] },
    { name: "Libra", glyph: "♎", from: [9, 23], to: [10, 22] },
    { name: "Scorpio", glyph: "♏", from: [10, 23], to: [11, 21] },
    { name: "Sagittarius", glyph: "♐", from: [11, 22], to: [12, 21] }
  ];
  const SIGN_INFO = {
    Aries:       { el: "Fire",  mo: "Cardinal", ruler: "Mars",    p: "The initiator — bold, direct, and allergic to standing still. You lead by leaping. Learn patience and you're unstoppable." },
    Taurus:      { el: "Earth", mo: "Fixed",    ruler: "Venus",   p: "The builder of comfort and worth. Steady, sensual, loyal to a fault. You bloom slowly and last long. Guard against stubbornness." },
    Gemini:      { el: "Air",   mo: "Mutable",  ruler: "Mercury", p: "The messenger — quick, curious, endlessly plural. You collect ideas and people. Choose a few threads to follow all the way down." },
    Cancer:      { el: "Water", mo: "Cardinal", ruler: "the Moon", p: "The keeper of home and heart. You feel everything and remember it all. Your care is a superpower; build a shell you can open at will." },
    Leo:         { el: "Fire",  mo: "Fixed",    ruler: "the Sun", p: "The radiant one — warm, generous, born to be seen. You lead with heart. The work is to shine without needing the applause." },
    Virgo:       { el: "Earth", mo: "Mutable",  ruler: "Mercury", p: "The craftsperson — precise, useful, quietly devoted. You perfect what others leave rough. Let 'good enough' be holy sometimes." },
    Libra:       { el: "Air",   mo: "Cardinal", ruler: "Venus",   p: "The harmoniser — fair, charming, allergic to ugliness and injustice. You balance the room. Learn to weigh your own needs on the scale too." },
    Scorpio:     { el: "Water", mo: "Fixed",    ruler: "Pluto & Mars", p: "The alchemist — intense, magnetic, unafraid of the depths. You transform whatever you touch. Trust is your treasure; spend it wisely." },
    Sagittarius: { el: "Fire",  mo: "Mutable",  ruler: "Jupiter", p: "The seeker — restless, honest, hungry for the horizon. You chase meaning and freedom. Root your wanderings in something you return to." },
    Capricorn:   { el: "Earth", mo: "Cardinal", ruler: "Saturn",  p: "The architect of the long game — disciplined, ambitious, wry. You climb steadily and arrive. Remember the summit is meant to be enjoyed." },
    Aquarius:    { el: "Air",   mo: "Fixed",    ruler: "Uranus & Saturn", p: "The visionary — original, humane, a little ahead of the room. You see the future's shape. Let people close, not just causes." },
    Pisces:      { el: "Water", mo: "Mutable",  ruler: "Neptune & Jupiter", p: "The dreamer — compassionate, intuitive, porous to the unseen. You feel the ocean everyone swims in. Protect your shoreline and create from the tide." }
  };
  function sunSign(month, day) {
    for (const z of ZODIAC) {
      const [fm, fd] = z.from, [tm, td] = z.to;
      if (fm === 12) { if ((month === 12 && day >= fd) || (month === 1 && day <= td)) return z; }
      else if ((month === fm && day >= fd) || (month === tm && day <= td)) return z;
    }
    return ZODIAC[0];
  }
  // UTC offset (hours) for an IANA timezone at a given local date — via Intl.
  function tzOffsetHours(ianaTZ, y, m, d) {
    try {
      const dtf = new Intl.DateTimeFormat("en-US", { timeZone: ianaTZ, timeZoneName: "shortOffset", year: "numeric" });
      const dateAt = new Date(Date.UTC(y, m - 1, d, 12));
      const part = dtf.formatToParts(dateAt).find((p) => p.type === "timeZoneName");
      const mtch = part && part.value.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
      if (!mtch) return 0;
      return parseInt(mtch[1], 10) + (mtch[2] ? Math.sign(parseInt(mtch[1], 10)) * (parseInt(mtch[2], 10) / 60) : 0);
    } catch (e) { return 0; }
  }

  function renderAstrologyForm(s) {
    modalEyebrow.textContent = "Birth Chart";
    modalTitle.textContent = "Map your natal sky";
    modalLead.textContent = "Your birth date gives your Sun sign instantly. Add your exact time and place to unlock your Moon, Rising, and planets.";
    modalActions.innerHTML = "";
    modalBody.innerHTML =
      `<form class="modal-form" id="astro-form">
         <label for="astro-name">Your name <span class="form-hint">(optional)</span></label>
         <input id="astro-name" type="text" placeholder="e.g. Ada" autocomplete="off" />
         <label for="astro-date">Date of birth</label>
         <input id="astro-date" type="date" required max="2026-12-31" />
         <label for="astro-time">Time of birth <span class="form-hint">(optional — needed for Moon &amp; Rising)</span></label>
         <input id="astro-time" type="time" />
         <label for="astro-place">Place of birth <span class="form-hint">(optional — city, country)</span></label>
         <input id="astro-place" type="text" placeholder="e.g. London, United Kingdom" autocomplete="off" />
         <button type="submit" class="btn btn-primary">Cast my chart</button>
       </form>`;
    document.getElementById("astro-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const date = document.getElementById("astro-date").value;
      if (!date) return;
      renderAstrologyResult(s, {
        name: document.getElementById("astro-name").value.trim(),
        date: date,
        time: document.getElementById("astro-time").value,
        place: document.getElementById("astro-place").value.trim()
      });
    });
    setTimeout(() => document.getElementById("astro-date").focus(), 100);
  }

  function planetTable(list) {
    if (!list || !list.length) return "";
    const rows = list.map((p) =>
      `<tr><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.sign)}</td>` +
      `<td>${p.house != null ? "House " + escapeHtml(String(p.house)) : "—"}</td></tr>`).join("");
    return `<table class="astro-table"><thead><tr><th>Planet</th><th>Sign</th><th>House</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  async function renderAstrologyResult(s, inp) {
    const parts = inp.date.split("-").map(Number); // [yyyy, mm, dd]
    const sun = sunSign(parts[1], parts[2]);
    const info = SIGN_INFO[sun.name];

    modalEyebrow.textContent = "Birth Chart";
    modalTitle.textContent = inp.name ? `${inp.name}'s natal sky` : "Your natal sky";
    modalLead.textContent = "";
    // Sun sign renders instantly; the rest streams in below.
    modalBody.innerHTML =
      `<div class="astro-hero">
         <div class="astro-sun-glyph">${sun.glyph}</div>
         <div>
           <span class="astro-kicker">Sun in</span>
           <h4 class="astro-sign">${sun.name}</h4>
           <div class="astro-chips"><span>${info.el}</span><span>${info.mo}</span><span>Ruled by ${info.ruler}</span></div>
         </div>
       </div>
       <p class="astro-profile">${info.p}</p>
       <div id="astro-more"></div>`;
    setActions([
      { label: "Cast another", primary: true, on: () => renderAstrologyForm(s) },
      { label: "Ask Vesper about it →", on: () => prefillChat(`I'm a ${sun.name} sun. What should I lean into this season?`) }
    ]);

    const more = document.getElementById("astro-more");
    // Full chart requires time + place (for Moon/Rising/houses)
    if (!inp.time || !inp.place) {
      more.innerHTML = `<p class="astro-note">Add your <strong>birth time</strong> and <strong>place</strong> and cast again to reveal your Moon, Rising sign, and the full planetary chart.</p>`;
      return;
    }
    more.innerHTML = `<p class="astro-loading">Reading the rest of your sky…</p>`;

    try {
      // 1) geocode the birthplace (free, no key)
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inp.place)}&count=1&language=en&format=json`);
      const geo = await geoRes.json();
      const loc = geo && geo.results && geo.results[0];
      if (!loc) { more.innerHTML = `<p class="astro-note">Couldn't find “${escapeHtml(inp.place)}”. Try a nearby larger city, e.g. “Paris, France”.</p>`; return; }

      const [hh, mm] = inp.time.split(":").map(Number);
      const tz = tzOffsetHours(loc.timezone, parts[0], parts[1], parts[2]);

      // 2) ask our serverless proxy for the full chart
      const res = await fetch("/api/natal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: parts[0], month: parts[1], date: parts[2],
          hours: hh, minutes: mm, latitude: loc.latitude, longitude: loc.longitude, tzOffset: tz
        })
      });
      const placeLabel = `${loc.name}${loc.country ? ", " + loc.country : ""}`;

      if (res.status === 501) {
        more.innerHTML =
          `<p class="astro-note">Your Sun sign is set. The full planetary chart turns on once the astrology API key is configured on the server.</p>
           <p class="astro-meta">Born ${escapeHtml(inp.date)} at ${escapeHtml(inp.time)} · ${escapeHtml(placeLabel)}</p>`;
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.normalized || !data.normalized.length) {
        more.innerHTML = `<p class="astro-note">The chart service didn't return usable data this time — your Sun reading above still stands. ${data && data.message ? escapeHtml(data.message) : ""}</p>`;
        return;
      }

      const find = (n) => data.normalized.find((p) => p.name.toLowerCase() === n);
      const moon = find("moon"), asc = find("ascendant") || find("rising");
      let big = "";
      if (moon || asc) {
        big = `<div class="astro-bigthree">`;
        big += `<div class="astro-bt"><span>Sun</span><strong>${sun.name}</strong></div>`;
        if (moon) big += `<div class="astro-bt"><span>Moon</span><strong>${escapeHtml(moon.sign)}</strong></div>`;
        if (asc) big += `<div class="astro-bt"><span>Rising</span><strong>${escapeHtml(asc.sign)}</strong></div>`;
        big += `</div>`;
      }
      more.innerHTML =
        big +
        `<h5 class="astro-subhead">The wandering planets</h5>` +
        planetTable(data.normalized) +
        `<p class="astro-meta">Born ${escapeHtml(inp.date)} at ${escapeHtml(inp.time)} · ${escapeHtml(placeLabel)}</p>`;
    } catch (err) {
      more.innerHTML = `<p class="astro-note">Couldn't reach the chart service just now — your Sun reading above still holds. Try again in a moment.</p>`;
    }
  }

  function renderDreamForm(s) {
    modalEyebrow.textContent = "Dream Reading";
    modalTitle.textContent = "Tell me what you saw";
    modalLead.textContent = "Describe the dream — a fragment is plenty. Vesper draws the card that answers it.";
    modalActions.innerHTML = "";
    modalBody.innerHTML =
      `<form class="modal-form" id="dream-form">
         <label for="dream-text">Your dream</label>
         <textarea id="dream-text" placeholder="I was standing at the edge of the sea, and the water kept pulling back…"></textarea>
         <button type="submit" class="btn btn-primary">Read my dream</button>
       </form>`;
    document.getElementById("dream-form").addEventListener("submit", (e) => {
      e.preventDefault();
      renderDreamResult(s, document.getElementById("dream-text").value.trim());
    });
    setTimeout(() => document.getElementById("dream-text").focus(), 100);
  }

  function renderDreamResult(s, text) {
    const r = window.VESPER.dream(text);
    modalEyebrow.textContent = "Dream Reading";
    modalTitle.textContent = "What the dream was reaching for";
    modalLead.textContent = "";
    modalBody.innerHTML = "";
    modalBody.appendChild(makeCardEl(r.card, "The dream's card", 0, r.card.reversed ? r.card.rev : r.card.up));
    const msg = document.createElement("div"); msg.className = "modal-summary"; msg.innerHTML = fmt(r.text); modalBody.appendChild(msg);
    setActions([{ label: "Read another dream", primary: true, on: () => renderDreamForm(s) }]);
  }

  /* ---- Register reveals ----------------------------------------- */
  requestAnimationFrame(() => {
    document.querySelectorAll(".reveal").forEach((el) => {
      // let hero reveals play immediately; observe the rest
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        el.style.animationPlayState = "paused";
        io.observe(el);
      }
    });
  });

})();
