import type { AuditInput, AuditResult } from "./types";
import { makeFallbackSummary } from "./audit";

export async function generateSummary(input: AuditInput, partial: Pick<AuditResult, "totalMonthlySpend" | "totalMonthlySavings" | "findings">) {
  if (!process.env.GROQ_API_KEY) {
    return makeFallbackSummary(partial.totalMonthlySpend, partial.totalMonthlySavings, input.useCase);
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        max_tokens: 180,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: "You write concise B2B finance/product summaries. Use only the facts provided. Do not invent vendors, guarantees, or savings."
          },
          {
            role: "user",
            content: `Write a direct ~100-word AI spend audit summary for a ${input.teamSize}-person startup using AI primarily for ${input.useCase}. Current monthly spend is $${partial.totalMonthlySpend}; estimated monthly savings is $${partial.totalMonthlySavings}. Findings: ${partial.findings.map((finding) => `${finding.toolName}: ${finding.recommendedAction} saves $${finding.monthlySavings}/mo`).join("; ")}. Be specific, honest, and do not invent vendors or guarantees.`
          }
        ]
      })
    });

    if (!response.ok) {
      return makeFallbackSummary(partial.totalMonthlySpend, partial.totalMonthlySavings, input.useCase);
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (text) return text;
  } catch {
    return makeFallbackSummary(partial.totalMonthlySpend, partial.totalMonthlySavings, input.useCase);
  }

  return makeFallbackSummary(partial.totalMonthlySpend, partial.totalMonthlySavings, input.useCase);
}
