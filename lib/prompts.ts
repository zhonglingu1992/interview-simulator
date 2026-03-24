import {
  GenerateQuestionRequest,
  GenerateChoicesRequest,
  EvaluateAnswerRequest,
} from "./types";

const SYSTEM_PROMPT = `You are an expert behavioral interview coach with 20+ years of experience helping candidates across all industries prepare for interviews. You provide realistic, industry-specific practice questions and detailed, constructive feedback. Always respond with valid JSON only — no markdown, no explanation outside the JSON structure.`;

export function buildQuestionPrompt(req: GenerateQuestionRequest): {
  system: string;
  user: string;
} {
  const typeDescriptions: Record<string, string> = {
    behavioral:
      "Ask about a past experience using STAR method framing (Situation, Task, Action, Result). The question should prompt the candidate to describe a specific past experience.",
    case: "Present a realistic business scenario or problem that requires analysis, structured thinking, and a recommendation.",
    situational:
      "Present a hypothetical workplace situation that requires judgment, decision-making, and interpersonal skills.",
  };

  const difficultyDescriptions: Record<string, string> = {
    easy: "Common, straightforward situations most professionals encounter. Clear expectations.",
    medium:
      "Nuanced situations with trade-offs, competing priorities, or stakeholder management challenges.",
    hard: "High-stakes scenarios with ambiguity, organizational complexity, ethical considerations, or cross-functional challenges.",
  };

  const user = `Generate a single interview question for a candidate with this profile:
- Industry: ${req.profile.industry}
- Experience Level: ${req.profile.experienceLevel}
- Career Goals: ${req.profile.careerGoals}
${req.jobDescription ? `\n- Target Job Description:\n${req.jobDescription.slice(0, 4000)}` : ""}

Question Type: ${req.questionType}
${typeDescriptions[req.questionType]}

Difficulty: ${req.difficulty}
${difficultyDescriptions[req.difficulty]}

Personalize the question to the candidate's industry and experience level. Make it realistic and specific.

Respond with JSON only:
{"question": "the interview question", "context": "additional scenario context or null if not needed"}`;

  return { system: SYSTEM_PROMPT, user };
}

export function buildChoicesPrompt(req: GenerateChoicesRequest): {
  system: string;
  user: string;
} {
  const user = `Given this interview question, generate 4 answer options for a candidate in ${req.profile.industry} at the ${req.profile.experienceLevel} level.

Question: ${req.question}

Create 4 options with varying quality:
- One clearly best answer (demonstrates all expected competencies)
- One good but incomplete answer (misses some key aspects)
- One mediocre answer (shows common mistakes or shallow thinking)
- One poor answer (demonstrates red flags like blaming others, lacking self-awareness)

Randomize the placement of the correct answer — do NOT always make it option A.

Respond with JSON only:
{"choices": [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."}], "correctId": "the id of the best answer"}`;

  return { system: SYSTEM_PROMPT, user };
}

export function buildEvaluationPrompt(req: EvaluateAnswerRequest): {
  system: string;
  user: string;
} {
  const system =
    SYSTEM_PROMPT +
    " You provide constructive, specific, actionable feedback. Cite what the candidate actually said when noting strengths. Suggest concrete additions or changes for improvements.";

  const starInstruction =
    req.questionType === "behavioral"
      ? `
Also evaluate the answer against the STAR framework:
- Situation: Did they set the scene with specific context?
- Task: Did they clearly define their responsibility or challenge?
- Action: Did they describe specific steps THEY took (not the team)?
- Result: Did they quantify outcomes or describe the impact?

Include "starBreakdown" in your response with score (1-10) and feedback for each element.`
      : "";

  const mcContext =
    req.isMultipleChoice
      ? `\nThis was a multiple choice question. The candidate selected: ${req.selectedChoiceId}. The best answer was: ${req.correctChoiceId}. Explain why their selection was right or wrong and what the best answer demonstrates.`
      : "";

  const user = `Evaluate this interview answer.

Question: ${req.question}
Question Type: ${req.questionType}
Candidate Profile:
- Industry: ${req.profile.industry}
- Experience Level: ${req.profile.experienceLevel}
- Career Goals: ${req.profile.careerGoals}

Answer: ${req.answer}
${mcContext}

Scoring anchors:
- 1-3: Inadequate (missing key elements, red flags)
- 4-5: Needs work (partial answer, vague, generic)
- 6-7: Competent (covers basics, some specifics)
- 8-9: Strong (detailed, specific, well-structured)
- 10: Exceptional (outstanding specificity, self-awareness, impact)
${starInstruction}

Respond with JSON only:
{
  "overallScore": <1-10>,
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["actionable improvement 1", "actionable improvement 2"],
  ${req.questionType === "behavioral" ? '"starBreakdown": {"situation": {"score": <1-10>, "feedback": "..."}, "task": {"score": <1-10>, "feedback": "..."}, "action": {"score": <1-10>, "feedback": "..."}, "result": {"score": <1-10>, "feedback": "..."}}, ' : ""}
  "summary": "2-3 sentence overall assessment"
}`;

  return { system, user };
}
