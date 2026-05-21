"use client";

import { useState } from "react";
import { CalendarCheck, Copy, Mail, PiggyBank, ShieldCheck, Check, ArrowLeft } from "lucide-react";
import type { AuditResult } from "@/lib/types";
import Link from "next/link";

export function ResultsView({ result, publicMode = false }: { result: AuditResult; publicMode?: boolean }) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");

  const highSavings = result.totalMonthlySavings > 500;

  async function captureLead(event: React.FormEvent) {
    event.preventDefault();
    if (!result.id) return;
    setStatus("Saving...");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auditId: result.id,
        email,
        companyName,
        role,
        teamSize: result.teamSize,
        website
      })
    });
    if (response.ok) {
      setStatus("Report captured. Check your inbox for the confirmation.");
    } else {
      setStatus("Could not capture the report yet. Try again in a minute.");
    }
  }

  async function copyToClipboard() {
    if (!result.publicUrl) return;
    try {
      await navigator.clipboard.writeText(new URL(result.publicUrl, window.location.origin).toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL", err);
    }
  }

  return (
    <main className="min-h-screen bg-paper pb-20 selection:bg-lemon selection:text-ink">
      {/* Brand Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-moss via-mint to-clay" />

      {/* Results Header Block */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-gradient-to-b from-mint/55 to-mint/5 py-12 md:py-16">
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-moss/20 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-moss shadow-sm backdrop-blur-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-clay animate-pulse" />
              Audit Complete
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl tracking-tight">
              <span className="bg-gradient-to-r from-moss to-clay bg-clip-text text-transparent">
                ${result.totalMonthlySavings.toLocaleString()}
              </span>{" "}
              monthly savings found
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75 sm:text-lg">
              Annualized, that is an opportunity of{" "}
              <strong className="text-ink">${result.totalAnnualSavings.toLocaleString()}/year</strong> against a current{" "}
              <strong>${result.totalMonthlySpend.toLocaleString()}/month</strong> baseline.
            </p>
            {publicMode ? (
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-moss hover:text-clay transition-colors"
              >
                <ArrowLeft size={16} /> Run a new AI audit
              </Link>
            ) : null}
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft backdrop-blur-md transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 text-moss">
              <PiggyBank aria-hidden className="h-5 w-5 text-moss" />
              <span className="font-bold text-sm tracking-wide uppercase">
                {highSavings ? "Credex opportunity" : "Disciplined stack"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/80">{result.summary}</p>
            {result.publicUrl ? (
              <button
                id="copy-report-btn"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink hover:bg-moss text-white px-5 py-3.5 font-bold text-sm shadow-md transition-all duration-200"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-lemon" /> Copied public URL!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy public report URL
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Details List & Lead Form Side-by-Side */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-2xl font-black text-ink tracking-tight">Per-tool recommendations</h2>
          <p className="text-sm text-ink/60 mt-1">Defensible optimization checklist derived from official vendor pricing</p>
          <div className="mt-6 grid gap-4">
            {result.findings.map((finding) => (
              <article
                key={`${finding.tool}-${finding.plan}`}
                className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card transition-all hover:border-moss/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-ink">{finding.toolName}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/50">
                      Current: {finding.plan}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-clay">
                      {finding.monthlySavings > 0 ? `$${finding.monthlySavings.toLocaleString()}/mo saved` : "Already optimal"}
                    </p>
                    <p className="text-xs text-ink/65 mt-1">
                      ${finding.currentSpend} → ${finding.recommendedSpend}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-ink/5 pt-4">
                  <p className="font-bold text-sm text-ink">{finding.recommendedAction}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{finding.reason}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {!publicMode ? (
          <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3 text-moss">
              {highSavings ? (
                <CalendarCheck aria-hidden className="h-5 w-5 text-moss" />
              ) : (
                <Mail aria-hidden className="h-5 w-5 text-moss" />
              )}
              <h2 className="text-lg font-black text-ink">
                {highSavings ? "Book the savings review" : "Capture this report"}
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {highSavings
                ? "This audit qualifies for a direct Credex consultation to source credits and lower retail AI bills. Save your report parameters."
                : "No pressure. Save this audit parameter state and receive alerts when new optimization benchmarks apply to your stack."}
            </p>
            <form className="mt-5 grid gap-3" onSubmit={captureLead}>
              <div className="grid gap-1">
                <input
                  id="lead-email"
                  className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold"
                  type="email"
                  placeholder="Work email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1">
                <input
                  id="lead-company"
                  className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold"
                  placeholder="Company name (optional)"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <input
                  id="lead-role"
                  className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink transition-all focus:border-moss focus:bg-white focus:ring-1 focus:ring-moss font-semibold"
                  placeholder="Your role (optional)"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                />
              </div>

              {/* Bot Honeypot - hidden and state-bound */}
              <input
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                name="website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />

              <button
                id="lead-submit-btn"
                className="mt-2 rounded-xl bg-clay hover:bg-clay/90 text-white px-4 py-3.5 font-bold text-sm shadow-md transition-colors"
              >
                Send report parameters
              </button>
            </form>
            {status ? (
              <p className="mt-4 text-xs font-bold text-moss bg-mint/30 rounded-lg p-3 text-center border border-moss/10">
                {status}
              </p>
            ) : null}
            <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-ink/55">
              <ShieldCheck size={14} /> Public report strips email and company details.
            </p>
          </aside>
        ) : null}
      </section>
    </main>
  );
}
