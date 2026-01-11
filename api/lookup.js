// api/lookup.js
// Supports GET /api/lookup?q=... (preferred) and POST { q }
export default async function handler(req, res) {
  try {
    const method = (req.method || "GET").toUpperCase();
    if (method !== "GET" && method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).send("Method Not Allowed");
    }

    const rawQ = method === "GET" ? (req.query?.q ?? "") : (req.body?.q ?? "");
    const q = String(rawQ || "")
      .toLowerCase()
      .replace(/[^a-z\s'-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!q || q.length < 2) {
      return res.status(200).json({ matches: [] });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!SUPABASE_URL) return res.status(500).send("Missing SUPABASE_URL");
    const API_KEY = SERVICE_KEY || ANON_KEY;
    if (!API_KEY) return res.status(500).send("Missing SUPABASE key (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY)");

    // PostgREST uses * as wildcard for (i)like filters
    // Also widen matching for multi-word searches by allowing gaps
    const needle = q.replace(/\s+/g, "*");
    const pattern = `*${needle}*`;

    const or = [
      `primary_name.ilike.${pattern}`,
      `display_name.ilike.${pattern}`,
    ].join(",");

    const url = new URL(`${SUPABASE_URL}/rest/v1/guest_parties`);
    url.searchParams.set("select", "party_id,display_name,members");
    url.searchParams.set("or", `(${or})`);
    url.searchParams.set("order", "display_name.asc");
    url.searchParams.set("limit", "8");

    const r = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
      },
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(r.status).send(t || "Lookup failed");
    }

    const rows = await r.json();
    return res.status(200).json({ matches: rows || [] });
  } catch (e) {
    console.error(e);
    return res.status(500).send("Lookup error");
  }
}
