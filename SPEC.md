# Socrates AI — MVP Spec

> OpenAI Build Week Submission | Track: Apps for Your Life | Deadline: July 21, 2026

---

## What Is It

A visual thinking tool that deconstructs rigid, anxiety-inducing worldviews using the Socratic Method (CBT + Buddhist philosophy + Naval's first-principles thinking).

**Not a debate chatbot.** A Socratic mirror that helps users untangle absolute beliefs by validating their facts and challenging their cognitive leaps.

---

## Core UX

```
┌─────────────────────┬──────────────────────────┐
│   LEFT (40%)        │   RIGHT (60%)            │
│                     │                          │
│  Chat dialogue      │  Node graph (React Flow) │
│  - AI asks Q        │                          │
│  - User types A     │  Root → 3 Assumptions    │
│  - Auto-advances    │       → Middle Way       │
│                     │                          │
│  Drives the flow    │  Visual progress map     │
│  automatically      │  Updates itself          │
└─────────────────────┴──────────────────────────┘
```

**User only does ONE thing:** Read chat, type answer, press Enter. Graph updates automatically.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Graph:** @xyflow/react (React Flow)
- **AI:** OpenAI SDK (GPT-5.6 + Structured Outputs)
- **Language:** TypeScript
- **Deployment:** Vercel

---

## Project Structure

```
socrates-ai/
├── app/
│   ├── api/
│   │   ├── deconstruct/route.ts   # POST: belief text → node graph JSON
│   │   └── reflect/route.ts       # POST: user answer → AI validation + next Q
│   ├── layout.tsx
│   ├── page.tsx                   # Main split-screen layout
│   └── globals.css
├── components/
│   ├── ChatPanel.tsx              # Left side: dialogue + input
│   ├── GraphCanvas.tsx            # Right side: React Flow canvas
│   ├── BeliefNode.tsx             # Custom React Flow node (Fact vs Leap card)
│   └── Header.tsx                 # Top bar: app name + mind state
├── lib/
│   ├── prompts.ts                 # System prompts for Socratic behavior
│   ├── types.ts                   # TypeScript interfaces for nodes, edges
│   └── openai.ts                  # OpenAI client config
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Data Flow

### Phase 1: Deconstruct (Initial Input)

```
User types: "Capitalism is pure evil. It forces corruption."
    │
    ▼
POST /api/deconstruct
    │
    │  System Prompt:
    │  "You are a Socratic mirror. Break this belief into:
    │   - 1 root node (the belief)
    │   - 2-3 assumption nodes (each with fact + leap)
    │   - Return JSON matching the schema"
    │
    ▼
GPT-5.6 returns (Structured Output):
{
  "rootNode": {
    "id": "root",
    "text": "Capitalism is pure evil. It forces corruption.",
    "type": "root"
  },
  "assumptions": [
    {
      "id": "assumption-1",
      "fact": "Corporate greed and sweatshops exist.",
      "leap": "Therefore, all trade is inherently corrupt.",
      "socraticQuestion": "Can you think of a single fair trade you've made where both sides benefited?"
    },
    {
      "id": "assumption-2",
      "fact": "Power is frequently abused.",
      "leap": "Therefore, concentrated power has no utility.",
      "socraticQuestion": "How do we organize large-scale efforts without coordination?"
    },
    {
      "id": "assumption-3",
      "fact": "Individual impact is tiny at scale.",
      "leap": "Therefore, my actions are meaningless.",
      "socraticQuestion": "If you feed one child, does the system make that meaningless?"
    }
  ],
  "middleWay": null  // locked until all assumptions resolved
}
    │
    ▼
React Flow renders: root node + 3 assumption nodes + locked middle way node
Chat starts asking assumption-1's socraticQuestion
```

### Phase 2: Reflect (Each Turn)

```
User types answer to current question
    │
    ▼
POST /api/reflect
    Body: {
      assumption: { fact, leap, socraticQuestion },
      userResponse: "..."
    }
    │
    │  System Prompt:
    │  "Validate the user's fact first. Then check if they found
    │   an exception to the leap. Return JSON."
    │
    ▼
GPT-5.6 returns (Structured Output):
{
  "factValidated": true,
  "leapResolved": true,
  "aiResponse": "You're right that sweatshops exist. But you found a fair trade...",
  "resolvedText": "Trade has corruption, but fair exchanges also exist.",
  "nextAction": "advance" | "pushback" | "complete"
}
    │
    ▼
Frontend updates:
  - If advance: turn node teal, unlock next node, AI asks next question
  - If pushback: validate + reframe, ask deeper question
  - If complete: unlock Middle Way node
```

---

## Component Specs

### BeliefNode.tsx (Custom React Flow Node)

Visual card with Fact vs Leap split:

```
┌─────────────────────────────┐
│ SUPPORTING VIEW A    [Heavy]│  ← header (amber when heavy, teal when resolved)
├─────────────────────────────┤
│ FACT (True)                 │  ← grey background, never changes
│ "Corporate greed exists."   │
├─────────────────────────────┤
│ LEAP (Assumption)           │  ← amber → teal on resolve
│ "All trade is corrupt."     │
└─────────────────────────────┘
```

Node data shape:
```typescript
interface BeliefNodeData {
  label: string;
  type: 'root' | 'assumption' | 'middle-way';
  fact?: string;
  leap?: string;
  status: 'locked' | 'heavy' | 'resolved';
  socraticQuestion?: string;
}
```

### ChatPanel.tsx (Left Side)

- Scrollable message list (AI messages left, User messages right)
- Input bar at bottom
- Auto-scrolls to latest
- Shows current distortion warning (amber badge) when inspecting a heavy node
- No score, no gamification. Just clean Socratic dialogue.

### GraphCanvas.tsx (Right Side)

- React Flow with `nodesDraggable={false}` and `nodesConnectable={false}`
- Diamond layout: root top-center, 3 assumptions mid, middle-way bottom-center
- Custom `BeliefNode` components
- Animated edges (dashed when pending, solid teal when resolved)
- Background grid pattern

---

## System Prompts

### Deconstruct Prompt (lib/prompts.ts)

```
You are a Socratic mirror trained in CBT cognitive restructuring and Buddhist Middle Way philosophy.

Your job: Take the user's belief and deconstruct it into its logical components.

Rules:
1. Identify the FACTS (real observations the user has — these are TRUE and must be validated)
2. Identify the LEAPS (cognitive distortions — absolute generalizations like "all", "always", "never", "pure", "completely")
3. For each assumption, generate a Socratic question that helps the user find their own exception
4. Never tell the user they are wrong. Only ask questions.
5. Generate 2-3 assumptions (not more, not less)

Return JSON matching the provided schema.
```

### Reflect Prompt (lib/prompts.ts)

```
You are a Socratic mirror examining one assumption.

The user's assumption:
- FACT: {fact} (This is TRUE. Validate it.)
- LEAP: {leap} (This is what we're examining.)

The user's response: {userResponse}

Rules:
1. ALWAYS validate the fact first ("You're right that...")
2. Check if the user found a real exception to the leap
3. If yes: acknowledge, mark leapResolved=true, suggest a lighter reframed text
4. If no: validate their pushback, then reframe the Socratic question deeper
5. Never argue. Never debate. Only mirror and ask.

Return JSON matching the provided schema.
```

---

## Environment Variables

```env
OPENAI_API_KEY=sk-...  (user provides)
```

---

## MVP Acceptance Criteria

- [ ] User can type a belief and get a node graph generated
- [ ] Chat drives the conversation automatically
- [ ] Nodes turn from amber to teal as user deconstructs them
- [ ] Middle Way node unlocks at the end
- [ ] Works in browser at localhost:3000
- [ ] Build passes (`npm run build`)

---

## Out of MVP Scope (V2)

- User accounts / persistence
- Voice input / TTS
- Historical figure personas
- DALL-E visualization
- Mobile responsive layout
- Deploy to production
