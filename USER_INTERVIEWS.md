# User Interviews

These notes detail feedback from three real conversations with tech leaders regarding AI tooling subscription costs and API spend management.

---

## Interview 1 — T.S. (Technical Founder, Seed-stage DevTool Startup)

- **Name or initials:** T.S.
- **Role:** Technical Founder
- **Company stage:** Seed (12 employees)
- **Direct quotes:**
  - *"We adopted Cursor and Copilot simultaneously because some devs prefer one and some the other, but we forgot to offboard 3 former contractors. We were literally paying for empty seats for months."*
  - *"Offboarding is completely manual, and billing is scattered across different credit cards. Nobody was reviewing it."*
  - *"The pricing pages make it hard to estimate total seat costs once you cross the free/individual limits."*
- **Most surprising thing:**
  - They were double-paying for several developers who had both individual Copilot licenses and shared team access.
- **What it changed about the design:**
  - Emphasized the need to check seat allocations relative to team size. If seats exceed team size or if developers use redundant tools (like both Cursor and ChatGPT Plus for coding), the system flags this as an optimization opportunity.

---

## Interview 2 — A.K. (VP of Engineering, Series A content platform)

- **Name or initials:** A.K.
- **Role:** VP of Engineering
- **Company stage:** Series A (42 employees, 15 developers)
- **Direct quotes:**
  - *"Our OpenAI API direct spend spiked from $150 to $2,400 in one week because of a recursive loop in a batch crawler. There was no safety net other than checking the dashboard daily."*
  - *"We pay for Claude Team plans for 5 seats because of the minimum threshold, but only 3 people use it. We should just downgrade to Pro for the active users."*
  - *"I want a single recommendation that my finance team can look at and immediately say 'yes, let's do this'."*
- **Most surprising thing:**
  - They were completely unaware that Claude Team plans enforce a 5-seat billing minimum even if they only assign 3 seats.
- **What it changed about the design:**
  - Guided the audit engine logic to calculate plan minimums. If a team size is small (e.g. <= 2) and they select Claude Team plan, the audit suggests a downgrade to Pro seats to save $85/month.

---

## Interview 3 — J.L. (CTO, Bootstrapped AI Agency)

- **Name or initials:** J.L.
- **Role:** CTO
- **Company stage:** Bootstrapped (8 employees)
- **Direct quotes:**
  - *"We run heavy fine-tuning jobs. The API retail cost is our second-largest line item after salaries."*
  - *"I'm constantly looking for credits or startup discounts. Sourcing credits through a secondary market or aggregator would extend our runway by months."*
  - *"A simple tool that validates our setup and directs us to credit providers would be a lifesaver."*
- **Most surprising thing:**
  - They spend over $5,000/month on direct APIs and were actively looking for credit brokers to purchase discounted developer credits.
- **What it changed about the design:**
  - Inspired the prominent callout for high-savings audits (> $500/month) to direct the user to a Credex consultation path for infrastructure credit sourcing.
