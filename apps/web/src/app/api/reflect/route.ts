import { MODEL, REFLECT_SYSTEM_PROMPT, openai, provider } from "@workspace/core";
import type { ReflectRequest, ReflectResponse } from "@workspace/core";
import { NextResponse } from "next/server";

const JSON_INSTRUCTIONS = `
You MUST return a JSON object with EXACTLY this structure:
{
  "factValidated": <boolean>,
  "leapResolved": <boolean — true if user found a real exception to the leap>,
  "aiResponse": "<your Socratic response — validate fact first, then address the leap>",
  "resolvedText": "<if leapResolved is true, provide a lighter reframed version of the leap; otherwise empty string>",
  "nextAction": "<one of: 'advance' | 'pushback' | 'complete'>"
}

Rules:
- ALWAYS validate the fact first in your aiResponse ("You're right that...")
- leapResolved = true ONLY if the user acknowledged a real exception to the absolute claim
- nextAction: 'advance' = move to next assumption, 'pushback' = reframe deeper, 'complete' = all resolved
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

    const parsed: ReflectResponse = JSON.parse(content);

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
