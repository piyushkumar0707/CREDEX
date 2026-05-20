import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas";
import { sendAuditEmail } from "@/lib/email";
import { getAudit, checkRateLimit, saveLead } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead input" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true, stored: false, sent: false });
  }

  if (!checkRateLimit(`lead:${parsed.data.email}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many signups for this email. Try again later." }, { status: 429 });
  }

  const audit = await getAudit(parsed.data.auditId);
  if (!audit) return NextResponse.json({ error: "Audit not found" }, { status: 404 });

  const storage = await saveLead(parsed.data);
  const origin = request.nextUrl.origin;
  const email = await sendAuditEmail(parsed.data.email, `${origin}/report/${parsed.data.auditId}`, audit.totalMonthlySavings > 500);
  return NextResponse.json({ ok: true, ...storage, ...email });
}
