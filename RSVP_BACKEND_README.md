# RSVP Backend (Starter)

This zip includes a starter RSVP form (disabled by default) and a Vercel serverless endpoint:

- Frontend form posts to: POST /api/rsvp
- Endpoint file: api/rsvp.js

## Open RSVPs later
In index.html, find the RSVP button and remove `disabled` when you're ready.

## Storage options
Right now the endpoint validates and returns the payload (no storage).

Pick one:
- Formspree (fastest, no DB): set FORMSPREE_ENDPOINT in Vercel env vars and uncomment the block in api/rsvp.js
- Supabase (recommended custom DB): create `rsvps` table; we'll wire it with supabase-js
- Vercel Storage (KV/Postgres): enable and I’ll wire it once you pick KV or Postgres

## Anti-spam (later)
We can add a honeypot field + rate limiting.
