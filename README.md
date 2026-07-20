# Socrates AI: The Middle Way

[![GitHub](https://img.shields.io/badge/github-Long104/socrates--ai-181717?logo=github)](https://github.com/Long104/socrates-ai)

A visual thinking tool that deconstructs rigid, anxiety-inducing worldviews using the Socratic Method (CBT + Buddhist philosophy + first-principles thinking).

**OpenAI Build Week 2026**, Track: Apps for Your Life

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

1. Type a rigid belief. e.g. "Capitalism is pure evil."
2. The AI deconstructs it into Fact vs Leap components using GPT-5.6 Structured Outputs.
3. Chat drives the conversation. AI asks Socratic questions, you answer.
4. The graph updates on its own. Nodes shift from ochre (heavy) to sage (resolved).
5. The Middle Way unlocks. A balanced perspective emerges.

---

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env.local with your OpenAI API key
echo "OPENAI_API_KEY=sk-..." > apps/web/.env.local

# 3. Run development server
pnpm dev
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
| `/api/deconstruct` | POST | Belief text to node graph JSON via GPT-5.6 Structured Outputs |
| `/api/reflect` | POST | User response to validation + next action via GPT-5.6 Structured Outputs |
| `/api/synthesize` | POST | Resolved assumptions to Middle Way line via GPT-5.6 |
| `/api/test` | POST | Simple OpenAI connection test |

---

## How it was built

The engineering side ran on Codex (opencode CLI) orchestrating GPT-5.6 through the OpenAI SDK. Codex handled codegen end to end: TypeScript types, React components, API routes, prompt scaffolds, and the custom `BeliefNode` for React Flow. The `agent-browser` skill was used to inspect a visual reference prototype and reverse-engineer its layout. Generated files shipped with no manual edits.

GPT-5.6 backs every API route at runtime. `/api/deconstruct` and `/api/reflect` use Structured Outputs (JSON schema mode), so the frontend receives validated JSON with no manual parsing. The model also builds the full node graph from a raw belief string, runs Socratic dialogue with follow-up questions that adapt to user answers, and validates responses against prior context before advancing the conversation.

```
User prompt -> Codex parses intent -> writes code / edits files
            -> GPT-5.6 backs API routes at runtime
            -> Structured Outputs return typed JSON to React Flow graph
```

A few decisions worth flagging. No gamification: no scores, no streaks, no progress bars. Pure Socratic deconstruction. Structured Outputs over manual JSON parsing, because hand-rolled parsing breaks under pressure. Nodes are static (not draggable), since the graph is a progress map rather than an editor. The theme is warm-ink dark mode with ochre, sage, and ivory accents, deliberately avoiding the generic AI purple-cyan palette.

---

## Project Structure

```
socrates-ai/
├── apps/
│   └── web/                        # Next.js 16 App Router
│       └── src/
│           ├── app/
│           │   ├── api/
│           │   │   ├── deconstruct/route.ts
│           │   │   ├── reflect/route.ts
│           │   │   ├── synthesize/route.ts
│           │   │   └── test/route.ts
│           │   ├── layout.tsx
│           │   ├── page.tsx        # Main split-screen page
│           │   └── globals.css
│           └── ...
├── packages/
│   ├── core/                       # Types, prompts, OpenAI client
│   ├── ui/                         # BeliefNode, ChatPanel, GraphCanvas, Header
│   └── typescript-config/          # Shared tsconfigs
├── biome.json
├── turbo.json
└── README.md
```

---

## Out of MVP Scope

- User accounts / persistence
- Voice input / TTS
- Multiple session history
- Mobile responsive layout
- Production deployment
