import type { ToolKey } from "./types";

export type PlanPrice = {
  label: string;
  monthlySeatPrice: number;
  source: string;
};

export const TOOL_LABELS: Record<ToolKey, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf"
};

export const PLAN_PRICES: Record<ToolKey, PlanPrice[]> = {
  cursor: [
    { label: "Hobby", monthlySeatPrice: 0, source: "https://cursor.com/en-US/pricing" },
    { label: "Pro", monthlySeatPrice: 20, source: "https://cursor.com/en-US/pricing" },
    { label: "Business", monthlySeatPrice: 40, source: "https://cursor.com/en-US/pricing" },
    { label: "Enterprise", monthlySeatPrice: 0, source: "https://cursor.com/en-US/pricing" }
  ],
  "github-copilot": [
    { label: "Individual", monthlySeatPrice: 10, source: "https://github.com/features/copilot/plans" },
    { label: "Business", monthlySeatPrice: 19, source: "https://github.com/features/copilot/plans" },
    { label: "Enterprise", monthlySeatPrice: 39, source: "https://github.com/features/copilot/plans" }
  ],
  claude: [
    { label: "Free", monthlySeatPrice: 0, source: "https://claude.com/pricing" },
    { label: "Pro", monthlySeatPrice: 20, source: "https://claude.com/pricing" },
    { label: "Max", monthlySeatPrice: 100, source: "https://claude.com/pricing" },
    { label: "Team", monthlySeatPrice: 25, source: "https://claude.com/pricing" },
    { label: "Enterprise", monthlySeatPrice: 20, source: "https://claude.com/pricing" },
    { label: "API direct", monthlySeatPrice: 0, source: "https://docs.anthropic.com/en/docs/about-claude/pricing" }
  ],
  chatgpt: [
    { label: "Plus", monthlySeatPrice: 20, source: "https://openai.com/chatgpt/pricing" },
    { label: "Team", monthlySeatPrice: 25, source: "https://openai.com/chatgpt/pricing" },
    { label: "Enterprise", monthlySeatPrice: 0, source: "https://openai.com/chatgpt/pricing" },
    { label: "API direct", monthlySeatPrice: 0, source: "https://openai.com/api/pricing/" }
  ],
  "anthropic-api": [
    { label: "API direct", monthlySeatPrice: 0, source: "https://docs.anthropic.com/en/docs/about-claude/pricing" }
  ],
  "openai-api": [{ label: "API direct", monthlySeatPrice: 0, source: "https://openai.com/api/pricing/" }],
  gemini: [
    { label: "Pro", monthlySeatPrice: 19.99, source: "https://gemini.google/us/subscriptions/" },
    { label: "Ultra", monthlySeatPrice: 249.99, source: "https://gemini.google/us/subscriptions/" },
    { label: "API", monthlySeatPrice: 0, source: "https://ai.google.dev/gemini-api/docs/pricing" }
  ],
  windsurf: [
    { label: "Free", monthlySeatPrice: 0, source: "https://windsurf.com/pricing" },
    { label: "Pro", monthlySeatPrice: 20, source: "https://windsurf.com/pricing" },
    { label: "Max", monthlySeatPrice: 200, source: "https://windsurf.com/pricing" },
    { label: "Teams", monthlySeatPrice: 40, source: "https://windsurf.com/pricing" },
    { label: "Enterprise", monthlySeatPrice: 0, source: "https://windsurf.com/pricing" }
  ]
};

export function getPlanPrice(tool: ToolKey, plan: string) {
  return PLAN_PRICES[tool].find((item) => item.label === plan);
}
