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
      up: "A fresh start stands wide open before you, and the only real risk is refusing to walk through it. Trust the leap even before you can see where you'll land — the ground has a way of rising to meet the brave. Travel light, stay curious, and let the unknown be an invitation rather than a threat; this is the first step of a whole new story.",
      rev: "Hesitation or recklessness — you're either clutching the ledge when it's time to jump, or leaping with your eyes shut. A beginning is being fumbled by fear on one side and carelessness on the other. Take one honest breath to tell the two apart, then move accordingly.",
      love: "New romance or a spontaneous chapter.", career: "A bold new venture or role.", advice: "Say yes to the unknown." },
    { name: "The Magician", n: 1, glyph: "I", key: ["will", "manifestation", "skill"],
      up: "Everything you need is already in your hands — the skill, the timing, and the will, aligned all at once. This is the rare hour when intention becomes action and an idea takes on real weight in the world. Gather your scattered energies toward a single clear aim, and watch how readily things begin to move for you.",
      rev: "Power that is misaimed or unspent — big talk without motion, or talent bent toward manipulation and shortcuts. The ability is real, but it's pointed at the wrong target or trapped behind hesitation. Realign what you're doing with what you actually want, and the magic returns.",
      love: "Magnetic attraction, real chemistry.", career: "You have the skill to build it now.", advice: "Concentrate your power on one thing." },
    { name: "The High Priestess", n: 2, glyph: "II", key: ["intuition", "mystery", "the inner voice"],
      up: "The answer you're chasing lives beneath the surface, in the quiet you keep talking over. This is a time to stop performing and start listening — to dreams, to instinct, to the knowing that arrives without explanation. Go still, trust what you already sense, and let the mystery unfold at its own unhurried pace.",
      rev: "Ignored instincts or secrets held too close — you're seeking answers everywhere except where they actually live, which is within. The inner voice has been drowned out by noise and second-guessing. Get quiet again, and stop overriding what you already know to be true.",
      love: "A deep, unspoken connection.", career: "Trust a hunch you can't yet justify.", advice: "Listen before you act." },
    { name: "The Empress", n: 3, glyph: "III", key: ["abundance", "nurture", "creation"],
      up: "A lush season of growth, warmth, and sensual abundance is opening around you. Whatever you tend now — a project, a bond, a body, a home — will flourish under your patient care. Slow down enough to actually enjoy it; creation isn't only effort, it's pleasure, beauty, and the grace of receiving.",
      rev: "Creative block, or over-giving until the well runs dry. You may be pouring care into everyone and everything but yourself, and the flow has stalled as a result. Turn some of that nurture inward first — you can't tend a garden from an empty watering can.",
      love: "Warmth, fertility, devotion.", career: "Creative projects bloom.", advice: "Nurture, don't force." },
    { name: "The Emperor", n: 4, glyph: "IV", key: ["structure", "authority", "stability"],
      up: "Structure is your ally now — build the solid framework that turns vision into something lasting. Discipline, clear boundaries, and steady authority give your dreams a spine to stand on. Lead deliberately, set the rules you'll actually keep, and discover how much freedom a little order can buy you.",
      rev: "Rigidity, control, or authority gone cold and domineering. The scaffolding that once supported you has hardened into a cage — for yourself or for someone around you. Loosen the grip; real leadership guides and protects rather than dominates.",
      love: "Commitment and steadiness.", career: "Leadership and firm structure.", advice: "Set the rules, then keep them." },
    { name: "The Hierophant", n: 5, glyph: "V", key: ["tradition", "guidance", "belonging"],
      up: "Wisdom passed down through tradition, mentors, and community is available to you now. There is real strength in the tried-and-true path, in learning from those who walked the road before you. Seek the teacher, honor the ritual, and let a sense of belonging steady your footing.",
      rev: "A restlessness with convention — the inherited rules no longer fit, and something in you knows it. This is the moment to question what you were handed and keep only what still rings true. Sometimes the sacred act is to step off the well-worn path and make your own.",
      love: "Traditional union or shared values.", career: "Mentorship, institutions, credentials.", advice: "Learn from those who came before." },
    { name: "The Lovers", n: 6, glyph: "VI", key: ["union", "choice", "alignment"],
      up: "A meaningful union, and a choice made from the deepest part of you. This card is about alignment — of two hearts, of your values, of the life you say you want and the one you actually choose. Decide with your whole self rather than just your longing, and the connection will have roots that hold.",
      rev: "Disharmony, temptation, or a values mismatch quietly pulling at a bond. Something is out of true between what you feel and what you've committed to. Get honest about the misalignment before you take another step; a choice avoided is still a choice.",
      love: "Soulful connection, real choice.", career: "A partnership worth choosing.", advice: "Choose with your whole heart." },
    { name: "The Chariot", n: 7, glyph: "VII", key: ["drive", "victory", "willpower"],
      up: "Victory belongs to the focused, and right now the momentum is yours to seize. Harness the opposing forces tugging at you — will against fear, drive against doubt — and point them in one direction. Hold the reins with confidence; you arrive where you're going by choosing it, not by drifting toward it.",
      rev: "Loss of direction, scattered force, or a will that has stalled out. You're either spinning your wheels or being pulled three ways at once. Gather yourself, name the single destination that matters, and take back the reins before you move.",
      love: "Pursuing what you want with resolve.", career: "Momentum and hard-won wins.", advice: "Steer; don't drift." },
    { name: "Strength", n: 8, glyph: "VIII", key: ["courage", "gentleness", "inner power"],
      up: "True strength here is tender, not brute — the quiet courage to meet your fears with patience. You tame what's wild, in yourself and in your situation, through gentleness and steady nerve rather than force. Soft power outlasts hard force every time; lead with the open hand and the calm, unhurried heart.",
      rev: "Self-doubt, forced control, or courage worn thin. You may be white-knuckling something that only patience and compassion can soothe. Be gentler with the wild parts of yourself — they answer to kindness, never to domination.",
      love: "Patience deepens the bond.", career: "Grace under pressure.", advice: "Soft power outlasts brute force." },
    { name: "The Hermit", n: 9, glyph: "IX", key: ["solitude", "reflection", "inner light"],
      up: "It's time to step back from the noise and light your own small lamp in the quiet. The wisdom you're seeking won't be found in the crowd — it lives in solitude, reflection, and honest self-inquiry. Withdraw for a while, listen to yourself think, and let your inner light reveal the very next step.",
      rev: "Isolation that has curdled into avoidance, or a refusal of the reflection you truly need. Either you've hidden in the cave too long, or you won't sit still long enough to hear yourself at all. Find the balance between honest retreat and coming back to the world.",
      love: "A season of introspection.", career: "Seek clarity before the next move.", advice: "Withdraw to hear yourself think." },
    { name: "Wheel of Fortune", n: 10, glyph: "X", key: ["cycles", "fate", "turning points"],
      up: "The great wheel is turning, and this time it turns in your favor. Cycles complete, luck shifts, and an unexpected opening arrives — fortune rewards those who move with the change instead of bracing against it. Trust the timing of your life; what is rising now was always meant to.",
      rev: "A downturn, bad timing, or stubborn resistance to a cycle you cannot stop. The wheel keeps turning whether or not you approve of the direction. Hold steady and keep your footing — this, too, will come back around in time.",
      love: "A fated shift in connection.", career: "Luck and unexpected openings.", advice: "Flow with the cycle." },
    { name: "Justice", n: 11, glyph: "XI", key: ["truth", "fairness", "consequence"],
      up: "Truth comes to light and the accounts of your life are balanced with fairness. Cause and consequence are unusually clear right now — what you put out is returning to you, so act with integrity and it will serve you well. Make the honest choice plainly; clarity and fairness are firmly on your side.",
      rev: "Imbalance, dishonesty, or accountability quietly dodged. Something is being weighed unfairly, or you're avoiding your own part in how things turned out. Own it honestly — the scales only settle once you stop tipping them.",
      love: "Fairness and honest terms.", career: "A just outcome; contracts favor you.", advice: "Do the right thing plainly." },
    { name: "The Hanged Man", n: 12, glyph: "XII", key: ["surrender", "new perspective", "pause"],
      up: "Suspend the struggle and surrender, for now, to a completely new point of view. What forcing could never solve, a change of perspective quietly reveals. Let go of your grip on how things 'should' unfold, hang in the pause without panic, and notice what becomes clear once you stop fighting the current.",
      rev: "Stalling, needless martyrdom, or clinging to a delay long past its usefulness. You're stuck upside down and calling it patience, or sacrificing for a cause that no longer asks it of you. Release what you're holding and let things finally move.",
      love: "Seeing a partner with new eyes.", career: "A useful pause before progress.", advice: "Surrender to gain sight." },
    { name: "Death", n: 13, glyph: "XIII", key: ["endings", "transformation", "release"],
      up: "One chapter is ending so that another can begin — this is transformation, not catastrophe. Let the old form die cleanly; clinging to what is already finished only prolongs the ache. Release it with grace, and make room for the rebirth that every true ending quietly carries inside it.",
      rev: "Resisting a necessary ending, or trying to breathe life back into what is already gone. The change is coming regardless — your grip is the only thing turning it painful. Loosen your hold and let the door close so a new one can open.",
      love: "A relationship transforms or ends.", career: "A clean break and a new chapter.", advice: "Release what has finished." },
    { name: "Temperance", n: 14, glyph: "XIV", key: ["balance", "patience", "alchemy"],
      up: "Blend the extremes into something finer through patience and quiet moderation. This is the alchemy of the middle path — combining opposites slowly and carefully until they become a balanced whole. Don't rush the process; the small daily miracle lives in the measured, unhurried mixing.",
      rev: "Excess, imbalance, or impatience throwing you off center. You've swung too far one way, or you're forcing a result that only time can ripen. Return to the middle path and let things settle at their own pace.",
      love: "Harmony through compromise.", career: "Steady, measured progress.", advice: "Mix the opposites slowly." },
    { name: "The Devil", n: 15, glyph: "XV", key: ["attachment", "shadow", "temptation"],
      up: "Notice the chains you've stopped questioning — the attachment, habit, or fear that quietly runs the show. This card doesn't shame the bondage; it names it, because seeing it clearly is the first step toward slipping free. Ask honestly what you're bound to, and whether the shackle is truly as locked as it feels.",
      rev: "You're loosening a grip that held you — breaking free of a pattern, craving, or bond that cost you more than it gave. The chains are coming off, link by link. Keep going; the freedom you can almost taste is closer than it has been in a long time.",
      love: "Intense passion or an unhealthy bind.", career: "Golden handcuffs; examine the cost.", advice: "The chains are looser than they look." },
    { name: "The Tower", n: 16, glyph: "XVI", key: ["upheaval", "revelation", "sudden change"],
      up: "A sudden flash of truth topples a structure that was built on shaky ground. It feels like upheaval, but what falls now was never going to hold — the crash is actually a clearing. Let the false thing collapse without clinging to the rubble; whatever remains standing is what was genuinely true.",
      rev: "You're delaying an inevitable collapse, or a crisis is finally easing its grip. Either the tower is already cracking and you're bracing your shoulder against it, or the worst has passed and the dust is settling. Either way, stop propping up the false thing and let the rebuild begin.",
      love: "A shakeup that clears the air.", career: "Disruption that resets everything.", advice: "Let the false thing fall." },
    { name: "The Star", n: 17, glyph: "XVII", key: ["hope", "healing", "renewal"],
      up: "After the storm comes a great calm, and with it the gentle return of hope. Your faith is being quietly restored — this is healing, renewal, and the soft light that guides you back toward yourself. Breathe, trust that it truly is mending, and let yourself believe in the future again.",
      rev: "Discouragement, depletion, or a loss of faith after a long hard stretch. The light hasn't actually gone out — you've simply stopped lifting your eyes to see it. Rest without guilt, and let hope find its own quiet way back in.",
      love: "Healing and renewed tenderness.", career: "Inspiration and quiet optimism.", advice: "Trust that it's mending." },
    { name: "The Moon", n: 18, glyph: "XVIII", key: ["dreams", "illusion", "the unknown"],
      up: "Not everything is as it appears; you're moving through fog where feeling matters more than fact. Illusions, dreams, and half-truths cloud the path, so navigate by intuition rather than by fear. Feel your way through the dark slowly — clarity arrives with the dawn, not a moment before.",
      rev: "The confusion is beginning to clear, and truth is surfacing from the dark water. What was hidden or misread is finally coming into focus. Trust the returning light, and act on what you can now genuinely see.",
      love: "Uncertainty or hidden feelings.", career: "Trust intuition where facts are murky.", advice: "Feel your way through the dark." },
    { name: "The Sun", n: 19, glyph: "XIX", key: ["joy", "success", "vitality"],
      up: "Warmth, clarity, and uncomplicated joy — everything you touch seems lit up from within. This is success, vitality, and the simple happiness of being fully yourself out in the open. Let yourself shine without apology; the season is bright and generous, so step into it and enjoy.",
      rev: "A passing cloud dims the sun — a temporary discouragement, or joy that's merely delayed. The warmth and optimism are still there, just muffled for a moment. Wait it out with patience; the light always returns.",
      love: "Radiant, uncomplicated happiness.", career: "Success and recognition.", advice: "Let yourself shine." },
    { name: "Judgement", n: 20, glyph: "XX", key: ["awakening", "reckoning", "calling"],
      up: "A calling rises that you can't quite ignore — a reckoning, an awakening, a summons toward a truer version of your life. Look honestly at what's behind you, forgive what needs forgiving, and answer the deeper call. This is the moment to rise up and meet the person you're becoming.",
      rev: "Self-doubt, or a calling you keep quietly declining to answer. You may be judging yourself far too harshly, or ignoring the summons out of fear of what saying yes would ask of you. Make peace with the past, and let yourself respond.",
      love: "A relationship reborn or reassessed.", career: "A pivotal calling arrives.", advice: "Answer the call." },
    { name: "The World", n: 21, glyph: "XXI", key: ["completion", "wholeness", "arrival"],
      up: "A whole cycle completes in triumph — you've arrived, and the circle closes with a deep sense of wholeness. This is fulfillment, integration, and well-earned completion; pause to savor the finish before the next journey inevitably calls. Honor how far you've travelled; you actually finished the thing.",
      rev: "So close — a loose end or unfinished piece is keeping the circle from fully closing. Don't abandon it at the very last step, where it's easiest to walk away. Tie off what remains and let yourself genuinely arrive.",
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
      note: "This is the seed stage — raw potential, not yet shape. Say yes to it and plant it with real intention.",
      loveHint: "a fresh emotional beginning", careerHint: "a new opportunity opening" },
    { r: "Two",   up: "balance and a first choice within", rev: "indecision around",
      note: "Two paths, two hands, one decision waiting to be weighed. Choose consciously rather than letting the moment choose for you.",
      loveHint: "a budding partnership", careerHint: "weighing two paths" },
    { r: "Three", up: "growth and early reward in", rev: "a stall or misstep in",
      note: "The first fruits are appearing — early proof that the effort is working. Celebrate it, then keep building on the momentum.",
      loveHint: "connection deepening or a triangle", careerHint: "collaboration paying off" },
    { r: "Four",  up: "stability and rest within", rev: "stagnation or clinging in",
      note: "A plateau of rest and consolidation, well earned. Enjoy the steadiness, but don't let comfort quietly harden into stagnation.",
      loveHint: "steady comfort — or complacency", careerHint: "consolidation and saving" },
    { r: "Five",  up: "challenge, loss or friction in", rev: "recovery from struggle in",
      note: "This is the difficult middle, where friction and setback test what you're made of. It's uncomfortable, but it's shaping you — don't waste the lesson.",
      loveHint: "a rough patch to move through", careerHint: "competition or a setback" },
    { r: "Six",   up: "harmony, generosity and progress in", rev: "imbalance or debt in",
      note: "The turning toward harmony — recovery, generosity, and forward motion after the hard stretch. Give and receive freely; the tide has changed.",
      loveHint: "kindness restoring the bond", careerHint: "recognition and forward motion" },
    { r: "Seven", up: "assessment, patience or defense of", rev: "impatience or giving up on",
      note: "A moment to assess, hold your position, or wait — strategy and patience over haste. Look before you commit the next move.",
      loveHint: "reflection on what you truly want", careerHint: "playing the long game" },
    { r: "Eight", up: "movement, mastery and momentum in", rev: "delay or scattered focus in",
      note: "Swift movement and growing mastery — momentum is on your side, so keep your focus narrow and let it carry you.",
      loveHint: "swift developments", careerHint: "skill-building and speed" },
    { r: "Nine",  up: "near-fulfillment and resilience in", rev: "anxiety or almost-there in",
      note: "Nearly there — resilience is paying off and fulfillment is within reach. Hold your nerve through the final stretch.",
      loveHint: "contentment within reach", careerHint: "hard-won progress" },
    { r: "Ten",   up: "completion and the full weight of", rev: "burden or an overdue ending in",
      note: "The full cycle, carried to its end — the complete weight of the suit, for better or for heavier. Honor the ending, and ready yourself for what begins next.",
      loveHint: "lasting fulfillment or a heavy chapter", careerHint: "a cycle reaching its end" },
    { r: "Page",  up: "curiosity and a fresh message about", rev: "immaturity or blocked news about",
      note: "The student's spark — curiosity, a message, the first eager stirring of the suit's energy. Stay open and willing to learn.",
      loveHint: "a flirtation or sweet message", careerHint: "a student's fresh eagerness" },
    { r: "Knight",up: "bold action and pursuit of", rev: "haste or stalling in the pursuit of",
      note: "Bold pursuit and forward charge — the suit's energy in its most driven, headlong form. Aim before you gallop.",
      loveHint: "a passionate suitor or chase", careerHint: "driving hard toward a goal" },
    { r: "Queen", up: "mature, nurturing mastery of", rev: "insecurity or over-control of",
      note: "Mature, nurturing mastery — the suit's power held with warmth, depth, and emotional intelligence. Lead from that fullness.",
      loveHint: "emotional generosity and depth", careerHint: "confident, caring leadership" },
    { r: "King",  up: "commanding, seasoned authority over", rev: "rigidity or misuse of power over",
      note: "Seasoned, commanding authority — the suit's power wielded with control and long experience. Rule it wisely, with an open hand.",
      loveHint: "a steady, devoted presence", careerHint: "authority and strategic command" }
  ];

  /* Optional artwork for individual minor cards. Minors are generated from
     archetypes, so add per-card images here by name, e.g.:
       "Ace of Cups": "assets/cards/ace-of-cups.jpg",
     Any minor without an entry falls back to its suit glyph. */
  const MINOR_IMAGES = {};

  function buildMinors() {
    const out = [];
    Object.keys(SUITS).forEach((suitName) => {
      const s = SUITS[suitName];
      RANKS.forEach((rk) => {
        const isCourt = ["Page", "Knight", "Queen", "King"].includes(rk.r);
        const name = `${rk.r} of ${suitName}`;
        out.push({
          name: name,
          arcana: "minor",
          suit: suitName,
          element: s.element,
          glyph: s.glyph,
          img: MINOR_IMAGES[name],
          court: isCourt,
          key: [rk.r.toLowerCase(), suitName.toLowerCase(), s.element.toLowerCase()],
          up: `${cap(rk.up)} ${s.theme}. ${rk.note}`,
          rev: `${cap(rk.rev)} ${s.theme}. The ${s.element.toLowerCase()} energy of ${suitName} is blocked or turned inward right now — worth tending before you move on. ${rk.note}`,
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
    name: m.name, arcana: "major", n: m.n, glyph: m.glyph, court: false, img: m.img,
    key: m.key, up: m.up, rev: m.rev, love: m.love, career: m.career, advice: m.advice
  }));

  const DECK = MAJOR_CARDS.concat(buildMinors()); // 22 + 56 = 78

  global.VESPER_DECK = DECK;
  global.VESPER_SUITS = SUITS;

})(typeof window !== "undefined" ? window : this);
