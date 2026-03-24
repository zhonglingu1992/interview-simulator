"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GenerateQuestionRequest,
  QuestionType,
  DifficultyLevel,
  UserProfile,
} from "@/lib/types";

const questionTypeLabels: Record<QuestionType, string> = {
  behavioral: "Behavioral (STAR)",
  case: "Open-ended Case",
  situational: "Situational Judgment",
};

const difficultyLabels: Record<DifficultyLevel, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

interface QuestionConfigProps {
  onGenerate: (config: GenerateQuestionRequest) => void;
  isLoading: boolean;
  profile: UserProfile;
}

export function QuestionConfig({
  onGenerate,
  isLoading,
  profile,
}: QuestionConfigProps) {
  const [questionType, setQuestionType] = useState<QuestionType>("behavioral");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [jobDescription, setJobDescription] = useState("");

  const handleGenerate = (withJD: boolean) => {
    onGenerate({
      questionType,
      difficulty,
      profile,
      jobDescription: withJD ? jobDescription : undefined,
    });
  };

  const typeSelect = (
    <div className="space-y-2">
      <Label>Question Type</Label>
      <Select
        value={questionType}
        onValueChange={(v) => setQuestionType(v as QuestionType)}
      >
        <SelectTrigger>
          <SelectValue>{questionTypeLabels[questionType]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(questionTypeLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const difficultySelect = (
    <div className="space-y-2">
      <Label>Difficulty</Label>
      <Select
        value={difficulty}
        onValueChange={(v) => setDifficulty(v as DifficultyLevel)}
      >
        <SelectTrigger>
          <SelectValue>{difficultyLabels[difficulty]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(difficultyLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Your Question</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Practice</TabsTrigger>
            <TabsTrigger value="jd">Job Description</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {typeSelect}
              {difficultySelect}
            </div>
            <Button
              onClick={() => handleGenerate(false)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Generating..." : "Generate Question"}
            </Button>
          </TabsContent>

          <TabsContent value="jd" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Paste Job Description or Link</Label>
              <Textarea
                placeholder="Paste the full job description text or a link to the job posting..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {typeSelect}
              {difficultySelect}
            </div>
            <Button
              onClick={() => handleGenerate(true)}
              disabled={isLoading || !jobDescription.trim()}
              className="w-full"
            >
              {isLoading ? "Generating..." : "Generate from Job Description"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
