import Anthropic from "@anthropic-ai/sdk";
import { buildChoicesPrompt } from "@/lib/prompts";
import { GenerateChoicesRequest } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

function extractJSON(text: string): string {
  const stripped = text.replace(/```(?:json)?\s*/g, "").replace(/```/g, "");
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    return stripped.slice(start, end + 1);
  }
  return stripped;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateChoicesRequest = await req.json();

    if (!body.question || !body.profile) {
      return NextResponse.json(
        { error: "Question and profile are required" },
        { status: 400 }
      );
    }

    const { system, user } = buildChoicesPrompt(body);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(extractJSON(text));
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generate choices error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate choices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
