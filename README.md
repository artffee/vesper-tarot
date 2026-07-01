# VESPER — A Modern Tarot House

An editorial-celestial tarot experience: live card readings, an AI oracle with a
personality, daily horoscopes, a sensor-based Frequency Reader, and multiple
themed decks. Pure static site — **no build step, no dependencies.**

Live demo: _add your Vercel URL here_

## Features

- **Live card draws** — real 78-card deck with 3D flip animations, single / 3-card / Star spreads, and woven interpretations.
- **Four decks** — Classic Tarot (78), Angel Tarot (24), Power Animal (28), and Shaman Path (24), each hand-written.
- **Vesper, the AI Oracle** — a chat agent with a distinct personality that does readings, answers love / career / yes-no questions, and handles customer support (pricing, refunds, account help).
- **The Frequency Reader** — measures your "frequency" from a fingertip pulse (camera photoplethysmography) and your voice (Web Audio), with a Solfeggio tone and an interactive constellation.
- **Daily horoscopes**, membership tiers, testimonials, and a fully responsive mobile layout with a hamburger menu.

## Project structure

```
index.html            Home (hero, services, draw, oracle, horoscopes, membership)
frequency.html        The Frequency Reader
assets/
  css/styles.css      All styling (editorial-celestial theme)
  js/
    tarot-data.js     The 78-card classic deck
    decks.js          Angel / Power Animal / Shaman Path decks
    oracle.js         Vesper's personality + reasoning engine
    app.js            Site interactions, draw widget, chat, decks
    frequency.js      The Frequency Reader engine
vercel.json           Static hosting config (asset caching)
```

## Run locally

Any static server works. The camera/microphone in the Frequency Reader require a
secure context (`localhost` or HTTPS):

```bash
npx serve .
# or
python -m http.server 8000
```

Then open http://localhost:8000

## Deploy

Zero-config static deploy on Vercel — `index.html` is served at the root.

## Note

For entertainment and reflection. Not medical, legal, or financial advice.
