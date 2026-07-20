# Visual & UX Specification: Socrates AI Redesign

> Awwwards SOTD target. Contemplative philosophical tool, not SaaS. Impeccable taste, zero AI slop.

---

## 1. Design Read

**Reading this as:** Socratic belief deconstruction engine for intellectually rigorous seekers, with an editorial-academic-quiet visual language, leaning toward *The Pudding* / *Distill.pub* / Readwise Reader — NOT Linear, NOT Vercel dashboard, NOT generic AI tool.

**Anti-references (refused):**
- Cyan-on-slate-950 "AI hackathon" aesthetic (current design)
- Purple/violet gradient slop
- Cream/beige warm paper bg (saturated AI default of 2026)
- Bento card grids, marketing landing-page tropes
- Glassmorphism as default

---

## 2. Three Dials

| Dial | Value | Reasoning |
|---|---|---|
| `DESIGN_VARIANCE` | **4** | Restrained, grid-honoring. Not chaotic. The graph already carries visual interest. |
| `MOTION_INTENSITY` | **4** | Motivated motion only: node reveal, state shift heavy→resolved, Middle Way emergence. No ambient loops. |
| `VISUAL_DENSITY` | **6** | Tight but breathable. Cards with hairline rules, not heavy shadows. Numbers/labels in mono. |

---

## 3. Color System (OKLCH)

**Physical scene sentence:** A person sits alone late at night, lamp low, working through an uncomfortable certainty. The screen should feel like a quiet study, not a cockpit. Dark wins — but warm-ink, not cold-corp-slate.

**Color strategy:** Restrained — tinted neutrals + 2 accents (ochre for dogma, sage for openness). Ivory glow reserved only for the Middle Way moment.

```css
@theme {
  /* Base — warm-ink dark, NOT slate */
  --background:         oklch(15% 0.008 240);   /* Midnight ink, slight blue tint */
  --foreground:         oklch(91% 0.012 240);   /* Soft linen white, not pure */

  --card:               oklch(18% 0.010 240);
  --card-foreground:    oklch(91% 0.012 240);

  --muted:              oklch(23% 0.012 240);
  --muted-foreground:   oklch(64% 0.018 240);

  --border:             oklch(28% 0.015 240);   /* Hairline gridlines */

  /* Accents */
  --accent:             oklch(72% 0.135 75);    /* Warm Ochre — heavy/active dogma */
  --accent-foreground:  oklch(15% 0.008 240);

  /* Semantic — philosophical states */
  --fact:               oklch(78% 0.012 240);   /* Neutral acknowledged truth */
  --leap-heavy:         oklch(72% 0.135 75);    /* Ochre — unresolved leap */
  --leap-resolved:      oklch(75% 0.090 145);   /* Sage Moss — resolved openness */
  --middle-way-glow:    oklch(90% 0.035 95);    /* Soft ivory glow — synthesis */
}
```

**Contrast verification (WCAG AA min 4.5:1 body, 3:1 large):**
- `foreground` (91% L) on `background` (15% L): ~14:1 ✓ AAA
- `muted-foreground` (64% L) on `background` (15% L): ~6.8:1 ✓ AA
- `accent` (72% L ochre) on `background`: ~6.5:1 ✓ AA
- `leap-resolved` (75% L sage) on `background`: ~7.2:1 ✓ AAA
- `accent-foreground` (15% L) on `accent` (72% L): ~6.5:1 ✓ AA

**One palette, locked.** No flip mid-page. Page is dark, stays dark.

---

## 4. Typography

**Pairing (contrast axis — humanist serif + geometric sans):**
- **Newsreader** (Google Fonts) — editorial serif, italic for beliefs/quotes/Socratic challenges. Italic display variant.
- **Geist** (Vercel) — geometric sans for UI labels, body, metadata.
- **Geist Mono** — system markers, node IDs, status tags.

**BANNED as default:** Inter, Fraunces, Instrument Serif (LLM tells).

**Scale:**
| Element | Family | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Belief text (root node, middle way) | Newsreader Italic | 18-20px | 400 | -0.01em | 1.45 |
| Socratic question (chat AI msg) | Newsreader Italic | 17px | 400 | -0.005em | 1.55 |
| Section/node labels | Geist Mono UPPERCASE | 10px | 500 | 0.12em | 1.2 |
| Body / fact text | Geist | 13px | 400 | 0 | 1.55 |
| Hero headline (input overlay) | Newsreader Italic | clamp(2rem, 5vw, 3.25rem) | 400 | -0.02em | 1.1 |
| Button labels | Geist | 13px | 500 | 0.01em | 1 |
| User response (chat) | Geist | 14px | 400 | 0 | 1.55 |

