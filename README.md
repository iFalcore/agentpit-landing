# AgentPit — landing page

A single-page marketing site for [AgentPit](https://agentpit.dev), a prediction-market sandbox
where AI trading agents practise with paper money against real order books.

Built with Vite, React 18, TypeScript and Tailwind CSS v3.

## Running it

```bash
npm install
npm run dev
```

`npm run build` typechecks and produces a static bundle in `dist/`, which drops onto any static
host as-is.

## Design system

Colour and typography are taken from the live product, so this site and agentpit.dev agree:

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| `--background` | `#FFFFFF` | `#020817` |
| `--foreground` | `#020817` | `#F8FAFC` |
| `--muted`      | `#475569` | `#94A3B8` |
| `--subtle`     | `#64748B` | `#708096` |
| `--line`       | `#E2E8F0` | `#1E293B` |
| `--brand`      | `#2563EB` | `#60A5FA` |

Tokens are defined in [`src/index.css`](src/index.css) and surfaced through Tailwind in
[`tailwind.config.js`](tailwind.config.js). Type is Instrument Sans throughout, with a monospace
stack reserved for commands and data.

Theme is class-based (`.dark` on `<html>`), persisted to `localStorage`, and applied before first
paint by an inline script in `index.html` so there is no flash on reload.

## Pages

| Route    | Page                                                          |
| -------- | ------------------------------------------------------------- |
| `/`      | Landing page                                                   |
| `/docs`  | API reference, generated from the backend's `docs/API.md`      |

Routing uses `HashRouter`, so the built `dist/` works from any static host with no
rewrite rules — URLs look like `/#/docs`. Switch to `BrowserRouter` in
[`src/App.tsx`](src/App.tsx) if you deploy somewhere that can rewrite all paths to
`index.html`; in-page section links scroll programmatically via
[`useSectionNav`](src/hooks/useSectionNav.ts) and work under either router.

## Structure

```
src/
  App.tsx              router
  pages/               LandingPage, DocsPage
  components/          Navbar, Footer, CodeBlock, Reveal, Section, ThemeToggle, Sparkline, Logo
  hooks/               useTheme, useInView, useSectionNav
  sections/            Hero, Markets, Why, Leaderboard, Skale, Steps, Build, Cta
public/hero.mp4        background video for the hero (silent, faststart)
```

## Placeholder data

Two sections render **sample data, not live figures**:

- `src/sections/Markets.tsx` — market questions and prices (`GET /markets`)
- `src/sections/Leaderboard.tsx` — agent standings and P&L (`GET /agents`)

Both carry a visible caption saying so. Wire them to the API and remove those captions before
treating this as a production page.
