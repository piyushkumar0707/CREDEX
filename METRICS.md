# Metrics

The North Star metric is qualified savings discovered per week. This fits the product better than DAU because AI spend audits are occasional, not daily habits. A week with fewer users but more credible savings is more valuable to Credex than a week with many shallow visits.

Three input metrics drive that North Star. First, completed audits: the number of visitors who enter enough data to see a report. Second, high-savings rate: the percentage of completed audits with more than $500/month in potential savings. Third, consultation intent: the percentage of high-savings users who submit email and request or accept follow-up.

The first instrumentation should track landing-page view, audit started, tool row added, audit completed, lead captured, public report copied, and consultation CTA clicked. Each event should include anonymous savings band, team-size band, and use case, but never email or company name in analytics payloads.

A pivot trigger would be fewer than 5% of completed audits showing $500/month or more in credible savings after 300 completed audits from the target audience. That would mean the tool is either attracting the wrong users or Credex’s lead-gen wedge needs to focus on API spend and credit procurement rather than broad SaaS plan audits.
