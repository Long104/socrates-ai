## Inspiration

We noticed a pattern: when people hold rigid beliefs — "I'll never be good enough," "Capitalism is pure evil," "My life is over" — they can't see the exceptions. Arguments just make them dig in. But Socrates figured this out 2,400 years ago: don't argue, ask questions until they find the contradiction themselves. We built a tool that does that, at scale, with AI.

## What it does

A visual thinking tool that breaks down absolute beliefs using Socratic questioning. You type a rigid thought, the AI finds the hidden assumptions underneath it, then walks you through each one in conversation. As you find exceptions, a live graph turns from amber to teal. At the end, a balanced insight emerges — "the middle way."

No arguing. No debating. Just questions that help you see your own blind spots.

## How we built it

Next.js 16 app router frontend, OpenAI GPT-5.6 with Structured Outputs for reliable JSON parsing, React Flow for the interactive node graph, Tailwind CSS v4 for styling. The AI has three phases: Deconstruct (break belief into fact vs. leap), Reflect (Socratic dialogue per assumption), Synthesize (distill into balanced truth). Built in ~72 hours for OpenAI Build Week.

## Challenges we ran into

Getting the AI to *question without arguing* was the hardest part — default LLM behavior is to debate and explain, not to ask. We rewrote system prompts 8+ times to kill every trace of lecture tone. Structured Outputs were brittle at first (GPT kept adding extra fields or returning markdown). Progressive node reveal in React Flow required careful state management to avoid visual jumps.

## Accomplishments we're proud of

The fact vs. leap card design — visually splitting a belief into "what's true" and "where you jumped too far" makes cognitive distortions tangible. The middle way emergence animation (blur-to-clear with ivory glow) genuinely feels like a moment of clarity. We killed every gamification idea (scores, streaks, progress bars) — the tool stays quiet and respectful, like a real philosophical conversation.

## What we learned

Structured Outputs + JSON schema is the only reliable way to get AI to follow a format at scale. The Socratic Method maps surprisingly well to a state machine with exactly 3 phases. Less UI is more — the original spec had 5+ node types, we cut to 3 (root, assumption, middle way). Design-wise: warm-ink dark mode with ochre/sage accents avoids the generic AI purple-cyan look entirely.

## What's next for socratic method AI

Session history so you can track how your thinking shifts over time. Voice input for journaling on the go. A "lighter" mode for everyday worries vs. deep worldview deconstruction. Mobile-responsive layout. And eventually, custom belief profiles — the AI learns which leaps you tend to make and gets sharper at spotting them.
