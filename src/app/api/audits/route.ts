import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit";
import { auditInputSchema } from "@/lib/schemas";
import { generateSummary } from "@/lib/summary";
import { checkRateLimit, saveAudit } from "@/lib/store";

export async function POST(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`audit:${key}`, 12)) {
    return NextResponse.json({ error: "Too many audits. Try again in a minute." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = auditInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid audit input", details: parsed.error.flatten() }, { status: 400 });
  }

  const draft = runAudit(parsed.data);
  const summary = await generateSummary(parsed.data, draft);
  const result = await saveAudit({ ...draft, summary });
  const origin = request.nextUrl.origin;
  return NextResponse.json({ ...result, publicUrl: `${origin}/report/${result.id}` });
}
