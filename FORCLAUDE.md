# FORCLAUDE.md

> Notes and instructions for Claude about the AgentBase Dashboard — an internal team management dashboard for a company building OpenCLAW AI agents.

## Authentication

- **Stack:** NextAuth v4 (Credentials provider, JWT sessions) + bcrypt. Login page is the app root `/`. Login field is labeled "Username" — it maps to the NextAuth `email` field but does NOT have to be a real email (it's just a string compare, lowercased).
- **Users live in the `AUTH_USERS` env var** (JSON array), never in source code. Each entry: `{ "email", "name", "passwordHash" }`. Passwords are stored only as bcrypt hashes.
- **Add a user:** run `npm run add-user`, then append the printed entry to `AUTH_USERS` (locally in `.env.local`, and on Vercel) and redeploy.
- **Access control is deny-by-default** (`src/middleware.ts`): every page requires a session except `/` and static assets. Don't go back to an allowlist of protected routes — that's what let `/manual` and `/manual-mini` get accessed without login before.

### ⚠️ The `$` escaping trap (important)
bcrypt hashes contain `$` (e.g. `$2b$12$...`). dotenv **expands** `$` sequences, which corrupts the hash.

- **In `.env.local`:** escape every `$` as `\$` and single-quote the value, e.g.
  `AUTH_USERS='[{"...":"\$2b\$12\$..."}]'`
- **On Vercel:** env vars are set directly (no dotenv), so paste the **RAW** hash with real `$`, NOT the escaped version.

### Production env (Vercel) checklist
- `AUTH_USERS` — raw JSON, unescaped `$`.
- `NEXTAUTH_SECRET` — same secret as local.
- `NEXTAUTH_URL` — the real deployed domain (not localhost).

### First user
- Username `shaak` (this is Isaac / the owner).
