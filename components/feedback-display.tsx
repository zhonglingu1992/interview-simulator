"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FeedbackResult, QuestionType } from "@/lib/types";

interface FeedbackDisplayProps {
  feedback: FeedbackResult;
  questionType: QuestionType;
  onNextQuestion: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-600";
  if (score >= 5) return "text-yellow-600";
  return "text-red-600";
}

function getProgressColor(score: number): string {
  if (score >= 8) return "[&>div]:bg-green-500";
  if (score >= 5) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
}

function getScoreLabel(score: number): string {
  if (score >= 9) return "Exceptional";
  if (score >= 8) return "Strong";
  if (score >= 6) return "Competent";
  if (score >= 4) return "Needs Work";
  return "Inadequate";
}

export function FeedbackDisplay({
  feedback,
  questionType,
  onNextQuestion,
}: FeedbackDisplayProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Feedback</span>
            <Badge variant="outline" className={getScoreColor(feedback.overallScore)}>
              {getScoreLabel(feedback.overallScore)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="text-center space-y-2">
            <div
              className={`text-5xl font-bold ${getScoreColor(feedback.overallScore)}`}
            >
              {feedback.overallScore}
              <span className="text-lg text-muted-foreground font-normal">
                /10
              </span>
            </div>
            <Progress
              value={feedback.overallScore * 10}
              className={`h-2 ${getProgressColor(feedback.overallScore)}`}
            />
          </div>

          <Separator />

          {/* Strengths */}
          <div className="space-y-2">
            <h3 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-xs">
                +
              </span>
              Strengths
            </h3>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 space-y-2">
              {feedback.strengths.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-green-600 mt-0.5 shrink-0">
                    &bull;
                  </span>
                  <p className="text-sm">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-xs">
                !
              </span>
              Areas for Improvement
            </h3>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 space-y-2">
              {feedback.improvements.map((imp, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-amber-600 mt-0.5 shrink-0">
                    &bull;
                  </span>
                  <p className="text-sm">{imp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* STAR Breakdown */}
          {questionType === "behavioral" && feedback.starBreakdown && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">STAR Framework Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(
                    ["situation", "task", "action", "result"] as const
                  ).map((element) => {
                    const data = feedback.starBreakdown![element];
                    return (
                      <Card key={element} className="border">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                              {element}
                            </span>
                            <span
                              className={`text-lg font-bold ${getScoreColor(data.score)}`}
                            >
                              {data.score}/10
                            </span>
                          </div>
                          <Progress
                            value={data.score * 10}
                            className={`h-1.5 ${getProgressColor(data.score)}`}
                          />
                          <p className="text-sm text-muted-foreground">
                            {data.feedback}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold">Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feedback.summary}
            </p>
          </div>

          <Button onClick={onNextQuestion} className="w-full" size="lg">
            Practice Another Question
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
