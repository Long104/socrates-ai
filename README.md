# Socrates AI — The Middle Way

[![GitHub](https://img.shields.io/badge/github-Long104/socrates--ai-181717?logo=github)](https://github.com/Long104/socrates-ai)

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

## Codex + GPT-5.6 Collaboration

This project was built with **Codex (opencode CLI)** orchestrating **GPT-5.6** through the OpenAI SDK. Here's how they worked together:

### Codex (Engineering Agent)
- **`agent-browser`** skill — inspected visual reference prototype HTML to reverse-engineer the layout
- **`engineer`** subagent — wrote all TypeScript, React components, API routes, and prompt scaffolds in a single session
- **Structured file generation** — produced `lib/types.ts`, `lib/prompts.ts`, `lib/openai.ts`, and all routes with zero manual edits
- **Graph construction** — built custom `BeliefNode.tsx` for React Flow with Fact/Leap split-card and status color transitions
- **Prompt engineering** — crafted Socratic Mirror system prompts in `lib/prompts.ts` that force the AI to never argue, only ask

### GPT-5.6 (Reasoning Engine)
- **Structured Outputs** — `/api/deconstruct` and `/api/reflect` return validated JSON via GPT-5.6's built-in JSON schema mode (no manual parsing)
- **Socratic dialogue** — generates follow-up questions that adapt to user answers, maintaining the Socratic Mirror constraint
- **Graph generation** — takes a raw belief string and outputs a complete node graph with root, 3+ assumptions, balanced perspectives, and The Middle Way
- **Validation** — checks user responses against prior context before advancing the conversation

### Workflow
```
User prompt → Codex parses intent → writes code / edits files
           → GPT-5.6 backs API routes at runtime
           → Structured Outputs return typed JSON to React Flow graph
```

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
