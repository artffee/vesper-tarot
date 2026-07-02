/* =====================================================================
   VESPER — Natal chart proxy (Vercel serverless function)
   Keeps the astrology API key server-side so it never ships to the browser.

   Setup:
     1. Get a free API key from an astrology provider. Default target is
        FreeAstrologyAPI (https://freeastrologyapi.com) — sign up, copy the key.
     2. In Vercel → Project → Settings → Environment Variables, add:
          ASTROLOGY_API_KEY   = <your key>
        (optional) ASTROLOGY_API_URL = <endpoint>  to use a different provider.
     3. Redeploy. Until the key is set this returns 501 and the front-end
        gracefully falls back to a Sun-sign reading.

   Request  (POST JSON): { year, month, date, hours, minutes, latitude, longitude, tzOffset }
   Response (200 JSON):  { ok:true, normalized:[{name,sign,degree,house}], raw:<upstream> }
   ===================================================================== */

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed", message: "Use POST." });
    return;
  }

  const key = process.env.ASTROLOGY_API_KEY;
  if (!key) {
    res.status(501).json({
      error: "not_configured",
      message: "Astrology API key not set. Add ASTROLOGY_API_KEY in Vercel env vars to enable full charts."
    });
    return;
  }

  try {
    // Vercel parses JSON bodies automatically; fall back to manual parse just in case.
    var b = req.body;
    if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
    b = b || {};

    var url = process.env.ASTROLOGY_API_URL || "https://json.freeastrologyapi.com/western/planets";
    var payload = {
      year: Number(b.year),
      month: Number(b.month),
      date: Number(b.date),
      hours: b.hours == null ? 12 : Number(b.hours),
      minutes: b.minutes == null ? 0 : Number(b.minutes),
      seconds: 0,
      latitude: Number(b.latitude),
      longitude: Number(b.longitude),
      timezone: b.tzOffset == null ? 0 : Number(b.tzOffset),
      config: { observation_point: "topocentric", ayanamsha: "tropical", language: "en" }
    };

    var upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key },
      body: JSON.stringify(payload)
    });

    var data = await upstream.json().catch(function () { return null; });
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: "upstream_error", status: upstream.status, detail: data });
      return;
    }

    res.status(200).json({ ok: true, normalized: normalize(data), raw: data });
  } catch (e) {
    res.status(500).json({ error: "exception", message: String(e && e.message ? e.message : e) });
  }
};

var SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
             "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

// Best-effort normaliser: astrology providers vary, so we scan common shapes
// and return a tidy [{name, sign, degree, house}]. Returns [] if unrecognised
// (the front-end then falls back to the locally computed Sun sign).
function normalize(data) {
  if (!data) return [];
  var out = [];
  var list = null;

  if (Array.isArray(data)) list = data;
  else if (Array.isArray(data.output)) list = data.output;
  else if (data.output && typeof data.output === "object") list = Object.values(data.output);
  else if (Array.isArray(data.planets)) list = data.planets;

  if (!list) return [];

  list.forEach(function (p) {
    if (!p || typeof p !== "object") return;
    var name = p.name || p.planet || p.body || "";
    var sign = p.sign || p.zodiac_sign || p.zodiac || "";
    // some APIs give a numeric sign index (0-11) or full longitude in degrees
    if (!sign && typeof p.sign_id === "number") sign = SIGNS[p.sign_id % 12];
    if (!sign && typeof p.fullDegree === "number") sign = SIGNS[Math.floor(p.fullDegree / 30) % 12];
    if (!sign && typeof p.longitude === "number") sign = SIGNS[Math.floor(p.longitude / 30) % 12];
    var degree = p.normDegree != null ? p.normDegree : (p.degree != null ? p.degree : null);
    var house = p.house != null ? p.house : (p.house_number != null ? p.house_number : null);
    if (name && sign) out.push({ name: String(name), sign: String(sign), degree: degree, house: house });
  });

  return out;
}
