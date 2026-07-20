import { MODEL, SYNTHESIZE_SYSTEM_PROMPT, openai, provider, safeParseJson } from "@workspace/core";
import type { SynthesizeRequest, SynthesizeResponse } from "@workspace/core";
import { NextResponse } from "next/server";

const JSON_INSTRUCTIONS = `
Return ONLY valid JSON: { "middleWay": "<1-2 sentence string, max 40 words, simple enough for anyone to understand>" }
No markdown. No explanation.
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SynthesizeRequest;

    if (
      !body.rootBelief ||
      !Array.isArray(body.resolvedAssumptions) ||
      body.resolvedAssumptions.length < 2
    ) {
      return NextResponse.json(
        { error: "rootBelief and at least 2 resolvedAssumptions are required" },
        { status: 400 }
      );
    }

    const resolvedList = body.resolvedAssumptions
      .map(
        (a) =>
          `- Fact: ${a.fact} | Original leap: ${a.originalLeap} | User's resolved insight: ${a.resolvedText}`
      )
      .join("\n");

    const systemPrompt = SYNTHESIZE_SYSTEM_PROMPT.replace("{rootBelief}", body.rootBelief).replace(
      "{resolvedList}",
      resolvedList
    );

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Synthesize the Middle Way from these resolved assumptions:\n\n${resolvedList}\n\n${JSON_INSTRUCTIONS}`,
        },
      ],
      ...(provider === "deepseek"
        ? { response_format: { type: "json_object" } as const }
        : {
            response_format: {
              type: "json_object",
            } as const,
          }),
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from model");
    }

    const parsed = safeParseJson<SynthesizeResponse>(content);

    if (!parsed.middleWay || typeof parsed.middleWay !== "string") {
      throw new Error("Invalid response: middleWay must be a string");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Synthesize error:", error);
    return NextResponse.json(
      {
        error: "Failed to find the balance",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
