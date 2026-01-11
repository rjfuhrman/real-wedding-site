// Vercel Serverless Function
// GET /api/lookup?q=Riley
// Returns: { results: [{ party_id, display_name, members: [..] }, ...] }

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const q = (req.query?.q ? String(req.query.q) : '').trim();
    if (!q || q.length < 2) {
      return res.status(200).json({ results: [] });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return res.status(500).json({
        error: 'Missing environment variables',
        hint: 'Set SUPABASE_URL and SUPABASE_ANON_KEY in your deployment environment.',
      });
    }

    // Build the PostgREST URL using URL + searchParams so it’s safely encoded.
    // We search both display_name and primary_name.
    const url = new URL(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/guest_parties`);
    url.searchParams.set('select', 'party_id,display_name,members');

    const safe = q.replace(/\s+/g, ' ').trim();
    const pattern = `*${safe}*`;
    // or=(display_name.ilike.*riley*,primary_name.ilike.*riley*)
    url.searchParams.set('or', `(display_name.ilike.${pattern},primary_name.ilike.${pattern})`);
    url.searchParams.set('order', 'display_name.asc');
    url.searchParams.set('limit', '12');

    const resp = await fetch(url.toString(), {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: 'application/json',
      },
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return res.status(502).json({ error: 'Supabase request failed', status: resp.status, body: text });
    }

    const rows = await resp.json();
    return res.status(200).json({ results: Array.isArray(rows) ? rows : [] });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected server error', message: String(e?.message || e) });
  }
};