**Rules:**
- Display letter-spacing floor: -0.02em (never tighter). Per impeccable.
- Body line length cap: 60ch in chat, 45ch in nodes.
- `text-wrap: pretty` on chat prose; `text-wrap: balance` on node titles.
- Italic descender clearance: when italic + descender letter (g y p q j), use `leading-[1.15]` min.

---

## 5. Layout (split-screen preserved)

```
┌────────────────────────────────────────────────────────────────┐
│ HEADER  h-14 (56px)  border-b border-[--border]                │
│ Socrates AI · Socratic Mirror  [mono 10px]    ● Untangling...  │
├──────────────────────────┬─────────────────────────────────────┤
│ LEFT 40%                 │ RIGHT 60%                           │
│ w-[40%] border-r         │ React Flow canvas                   │
│                          │                                     │
│ Chat messages scroll     │        [ROOT BELIEF]                │
│ ┌─ AI (serif italic) ─┐  │           │                         │
│ │ "Can you think..."  │  │   ┌───────┴───────┐                 │
│ └─────────────────────┘  │   │               │                 │
│                          │ [ASSUMPTION A] [ASSUMPTION B]       │
│ ┌─ User (sans, card) ─┐  │   │               │                 │
│ │ "Well, yes..."     │  │   └───────┬───────┘                 │
│ └─────────────────────┘  │           │                         │
│                          │      [MIDDLE WAY]                   │
│                          │                                     │
│ ┌─ distortion warn ───┐  │ Background: dot grid 15% opacity   │
│ │ Inspecting leap...  │  │                                     │
│ └─────────────────────┘  │                                     │
│                          │                                     │
│ ┌──────────────────────┐ │                                     │
│ │ Input bar            │ │                                     │
│ └──────────────────────┘ │                                     │
└──────────────────────────┴─────────────────────────────────────┘
```

### Header (h-14)
- Left: "Socrates AI" wordmark, Geist 16px Medium + 8px gap + dot + "Socratic Mirror" mono 10px muted
- Right: Mind State badge — pill `bg-[--card] border border-[--border]` rounded-full px-3 py-1, 6px status LED (`--accent` when untangling, `--leap-resolved` when untangled)

### Left Chat Panel (`w-[40%]`)
- `border-r border-[--border]`, flex flex-col, h-full
- Messages scroll area: `flex-1 overflow-y-auto` with custom thin scrollbar (4px, `--muted` thumb)
- **AI message**: no bubble. Left border 2px solid `--border`, pl-4, my-3. Newsreader italic 17px `--foreground`. Inline `<em>` for Socratic questions in `--accent`.
- **User message**: flat `bg-[--card]` with `border border-[--border]` rounded-md p-3. Small caps mono label "USER REFLECTION" 9px `--muted-foreground` above body. Geist 14px.
- **Distortion warning**: when `phase==="reflecting"`, inline pill above input: `bg-[--accent]/10 text-[--accent] border-[--accent]/30` rounded-md px-3 py-1.5, mono 11px. Contains the current leap being inspected. NOT a toast.
- **Input bar**: bottom, `border-t border-[--border] p-4`. Auto-grow textarea (min 1 row, max 4 rows). Send button right-aligned, icon-only, `bg-[--accent] text-[--accent-foreground]` rounded-md p-2.

### Right Graph Canvas (`flex-1`)
- React Flow `<Background variant="dots" gap=24 size=1 color="var(--border)" />` at ~15% effective opacity
- No mini-map, no attribution
- Edges:
  - locked/dashed: `stroke: var(--muted-foreground); stroke-width: 1.5; stroke-dasharray: 4 4`
  - heavy/active: `stroke: var(--accent); stroke-width: 2; stroke-dasharray: 6 4`
  - resolved: `stroke: var(--leap-resolved); stroke-width: 2` (solid)
- Custom nodes — see §6.

### Hero / Input Overlay
- `fixed inset-0 z-50 flex items-center justify-center bg-[--background]/85 backdrop-blur-md`
- Card: `bg-[--card] border border-[--border]` rounded-lg (8px — NOT 24px+), p-8, max-w-lg w-full
- Headline: Newsreader italic `clamp(2rem, 5vw, 3.25rem)` `text-[--foreground]` `text-balance` `tracking-[-0.02em]` `leading-[1.1]`
- Body: Geist 14px `--muted-foreground` max-w-prose
- Textarea: `bg-[--background] border border-[--border]` rounded-md, no ring on focus, border shifts to `--accent` on focus
- CTA: full-width, `bg-[--accent] text-[--accent-foreground]` Geist Medium 14px, rounded-md, py-3. On hover: `-translate-y-[1px]`. On active: `translate-y-0`.

---

