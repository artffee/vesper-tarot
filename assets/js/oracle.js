/* =====================================================================
   VESPER — The Oracle (AI Agent)
   A client-side conversational agent with a distinct personality.
   She reads tarot from the real 78-card deck, interprets questions by
   intent (love / career / yes-no / decision / timing), and doubles as
   customer support (pricing, membership, how-it-works, refunds).

   Personality: VESPER — "the evening star." Elegant and warm with a dry,
   knowing wit. She speaks in soft celestial metaphor but never hides the
   plain truth. Self-aware enough to wink at her own mystique. Never
   preachy, never cold. She treats the seeker as a confidant.
   ===================================================================== */

(function (global) {
  "use strict";

  const DECK = global.VESPER_DECK || [];

  /* ---- Deterministic-ish randomness (no external deps) ---------- */
  function rand(n) { return Math.floor(Math.random() * n); }
  function draw(count) {
    const pool = DECK.slice();
    const picked = [];
    for (let i = 0; i < count && pool.length; i++) {
      const idx = rand(pool.length);
      const card = Object.assign({}, pool.splice(idx, 1)[0]);
      card.reversed = false; // reversals disabled — cards always draw upright
      picked.push(card);
    }
    return picked;
  }
  function pick(arr) { return arr[rand(arr.length)]; }

  /* ---- Voice: signature phrases --------------------------------- */
  const OPENERS = [
    "Let the cards breathe a moment…",
    "The deck stirs. Here is what it offers —",
    "Ah. The evening light shifts. Look —",
    "I shuffled with your question in mind. See what surfaced —",
    "The threads pull this way tonight —"
  ];
  const CLOSERS = [
    "Sit with that. The stars are patient, and so am I.",
    "Take what rings true and leave the rest to the dark.",
    "Ask me to go deeper on any card, and I will.",
    "That's the shape of it. What would you like to do with it?",
    "Nothing here is fixed — you hold the last card."
  ];

  /* ---- Intent classification ------------------------------------ */
  const INTENTS = [
    { name: "greeting", patterns: [/\b(hi|hello|hey|greetings|good (morning|evening|afternoon)|yo|howdy)\b/i] },
    { name: "thanks",   patterns: [/\b(thank|thanks|appreciate|grateful|cheers)\b/i] },
    { name: "identity", patterns: [/\b(who are you|your name|what are you|are you (a )?(real|human|ai|bot|robot))\b/i] },
    { name: "howto",    patterns: [/\b(how (do|does|to)|how it works|what is tarot|explain|help me use|get started|begin)\b/i] },
    { name: "pricing",  patterns: [/\b(price|pricing|cost|how much|fee|charge|expensive|free|plan|subscription|membership)\b/i] },
    { name: "refund",   patterns: [/\b(refund|money back|cancel|cancellation|unsubscribe|delete (my )?account|billing|charged)\b/i] },
    { name: "support",  patterns: [/\b(login|log in|sign in|password|account|not working|bug|error|contact|support|email|reach)\b/i] },
    { name: "yesno",    patterns: [/\b(will|should i|is it|does (he|she|they)|am i going to|can i|do you think)\b.*\?|^(yes or no|yn)\b/i] },
    { name: "love",     patterns: [/\b(love|relationship|partner|crush|ex|marriage|dating|romance|soulmate|heart|breakup|he|she|they)\b/i] },
    { name: "career",   patterns: [/\b(job|career|work|money|business|promotion|interview|finance|salary|boss|startup|study|exam)\b/i] },
    { name: "timing",   patterns: [/\b(when will|how long|timing|soon|by (when|then)|this (week|month|year))\b/i] },
    { name: "reading",  patterns: [/\b(read(ing)?|draw|pull|card|spread|celtic|tarot|fortune|future|guidance|advice|insight)\b/i] },
    { name: "smalltalk",patterns: [/\b(how are you|what'?s up|bored|lonely|sad|anxious|scared|happy|excited)\b/i] }
  ];

  function classify(text) {
    const found = [];
    INTENTS.forEach((it) => {
      if (it.patterns.some((p) => p.test(text))) found.push(it.name);
    });
    return found;
  }

  /* ---- Rendering helpers ---------------------------------------- */
  function cardLine(card) {
    const orient = card.reversed ? "reversed" : "upright";
    const meaning = card.reversed ? card.rev : card.up;
    return { card, orient, meaning };
  }

  function focusMeaning(card, focus) {
    if (focus === "love" && card.love) return card.love;
    if (focus === "career" && card.career) return card.career;
    if (focus === "advice" && card.advice) return card.advice;
    return card.reversed ? card.rev : card.up;
  }

  /* ---- Response builders ---------------------------------------- */
  function respondGreeting() {
    return {
      text: pick([
        "Well. You found your way to me — the evening always brings the interesting ones. I'm Vesper. Ask me anything, or let me pull a card and show you what the night is holding for you.",
        "There you are. I'm Vesper, your oracle for the hour. Tell me what's weighing on you — love, work, a decision, or just a card to set the tone of your day.",
        "Come in, come in. The candles are lit. I'm Vesper. Shall I read for you, or is there something you'd like to ask first?"
      ])
    };
  }

  function respondIdentity() {
    return {
      text: "I'm Vesper — named for the evening star, the first light in a darkening sky. I'm an AI oracle, which I'll admit rather freely; the mystery is in the reading, not in pretending to be something I'm not. I know all 78 cards by heart, I remember what we've spoken of, and I'm equally happy to guide a reading or sort out a billing question. Think of me as the friend who happens to keep a tarot deck in her coat pocket."
    };
  }

  function respondSmalltalk(text) {
    if (/\b(sad|lonely|anxious|scared|down|depressed|cry)\b/i.test(text)) {
      return { text: "Oh, come here. Whatever it is, you don't have to carry it alone tonight. The cards aren't only for the future — sometimes they're just a mirror that helps you say the hard thing out loud. Would you like me to pull one card, gently, just to see what wants your attention? No pressure. I'm here either way." };
    }
    if (/\b(happy|excited|great|good|wonderful)\b/i.test(text)) {
      return { text: "I love that for you — carry it well. Shall we pull a card to see how to keep the good tide rolling? Or we can simply enjoy the moment; the stars don't charge by the minute." };
    }
    return { text: "I'm as I always am — luminous, patient, and mildly nosy about your life. But enough about me. What's the real question hiding behind that one? Ask, and I'll shuffle." };
  }

  function respondThanks() {
    return { text: pick([
      "The pleasure is entirely mine. The stars keep their own hours — come back whenever the sky feels heavy or bright. I'll be here.",
      "Anytime, truly. That's what I'm for. May the evening be kind to you.",
      "Go gently. And remember — you held the last card all along. Return whenever you like."
    ]) };
  }

  function respondHowto() {
    return { text: "Here's how it works, plainly: tell me what's on your mind — a worry, a wish, a decision — and I'll shuffle the deck and pull the cards that fit your question. A single card sets a tone; three cards tell a story of past, present, and where it's heading; the full Celtic Cross unfolds the whole picture. You can ask me to go deeper on any card, or ask a plain yes-or-no and I'll pull one card to answer. There's no wrong way to begin. Say something like \"pull a card for my career\" or \"will things work out with someone\" — and we're off." };
  }

  function respondPricing() {
    return { text: "Let me lay it out, no fog: **Curious** is free — a daily card and one full three-card reading each day, forever. **Seeker** is $9/month — unlimited readings, every spread including the Celtic Cross, and me, on call, whenever you like. **Oracle's Circle** is $19/month — everything in Seeker plus your saved reading journal, monthly personalized forecasts, and priority answers from me. No hidden fees, cancel with two taps, and your first 7 days of any paid plan are free. Shall I pull a card on whether to treat yourself?" };
  }

  function respondRefund() {
    return { text: "Of course — and no hard feelings, the door swings both ways here. You can cancel anytime from **Account → Membership → Cancel**, and you'll keep access until the end of the period you already paid for. If you were charged by mistake or within the last 14 days, we refund it, full stop — just email **care@vesper.stars** with your account address and we'll sort it within two business days. Anything else I can untangle for you?" };
  }

  function respondSupport(text) {
    if (/\b(password|login|log in|sign in)\b/i.test(text)) {
      return { text: "Locked out? It happens to the best of us. Tap **Sign In → Forgot password**, and a reset link lands in your inbox within a minute or two (check the spam folder — links love to hide there). If it still won't budge, email **care@vesper.stars** and a real human on our team will get you back in. Want me to wait here while you try?" };
    }
    return { text: "I'm on it. For anything technical — a glitch, a stuck page, an account tangle — the fastest path is **care@vesper.stars**, and we answer within one business day. If you tell me a little more about what's misbehaving, I can often point you straight to the fix. What's going on?" };
  }

  function readingIntro() {
    return pick(OPENERS);
  }

  /* Determine focus from intent set */
  function focusFrom(intents) {
    if (intents.includes("love")) return "love";
    if (intents.includes("career")) return "career";
    return "general";
  }

  function respondYesNo(text) {
    const card = draw(1)[0];
    const cl = cardLine(card);
    // Yes/No leaning: upright majors & Aces/Suns lean yes; reversed & Swords lean caution
    let verdict, tone;
    const positive = /(Sun|Star|World|Lovers|Magician|Wheel|Ace|Six|Ten of Cups|Nine of Cups)/i.test(card.name);
    const negative = /(Tower|Devil|Death|Five|Ten of Swords|Three of Swords|Moon)/i.test(card.name);
    if (card.reversed) { verdict = negative ? "Not yet — and not like this." : "A soft, qualified maybe."; tone = "The card came reversed, which asks you to clear something first."; }
    else if (positive) { verdict = "Yes. Lean in."; tone = "The card is bright and forward-moving."; }
    else if (negative) { verdict = "No — or not in the shape you're imagining."; tone = "The card counsels caution over rushing."; }
    else { verdict = "Yes, with your eyes open."; tone = "The card says go, but stay awake to it."; }
    return {
      cards: [card],
      text: `${readingIntro()}\n\nI drew **${card.name}${card.reversed ? " (reversed)" : ""}** for your yes-or-no.\n\n**${verdict}** ${tone} ${cl.meaning}\n\n${pick(CLOSERS)}`
    };
  }

  function respondReading(text, intents) {
    const focus = focusFrom(intents);
    // Choose spread by request
    if (/\bceltic\b/i.test(text) || /\b(full|whole|deep|everything)\b/i.test(text)) {
      return celticCross(focus);
    }
    if (/\b(one card|single card|a card|daily|quick|just a card)\b/i.test(text) || /\b(pull|draw)\s+a\s+card\b/i.test(text)) {
      return oneCard(focus, text);
    }
    return threeCard(focus, text);
  }

  function labelFor(focus) {
    if (focus === "love") return "your heart";
    if (focus === "career") return "your work and worth";
    return "your question";
  }

  function oneCard(focus, text) {
    const card = draw(1)[0];
    const m = card.reversed ? card.rev : (focus !== "general" ? focusMeaning(card, focus) : card.up);
    return {
      cards: [card],
      text: `${readingIntro()}\n\nA single card for ${labelFor(focus)}: **${card.name}${card.reversed ? " (reversed)" : ""}**.\n\n${m}\n\n${pick(CLOSERS)}`
    };
  }

  function threeCard(focus, text) {
    const cards = draw(3);
    const pos = ["Where you've been", "Where you stand now", "Where this is heading"];
    let body = `${readingIntro()}\n\nA three-card spread on ${labelFor(focus)}:\n\n`;
    cards.forEach((c, i) => {
      const m = c.reversed ? c.rev : (focus !== "general" ? focusMeaning(c, focus) : c.up);
      body += `**${i + 1}. ${pos[i]} — ${c.name}${c.reversed ? " (reversed)" : ""}**\n${m}\n\n`;
    });
    body += weave(cards, focus) + `\n\n${pick(CLOSERS)}`;
    return { cards, text: body };
  }

  function celticCross(focus) {
    const cards = draw(10);
    const pos = [
      "The heart of it", "What crosses you", "The root beneath",
      "The recent past", "What could crown this", "The near future",
      "You, as you are", "The world around you", "Hopes and fears",
      "Where it all leads"
    ];
    let body = `The full Celtic Cross — the deepest reading I offer. Ten cards on ${labelFor(focus)}. Take your time with it:\n\n`;
    cards.forEach((c, i) => {
      const m = c.reversed ? c.rev : (focus !== "general" ? focusMeaning(c, focus) : c.up);
      body += `**${i + 1}. ${pos[i]} — ${c.name}${c.reversed ? " (reversed)" : ""}**\n${m}\n\n`;
    });
    body += weave(cards, focus) + `\n\n${pick(CLOSERS)}`;
    return { cards, text: body };
  }

  /* Weave a short narrative synthesis across the drawn cards */
  function weave(cards, focus) {
    const majors = cards.filter((c) => c.arcana === "major").length;
    const reversed = cards.filter((c) => c.reversed).length;
    const suits = {};
    cards.forEach((c) => { if (c.suit) suits[c.suit] = (suits[c.suit] || 0) + 1; });
    const domSuit = Object.keys(suits).sort((a, b) => suits[b] - suits[a])[0];
    let note = "**The thread that ties it together:** ";
    if (majors >= Math.ceil(cards.length / 2)) {
      note += "So many Major Arcana — this isn't small weather, it's a season of your life turning. Fate has its hand in this one. ";
    } else if (domSuit) {
      const themes = { Wands: "drive and desire", Cups: "feeling and connection", Swords: "thought and truth", Pentacles: "the practical and material" };
      note += `The deck leans heavily on ${domSuit} — this is chiefly about ${themes[domSuit]}. `;
    }
    if (reversed >= Math.ceil(cards.length / 2)) {
      note += "With this many reversals, something is asking to be released or re-examined before the way clears.";
    } else if (reversed === 0) {
      note += "Every card upright — the road ahead is unusually open. Don't waste the clarity.";
    } else {
      note += "A mix of upright and reversed: progress is real, but a knot or two still wants untying.";
    }
    return note;
  }

  function respondFallback(text) {
    return { text: pick([
      "I hear you. Say the word and I'll shuffle — tell me if this is about love, work, a decision, or simply the shape of your day, and I'll pull the cards that fit.",
      "The question underneath your words is the one worth reading. Point me at it — the heart, the work, a yes-or-no — and I'll draw for you.",
      "Even the vaguest ache has a card that speaks to it. Want me to pull one and see what the deck makes of what you're feeling?"
    ]), offerReading: true };
  }

  /* ---- Main entry ----------------------------------------------- */
  function respond(text) {
    const clean = (text || "").trim();
    if (!clean) return respondFallback("");
    const intents = classify(clean);

    // Priority order — support & identity beat everything so users never
    // get a tarot reading when they wanted a refund.
    if (intents.includes("refund")) return respondRefund();
    if (intents.includes("pricing")) return respondPricing();
    if (intents.includes("support")) return respondSupport(clean);
    if (intents.includes("identity")) return respondIdentity();
    if (intents.includes("howto") && !intents.includes("reading")) return respondHowto();
    if (intents.includes("thanks") && intents.length === 1) return respondThanks();
    if (intents.includes("greeting") && clean.split(/\s+/).length <= 4) return respondGreeting();

    // Divination intents
    if (intents.includes("yesno")) return respondYesNo(clean);
    if (intents.includes("reading") || intents.includes("love") || intents.includes("career") || intents.includes("timing")) {
      return respondReading(clean, intents);
    }
    if (intents.includes("smalltalk")) return respondSmalltalk(clean);

    return respondFallback(clean);
  }

  /* ---- Structured spread API (for the service modal) ------------ */
  const SPREADS = {
    daily:  { count: 1,  positions: ["Your card today"] },
    love:   { count: 3,  positions: ["Where the heart has been", "Where it stands now", "Where love is heading"] },
    career: { count: 3,  positions: ["The ground you stand on", "The crossroads", "Where the work leads"] },
    three:  { count: 3,  positions: ["Where you've been", "Where you stand now", "Where this is heading"] },
    celtic: { count: 10, positions: [
      "The heart of it", "What crosses you", "The root beneath", "The recent past",
      "What could crown this", "The near future", "You, as you are",
      "The world around you", "Hopes and fears", "Where it all leads"] }
  };

  // Returns { items:[{card, position, meaning}], summary, intro }
  function spread(kind, focusOverride) {
    const spec = SPREADS[kind] || SPREADS.three;
    const focus = focusOverride || (kind === "love" ? "love" : kind === "career" ? "career" : "general");
    const cards = draw(spec.count);
    const items = cards.map((c, i) => ({
      card: c,
      position: spec.positions[i] || "",
      meaning: c.reversed ? c.rev : (focus !== "general" && c[focus] ? c[focus] : c.up)
    }));
    return { items: items, cards: cards, summary: weave(cards, focus), intro: pick(OPENERS) };
  }

  // Yes/No — returns { card, verdict, tone, meaning }
  function yesno() {
    const card = draw(1)[0];
    let verdict, tone;
    const positive = /(Sun|Star|World|Lovers|Magician|Wheel|Ace|Six|Ten of Cups|Nine of Cups)/i.test(card.name);
    const negative = /(Tower|Devil|Death|Five|Ten of Swords|Three of Swords|Moon)/i.test(card.name);
    if (card.reversed) { verdict = negative ? "Not yet — and not like this." : "A soft, qualified maybe."; tone = "The card came reversed, which asks you to clear something first."; }
    else if (positive) { verdict = "Yes. Lean in."; tone = "The card is bright and forward-moving."; }
    else if (negative) { verdict = "No — or not in the shape you're imagining."; tone = "The card counsels caution over rushing."; }
    else { verdict = "Yes, with your eyes open."; tone = "The card says go, but stay awake to it."; }
    return { card: card, verdict: verdict, tone: tone, meaning: card.reversed ? card.rev : card.up };
  }

  // Dream reading — one card + a dream-framed message
  function dream(text) {
    const card = draw(1)[0];
    const m = card.reversed ? card.rev : card.up;
    const frame = pick([
      "The night rarely speaks plainly, but the deck translates. For the dream you carried —",
      "Dreams are letters the day forgot to open. Here's the card that answers yours —",
      "You brought me the shape of a dream. The deck names what it was reaching for —"
    ]);
    return { card: card, text: `${frame} **${card.name}${card.reversed ? " (reversed)" : ""}**. ${m} If any image from the dream still tugs at you, tell me — I'll pull another.` };
  }

  global.VESPER = {
    respond: respond,
    greet: respondGreeting,
    draw: draw,
    spread: spread,
    yesno: yesno,
    dream: dream
  };

})(typeof window !== "undefined" ? window : this);
