export interface UserProfile {
  industry: string;
  experienceLevel: "entry" | "mid" | "senior" | "executive";
  careerGoals: string;
}

export type QuestionType = "behavioral" | "case" | "situational";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface GenerateQuestionRequest {
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  profile: UserProfile;
  jobDescription?: string;
}

export interface GenerateQuestionResponse {
  question: string;
  context?: string;
}

export interface GenerateChoicesRequest {
  question: string;
  profile: UserProfile;
}

export interface GenerateChoicesResponse {
  choices: { id: string; text: string }[];
  correctId: string;
}

export interface EvaluateAnswerRequest {
  question: string;
  answer: string;
  questionType: QuestionType;
  profile: UserProfile;
  isMultipleChoice: boolean;
  selectedChoiceId?: string;
  correctChoiceId?: string;
}

export interface StarElement {
  score: number;
  feedback: string;
}

export interface FeedbackResult {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  starBreakdown?: {
    situation: StarElement;
    task: StarElement;
    action: StarElement;
    result: StarElement;
  };
  summary: string;
}

export interface EvaluateAnswerResponse {
  feedback: FeedbackResult;
}
