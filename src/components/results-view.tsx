"use client";

import { useState } from "react";
import { CalendarCheck, Copy, Mail, PiggyBank, ShieldCheck } from "lucide-react";
import type { AuditResult } from "@/lib/types";

export function ResultsView({ result, publicMode = false }: { result: AuditResult; publicMode?: boolean }) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const highSavings = result.totalMonthlySavings > 500;

  async function captureLead(event: React.FormEvent) {
    event.preventDefault();
    if (!result.id) return;
    setStatus("Sending...");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auditId: result.id, email, companyName, role, teamSize: result.teamSize, website: "" })
    });
    setStatus(response.ok ? "Report captured. Check your inbox for the confirmation." : "Could not capture the report yet. Try again in a minute.");
  }

  return (
    <main className="min-h-screen bg-paper">
      <section className="border-b border-ink/10 bg-mint">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1.15fr_0.85fr] md:py-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-moss">SpendScope by Credex</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              ${result.totalMonthlySavings.toLocaleString()} monthly AI savings found
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/75">
              Annualized, that is ${result.totalAnnualSavings.toLocaleString()} against a current ${result.totalMonthlySpend.toLocaleString()}/month AI stack.
            </p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-paper p-5 shadow-soft">
            <div className="flex items-center gap-3 text-moss">
              <PiggyBank aria-hidden />
              <span className="font-bold">{highSavings ? "Credex opportunity" : "Disciplined stack"}</span>
            </div>
            <p className="mt-4 leading-7 text-ink/80">{result.summary}</p>
            {result.publicUrl ? (
              <button
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 font-bold text-white"
                onClick={() => navigator.clipboard.writeText(new URL(result.publicUrl || "", window.location.origin).toString())}
              >
                <Copy size={18} /> Copy public report URL
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-2xl font-black">Per-tool audit</h2>
          <div className="mt-5 grid gap-4">
            {result.findings.map((finding) => (
              <article key={`${finding.tool}-${finding.plan}`} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{finding.toolName}</h3>
                    <p className="mt-1 text-sm text-ink/60">{finding.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-clay">${finding.monthlySavings.toLocaleString()}/mo saved</p>
                    <p className="text-sm text-ink/60">${finding.currentSpend} → ${finding.recommendedSpend}</p>
                  </div>
                </div>
                <p className="mt-4 font-bold">{finding.recommendedAction}</p>
                <p className="mt-2 leading-7 text-ink/70">{finding.reason}</p>
              </article>
            ))}
          </div>
        </div>

        {!publicMode ? (
          <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3 text-moss">
              {highSavings ? <CalendarCheck aria-hidden /> : <Mail aria-hidden />}
              <h2 className="text-xl font-black">{highSavings ? "Book the savings review" : "Capture this report"}</h2>
            </div>
            <p className="mt-3 leading-7 text-ink/70">
              {highSavings ? "This audit is above the Credex consultation threshold. Save the report and get a follow-up path." : "No pressure. Save the report and get notified when new optimizations apply."}
            </p>
            <form className="mt-5 grid gap-3" onSubmit={captureLead}>
              <input className="rounded-md border border-ink/15 px-3 py-3" type="email" placeholder="Work email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <input className="rounded-md border border-ink/15 px-3 py-3" placeholder="Company name optional" value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              <input className="rounded-md border border-ink/15 px-3 py-3" placeholder="Role optional" value={role} onChange={(event) => setRole(event.target.value)} />
              <input className="hidden" tabIndex={-1} autoComplete="off" name="website" />
              <button className="rounded-md bg-clay px-4 py-3 font-black text-white">Send my report</button>
            </form>
            {status ? <p className="mt-3 text-sm font-bold text-moss">{status}</p> : null}
            <p className="mt-4 flex items-center gap-2 text-xs text-ink/55"><ShieldCheck size={16} /> Public report strips email and company details.</p>
          </aside>
        ) : null}
      </section>
    </main>
  );
}
