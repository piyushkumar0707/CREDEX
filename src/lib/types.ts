export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolKey =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type ToolInput = {
  tool: ToolKey;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
};

export type AuditFinding = {
  tool: ToolKey;
  toolName: string;
  plan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedSpend: number;
  monthlySavings: number;
  reason: string;
};

export type AuditResult = {
  id?: string;
  teamSize: number;
  useCase: UseCase;
  findings: AuditFinding[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary: string;
  publicUrl?: string;
  createdAt: string;
};
