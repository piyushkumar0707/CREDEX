# Prompts

## Audit Summary Prompt

```text
Write a direct ~100-word AI spend audit summary for a {teamSize}-person startup using AI primarily for {useCase}. Current monthly spend is ${totalMonthlySpend}; estimated monthly savings is ${totalMonthlySavings}. Findings: {tool findings}. Be specific, honest, and do not invent vendors or guarantees.
```

## Why This Prompt

The audit math is deterministic, so the LLM only turns already-computed findings into concise executive prose. The prompt includes team size, use case, current spend, savings, and line-item findings to prevent generic advice.

## What Did Not Work

The first idea was to ask the model to identify overspend directly. I rejected that because pricing and finance logic need traceable rules, not probabilistic recommendations.
