import { MODEL, REFLECT_SYSTEM_PROMPT, openai, provider, safeParseJson } from "@workspace/core";
import type { ReflectRequest, ReflectResponse } from "@workspace/core";
import { NextResponse } from "next/server";

const JSON_INSTRUCTIONS = `
You MUST return a JSON object with EXACTLY this structure:
{
  "factValidated": <boolean>,
  "leapResolved": <boolean — true if user found a real exception to the leap>,
  "aiResponse": "<your response — check their real observation first, then ask about the jump>",
  "resolvedText": "<if leapResolved is true, provide a lighter reframed version of the leap; otherwise empty string>",
  "nextAction": "<one of: 'advance' | 'pushback' | 'complete'>"
}

Rules:
- ALWAYS validate the fact first in your aiResponse
- leapResolved = true if the user shows ANY openness or acknowledges nuance (even partial concession)
- nextAction: 'advance' = user showed openness, move to next question; 'pushback' = user defended absolutism, ask sharper; 'complete' = all resolved
- BE GENEROUS: if user says "yes", "maybe", "I suppose", "fair point" → advance
- Return ONLY valid JSON, no markdown, no explanation
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReflectRequest;

    if (!body.assumption || !body.userResponse) {
      return NextResponse.json(
        { error: "assumption and userResponse are required" },
        { status: 400 }
      );
    }

    const systemPrompt = REFLECT_SYSTEM_PROMPT.replace("{fact}", body.assumption.fact)
      .replace("{leap}", body.assumption.leap)
      .replace("{userResponse}", body.userResponse);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `${body.userResponse}\n\n${JSON_INSTRUCTIONS}`,
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

    const parsed = safeParseJson<ReflectResponse>(content);

    // Validate
    if (typeof parsed.factValidated !== "boolean") {
      throw new Error("Invalid response: factValidated must be boolean");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Reflect error:", error);
    return NextResponse.json(
      {
        error: "Failed to process reflection",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
