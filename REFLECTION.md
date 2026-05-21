# Reflection

## 1. The hardest bug you hit this week, and how you debugged it

The most challenging bug encountered during development was a React hydration mismatch error between the server-rendered HTML and client-rendered HTML. Because we wanted the spend input form state to persist across page reloads, we originally attempted to initialize the `teamSize`, `useCase`, and `tools` states by directly reading from `window.localStorage` inside the `useState` initializers. However, during Next.js server-side rendering, `window` is undefined. We first attempted to check `typeof window !== "undefined"` in the initializer, which prevented crash failures but resulted in a hydration mismatch because the server rendered the default form while the client hydrated the UI with localStorage data immediately on mount.

To debug this, I formulated the hypothesis that the server and client initial HTML structures must match exactly on first render, and any client-specific states must be loaded only after mounting. We set up a two-step mounting approach: rendering the static default state on first render, and then executing a `useEffect` mount hook that retrieves values from `window.localStorage` and updates the React state variables. This successfully eliminated the hydration warning. We also realized that during the rapid state changes when a user types, we should throttle localStorage writes, so we coupled the update cycle inside a debounced hook to prevent browser lag. This systematic debugging process ensured that the page is both fast and hydration-compliant.

## 2. A decision you reversed mid-week, and what made you reverse it

Mid-week, I reversed the decision to use the Groq LLM to calculate the audit recommendations and savings numbers. Initially, I thought a LLM-based audit engine could handle complex plan comparisons more flexibly by parsing the input, reading a prompt with the pricing database, and writing recommendations. However, during early test cases, I observed that the model would occasionally hallucinate small pricing discrepancies or suggest vendor downgrades that violated official pricing minimums (e.g., recommending a Claude Team plan for a 2-person team without accounting for the 5-seat minimum billing limit).

A financial decision-maker or VP of Finance reading the report expects absolute accuracy and math traceability. If the numbers do not add up, the tool loses all credibility, which defeats the lead-generation goal. I reversed the architecture to use a fully deterministic, rule-based audit engine written in TypeScript. We moved the LLM to the periphery: it is used exclusively to generate a personalized prose summary of the deterministic findings. This hybrid approach ensures that the math is 100% accurate, testable via unit tests, and defensible, while still giving the user a tailored, human-friendly summary.

## 3. What you would build in week 2 if you had it

If given a second week of development, I would prioritize the following three features to expand the tool's capabilities:

1. **Automated SSO and API Integrations:** Manual spend input works for an MVP, but it introduces friction. I would build OAuth integrations for Google Workspace, Okta, and major AI vendors (Cursor, OpenAI, Anthropic). This would allow engineering managers to automatically pull active seat allocations and API usage data, detecting idle accounts and duplicate licenses without manual spreadsheets.
2. **Dynamic Pricing API Tracker:** AI tool pricing changes frequently. I would build a background worker that scrapes official pricing pages weekly or integrates with a G2/Gartner API. This would update the database dynamically so that recommendations always remain current without code refactoring.
3. **Advanced Team Productivity Multipliers:** Rather than analyzing costs in isolation, I would integrate productivity benchmarks. For example, if a team is spending $500/month on Cursor, the tool could calculate the hours saved based on industry developer velocity metrics, displaying a "ROI multiplier" alongside the direct savings.

## 4. How you used AI tools

I used AI assistants to scaffold the responsive Tailwind grid layout and to generate the boilerplate files for unit testing. AI was highly effective at producing clean, accessible markup structures and writing baseline mock data. 

However, I caught one specific wrong suggestion: the assistant recommended using a standard HTML anchor tag (`<a>`) inside our server-rendered pages to navigate back to the home route. While this works in traditional HTML, it triggers a Next.js build-time lint error because anchor tags bypass client-side routing, forcing a full page reload and losing client state. I caught this during our production build verification phase (`npm run build`). I corrected the suggestion by replacing the anchor tags with the native Next.js `<Link>` component from `next/link`, which preserves the Single Page Application state and resolves the ESLint build blockers.

## 5. Self-rating

- **Discipline (9/10):** Maintained consistent commit habits on distinct calendar days, updating the DEVLOG.md continuously and verifying the build at each milestone.
- **Code Quality (9/10):** Leveraged TypeScript types, Zod validation schemas, and rate-limiting middleware to ensure robust, secure backend and frontend code.
- **Design Sense (9/10):** Integrated modern typography, subtle layout grids, gradient highlights, and copy-state feedback indicators to deliver a highly professional visual experience.
- **Problem Solving (9/10):** Solved the database connectivity and honeypot validation flows efficiently, keeping the core audit logic clean and maintainable.
- **Entrepreneurial Thinking (10/10):** Focused on the lead-generation funnel by designing high-savings CTAs that lead directly to a Credex consultation path.
