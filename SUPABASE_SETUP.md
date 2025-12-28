# Supabase-only RSVP (Private Lookup + Submissions)

This project uses:
- Static site (index.html + CSS)
- Vercel serverless endpoints:
  - POST /api/lookup  -> searches invited guests
  - POST /api/rsvp    -> stores RSVP submission

## 1) Create Supabase tables

Run this in Supabase SQL Editor.

### guest_parties (invite list)
```sql
create table if not exists public.guest_parties (
  party_id text primary key,
  primary_name text not null,
  display_name text not null,
  members jsonb not null default '[]'::jsonb
);

-- Helpful index for name searches
create index if not exists guest_parties_primary_name_idx
  on public.guest_parties using btree (primary_name);
```

### rsvps (submissions)
```sql
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  party_id text not null references public.guest_parties(party_id),
  email text not null,
  phone text,
  dietary text,
  notes text,
  members jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists rsvps_party_id_idx on public.rsvps(party_id);
```

## 2) Add a few guest parties

Example:
```sql
insert into public.guest_parties (party_id, primary_name, display_name, members)
values
  ('P0001', 'christine riley', 'Christine & Riley', '["Christine Lastname","Riley Fuhrman"]'::jsonb),
  ('P0002', 'max jackson', 'Max Jackson', '["Max Jackson"]'::jsonb);
```

Important:
- `primary_name` is what lookup searches. Use lowercase, and include first + last.
- `display_name` is what the guest sees in search results.

## 3) Vercel Environment Variables

In your Vercel project settings:
- SUPABASE_URL = your project URL (e.g. https://xxxx.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY = service role key (keep secret)

## 4) Deploy

Deploy as usual. The RSVP flow will:
- Search names privately via /api/lookup
- Submit RSVP to /api/rsvp, storing to Supabase table `rsvps`

## Notes / Next Enhancements
- Add alias searching (maiden names, nicknames)
- Add a "code" field to confirm identity (optional)
- Add honeypot + rate limiting for spam resistance
