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
    setTools((items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : itemIndex === index ? item : item)));
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
    <main className="min-h-screen bg-paper">
      <section className="border-b border-ink/10 bg-mint">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-[0.9fr_1.1fr] md:py-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-moss">SpendScope by Credex</p>
            <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">Find wasted AI spend</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/75">Audit Cursor, Copilot, Claude, ChatGPT, Gemini, API usage, and more before the next invoice lands.</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
            <p className="text-sm font-bold uppercase text-moss">Current stack</p>
            <p className="mt-2 text-4xl font-black">${totalSpend.toLocaleString()}/mo</p>
            <p className="mt-3 leading-7 text-ink/70">Enter what the team actually pays. The report appears before any email gate.</p>
          </div>
        </div>
      </section>

      <form className="mx-auto max-w-6xl px-5 py-10" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 font-bold">
            Team size
            <input className="rounded-md border border-ink/15 px-3 py-3 font-normal" type="number" min={1} value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 font-bold">
            Primary use case
            <select className="rounded-md border border-ink/15 px-3 py-3 font-normal" value={useCase} onChange={(event) => setUseCase(event.target.value as UseCase)}>
              {["coding", "writing", "data", "research", "mixed"].map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black">Paid AI tools</h2>
          <button type="button" className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 font-bold text-white" onClick={() => setTools((items) => [...items, defaultTool])}>
            <Plus size={18} /> Add tool
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {tools.map((tool, index) => (
            <div className="grid gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_140px_140px_auto]" key={`${index}-${tool.tool}`}>
              <label className="grid gap-2 text-sm font-bold">
                Tool
                <select
                  className="rounded-md border border-ink/15 px-3 py-3 font-normal"
                  value={tool.tool}
                  onChange={(event) => {
                    const nextTool = event.target.value as ToolKey;
                    updateTool(index, { tool: nextTool, plan: PLAN_PRICES[nextTool][0].label });
                  }}
                >
                  {(Object.keys(TOOL_LABELS) as ToolKey[]).map((key) => <option value={key} key={key}>{TOOL_LABELS[key]}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Plan
                <select className="rounded-md border border-ink/15 px-3 py-3 font-normal" value={tool.plan} onChange={(event) => updateTool(index, { plan: event.target.value })}>
                  {PLAN_PRICES[tool.tool].map((plan) => <option key={plan.label}>{plan.label}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Spend
                <input className="rounded-md border border-ink/15 px-3 py-3 font-normal" type="number" min={0} value={tool.monthlySpend} onChange={(event) => updateTool(index, { monthlySpend: Number(event.target.value) })} />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Seats
                <input className="rounded-md border border-ink/15 px-3 py-3 font-normal" type="number" min={1} value={tool.seats} onChange={(event) => updateTool(index, { seats: Number(event.target.value) })} />
              </label>
              <button type="button" className="self-end rounded-md border border-ink/15 p-3" aria-label="Remove tool" onClick={() => setTools((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {error ? <p className="mt-4 font-bold text-clay">{error}</p> : null}
        <button className="mt-8 inline-flex items-center gap-2 rounded-md bg-clay px-6 py-4 text-lg font-black text-white" disabled={loading}>
          {loading ? "Running audit..." : "Run free audit"} <ArrowRight size={20} />
        </button>
      </form>
    </main>
  );
}
