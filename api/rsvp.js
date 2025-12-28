// Vercel Serverless Function: /api/rsvp
// Starter endpoint. Validates input and then forwards to a storage provider.
// Pick one storage option in the TODO section below.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const name = (body?.name || "").toString().trim();
  const email = (body?.email || "").toString().trim();
  const attending = (body?.attending || "").toString().trim(); // yes|no
  const guests = Number(body?.guests ?? 1);
  const dietary = (body?.dietary || "").toString().trim();
  const notes = (body?.notes || "").toString().trim();

  if (!name || !email || !attending) return res.status(400).send("Missing required fields.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).send("Invalid email.");
  if (!["yes","no"].includes(attending)) return res.status(400).send("Invalid attending value.");
  if (!Number.isFinite(guests) || guests < 1 || guests > 6) return res.status(400).send("Invalid guests value.");

  const payload = { name, email, attending, guests, dietary, notes, created_at: new Date().toISOString() };

  // TODO: Choose ONE option.
  //
  // Option A (fastest): forward to Formspree
  //   - Set FORMSPREE_ENDPOINT in Vercel env vars
  // const endpoint = process.env.FORMSPREE_ENDPOINT;
  // if (!endpoint) return res.status(500).send("Missing FORMSPREE_ENDPOINT");
  // const r = await fetch(endpoint, { method:"POST", headers:{ "Content-Type":"application/json", "Accept":"application/json" }, body: JSON.stringify(payload) });
  // if (!r.ok) return res.status(500).send("Form provider error");
  // return res.status(200).json({ ok:true });
  //
  // Option B (recommended custom): Supabase
  //   - Create table `rsvps`
  //   - Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel env vars
  //   - Convert site to a Vercel project with dependencies (@supabase/supabase-js)
  //
  // Option C: Vercel Storage (KV/Postgres)
  //   - Enable in Vercel and wire env vars; I can implement once you pick KV or Postgres.

  // For now: return validated payload so you can test end-to-end without storage.
  return res.status(200).json({ ok:true, stored:false, payload });
}
