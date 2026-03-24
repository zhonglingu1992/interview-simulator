"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/lib/types";

interface Choice {
  id: string;
  text: string;
}

interface AnswerFormProps {
  question: string;
  questionContext?: string;
  profile: UserProfile;
  onSubmit: (
    answer: string,
    isMultipleChoice: boolean,
    selectedId?: string,
    correctId?: string
  ) => void;
  isLoading: boolean;
}

export function AnswerForm({
  question,
  questionContext,
  profile,
  onSubmit,
  isLoading,
}: AnswerFormProps) {
  const [answerMode, setAnswerMode] = useState("freeform");
  const [freeformAnswer, setFreeformAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [choices, setChoices] = useState<Choice[]>([]);
  const [correctId, setCorrectId] = useState("");
  const [loadingChoices, setLoadingChoices] = useState(false);

  useEffect(() => {
    setFreeformAnswer("");
    setSelectedChoice("");
    setChoices([]);
    setCorrectId("");
  }, [question]);

  const fetchChoices = async () => {
    setLoadingChoices(true);
    try {
      const res = await fetch("/api/generate-choices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, profile }),
      });
      const data = await res.json();
      if (data.choices) {
        setChoices(data.choices);
        setCorrectId(data.correctId);
      }
    } catch (error) {
      console.error("Failed to fetch choices:", error);
    } finally {
      setLoadingChoices(false);
    }
  };

  const handleModeChange = (mode: string) => {
    setAnswerMode(mode);
    if (mode === "mc" && choices.length === 0) {
      fetchChoices();
    }
  };

  const handleSubmit = () => {
    if (answerMode === "freeform") {
      onSubmit(freeformAnswer, false);
    } else {
      const choiceText =
        choices.find((c) => c.id === selectedChoice)?.text || "";
      onSubmit(choiceText, true, selectedChoice, correctId);
    }
  };

  const canSubmit =
    answerMode === "freeform"
      ? freeformAnswer.trim().length > 0
      : selectedChoice.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-base font-medium leading-relaxed">{question}</p>
          {questionContext && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              {questionContext}
            </p>
          )}
        </div>

        <Tabs value={answerMode} onValueChange={handleModeChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="freeform">Free-form Answer</TabsTrigger>
            <TabsTrigger value="mc">Multiple Choice</TabsTrigger>
          </TabsList>

          <TabsContent value="freeform" className="space-y-3 pt-2">
            <Label>Write your answer</Label>
            <Textarea
              placeholder="Type your response here. For behavioral questions, try to follow the STAR framework (Situation, Task, Action, Result)..."
              value={freeformAnswer}
              onChange={(e) => setFreeformAnswer(e.target.value)}
              rows={8}
              className="resize-y"
            />
          </TabsContent>

          <TabsContent value="mc" className="space-y-3 pt-2">
            {loadingChoices ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted/50 rounded-lg animate-pulse"
                  />
                ))}
                <p className="text-sm text-muted-foreground text-center">
                  Generating answer options...
                </p>
              </div>
            ) : (
              <RadioGroup
                value={selectedChoice}
                onValueChange={setSelectedChoice}
              >
                {choices.map((choice) => (
                  <div
                    key={choice.id}
                    className="flex items-start space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem
                      value={choice.id}
                      id={choice.id}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={choice.id}
                      className="font-normal leading-relaxed cursor-pointer flex-1"
                    >
                      <span className="font-semibold mr-2">{choice.id}.</span>
                      {choice.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || isLoading || loadingChoices}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Analyzing your answer..." : "Submit Answer"}
        </Button>
      </CardContent>
    </Card>
  );
}
