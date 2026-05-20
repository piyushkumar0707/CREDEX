import Anthropic from "@anthropic-ai/sdk";
import type { AuditInput, AuditResult } from "./types";
import { makeFallbackSummary } from "./audit";

export async function generateSummary(input: AuditInput, partial: Pick<AuditResult, "totalMonthlySpend" | "totalMonthlySavings" | "findings">) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return makeFallbackSummary(partial.totalMonthlySpend, partial.totalMonthlySavings, input.useCase);
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 180,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: `Write a direct ~100-word AI spend audit summary for a ${input.teamSize}-person startup using AI primarily for ${input.useCase}. Current monthly spend is $${partial.totalMonthlySpend}; estimated monthly savings is $${partial.totalMonthlySavings}. Findings: ${partial.findings.map((finding) => `${finding.toolName}: ${finding.recommendedAction} saves $${finding.monthlySavings}/mo`).join("; ")}. Be specific, honest, and do not invent vendors or guarantees.`
        }
      ]
    });
    const block = response.content[0];
    if (block?.type === "text") return block.text.trim();
  } catch {
    return makeFallbackSummary(partial.totalMonthlySpend, partial.totalMonthlySavings, input.useCase);
  }

  return makeFallbackSummary(partial.totalMonthlySpend, partial.totalMonthlySavings, input.useCase);
}
