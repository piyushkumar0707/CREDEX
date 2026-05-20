import { AuditInput, AuditResult, ToolInput } from "./types";
import { getPlanPrice, PLAN_PRICES, TOOL_LABELS } from "./pricing";

const money = (value: number) => Math.max(0, Math.round(value));

function cheapestSeatPlan(tool: ToolInput, teamSize: number) {
  const plans = PLAN_PRICES[tool.tool].filter((plan) => plan.monthlySeatPrice > 0);
  if (tool.tool === "cursor") return teamSize <= 3 ? plans.find((p) => p.label === "Pro") : plans.find((p) => p.label === "Business");
  if (tool.tool === "github-copilot") return teamSize <= 2 ? plans.find((p) => p.label === "Individual") : plans.find((p) => p.label === "Business");
  if (tool.tool === "claude") return teamSize <= 2 ? plans.find((p) => p.label === "Pro") : plans.find((p) => p.label === "Team");
  if (tool.tool === "chatgpt") return teamSize <= 2 ? plans.find((p) => p.label === "Plus") : plans.find((p) => p.label === "Team");
  if (tool.tool === "gemini") return tool.plan === "Ultra" && teamSize <= 3 ? plans.find((p) => p.label === "Pro") : getPlanPrice(tool.tool, tool.plan);
  if (tool.tool === "windsurf") return teamSize <= 2 ? plans.find((p) => p.label === "Pro") : plans.find((p) => p.label === "Teams");
  return getPlanPrice(tool.tool, tool.plan);
}

function expectedSpend(tool: ToolInput, teamSize: number) {
  const plan = cheapestSeatPlan(tool, teamSize);
  if (!plan || plan.monthlySeatPrice === 0) return tool.monthlySpend;
  return plan.monthlySeatPrice * Math.max(1, tool.seats);
}

function creditOptimizedSpend(tool: ToolInput) {
  if (tool.monthlySpend < 250) return tool.monthlySpend;
  if (tool.tool === "anthropic-api" || tool.tool === "openai-api") return tool.monthlySpend * 0.78;
  if (tool.tool === "cursor" || tool.tool === "chatgpt" || tool.tool === "claude") return tool.monthlySpend * 0.85;
  return tool.monthlySpend;
}

function alternativeSpend(tool: ToolInput, useCase: AuditInput["useCase"]) {
  if (useCase === "coding" && tool.tool === "chatgpt" && tool.monthlySpend > 60) {
    return { spend: 20 * Math.max(1, tool.seats), action: "Move coding-heavy seats to Cursor Pro and keep ChatGPT only where it is used daily." };
  }
  if (useCase === "writing" && tool.tool === "claude" && tool.plan === "Max") {
    return { spend: 20 * Math.max(1, tool.seats), action: "Downgrade most writing seats from Claude Max to Pro unless they routinely hit limits." };
  }
  if (useCase === "mixed" && tool.tool === "gemini" && tool.plan === "Ultra") {
    return { spend: 30 * Math.max(1, tool.seats), action: "Replace Gemini Ultra seats with ChatGPT Team for mixed office and research work." };
  }
  return null;
}

export function runAudit(input: AuditInput, summary = ""): AuditResult {
  const findings = input.tools.map((tool) => {
    const planPrice = getPlanPrice(tool.tool, tool.plan);
    const rightSized = expectedSpend(tool, input.teamSize);
    const credited = creditOptimizedSpend(tool);
    const alternative = alternativeSpend(tool, input.useCase);
    const candidateSpend = Math.min(rightSized, credited, alternative?.spend ?? tool.monthlySpend);
    const monthlySavings = money(tool.monthlySpend - candidateSpend);

    let recommendedAction = "Keep current setup";
    let reason = "Current spend is close to the defensible benchmark for this team size and use case.";
    if (monthlySavings > 0 && alternative && alternative.spend === candidateSpend) {
      recommendedAction = alternative.action;
      reason = "A cheaper tool covers the primary use case with materially lower monthly cost.";
    } else if (monthlySavings > 0 && credited === candidateSpend) {
      recommendedAction = "Route eligible usage through discounted infrastructure credits via Credex.";
      reason = "The same category of AI infrastructure can be sourced below retail pricing without changing user workflow.";
    } else if (monthlySavings > 0) {
      const target = cheapestSeatPlan(tool, input.teamSize);
      recommendedAction = `Right-size to ${target?.label ?? "a lower plan"}`;
      reason = `${tool.seats} seat(s) on ${tool.plan} exceeds what a ${input.teamSize}-person ${input.useCase} team usually needs.`;
    }

    return {
      tool: tool.tool,
      toolName: TOOL_LABELS[tool.tool],
      plan: tool.plan,
      currentSpend: money(tool.monthlySpend),
      recommendedAction,
      recommendedSpend: money(candidateSpend),
      monthlySavings,
      reason: planPrice ? reason : "Plan price is treated as custom-entered spend because vendor pricing is usage-based or sales-led."
    };
  });

  const totalMonthlySpend = money(findings.reduce((sum, item) => sum + item.currentSpend, 0));
  const totalMonthlySavings = money(findings.reduce((sum, item) => sum + item.monthlySavings, 0));
  return {
    teamSize: input.teamSize,
    useCase: input.useCase,
    findings,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    summary: summary || makeFallbackSummary(totalMonthlySpend, totalMonthlySavings, input.useCase),
    createdAt: new Date().toISOString()
  };
}

export function makeFallbackSummary(monthlySpend: number, monthlySavings: number, useCase: AuditInput["useCase"]) {
  if (monthlySavings < 100) {
    return `Your AI stack looks disciplined for a ${useCase} workflow. The audit found only minor optimization room against a $${monthlySpend}/month baseline, so the best next step is monitoring pricing changes rather than forcing unnecessary vendor switches.`;
  }
  return `Your current AI stack has a clear savings opportunity: roughly $${monthlySavings}/month, or $${monthlySavings * 12}/year. The main lever is matching plans to actual team size and routing eligible retail AI spend through lower-cost credits without disrupting the ${useCase} workflow.`;
}
