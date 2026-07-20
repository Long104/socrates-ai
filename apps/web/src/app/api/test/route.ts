import { MODEL, openai, provider } from "@workspace/core";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: `Say 'Hello from ${MODEL}! Connection OK.'`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    return NextResponse.json({
      success: true,
      message: content,
      model: MODEL,
      provider,
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        model: MODEL,
        provider,
      },
      { status: 500 }
    );
  }
}