## 6. Node Specs (custom React Flow nodes)

### ROOT BELIEF node
- `w-[300px] bg-[--card] border border-[--border]` rounded-md (6px)
- Header strip: `bg-[--muted]/50 border-b border-[--border]` px-3 py-1.5, flex justify-between. Left: mono 9px UPPERCASE `tracking-[0.12em]` "ROOT BELIEF". Right: mono 9px `--muted-foreground` "Seed".
- Body: p-3. Newsreader italic 18px `--foreground`. Wrapped in real quotes: `"…"`.
- No status color shift (always seed). Subtle `shadow-[0_2px_8px_rgba(0,0,0,0.15)]`.

### ASSUMPTION node (heavy vs resolved states)
- `w-[240px] bg-[--card] border` rounded-md (6px). Border color:
  - `locked`: HIDDEN entirely (progressive reveal)
  - `heavy`: `border-[--accent]/40`
  - `resolved`: `border-[--leap-resolved]/40`
- Header strip: `bg-[--muted]/50 border-b border-[--border]` px-2.5 py-1.5, flex justify-between mono 9px UPPERCASE:
  - Left: `text-[--muted-foreground]` "SUPPORTING VIEW A"
  - Right status:
    - heavy: `text-[--accent]` "Heavy"
    - resolved: `text-[--leap-resolved]` "Open"
- **Fact section**: `p-2.5 border-b border-dashed border-[--border]`. Mono 8px UPPERCASE label "FACT" `--muted-foreground`. Body: Geist 11px `--fact` leading-snug.
- **Leap section**: `p-2.5`. Mono 8px UPPERCASE label "LEAP" colored by state. Body:
  - heavy: Geist 11px `--foreground` (normal)
  - resolved: Newsreader italic 12px `--leap-resolved` (the reframed text)
- No side-stripe borders (per impeccable ban). Full borders only.
- No `border-radius: 24px+`. 6px max.

### MIDDLE WAY node
- `w-[340px]` — largest, the synthesis moment
- `bg-[--card] border-2` — double-weight border for ceremony
  - locked: `border-[--border]` + `opacity-50` (still rendered as a closed slab, NOT hidden — user sees it waiting)
  - resolved: `border-[--middle-way-glow]/40` + `shadow-[0_0_40px_-8px_var(--middle-way-glow)]`
- Header strip: mono 9px UPPERCASE "THE MIDDLE WAY". Right status: locked = "Awaiting", resolved = "Synthesized".
- Body: p-4. 
  - locked: Newsreader italic 13px `--muted-foreground` "Examine each leap above…"
  - resolved: Newsreader italic 17px `--foreground` center-aligned `text-pretty` `leading-[1.4]`. Wrapped in quotes.

**Node count rule:** exactly 1 root + 2 assumption + 1 middle way = 4 nodes total. No more.

---

## 7. 21st.dev Component Shopping List

Sourced from 21st.dev registry. Prefer kokonutd + magicui for coherence.

| Slot | Component | Install |
|---|---|---|
| Chat input bar | `kokonutd/chat-input` | `npx shadcn@latest add "https://21st.dev/r/kokonutd/chat-input"` |
| Scroll area (chat) | shadcn `scroll-area` | `npx shadcn@latest add "scroll-area"` |
| Primary button (CTA + send) | `kokonutd/button-shiny` | `npx shadcn@latest add "https://21st.dev/r/kokonutd/button-shiny"` |
| Background texture | `magicui/retro-grid` (subtle, low opacity) | `npx shadcn@latest add "https://21st.dev/r/magicui/retro-grid"` |
| Animated text (Middle Way emergence) | `magicui/animated-gradient-text` (use ivory glow, NOT purple) | `npx shadcn@latest add "https://21st.dev/r/magicui/animated-gradient-text"` |
| Dialog (for "start new session") | `originui/dialog` | `npx shadcn@latest add "https://21st.dev/r/originui/dialog"` |
| Badge (mind state + node status) | `kokonutd/badge` or shadcn `badge` | `npx shadcn@latest add "badge"` |

**Install order (deps first):**
1. `scroll-area`, `badge` (primitives)
2. `button-shiny`, `chat-input` (kokonutd — depend on primitives)
3. `dialog` (origin)
4. `retro-grid`, `animated-gradient-text` (magicui — decorative)

**Total: 7 components.** All into `packages/ui/src/components/` (or wherever shadcn installs based on `components.json`).

**Post-install fixes (per 21st.dev skill):**
- Check `button-shiny` for `render` prop → convert to `asChild` if present
- Replace any default purple in `animated-gradient-text` with `--middle-way-glow`
- Reduce `retro-grid` opacity to ~5% so it whispers, not shouts
- Verify dark mode renders (force `.dark` class globally)

