// /api/lookup - Vercel Serverless Function
// Private guest lookup backed by Supabase (REST).
export default async function handler(req, res) {
  // Allow GET (browser-friendly) and POST (JS-friendly)
  const method = (req.method || "").toUpperCase();
  if (method !== "GET" && method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).send("Method Not Allowed");
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).send("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const q = (
    (req.query && (req.query.q || req.query.name)) ||
    (body && (body.q || body.name)) ||
    ""
  ).toString().trim();
  if (!q || q.length < 2) return res.status(200).json({ results: [] });

  // Basic, privacy-preserving name search:
  // - matches primary_name only (you can add aliases later)
  // - returns minimal fields needed for RSVP
  //
  // Table expected: guest_parties
  // Columns:
  //   party_id (text/uuid), display_name (text), primary_name (text), members (jsonb array of strings)
  const encoded = encodeURIComponent(`*${q}*`);
  const url = `${SUPABASE_URL}/rest/v1/guest_parties?select=party_id,display_name,members&primary_name=ilike.${encoded}&limit=8`;

  try {
    const r = await fetch(url, {
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Accept": "application/json"
      }
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(500).send(t || "Lookup failed");
    }

    const rows = await r.json();

    // Normalize output
    const results = (rows || []).map((row) => ({
      party_id: row.party_id,
      display_name: row.display_name,
      members: Array.isArray(row.members) ? row.members : []
    }));

    return res.status(200).json({ results });
  } catch (e) {
    console.error(e);
    return res.status(500).send("Lookup error");
  }
}
