"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuestionConfig } from "@/components/question-config";
import { AnswerForm } from "@/components/answer-form";
import { FeedbackDisplay } from "@/components/feedback-display";
import { getProfile } from "@/lib/profile";
import {
  UserProfile,
  QuestionType,
  GenerateQuestionRequest,
  GenerateQuestionResponse,
  FeedbackResult,
} from "@/lib/types";

type AppState =
  | "idle"
  | "generating"
  | "questionReady"
  | "evaluating"
  | "feedbackReady";

export default function PracticePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [questionContext, setQuestionContext] = useState<string | undefined>();
  const [questionType, setQuestionType] = useState<QuestionType>("behavioral");

  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace("/profile");
    } else {
      setProfile(p);
    }
  }, [router]);

  const handleGenerate = async (config: GenerateQuestionRequest) => {
    setState("generating");
    setError(null);
    setFeedback(null);
    setQuestionType(config.questionType);

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data: GenerateQuestionResponse & { error?: string } =
        await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate question");
      }

      setQuestion(data.question);
      setQuestionContext(data.context || undefined);
      setState("questionReady");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("idle");
    }
  };

  const handleSubmitAnswer = async (
    answer: string,
    isMultipleChoice: boolean,
    selectedChoiceId?: string,
    correctChoiceId?: string
  ) => {
    setState("evaluating");
    setError(null);

    try {
      const res = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          questionType,
          profile,
          isMultipleChoice,
          selectedChoiceId,
          correctChoiceId,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to evaluate answer");
      }

      setFeedback(data.feedback);
      setState("feedbackReady");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("questionReady");
    }
  };

  const handleNextQuestion = () => {
    setState("idle");
    setQuestion("");
    setQuestionContext(undefined);
    setFeedback(null);
    setError(null);
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Interview Practice</h1>
        <p className="text-muted-foreground">
          Practicing as a {profile.experienceLevel}-level professional in{" "}
          {profile.industry}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(state === "idle" || state === "generating") && (
        <QuestionConfig
          onGenerate={handleGenerate}
          isLoading={state === "generating"}
          profile={profile}
        />
      )}

      {(state === "questionReady" || state === "evaluating") && (
        <AnswerForm
          question={question}
          questionContext={questionContext}
          profile={profile}
          onSubmit={handleSubmitAnswer}
          isLoading={state === "evaluating"}
        />
      )}

      {state === "feedbackReady" && feedback && (
        <FeedbackDisplay
          feedback={feedback}
          questionType={questionType}
          onNextQuestion={handleNextQuestion}
        />
      )}
    </div>
  );
}
