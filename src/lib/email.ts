import { Resend } from "resend";

export async function sendAuditEmail(email: string, auditUrl: string, highSavings: boolean) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return { sent: false };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: highSavings ? "Your AI spend audit found a Credex-sized opportunity" : "Your AI spend audit is ready",
    html: `<p>Your AI spend audit is ready: <a href="${auditUrl}">${auditUrl}</a></p><p>${highSavings ? "Your report shows enough potential savings that a Credex consultation is worth considering." : "Your stack looks relatively disciplined. We will notify you when new optimizations apply."}</p>`
  });
  return { sent: true };
}
