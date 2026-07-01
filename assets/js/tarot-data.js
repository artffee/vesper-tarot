/* =====================================================================
   VESPER — Tarot Deck Data
   A complete 78-card deck. Major Arcana are hand-authored; the Minor
   Arcana are composed from suit + rank archetypes so every card carries
   a genuine, readable meaning across upright and reversed positions.
   ===================================================================== */

(function (global) {
  "use strict";

  /* ---- Major Arcana (22) ---------------------------------------- */
  const MAJORS = [
    { name: "The Fool", n: 0, glyph: "0", key: ["beginnings", "leap of faith", "freedom"],
      up: "A fresh start stands open before you. Trust the leap even before you can see where you'll land.",
      rev: "Hesitation or recklessness. Look before you leap — or stop clutching the ledge.",
      love: "New romance or a spontaneous chapter.", career: "A bold new venture or role.", advice: "Say yes to the unknown." },
    { name: "The Magician", n: 1, glyph: "I", key: ["will", "manifestation", "skill"],
      up: "Every tool you need is already in your hands. Focus your intention and make it real.",
      rev: "Scattered energy or manipulation. Align your actions with your true aim.",
      love: "Magnetic attraction, real chemistry.", career: "You have the skill to build it now.", advice: "Concentrate your power on one thing." },
    { name: "The High Priestess", n: 2, glyph: "II", key: ["intuition", "mystery", "the inner voice"],
      up: "The answer lives beneath the surface. Go quiet and let your intuition speak.",
      rev: "Ignored instincts or secrets kept. Reconnect with your inner knowing.",
      love: "A deep, unspoken connection.", career: "Trust a hunch you can't yet justify.", advice: "Listen before you act." },
    { name: "The Empress", n: 3, glyph: "III", key: ["abundance", "nurture", "creation"],
      up: "A season of growth and sensual abundance. Tend what you love and watch it flourish.",
      rev: "Creative block or over-giving. Pour some care back into yourself.",
      love: "Warmth, fertility, devotion.", career: "Creative projects bloom.", advice: "Nurture, don't force." },
    { name: "The Emperor", n: 4, glyph: "IV", key: ["structure", "authority", "stability"],
      up: "Build the framework. Discipline and clear boundaries turn vision into a lasting throne.",
      rev: "Rigidity or control. Loosen the grip; lead, don't dominate.",
      love: "Commitment and steadiness.", career: "Leadership and firm structure.", advice: "Set the rules, then keep them." },
    { name: "The Hierophant", n: 5, glyph: "V", key: ["tradition", "guidance", "belonging"],
      up: "Wisdom passed down and communities that hold you. Seek a mentor or honored path.",
      rev: "Breaking convention. Question the rules that no longer fit.",
      love: "Traditional union or shared values.", career: "Mentorship, institutions, credentials.", advice: "Learn from those who came before." },
    { name: "The Lovers", n: 6, glyph: "VI", key: ["union", "choice", "alignment"],
      up: "A meaningful union and a choice made from the heart. Choose what you truly value.",
      rev: "Disharmony or a values mismatch. Realign before you commit.",
      love: "Soulful connection, real choice.", career: "A partnership worth choosing.", advice: "Choose with your whole heart." },
    { name: "The Chariot", n: 7, glyph: "VII", key: ["drive", "victory", "willpower"],
      up: "Harness opposing forces and drive forward. Victory belongs to the focused.",
      rev: "Loss of direction. Gather your reins before you move.",
      love: "Pursuing what you want with resolve.", career: "Momentum and hard-won wins.", advice: "Steer; don't drift." },
    { name: "Strength", n: 8, glyph: "VIII", key: ["courage", "gentleness", "inner power"],
      up: "True strength is tender. Meet your fears with patience and quiet courage.",
      rev: "Self-doubt or forced control. Be gentle with the wild parts of you.",
      love: "Patience deepens the bond.", career: "Grace under pressure.", advice: "Soft power outlasts brute force." },
    { name: "The Hermit", n: 9, glyph: "IX", key: ["solitude", "reflection", "inner light"],
      up: "Step back and light your own lamp. The wisdom you seek is found in stillness.",
      rev: "Isolation or avoidance. Come back from the cave when it's time.",
      love: "A season of introspection.", career: "Seek clarity before the next move.", advice: "Withdraw to hear yourself think." },
    { name: "Wheel of Fortune", n: 10, glyph: "X", key: ["cycles", "fate", "turning points"],
      up: "The wheel turns in your favor. Ride the change instead of resisting it.",
      rev: "A downturn or bad timing. Hold steady; the wheel keeps turning.",
      love: "A fated shift in connection.", career: "Luck and unexpected openings.", advice: "Flow with the cycle." },
    { name: "Justice", n: 11, glyph: "XI", key: ["truth", "fairness", "consequence"],
      up: "Truth comes to light and accounts are balanced. Act with integrity and it returns to you.",
      rev: "Imbalance or evaded accountability. Own your part honestly.",
      love: "Fairness and honest terms.", career: "A just outcome; contracts favor you.", advice: "Do the right thing plainly." },
    { name: "The Hanged Man", n: 12, glyph: "XII", key: ["surrender", "new perspective", "pause"],
      up: "Suspend the struggle. A change of view reveals what forcing never could.",
      rev: "Stalling or needless martyrdom. Let go of what you're clinging to.",
      love: "Seeing a partner with new eyes.", career: "A useful pause before progress.", advice: "Surrender to gain sight." },
    { name: "Death", n: 13, glyph: "XIII", key: ["endings", "transformation", "release"],
      up: "One door closes so another can open. Let the old form die to make room for rebirth.",
      rev: "Resisting a needed ending. Stop reviving what is already gone.",
      love: "A relationship transforms or ends.", career: "A clean break and a new chapter.", advice: "Release what has finished." },
    { name: "Temperance", n: 14, glyph: "XIV", key: ["balance", "patience", "alchemy"],
      up: "Blend the extremes into something finer. Patience and moderation work quiet miracles.",
      rev: "Excess or imbalance. Find the middle path again.",
      love: "Harmony through compromise.", career: "Steady, measured progress.", advice: "Mix the opposites slowly." },
    { name: "The Devil", n: 15, glyph: "XV", key: ["attachment", "shadow", "temptation"],
      up: "Notice the chains you could slip off. Name the attachment that owns you.",
      rev: "Breaking free. You're loosening a grip that held you.",
      love: "Intense passion or an unhealthy bind.", career: "Golden handcuffs; examine the cost.", advice: "The chains are looser than they look." },
    { name: "The Tower", n: 16, glyph: "XVI", key: ["upheaval", "revelation", "sudden change"],
      up: "A flash of truth topples the false structure. What falls now needed to.",
      rev: "Delaying the inevitable, or the crisis easing. Let the rebuild begin.",
      love: "A shakeup that clears the air.", career: "Disruption that resets everything.", advice: "Let the false thing fall." },
    { name: "The Star", n: 17, glyph: "XVII", key: ["hope", "healing", "renewal"],
      up: "After the storm, calm and hope. Your faith is being gently restored.",
      rev: "Discouragement. Look up — the light is still there.",
      love: "Healing and renewed tenderness.", career: "Inspiration and quiet optimism.", advice: "Trust that it's mending." },
    { name: "The Moon", n: 18, glyph: "XVIII", key: ["dreams", "illusion", "the unknown"],
      up: "Not everything is as it seems. Move through the fog by feel, not by fear.",
      rev: "Confusion clearing. Truth surfaces from the dark water.",
      love: "Uncertainty or hidden feelings.", career: "Trust intuition where facts are murky.", advice: "Feel your way through the dark." },
    { name: "The Sun", n: 19, glyph: "XIX", key: ["joy", "success", "vitality"],
      up: "Warmth, clarity, and simple joy. Everything you touch is lit up now.",
      rev: "A cloud passing the sun. Optimism dims briefly, then returns.",
      love: "Radiant, uncomplicated happiness.", career: "Success and recognition.", advice: "Let yourself shine." },
    { name: "Judgement", n: 20, glyph: "XX", key: ["awakening", "reckoning", "calling"],
      up: "A calling you can't ignore. Rise to meet the truer version of your life.",
      rev: "Self-doubt or a call unanswered. Forgive the past and answer.",
      love: "A relationship reborn or reassessed.", career: "A pivotal calling arrives.", advice: "Answer the call." },
    { name: "The World", n: 21, glyph: "XXI", key: ["completion", "wholeness", "arrival"],
      up: "A cycle completes in triumph. You've arrived — savor it before the next journey.",
      rev: "So close. A loose end remains before the circle closes.",
      love: "Fulfillment and lasting union.", career: "Achievement and well-earned closure.", advice: "Honor the finish line." }
  ];

  /* ---- Minor Arcana archetypes ---------------------------------- */
  const SUITS = {
    Wands:     { element: "Fire",  glyph: "✦", theme: "passion, energy, ambition and creative drive" },
    Cups:      { element: "Water", glyph: "❋", theme: "emotion, love, intuition and relationships" },
    Swords:    { element: "Air",   glyph: "†", theme: "intellect, truth, conflict and clarity" },
    Pentacles: { element: "Earth", glyph: "✧", theme: "money, work, body and material security" }
  };

  const RANKS = [
    { r: "Ace",   up: "a pure new spark of", rev: "a blocked or delayed spark of",
      loveHint: "a fresh emotional beginning", careerHint: "a new opportunity opening" },
    { r: "Two",   up: "balance and a first choice within", rev: "indecision around",
      loveHint: "a budding partnership", careerHint: "weighing two paths" },
    { r: "Three", up: "growth and early reward in", rev: "a stall or misstep in",
      loveHint: "connection deepening or a triangle", careerHint: "collaboration paying off" },
    { r: "Four",  up: "stability and rest within", rev: "stagnation or clinging in",
      loveHint: "steady comfort — or complacency", careerHint: "consolidation and saving" },
    { r: "Five",  up: "challenge, loss or friction in", rev: "recovery from struggle in",
      loveHint: "a rough patch to move through", careerHint: "competition or a setback" },
    { r: "Six",   up: "harmony, generosity and progress in", rev: "imbalance or debt in",
      loveHint: "kindness restoring the bond", careerHint: "recognition and forward motion" },
    { r: "Seven", up: "assessment, patience or defense of", rev: "impatience or giving up on",
      loveHint: "reflection on what you truly want", careerHint: "playing the long game" },
    { r: "Eight", up: "movement, mastery and momentum in", rev: "delay or scattered focus in",
      loveHint: "swift developments", careerHint: "skill-building and speed" },
    { r: "Nine",  up: "near-fulfillment and resilience in", rev: "anxiety or almost-there in",
      loveHint: "contentment within reach", careerHint: "hard-won progress" },
    { r: "Ten",   up: "completion and the full weight of", rev: "burden or an overdue ending in",
      loveHint: "lasting fulfillment or a heavy chapter", careerHint: "a cycle reaching its end" },
    { r: "Page",  up: "curiosity and a fresh message about", rev: "immaturity or blocked news about",
      loveHint: "a flirtation or sweet message", careerHint: "a student's fresh eagerness" },
    { r: "Knight",up: "bold action and pursuit of", rev: "haste or stalling in the pursuit of",
      loveHint: "a passionate suitor or chase", careerHint: "driving hard toward a goal" },
    { r: "Queen", up: "mature, nurturing mastery of", rev: "insecurity or over-control of",
      loveHint: "emotional generosity and depth", careerHint: "confident, caring leadership" },
    { r: "King",  up: "commanding, seasoned authority over", rev: "rigidity or misuse of power over",
      loveHint: "a steady, devoted presence", careerHint: "authority and strategic command" }
  ];

  function buildMinors() {
    const out = [];
    Object.keys(SUITS).forEach((suitName) => {
      const s = SUITS[suitName];
      RANKS.forEach((rk) => {
        const isCourt = ["Page", "Knight", "Queen", "King"].includes(rk.r);
        out.push({
          name: `${rk.r} of ${suitName}`,
          arcana: "minor",
          suit: suitName,
          element: s.element,
          glyph: s.glyph,
          court: isCourt,
          key: [rk.r.toLowerCase(), suitName.toLowerCase(), s.element.toLowerCase()],
          up: `${cap(rk.up)} ${s.theme}.`,
          rev: `${cap(rk.rev)} ${s.theme} — worth tending before you move on.`,
          love: rk.loveHint,
          career: rk.careerHint,
          advice: `Work with the ${s.element.toLowerCase()} energy of ${suitName.toLowerCase()}: ${s.theme.split(",")[0]}.`
        });
      });
    });
    return out;
  }

  function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

  const MAJOR_CARDS = MAJORS.map((m) => ({
    name: m.name, arcana: "major", n: m.n, glyph: m.glyph, court: false,
    key: m.key, up: m.up, rev: m.rev, love: m.love, career: m.career, advice: m.advice
  }));

  const DECK = MAJOR_CARDS.concat(buildMinors()); // 22 + 56 = 78

  global.VESPER_DECK = DECK;
  global.VESPER_SUITS = SUITS;

})(typeof window !== "undefined" ? window : this);
