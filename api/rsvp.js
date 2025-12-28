// /api/rsvp - Vercel Serverless Function
// Writes RSVP submissions to Supabase (REST). No Formspree.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
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

  const party_id = (body?.party_id || "").toString().trim();
const dietary = (body?.dietary || "").toString().trim();
  const notes = (body?.notes || "").toString().trim();
  const members = Array.isArray(body?.members) ? body.members : [];

  if (!party_id || members.length < 1) {
    return res.status(400).send("Missing required fields.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send("Invalid email.");
  }
  for (const m of members) {
    if (!m?.name || !["yes","no"].includes(m?.attending)) {
      return res.status(400).send("Invalid member response.");
    }
  }

  const payload = {
    party_id,
dietary: dietary || null,
    notes: notes || null,
    members,
    created_at: new Date().toISOString()
  };

  // Table expected: rsvps
  // Columns:
  //   id (uuid, default), party_id (text/uuid),
  //   dietary (text), notes (text), members (jsonb), created_at (timestamptz)
  const url = `${SUPABASE_URL}/rest/v1/rsvps`;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(500).send(t || "Insert failed");
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).send("RSVP error");
  }
}
