
export interface User {
  id: string;
  email: string;
  password: string; // WARNING: In a real app, this would be a hash.
}

export interface Survey {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  schema: DrawflowData;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  submittedAt: number;
  answers: Record<string, any>;
}

// Simplified Drawflow types
export interface DrawflowNode {
  id: number;
  name: string;
  data: Record<string, any>;
  class: string;
  html: string;
  typenode: 'html';
  inputs: Record<string, { connections: { node: string; input: string }[] }>;
  outputs: Record<string, { connections: { node: string; output: string }[] }>;
  pos_x: number;
  pos_y: number;
}

export interface DrawflowData {
  drawflow: {
    Home: {
      data: Record<string, DrawflowNode>;
    };
  };
}

export interface SimplifiedNode {
  id: string;
  name: string;
  content: string;
  options: string[] | null;
  connections: Record<string, string>; // e.g., { "default": "2" } or { "0": "3", "1": "4" }
}

export interface GeminiAnalysis {
    overallSummary: string;
    keyInsights: string[];
    sentiment: {
        positive_themes: string[];
        negative_themes: string[];
        neutral_themes: string[];
    };
    actionableRecommendations: string[];
}
