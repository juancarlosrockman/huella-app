# HUELLA

**Pequeñas acciones. Grandes huellas.**

Initial Cloudflare-oriented scaffold for HUELLA. This is a starting point, not a claim that all agreed features are implemented.

## Stack
- React + Vite frontend
- Cloudflare Worker serving static assets and `/api/*`
- Draft Cloudflare D1 schema in `schema.sql`
- PWA manifest
- Spanish-first responsive UI, yellow/red primary identity

## Local development
```bash
npm install
npm run dev
npm run build
npx wrangler dev
```

## Cloudflare setup
The repository uses `wrangler.jsonc` for a Worker with static assets. The first deploy can serve the UI and `GET /api/health`. Create the D1 database in Cloudflare and add its binding before implementing data endpoints.

## Implemented in this scaffold
- Responsive initial interface
- Four navigation areas: Inicio, Testimonios, Mi camino, Perfil
- 250-character action text input (not persisted yet)
- PWA manifest
- Worker health endpoint
- Initial D1 schema draft

## Not implemented yet
- Real authentication (email/password, Google, Apple), sessions and recovery
- Secure journal CRUD and conflict-safe offline sync
- Server-backed community counter and timezone rules
- Testimony submission, moderation dashboard, reporting and withdrawal
- Catholic mode confirmation, liturgical calendar and reviewed catechesis
- Secure PIN/biometric integration
- Data export, deletion workflows, backups and production security review

## Security
Never commit API keys, OAuth secrets, session secrets, database credentials or private user data. Do not enable public sign-up until authentication and server-side authorization exist. Review the schema before applying it. Moderation and privacy controls are launch blockers.

## Product principles
Free access; no data sale or invasive ads. No public profiles, follower lists, rankings, streaks or public action counts per person. Public testimonies remain anonymous and pending until human moderation. General mode stays religiously neutral; Catholic mode is optional and one-way. Community totals must use confirmed server records, never fabricated values.
