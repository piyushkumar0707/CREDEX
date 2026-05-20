import { notFound } from "next/navigation";
import { getAudit } from "@/lib/store";
import { ResultsView } from "@/components/results-view";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return {};
  const title = `$${audit.totalMonthlySavings}/mo AI savings found`;
  const description = `A privacy-safe AI spend audit for a ${audit.teamSize}-person ${audit.useCase} team.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) notFound();
  return <ResultsView result={{ ...audit, publicUrl: `/report/${id}` }} publicMode />;
}
