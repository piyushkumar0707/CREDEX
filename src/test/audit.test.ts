import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit";

describe("audit engine", () => {
  it("keeps already disciplined stacks honest", () => {
    const result = runAudit({ teamSize: 1, useCase: "coding", tools: [{ tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 }] });
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.summary).toContain("disciplined");
  });

  it("flags high-savings cases for Credex-sized credit opportunities", () => {
    const result = runAudit({ teamSize: 12, useCase: "mixed", tools: [{ tool: "openai-api", plan: "API direct", monthlySpend: 3200, seats: 12 }] });
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
    expect(result.findings[0].recommendedAction).toContain("discounted infrastructure credits");
  });

  it("downgrades team plans when the team is too small", () => {
    const result = runAudit({ teamSize: 2, useCase: "coding", tools: [{ tool: "github-copilot", plan: "Enterprise", monthlySpend: 156, seats: 4 }] });
    expect(result.findings[0].recommendedAction).toContain("Right-size");
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it("recommends cheaper alternatives for coding-heavy ChatGPT spend", () => {
    const result = runAudit({ teamSize: 5, useCase: "coding", tools: [{ tool: "chatgpt", plan: "Team", monthlySpend: 300, seats: 5 }] });
    expect(result.findings[0].recommendedAction).toContain("Cursor Pro");
    expect(result.totalMonthlySavings).toBe(200);
  });

  it("handles Gemini Ultra overbuying for mixed teams", () => {
    const result = runAudit({ teamSize: 3, useCase: "mixed", tools: [{ tool: "gemini", plan: "Ultra", monthlySpend: 750, seats: 3 }] });
    expect(result.findings[0].recommendedAction).toContain("Right-size");
    expect(result.totalAnnualSavings).toBeGreaterThan(7000);
  });

  it("recommends seat optimization when plan is correct but spend is over-allocated", () => {
    const result = runAudit({
      teamSize: 5,
      useCase: "coding",
      tools: [{ tool: "github-copilot", plan: "Business", monthlySpend: 150, seats: 5 }]
    });
    expect(result.findings[0].recommendedAction).toContain("Optimize seats or billing");
    expect(result.totalMonthlySavings).toBe(55);
  });
});
