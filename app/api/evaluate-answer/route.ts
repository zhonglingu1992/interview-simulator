import Anthropic from "@anthropic-ai/sdk";
import { buildEvaluationPrompt } from "@/lib/prompts";
import { EvaluateAnswerRequest } from "@/lib/types";
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
    const body: EvaluateAnswerRequest = await req.json();

    if (!body.question || !body.answer || !body.profile) {
      return NextResponse.json(
        { error: "Question, answer, and profile are required" },
        { status: 400 }
      );
    }

    const { system, user } = buildEvaluationPrompt(body);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(extractJSON(text));
    return NextResponse.json({ feedback: parsed });
  } catch (error) {
    console.error("Evaluate answer error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to evaluate answer";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
