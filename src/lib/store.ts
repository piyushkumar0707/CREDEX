import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditResult } from "./types";

type Lead = {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
};

const memoryAudits = new Map<string, AuditResult>();
const attempts = new Map<string, number[]>();
const localStorePath = path.join(process.cwd(), ".local", "audits.json");

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function checkRateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < windowMs);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length <= limit;
}

export async function saveAudit(result: AuditResult) {
  const id = crypto.randomUUID();
  const publicResult = { ...result, id };
  memoryAudits.set(id, publicResult);
  const client = supabase();
  if (client) {
    const { error } = await client.from("audits").insert({
      id,
      team_size: result.teamSize,
      use_case: result.useCase,
      total_monthly_spend: result.totalMonthlySpend,
      total_monthly_savings: result.totalMonthlySavings,
      total_annual_savings: result.totalAnnualSavings,
      result: publicResult
    });
    if (error) {
      console.error("Supabase audit insert failed", error.message);
      await saveLocalAudit(publicResult);
    }
  } else {
    await saveLocalAudit(publicResult);
  }
  return publicResult;
}

export async function getAudit(id: string) {
  const cached = memoryAudits.get(id);
  if (cached) return cached;
  const client = supabase();
  if (!client) return getLocalAudit(id);
  const { data, error } = await client.from("audits").select("result").eq("id", id).single();
  if (error) {
    console.error("Supabase audit lookup failed", error.message);
    return getLocalAudit(id);
  }
  return (data?.result as AuditResult | undefined) ?? (await getLocalAudit(id));
}

export async function saveLead(lead: Lead) {
  const client = supabase();
  if (!client) return { stored: false };
  const { error } = await client.from("leads").insert({
    audit_id: lead.auditId,
    email: lead.email,
    company_name: lead.companyName || null,
    role: lead.role || null,
    team_size: lead.teamSize || null
  });
  if (error) {
    console.error("Supabase lead insert failed", error.message);
    return { stored: false };
  }
  return { stored: true };
}

async function readLocalAudits() {
  try {
    const raw = await readFile(localStorePath, "utf8");
    return JSON.parse(raw) as Record<string, AuditResult>;
  } catch {
    return {};
  }
}

async function saveLocalAudit(result: AuditResult & { id: string }) {
  await mkdir(path.dirname(localStorePath), { recursive: true });
  const audits = await readLocalAudits();
  audits[result.id] = result;
  await writeFile(localStorePath, JSON.stringify(audits, null, 2));
}

async function getLocalAudit(id: string) {
  const audits = await readLocalAudits();
  return audits[id] ?? null;
}
