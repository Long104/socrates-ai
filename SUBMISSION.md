## Inspiration

A pattern we kept noticing: when someone holds a rigid belief ("I'll never be good enough," "Capitalism is pure evil," "My life is over"), they stop seeing exceptions. Arguing makes it worse. They dig in.

Socrates figured this out 2,400 years ago. Don't argue. Ask questions until they hit the contradiction themselves. We wanted to see if an LLM could do that faithfully, at reading-speed, without slipping into lecture mode.

## What it does

A visual thinking tool that breaks absolute beliefs apart using Socratic questioning. You type a rigid thought. The AI surfaces the hidden assumptions underneath, then walks you through each one in conversation. As you find exceptions, a live graph shifts from amber to teal. At the end, a balanced perspective shows up. We call it the middle way.

No arguing. No debate. Questions that surface your own blind spots.

## How we built it

Next.js 16 App Router on the frontend. OpenAI GPT-5.6 with Structured Outputs for reliable JSON at every step. React Flow for the node graph. Tailwind v4 for styling.

The AI runs in three phases. Deconstruct splits a belief into fact versus leap. Reflect runs Socratic dialogue on each assumption. Synthesize distills the resolved concessions into one balanced line. Built in roughly 72 hours for OpenAI Build Week.

## Challenges we ran into

Hardest part: getting the model to *question* instead of *argue*. Default LLM behavior is to explain, correct, debate. We rewrote the system prompts more than eight times to strip every trace of lecture tone out.

Structured Outputs were brittle early on. GPT kept adding extra fields or wrapping JSON in markdown fences. We wrote a defensive parser that isolates the first valid JSON block regardless of envelope.

Progressive node reveal in React Flow needed careful state handling to avoid the graph jumping when new nodes appeared.

## Accomplishments we're proud of

The fact-versus-leap card. Visually splitting a belief into "what's actually true" and "where you jumped too far" makes a cognitive distortion something you can point at. People get it in two seconds.

The middle way emergence animation (blur-to-clear with an ivory glow) genuinely reads as a small moment of clarity. We are happy with that one.

We also killed every gamification idea we had. Scores, streaks, progress bars, all of it. The tool stays quiet. It feels like a conversation, not a quiz.

## What we learned

Structured Outputs plus a JSON schema is the only reliable way to get an LLM to hold a format under pressure. The Socratic Method maps cleanly onto a three-phase state machine, which surprised us. Less UI is more: the original spec had five-plus node types, we shipped three (root, assumption, middle way).

On design: warm-ink dark mode with ochre and sage accents dodges the generic AI purple-cyan look entirely. That felt worth the extra day.

## What's next

Session history, so you can track how your thinking shifts over weeks. Voice input for journaling on the go. A lighter mode for everyday worries (not just deep worldview deconstruction). Mobile layout. And eventually, custom belief profiles: the AI learns which leaps you tend to make and gets sharper at spotting them.
