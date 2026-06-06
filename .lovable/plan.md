# Unify the navigation

## Problem

Two navbars render on top of each other:

1. The **global `Navbar`** mounted once in `src/App.jsx` (already has a desktop menu and a mobile slide-in drawer with every route).
2. A **second in-page nav** (`<nav className="future-nav">…</nav>`) hardcoded inside `HomePage.jsx`, `AboutPage.jsx`, `FAQPage.jsx`, `ContactPage.jsx`, `CoachPage.jsx`, and `TrackerPage.jsx`. Each one re-implements its own brand mark + links, which is what's stacking on top of the global bar.

## Goal

One seamless navbar for every page, on desktop and mobile, with the mobile version using a drawer that lists every route.

## Changes

### 1. Remove every duplicate `future-nav`

In each of these files, delete the entire `<nav className="future-nav">…</nav>` block (and any wrapper `<header>` that exists only to hold it):

- `src/components/HomePage.jsx`
- `src/components/AboutPage.jsx`
- `src/components/FAQPage.jsx`
- `src/components/ContactPage.jsx`
- `src/components/CoachPage.jsx`
- `src/components/TrackerPage.jsx` (and `TrackerShell.jsx` if it has one)

Keep the page background layers, hero content, and animations — only the nav element goes.

### 2. Promote the global `Navbar` to the unified bar

`src/components/Navbar.jsx` already has:
- Desktop menu with Home / Track / Coach / About / FAQ / Contact + Sign In CTA
- Mobile hamburger that opens a slide-in drawer listing every route
- Auto-close on route change, scroll lock when open

Adjustments:
- Make the bar **transparent at top, blurred/solid after scroll** (listen to scroll position, toggle a `is-scrolled` class) so it sits seamlessly over the hero on every page.
- Add `Coach` and the AI Coach accent style that the home page nav had, so nothing is lost when we remove the per-page nav.
- Ensure z-index sits above hero glow/grid layers (already mostly handled — verify against the editorial hero).

### 3. Layout / spacing fix

`App.jsx` wraps routes in `<main className="app-layout">`. Add top padding equal to the navbar height (or use `pt-[72px]` equivalent) so page hero content isn't tucked under the fixed bar now that pages no longer render their own header spacer.

### 4. Mobile drawer polish

The existing drawer already lists every route. Small tweaks:
- Full-height panel from the right, frosted-glass background, links stacked with the same kinetic type styling used on the home page (large, uppercase, staggered fade-in).
- Tap a link → drawer closes (already wired via the `useEffect` on `location.pathname`).
- Keep a single hamburger / close affordance — no extra menu buttons inside individual pages.

## Out of scope

- No changes to page content, hero animations, GSAP timelines, or routing.
- No backend / data work.

## Acceptance

- Every route shows exactly **one** navbar.
- Desktop: navbar is transparent over the hero, becomes solid on scroll, links work and highlight the active route.
- Mobile: hamburger opens a drawer that lists Home, Track, Coach, About, FAQ, Contact + Sign In, closes on selection.
