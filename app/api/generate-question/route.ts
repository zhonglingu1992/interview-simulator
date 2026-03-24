import Anthropic from "@anthropic-ai/sdk";
import { buildQuestionPrompt } from "@/lib/prompts";
import { GenerateQuestionRequest } from "@/lib/types";
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
    const body: GenerateQuestionRequest = await req.json();

    if (!body.profile?.industry || !body.profile?.experienceLevel) {
      return NextResponse.json(
        { error: "Profile with industry and experience level is required" },
        { status: 400 }
      );
    }

    const { system, user } = buildQuestionPrompt(body);

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
    console.error("Generate question error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate question";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
