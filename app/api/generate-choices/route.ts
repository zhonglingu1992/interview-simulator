import OpenAI from "openai";
import { buildChoicesPrompt } from "@/lib/prompts";
import { GenerateChoicesRequest } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.MOONSHOT_API_KEY;
const client = apiKey
  ? new OpenAI({ apiKey, baseURL: "https://api.moonshot.cn/v1" })
  : null;

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
    if (!client) {
      return NextResponse.json(
        { error: "MOONSHOT_API_KEY is not configured. Please set it in your Vercel environment variables." },
        { status: 500 }
      );
    }

    const body: GenerateChoicesRequest = await req.json();

    if (!body.question || !body.profile) {
      return NextResponse.json(
        { error: "Question and profile are required" },
        { status: 400 }
      );
    }

    const { system, user } = buildChoicesPrompt(body);

    const completion = await client.chat.completions.create({
      model: "moonshot-v1-32k",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(extractJSON(text));
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generate choices error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate choices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
