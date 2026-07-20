# Socrates AI — The Middle Way

A visual thinking tool that deconstructs rigid, anxiety-inducing worldviews using the Socratic Method (CBT + Buddhist philosophy + first-principles thinking).

**OpenAI Build Week 2026** — Track: Apps for Your Life

---

## How It Works

```
┌─────────────────────┬──────────────────────────┐
│   LEFT (40%)        │   RIGHT (60%)            │
│                     │                          │
│  Chat dialogue      │  Node graph (React Flow) │
│  - AI asks Q        │                          │
│  - User types A     │  Root → 3 Assumptions    │
│  - Auto-advances    │       → Middle Way       │
└─────────────────────┴──────────────────────────┘
```

1. **Type a rigid belief** — e.g. "Capitalism is pure evil."
2. **AI deconstructs it** into Fact vs Leap components (GPT-5.6 Structured Outputs)
3. **Chat drives the conversation** — AI asks Socratic questions, you answer
4. **Graph updates automatically** — nodes turn from amber (heavy) → teal (resolved)
5. **The Middle Way unlocks** — a balanced perspective emerges

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your OpenAI API key
echo "OPENAI_API_KEY=sk-..." > .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Graph | @xyflow/react (React Flow) |
| AI | OpenAI SDK (GPT-5.6 + Structured Outputs) |
| Language | TypeScript (strict) |

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/deconstruct` | POST | Belief text → node graph JSON via GPT-5.6 Structured Outputs |
| `/api/reflect` | POST | User response → validation + next action via GPT-5.6 Structured Outputs |
| `/api/test` | POST | Simple OpenAI connection test |

---

## Codex Collaboration

This project was built using Codex (opencode CLI) with the following approach:

- **`agent-browser`** skill used to inspect visual reference prototype HTML
- All TypeScript types (`lib/types.ts`) defined upfront for type safety
- System prompts in `lib/prompts.ts` follow Socratic mirror philosophy (never argue, only ask)
- React Flow custom node (`BeliefNode.tsx`) renders Fact vs Leap split card with status-based color transitions
- Chat auto-advances through assumptions without gamification — just clean dialogue

**Key decisions:**
- No game mechanics or scores — pure Socratic deconstruction
- Structured Outputs (JSON schema) for reliable AI parsing, not manual JSON
- Nodes are static (not draggable) — the graph is a visual progress map, not an editor
- Dark theme (slate-950) with cyan/amber/teal accents matching the prototype design

---

## Project Structure

```
socrates-ai/
├── app/
│   ├── api/
│   │   ├── deconstruct/route.ts   # POST: belief → node graph
│   │   └── reflect/route.ts       # POST: answer → validation
│   │   └── test/route.ts          # POST: API connectivity check
│   ├── layout.tsx
│   ├── page.tsx                   # Main split-screen page
│   └── globals.css
├── components/
│   ├── BeliefNode.tsx             # Custom React Flow node
│   ├── ChatPanel.tsx              # Left side dialogue
│   ├── GraphCanvas.tsx            # Right side React Flow
│   └── Header.tsx                 # Top bar + mind state
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   ├── prompts.ts                 # System prompts
│   └── openai.ts                  # OpenAI client config
├── .env.local                     # API key (user fills in)
└── README.md
```

---

## Out of MVP Scope

- User accounts / persistence
- Voice input / TTS
- Multiple session history
- Mobile responsive layout
- Production deployment
