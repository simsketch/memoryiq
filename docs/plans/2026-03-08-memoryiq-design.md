# MemoryIQ — Design Document

**Date:** 2026-03-08
**Source Spec:** MemoryIQ-Spec.docx v1.0
**Approach:** Spec as strong guide, adapt where needed (Approach B)
**Build Order:** Foundation → Backend → Auth & Layout → Dashboard → Marketing → Polish

---

## 1. Foundation & Infrastructure

**Scaffold:** `create-next-app` with TypeScript, Tailwind, ESLint, App Router, no src-dir.

**Adaptations:**
- `proxy.ts` vs `middleware.ts`: Use whichever the installed Next.js version supports. If `proxy.ts` isn't available, use `middleware.ts` with identical Clerk logic.
- `PageProps` typegen: If `npx next typegen` isn't available, define param types manually.
- Tailwind v4: Use whatever version `create-next-app@latest` ships. No functional difference.

**Database:** Drizzle schema with `memoryiq` pgSchema, all 6 tables as specified. `match_thoughts` SQL function as custom migration. pgvector extension.

**Lib files:** `db.ts` (Neon + Drizzle), `ai.ts` (OpenRouter primary / OpenAI fallback), `utils.ts` (cn helper).

**Dependencies:** Exactly as listed in spec section 3.2 + shadcn components from section 3.3.

---

## 2. Backend — API Routes & MCP

10 API routes:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/thoughts` | POST | Create thought with full AI pipeline + conflict detection |
| `/api/thoughts` | GET | List/search thoughts (semantic when `q` param present) |
| `/api/thoughts/[id]` | PATCH | Update thought, re-run AI if content changes |
| `/api/thoughts/[id]` | DELETE | Soft delete (set `is_archived=true`) |
| `/api/brains` | POST | Create brain with auto-generated `mcp_key` |
| `/api/brains` | GET | List user's brains (owner or member) |
| `/api/brains/[id]/members` | POST | Invite member by email via Clerk lookup |
| `/api/brains/[id]/stats` | GET | Aggregated brain statistics |
| `/api/mcp` | POST | MCP server with 4 tools, key-based auth |
| `/api/webhooks/clerk` | POST | Svix-verified webhook, auto-creates personal brain |

**MCP tools:** `search_thoughts`, `browse_recent`, `capture_thought`, `brain_stats`

**Adaptations:**
- MCP route may need GET/DELETE handlers for session lifecycle.
- Clerk user lookup for invites handles "user not found" gracefully.
- No rate limiting in initial build.

---

## 3. Auth & Dashboard Layout

- Clerk `<SignIn>` and `<SignUp>` components in dark-themed wrappers.
- Middleware protecting `/dashboard/*`, public routes for marketing + API + webhooks.
- Persistent sidebar: logo, brain selector, nav links (Overview, Thoughts, Capture, Brains, Curate, Settings), `<UserButton />`, dark/light toggle.
- Two responsive states: full sidebar (desktop), hamburger drawer (mobile).

---

## 4. Dashboard Pages

| Page | Key Elements |
|------|-------------|
| `/dashboard` | 4 stat cards, recent thoughts (10), quick capture widget |
| `/dashboard/thoughts` | Semantic search, filter row, thought cards with actions, pagination |
| `/dashboard/capture` | Brain selector, textarea, collapsible metadata override, success animation |
| `/dashboard/brains` | Brain card grid, create brain dialog |
| `/dashboard/brains/[id]` | Editable header, stats, members, invite form, MCP connection, danger zone |
| `/dashboard/curate` | Tabs (Conflicts/Stale/All), side-by-side conflict cards, resolve actions, empty states |
| `/dashboard/settings` | Account info, MCP keys, integrations toggles, data export placeholder |

**Adaptations:**
- Pagination instead of infinite scroll for thoughts.
- Curate merge action does simple concatenation, not AI-powered merging.

---

## 5. Marketing Pages & Polish

**Pages:** Landing (9 sections), `/pricing` (tiers + FAQ), `/privacy`, `/terms`

**Design system:** Dark-first (`#0a0118` → `#1a1035`), violet/purple accent, glass morphism cards, `AnimateOnScroll` with IntersectionObserver + CSS transitions.

**Polish:** SEO metadata, SVG favicon, README, `.gitignore`, clean `npm run build`.

**Adaptations:**
- Hero background: subtle CSS radial gradient + animated dots via keyframes.
- Integration icons: Lucide icons or text labels, no external logo assets.
