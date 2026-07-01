/* =====================================================================
   VESPER — Alternative Decks
   Themed oracle decks that sit alongside the classic 78-card tarot:
     · Angel Tarot   — 24 archangels & angelic messengers
     · Power Animal  — 28 spirit animals and their medicine
     · Shaman Path   — 24 keys of the shamanic journey
   Each card carries an upright message, a reversed/shadow reading, and a
   piece of practical advice, so they slot straight into the draw widget.
   ===================================================================== */

(function (global) {
  "use strict";

  const CLASSIC = global.VESPER_DECK || [];

  // expand compact {n,k,u,r,a} entries into full card objects
  function build(list, glyph, label) {
    return list.map((c) => ({
      name: c.n, arcana: "oracle", glyph: glyph, label: label, court: false,
      key: c.k, up: c.u, rev: c.r, advice: c.a, love: c.u, career: c.u
    }));
  }

  /* ---- Angel Tarot (24) ----------------------------------------- */
  const ANGELS = [
    { n: "Archangel Michael", k: ["protection", "courage", "truth"], u: "Michael steps in with his sword of light. You are protected; fear holds no authority here. Cut the cord to whatever drains you.", r: "You are braver than the doubt whispering otherwise. Call in protection and reclaim your power.", a: "Set one boundary today and hold it without apology." },
    { n: "Archangel Gabriel", k: ["messages", "voice", "clarity"], u: "Gabriel brings word. A message or calling is arriving — speak your truth and it will be heard.", r: "Your voice matters. Stop swallowing the thing you need to say.", a: "Say it, write it, or send it — communicate clearly." },
    { n: "Archangel Raphael", k: ["healing", "wholeness", "travel"], u: "Raphael lays healing hands where it aches — body, heart, or memory. Mending is already underway.", r: "Let yourself receive care. Healing stalls when you refuse the help offered.", a: "Tend the wound instead of working around it." },
    { n: "Archangel Uriel", k: ["wisdom", "clarity", "ideas"], u: "Uriel lights the mind. Clarity and a wise idea are dawning — you will see the way through.", r: "The answer is already in you. Stop overthinking and trust what you know.", a: "Write the idea down before it fades." },
    { n: "Archangel Chamuel", k: ["love", "connection", "self-worth"], u: "Chamuel helps you find what is lost — often love, and often the love of self. Connection is near.", r: "You are worthy of the love you keep giving away. Turn some of it inward.", a: "Reach toward someone — or toward your own tender heart." },
    { n: "Archangel Jophiel", k: ["beauty", "joy", "perspective"], u: "Jophiel beautifies your thoughts. Shift the story and the whole day turns lovely again.", r: "Negativity has crept in. Clear the clutter — of mind and of space.", a: "Do one thing purely because it is beautiful." },
    { n: "Archangel Zadkiel", k: ["forgiveness", "mercy", "release"], u: "Zadkiel offers the grace of forgiveness — for another, or for yourself. Set down the stone.", r: "Resentment is heavier than the wrong itself. Choose to release it.", a: "Forgive one thing today, even silently." },
    { n: "Archangel Ariel", k: ["abundance", "nature", "manifestation"], u: "Ariel, lioness of God, roars abundance toward you. Your needs are provided for; trust the flow.", r: "Scarcity is a story, not a fact. Open your hands to receive.", a: "Sit in nature and ask plainly for what you need." },
    { n: "Archangel Metatron", k: ["focus", "motivation", "ascension"], u: "Metatron orders the chaos into sacred geometry. Prioritise, and your energy rises with you.", r: "You are spread thin. Clear the noise and focus on what is sacred.", a: "Choose the one thing that matters most and start there." },
    { n: "Archangel Sandalphon", k: ["prayer", "music", "gentleness"], u: "Sandalphon carries your prayers upward, and answers return as songs, signs, and synchronicities.", r: "You have stopped asking. Voice your longing — the universe is listening.", a: "Play music, pray, or simply speak your wish aloud." },
    { n: "Archangel Haniel", k: ["intuition", "grace", "cycles"], u: "Haniel, angel of the moon, deepens your intuition. Honour your natural rhythms and inner knowing.", r: "You have been overriding your intuition. Slow down and feel again.", a: "Follow the hunch you keep dismissing." },
    { n: "Archangel Raziel", k: ["mystery", "insight", "revelation"], u: "Raziel unveils a secret of the universe. Hidden knowledge and sudden 'aha' moments are near.", r: "A truth wants to surface. Stop looking away from it.", a: "Pay attention to dreams and sudden knowings." },
    { n: "Archangel Azrael", k: ["transition", "comfort", "endings"], u: "Azrael tenderly holds you through an ending or grief. This passage is sacred, and you are not alone.", r: "Unmourned loss is asking to be felt. Let the tears come.", a: "Let something end gently, and with honour." },
    { n: "Archangel Raguel", k: ["harmony", "fairness", "relationships"], u: "Raguel restores harmony and fairness. A relationship rebalances; justice moves in your favour.", r: "Speak up in the situation that feels unjust. Balance is yours to claim.", a: "Mend or address the strained connection." },
    { n: "Archangel Jeremiel", k: ["reflection", "review", "hope"], u: "Jeremiel invites a life review. Look back with mercy — you have come further than you think.", r: "Do not judge your past self so harshly. See how much you have grown.", a: "Reflect on how far you have travelled, then adjust course." },
    { n: "Archangel Barachiel", k: ["blessings", "luck", "expansion"], u: "Barachiel scatters blessings like petals. Unexpected good fortune is on its way to you.", r: "You are bracing for the worst. Make room for the good instead.", a: "Expect a blessing, and say yes when it arrives." },
    { n: "Guardian Angel", k: ["presence", "protection", "love"], u: "Your own guardian angel draws close. You are seen, guided, and dearly loved — never truly alone.", r: "You have forgotten you are supported. Ask for a sign; you will get one.", a: "Ask your angels for help — out loud, and specifically." },
    { n: "Angel of Peace", k: ["stillness", "calm", "surrender"], u: "An angel of peace settles the storm within. Breathe. Nothing needs solving this very moment.", r: "You are bracing against something. Soften, and let peace back in.", a: "Stop, take three slow breaths, and let go." },
    { n: "Angel of Patience", k: ["divine timing", "trust", "waiting"], u: "An angel counsels patience. What you long for is coming — on heaven's clock, not yours.", r: "Forcing it is only delaying it. Trust the timing.", a: "Release the deadline you have imposed on the universe." },
    { n: "Angel of Abundance", k: ["receiving", "prosperity", "gratitude"], u: "An angel pours blessings your way. Open to receiving — you have earned this ease.", r: "You block the good by insisting you do not deserve it. You do.", a: "Say thank you for what is already here." },
    { n: "Angel of Courage", k: ["bravery", "action", "rising"], u: "An angel of courage lifts you to your feet. The fear is real, but so is your strength. Rise.", r: "Courage is not the absence of fear — act anyway.", a: "Take the brave step you have been circling." },
    { n: "Angel of Release", k: ["letting go", "freedom", "surrender"], u: "An angel gently pries your fingers open. What you clutch was never yours to carry. Let it go.", r: "Holding on is costing you your peace. Release it.", a: "Name what you are gripping, then set it down." },
    { n: "Angel of New Beginnings", k: ["fresh start", "rebirth", "hope"], u: "An angel throws a new door wide. A fresh chapter begins — walk through with an open heart.", r: "You are lingering at a closed door. The new one is already open.", a: "Begin the thing you keep postponing." },
    { n: "Angel of Faith", k: ["trust", "surrender", "the unseen"], u: "An angel of faith steadies you in the dark. You need not see the whole staircase — only the next step.", r: "Doubt has crowded out your trust. Have a little faith again.", a: "Take the next step without needing the guarantee." }
  ];

  /* ---- Power Animal (28) ---------------------------------------- */
  const ANIMALS = [
    { n: "Wolf", k: ["instinct", "teacher", "freedom"], u: "Wolf medicine: trust your instincts and your loyalty to your pack. You are a teacher walking a wild, honest path.", r: "You have drifted from your instincts or your people. Return to both.", a: "Follow your gut and protect your inner circle." },
    { n: "Bear", k: ["strength", "introspection", "boundaries"], u: "Bear calls you into the cave. Your power now is rest, reflection, and firm boundaries.", r: "You are overextended. Retreat and restore your strength.", a: "Withdraw to recharge — and say no without guilt." },
    { n: "Eagle", k: ["vision", "spirit", "higher view"], u: "Eagle lifts you above the noise. See the larger picture and reconnect with your highest purpose.", r: "You are lost in the details. Rise higher and regain perspective.", a: "Step back and take in the whole landscape." },
    { n: "Owl", k: ["wisdom", "intuition", "seeing truth"], u: "Owl sees in the dark. Deception cannot hide from you now — trust what your intuition reveals.", r: "You are ignoring what you plainly see. Face the truth.", a: "Trust the quiet knowing beneath appearances." },
    { n: "Deer", k: ["gentleness", "grace", "sensitivity"], u: "Deer moves with gentle power. Lead with softness; kindness opens doors that force never will.", r: "Harshness — toward others or yourself — is blocking you. Be gentle.", a: "Choose the gentle response today." },
    { n: "Fox", k: ["cunning", "adaptability", "camouflage"], u: "Fox teaches clever adaptation. Stay quick, observant, and a little playful — outwit, do not overpower.", r: "Overthinking the strategy? Trust your adaptability and act.", a: "Adapt swiftly, and keep some things to yourself." },
    { n: "Raven", k: ["magic", "transformation", "the void"], u: "Raven keeps the magic and the fertile dark. A shift is being conjured; welcome the mystery.", r: "You fear the change brewing. It is magic, not menace.", a: "Trust the transformation taking shape in the shadows." },
    { n: "Butterfly", k: ["transformation", "joy", "rebirth"], u: "Butterfly signals metamorphosis. You are becoming — honour each stage, even the cocoon.", r: "Do not rush the change; transformation cannot be forced.", a: "Be patient with your own becoming." },
    { n: "Snake", k: ["healing", "rebirth", "life force"], u: "Snake sheds the old skin. Powerful healing and the transmutation of energy are available to you.", r: "You are clinging to an old skin. Shed it and be renewed.", a: "Release what you have outgrown and let vitality return." },
    { n: "Turtle", k: ["grounding", "patience", "Mother Earth"], u: "Turtle carries home on its back. Slow, steady, grounded — you already have all you need.", r: "You are rushing. Slow to the pace of the earth.", a: "Take it slow and stay grounded." },
    { n: "Horse", k: ["freedom", "power", "movement"], u: "Horse gallops toward freedom. Personal power and forward movement are yours — ride them.", r: "You have caged your own freedom. Break into open country.", a: "Move toward whatever makes you feel free." },
    { n: "Hawk", k: ["awareness", "messages", "focus"], u: "Hawk sharpens your sight. A message is circling — pay attention and focus on the signal.", r: "You are missing the signs. Look up and pay attention.", a: "Notice the message life is trying to send." },
    { n: "Dolphin", k: ["joy", "breath", "harmony"], u: "Dolphin plays in the waves. Return to breath, play, and the harmony of your community.", r: "You have forgotten to breathe and play. Come up for air.", a: "Breathe deeply and let joy back in." },
    { n: "Lion", k: ["courage", "leadership", "heart"], u: "Lion embodies courageous heart. Lead with dignity; your strength is meant to protect, not dominate.", r: "You are roaring from fear, not power. Lead from the heart.", a: "Stand in your dignity and lead." },
    { n: "Spider", k: ["creation", "weaving", "fate"], u: "Spider weaves the web of creation. You are the author — be intentional about what you spin.", r: "You feel trapped in a web of your own making. Reweave it.", a: "Create deliberately; you are writing your own story." },
    { n: "Hummingbird", k: ["joy", "sweetness", "resilience"], u: "Hummingbird sips the nectar. Seek the sweetness in life; joy is a form of strength.", r: "You have stopped tasting the good. Slow down and savour.", a: "Find the sweetness in this ordinary day." },
    { n: "Elephant", k: ["memory", "strength", "family"], u: "Elephant walks in ancient strength and deep memory. Honour your roots and your gentle power.", r: "Old memory is weighing you down. Release what no longer serves.", a: "Draw on your history, but do not be ruled by it." },
    { n: "Salmon", k: ["determination", "instinct", "return"], u: "Salmon swims upstream to its source. Determination and a return to your origins are called for.", r: "You are fighting the wrong current. Check your direction.", a: "Persist toward what you know is truly yours." },
    { n: "Buffalo", k: ["abundance", "gratitude", "prayer"], u: "Buffalo brings sacred abundance through gratitude. Give thanks and the plains provide.", r: "Taking things for granted blocks the flow. Give thanks.", a: "Practise gratitude and honour what sustains you." },
    { n: "Dragonfly", k: ["illusion", "change", "light"], u: "Dragonfly dances between worlds. See through the illusion and embrace the change you have resisted.", r: "You are believing an illusion. Look again in clearer light.", a: "Question the story and let the change come." },
    { n: "Otter", k: ["play", "curiosity", "balance"], u: "Otter reminds you that life is meant to be enjoyed. Play, share, and float easy for a while.", r: "You are too serious and self-focused. Lighten up and connect.", a: "Make space for play and generosity." },
    { n: "Lynx", k: ["secrets", "mystery", "clairvoyance"], u: "Lynx, keeper of secrets, sees what is hidden. Trust your psychic sense and guard your knowledge.", r: "You are revealing too much, or ignoring what you sense. Recentre.", a: "Trust what you sense, but hold your cards close." },
    { n: "Crow", k: ["sacred law", "authenticity", "magic"], u: "Crow keeps sacred law and speaks in your true voice. Live by your own authentic code.", r: "You are out of integrity with yourself. Realign.", a: "Act in accordance with your true values." },
    { n: "Whale", k: ["ancient wisdom", "emotion", "memory"], u: "Whale sings the ancient songs. Dive deep into memory and emotion; profound wisdom surfaces.", r: "You are avoiding a deep feeling. Let it rise and be heard.", a: "Go deep — the wisdom is inside the feeling." },
    { n: "Jaguar", k: ["power", "reclaiming", "shadow"], u: "Jaguar moves through the shadow without fear. Reclaim your personal power and walk it proudly.", r: "You have given your power away. Take it back.", a: "Step into your strength without apology." },
    { n: "Rabbit", k: ["fear", "awareness", "fertility"], u: "Rabbit warns that fear attracts what you dread. Move through the world with awareness, not anxiety.", r: "Fear is running your choices. Steady yourself.", a: "Act from intention, not from fear." },
    { n: "Swan", k: ["grace", "intuition", "surrender"], u: "Swan glides into grace. Surrender to the flow and trust the beauty of your transformation.", r: "You are forcing what wants to unfold naturally. Surrender.", a: "Move with grace and trust the process." },
    { n: "Bee", k: ["community", "industry", "sweetness"], u: "Bee makes honey through devoted community. Your diligent, shared effort yields a sweet reward.", r: "You are working in isolation, or burning out. Return to the hive.", a: "Collaborate, and let your work bear sweetness." }
  ];

  /* ---- Shaman Path (24) ----------------------------------------- */
  const SHAMAN = [
    { n: "The Shaman", k: ["between worlds", "service", "power"], u: "You stand between the seen and the unseen. Your gift is to bridge worlds — step into your role as healer and guide.", r: "You are denying your own power. The calling will not stop knocking.", a: "Accept the role you are being called to." },
    { n: "The Drum", k: ["heartbeat", "rhythm", "trance"], u: "The drum is the heartbeat of the earth. Find your rhythm and let it carry you into deeper knowing.", r: "You have lost your rhythm. Return to what steadies your beat.", a: "Reconnect with a daily rhythm that grounds you." },
    { n: "The Journey", k: ["vision", "inner travel", "quest"], u: "The shamanic journey begins. Close your eyes and travel inward — the answers live in the other worlds.", r: "You are avoiding the inner journey. The way through is in, not around.", a: "Set aside time to journey inward — meditate, wander, dream." },
    { n: "The Lower World", k: ["instinct", "animal allies", "roots"], u: "Descend to the Lower World of instinct and animal allies. Reclaim primal wisdom and grounded power.", r: "You have cut off from your instincts. Root back down.", a: "Trust your body's ancient intelligence." },
    { n: "The Upper World", k: ["guidance", "teachers", "spirit"], u: "Rise to the Upper World of guides and star wisdom. Higher guidance is available — ask and listen.", r: "You are not asking for guidance. Look up.", a: "Seek counsel from something greater than yourself." },
    { n: "The Middle World", k: ["the present", "nature spirits", "presence"], u: "The Middle World is this one, seen with awakened eyes. Spirit lives in the ordinary — be present to it.", r: "You are sleepwalking through the sacred. Wake up to now.", a: "Find the magic in your immediate surroundings." },
    { n: "The Spirit Guide", k: ["allies", "protection", "help"], u: "A spirit guide walks beside you. You never journey alone — call on your allies.", r: "You are refusing the help that is offered. Accept it.", a: "Ask your guides for a sign, then trust it." },
    { n: "The Medicine Wheel", k: ["wholeness", "cycles", "balance"], u: "The Medicine Wheel turns through all directions. Seek balance among body, heart, mind, and spirit.", r: "One part of you is neglected. Restore the balance.", a: "Tend the part of life you have been ignoring." },
    { n: "Sacred Smoke", k: ["cleansing", "clearing", "prayer"], u: "Sacred smoke clears the heavy energy. Purify your space, your body, your intentions — and begin fresh.", r: "Stale energy is clinging to you. Cleanse it.", a: "Clear your space and reset your intention." },
    { n: "The Vision Quest", k: ["solitude", "purpose", "revelation"], u: "The Vision Quest calls you into sacred solitude. Strip away the noise and your true purpose reveals itself.", r: "You are too distracted to hear your purpose. Withdraw.", a: "Take solitary time to seek your true direction." },
    { n: "The Ancestors", k: ["lineage", "memory", "blessing"], u: "The ancestors gather at your back. Honour those who came before — their strength is your inheritance.", r: "An ancestral wound is asking to be healed. Tend the line.", a: "Honour your roots and heal what was handed down." },
    { n: "The Totem", k: ["identity", "medicine", "protection"], u: "Your totem reveals your medicine. Know your gift and carry it with pride and responsibility.", r: "You have forgotten your own medicine. Remember who you are.", a: "Claim your unique gift and use it." },
    { n: "Soul Retrieval", k: ["wholeness", "reclaiming", "healing"], u: "A lost piece of your soul returns home. Reclaim the vitality you left behind in old wounds.", r: "You have abandoned a part of yourself. Go back for it.", a: "Reclaim the part of you that hardship took." },
    { n: "The Sacred Fire", k: ["transformation", "passion", "purification"], u: "The sacred fire transmutes all it touches. Offer the old to the flames and let your passion reignite.", r: "Your inner fire has dimmed. Feed it.", a: "Burn away the old and rekindle your passion." },
    { n: "The North", k: ["wisdom", "elders", "winter"], u: "The North holds the wisdom of the elders and the stillness of winter. Slow down and learn.", r: "You are rushing past the lesson. Sit with it.", a: "Seek wisdom from experience — yours or an elder's." },
    { n: "The South", k: ["trust", "innocence", "summer"], u: "The South is the place of trust, play, and the inner child. Meet life with open innocence.", r: "You have grown guarded. Trust a little again.", a: "Reconnect with childlike trust and play." },
    { n: "The East", k: ["illumination", "new dawn", "spirit"], u: "The East brings the dawn and new illumination. A fresh spiritual insight rises like the sun.", r: "You are facing away from the light. Turn toward it.", a: "Welcome the new understanding dawning in you." },
    { n: "The West", k: ["introspection", "emotion", "the dream"], u: "The West is the place of going within — of water and dreams. Look inward and honour your feelings.", r: "You are avoiding your emotional depths. Go within.", a: "Attend to your dreams and inner tides." },
    { n: "Mother Earth", k: ["grounding", "nourishment", "home"], u: "Mother Earth holds you always. Return to the ground, to your body, to what truly nourishes you.", r: "You are ungrounded and depleted. Come back to earth.", a: "Put your feet on the ground and receive." },
    { n: "Father Sky", k: ["vision", "spirit", "expansion"], u: "Father Sky opens the vast above. Expand your vision and remember your place in the great order.", r: "You have grown small and closed. Look to the sky.", a: "Widen your perspective beyond the immediate." },
    { n: "The Rattle", k: ["shift", "awakening", "movement"], u: "The rattle shakes the stagnant loose. Sound and movement break the spell — it is time to shift.", r: "You are stuck in a stillness that has become stagnation. Move.", a: "Shake something up — change the pattern." },
    { n: "The Threshold", k: ["passage", "choice", "initiation"], u: "You stand at a sacred threshold. An initiation awaits — cross with courage and be changed.", r: "You are hovering at the doorway. Step through.", a: "Commit to the passage before you." },
    { n: "Death & Rebirth", k: ["endings", "renewal", "the cycle"], u: "The great cycle turns: what dies feeds what is born. Release the old form and trust the renewal.", r: "You are resisting a necessary ending. Let it die.", a: "Allow the ending so the beginning can come." },
    { n: "The Great Silence", k: ["stillness", "source", "listening"], u: "Beyond the drum and rattle lies the Great Silence — the source of all. Rest here, and simply listen.", r: "You have filled every moment with noise. Seek silence.", a: "Sit in silence and listen for what lies beneath it." }
  ];

  global.VESPER_DECKS = {
    classic: { name: "Classic Tarot", glyph: "✶", kind: "78 cards",
      blurb: "The complete 78-card Rider–Waite tradition — the full language of the tarot.", cards: CLASSIC },
    angels: { name: "Angel Tarot", glyph: "✧", kind: "24 cards",
      blurb: "Twenty-four archangels and angelic messengers offering comfort, guidance, and grace.", cards: build(ANGELS, "✧", "Angelic Message") },
    animals: { name: "Power Animal", glyph: "❖", kind: "28 cards",
      blurb: "Twenty-eight spirit animals, each carrying its own medicine and instinctive wisdom.", cards: build(ANIMALS, "❖", "Animal Medicine") },
    shaman: { name: "Shaman Path", glyph: "✵", kind: "24 cards",
      blurb: "Twenty-four keys of the shaman's path — journeys, directions, and the worlds between.", cards: build(SHAMAN, "✵", "Shaman Path") }
  };

})(typeof window !== "undefined" ? window : this);
