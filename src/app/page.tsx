"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { PLAN_PRICES, TOOL_LABELS } from "@/lib/pricing";
import type { AuditInput, AuditResult, ToolInput, ToolKey, UseCase } from "@/lib/types";
import { ResultsView } from "@/components/results-view";

const defaultTool: ToolInput = { tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 };
const storageKey = "spendscope-form-v1";

export default function Home() {
  const [teamSize, setTeamSize] = useState(8);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [tools, setTools] = useState<ToolInput[]>([
    defaultTool,
    { tool: "github-copilot", plan: "Business", monthlySpend: 152, seats: 8 },
    { tool: "chatgpt", plan: "Team", monthlySpend: 240, seats: 8 }
  ]);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as AuditInput;
      setTeamSize(parsed.teamSize);
      setUseCase(parsed.useCase);
      setTools(parsed.tools);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ teamSize, useCase, tools }));
  }, [teamSize, useCase, tools]);

  const totalSpend = useMemo(() => tools.reduce((sum, tool) => sum + Number(tool.monthlySpend || 0), 0), [tools]);

  function updateTool(index: number, patch: Partial<ToolInput>) {
    setTools((items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/audits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamSize, useCase, tools })
    });
    setLoading(false);
    if (!response.ok) {
      setError("The audit could not run yet. Check inputs and try again.");
      return;
    }
    setResult(await response.json());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (result) return <ResultsView result={result} />;

  return (
    <main className="min-h-screen bg-paper pb-20 selection:bg-lemon selection:text-ink">
      {/* Top Brand Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-moss via-mint to-clay" />

      {/* Hero Header Area */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-gradient-to-b from-mint/55 to-mint/5 py-12 md:py-16">
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1.10fr_0.90fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-moss/20 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-moss shadow-sm backdrop-blur-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-clay animate-pulse" />
              SpendScope by Credex
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight leading-[1.1] text-ink sm:text-6xl">
              Find wasted <span className="bg-gradient-to-r from-moss to-clay bg-clip-text text-transparent">AI spend</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/75 sm:text-lg">
              Audit Cursor, Copilot, Claude, ChatGPT, Gemini, and API usage before the next invoice lands. Get an instant, shareable report.
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft backdrop-blur-md transition-all duration-300 hover:shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-moss">Current stack baseline</p>
            <p className="mt-2 text-5xl font-black text-ink tracking-tight">
              ${totalSpend.toLocaleString()}<span className="text-lg font-medium text-ink/50">/mo</span>
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-paper overflow-hidden">
              <div className="h-full bg-moss rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalSpend / 1500) * 100)}%` }} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Enter your team size and active subscriptions. Your detailed audit is generated instantly on the next screen.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Form */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <form className="space-y-8" onSubmit={submit}>
          {/* Metadata Block */}
          <div className="grid gap-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-card md:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="team-size" className="text-sm font-bold text-ink flex items-center justify-between">
                <span>Team size</span>
                <span className="text-xs text-moss font-semibold">For plan eligibility</span>
              </label>
              <input
                id="team-size"
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold"
                type="number"
                min={1}
                value={teamSize}
                onChange={(event) => setTeamSize(Number(event.target.value))}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="use-case" className="text-sm font-bold text-ink flex items-center justify-between">
                <span>Primary use case</span>
                <span className="text-xs text-moss font-semibold">For alternative recommendations</span>
              </label>
              <select
                id="use-case"
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold capitalize"
                value={useCase}
                onChange={(event) => setUseCase(event.target.value as UseCase)}
              >
                {["coding", "writing", "data", "research", "mixed"].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tools Allocation List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-ink tracking-tight">Active subscriptions</h2>
                <p className="text-sm text-ink/60 mt-1">Configure each paid tool and current team seats</p>
              </div>
              <button
                id="add-tool-btn"
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-ink hover:bg-moss text-white px-5 py-3 font-bold text-sm shadow-md transition-all duration-200 hover:scale-[1.01]"
                onClick={() => setTools((items) => [...items, defaultTool])}
              >
                <Plus size={16} /> Add tool
              </button>
            </div>

            <div className="grid gap-4">
              {tools.map((tool, index) => (
                <div
                  className="grid gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-card md:grid-cols-[1.2fr_1fr_120px_120px_auto] items-end transition-all hover:border-moss/20"
                  key={`${index}-${tool.tool}`}
                >
                  <div className="grid gap-2">
                    <label htmlFor={`tool-select-${index}`} className="text-xs font-bold uppercase tracking-wider text-ink/65">
                      Tool Name
                    </label>
                    <select
                      id={`tool-select-${index}`}
                      className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold"
                      value={tool.tool}
                      onChange={(event) => {
                        const nextTool = event.target.value as ToolKey;
                        updateTool(index, { tool: nextTool, plan: PLAN_PRICES[nextTool][0].label });
                      }}
                    >
                      {(Object.keys(TOOL_LABELS) as ToolKey[]).map((key) => (
                        <option value={key} key={key}>
                          {TOOL_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor={`plan-select-${index}`} className="text-xs font-bold uppercase tracking-wider text-ink/65">
                      Active Plan
                    </label>
                    <select
                      id={`plan-select-${index}`}
                      className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold"
                      value={tool.plan}
                      onChange={(event) => updateTool(index, { plan: event.target.value })}
                    >
                      {PLAN_PRICES[tool.tool].map((plan) => (
                        <option key={plan.label} value={plan.label}>
                          {plan.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor={`spend-input-${index}`} className="text-xs font-bold uppercase tracking-wider text-ink/65">
                      Spend ($)
                    </label>
                    <input
                      id={`spend-input-${index}`}
                      className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold"
                      type="number"
                      min={0}
                      value={tool.monthlySpend}
                      onChange={(event) => updateTool(index, { monthlySpend: Number(event.target.value) })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor={`seats-input-${index}`} className="text-xs font-bold uppercase tracking-wider text-ink/65">
                      Seats
                    </label>
                    <input
                      id={`seats-input-${index}`}
                      className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold"
                      type="number"
                      min={1}
                      value={tool.seats}
                      onChange={(event) => updateTool(index, { seats: Number(event.target.value) })}
                    />
                  </div>

                  <button
                    id={`remove-tool-btn-${index}`}
                    type="button"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-ink/15 hover:border-clay hover:bg-clay/5 hover:text-clay text-ink/60 transition-colors"
                    aria-label="Remove tool"
                    onClick={() => setTools((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger Block */}
          <div className="pt-6 border-t border-ink/10 flex flex-col items-center sm:items-start gap-4">
            {error ? (
              <div className="w-full max-w-md rounded-xl border border-clay/20 bg-clay/5 p-4 text-sm font-semibold text-clay">
                {error}
              </div>
            ) : null}
            <button
              id="submit-audit-btn"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clay hover:bg-clay/90 text-white px-8 py-4 font-black text-lg shadow-lg transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed hover:scale-[1.01]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running audit...
                </>
              ) : (
                <>
                  Run free audit <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