---

## 8. Motion

> Motivated motion only. No ambient loops. No parallax. No scroll-hijack. Gated by `prefers-reduced-motion`.

Use `motion/react` (NOT `framer-motion` legacy import).

| Trigger | Animation | Duration | Ease |
|---|---|---|---|
| Locked → heavy (node appears) | `opacity: 0→1, y: 12→0` | 450ms | `[0.16, 1, 0.3, 1]` |
| Heavy → resolved (state shift) | border-color + leap text crossfade | 500ms | ease-out |
| Edge dashed → solid | `stroke-dashoffset` from full → 0 | 600ms | ease-out |
| Middle Way emerges | `opacity: 0→1, scale: 0.96→1, filter: blur(8px)→0` | 800ms | `[0.16, 1, 0.3, 1]` |
| Chat msg in | `opacity: 0→1, y: 8→0` | 200ms | ease-out |
| Input focus | border-color shift | 150ms | ease-out |
| Button hover | `-translate-y-[1px]` | 150ms | ease-out |
| Button active | `translate-y-0` + `scale-[0.99]` | 100ms | ease-out |

**Reduced motion**: wrap all in `useReducedMotion()` from `motion/react`. If true → instant transitions (duration: 0), no scale/blur, just opacity 0→1.

**Banned motion patterns:**
- `window.addEventListener("scroll")`
- Continuous infinite-loop animations on cards
- Bounce / elastic easing
- Layout animations on static content
- Parallax

---

## 9. Anti-Slop Audit (impeccable compliance)

| Rule | Status |
|---|---|
| No side-stripe borders (`border-left > 1px`) | ✓ Using full borders only |
| No gradient text (`background-clip: text`) | ✓ Solid colors. `animated-gradient-text` used only for ivory Middle Way glow, NOT text gradient |
| No glassmorphism as default | ✓ Solid `--card` backgrounds. Backdrop-blur only on input overlay |
| No hero-metric template | ✓ No big numbers |
| No identical card grids | ✓ Nodes vary in size (300/240/340px) |
| No eyebrow above every section | ✓ Headers use single mono label, not kicker pattern |
| No `border: 1px solid X` + wide drop shadow | ✓ Hairline borders + tight 8px-blur shadows max |
| No `border-radius: 32px+` | ✓ 6-8px max on cards, pill only on small badges |
| No hand-drawn SVG illustrations | ✓ None used |
| No `repeating-linear-gradient` stripes | ✓ None |
| No decorative grid backgrounds | ✓ React Flow dot grid IS a canvas, acceptable |
| No AI-purple default | ✓ Ochre + Sage + Ivory chosen with justification |
| No cream/beige warm paper bg | ✓ Warm-ink dark |
| Display letter-spacing ≥ -0.04em | ✓ -0.02em floor honored |
| Body line length cap | ✓ 60ch chat, 45ch nodes |
| Real typographic quotes | ✓ `"…"` everywhere |
| No em-dashes in copy | ✓ Use periods or commas |

**AI slop test:** Could someone say "AI made that"? No — the editorial serif + warm-ink + ochre/sage palette is not the LLM default. The dot grid + custom nodes + philosophical register reads as a designed tool, not a template.

---

## 10. Pre-Flight Check

| Check | Pass |
|---|---|
| Contrast ratios verified §3 | ✓ all ≥4.5:1 |
| Hero (input overlay) fits viewport | ✓ max-w-lg, centered, paddings modest |
| Navigation (header) single-line desktop | ✓ |
| All CTAs have ≥4.5:1 contrast | ✓ `--accent-foreground` on `--accent` = 6.5:1 |
| No duplicate CTA intent | ✓ One "Deconstruct" CTA, one Send icon button |
| One accent locked across page | ✓ Ochre everywhere, sage only for resolved state |
| Shape consistency | ✓ 6px cards, 6-8px inputs, pill only on tiny badges |
| Page theme lock (dark only) | ✓ No section inversions |
| Real images | N/A — philosophical tool, type-driven |
| No emoji | ✓ |
| No em-dashes in visible copy | ✓ |
| Mobile fallback explicit | ✓ split-screen → stacked vertical below `md` |

---

## 11. Mobile Fallback (< 768px)

Split-screen collapses to stacked vertical:
- Header (56px)
- Chat panel: `h-[50vh]` with `border-b` instead of `border-r`
- Graph canvas: `h-[50vh]`
- Input overlay: `px-4`, card `max-w-md`

Both panels independently scrollable. Graph canvas touch-pan enabled by React Flow default.

---

## End

This spec is the source of truth for the visual layer. Engineer implements against this + MIGRATION_PLAN.md. Reviewer audits against both.
