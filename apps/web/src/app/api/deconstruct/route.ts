import { DECONSTRUCT_SYSTEM_PROMPT, MODEL, openai, provider, safeParseJson } from "@workspace/core";
import type { DeconstructRequest, DeconstructResponse } from "@workspace/core";
import { NextResponse } from "next/server";

const JSON_INSTRUCTIONS = `
You MUST return a JSON object with EXACTLY this structure:
{
  "rootNode": {
    "id": "root",
    "text": "<the user's belief, rephrased concisely>",
    "type": "root"
  },
  "assumptions": [
    {
      "id": "assumption-1",
      "fact": "<a real observation that is TRUE — what they actually saw>",
      "leap": "<the part where they jumped too far — uses words like all/always/never/pure/completely>",
      "socraticQuestion": "<a question that helps them see their own exception to the jump>"
    },
    ... (exactly 2 assumptions total)
  ],
  "middleWay": null
}

Rules:
- Generate exactly 2 assumptions (not more, not less)
- Each hidden idea must have a FACT (true observation) and a LEAP (where they jumped too far)
- Never tell the user they are wrong — frame the question so THEY find the exception
- Return ONLY valid JSON, no markdown, no explanation
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DeconstructRequest;

    if (!body.belief || typeof body.belief !== "string") {
      return NextResponse.json(
        { error: "belief is required and must be a string" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: DECONSTRUCT_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Deconstruct this belief: "${body.belief}"\n\n${JSON_INSTRUCTIONS}`,
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

    const parsed = safeParseJson<DeconstructResponse>(content);

    // Validate structure
    if (!parsed.rootNode || !Array.isArray(parsed.assumptions)) {
      throw new Error("Invalid response structure");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Deconstruct error:", error);
    return NextResponse.json(
      {
        error: "Failed to process your thought",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
