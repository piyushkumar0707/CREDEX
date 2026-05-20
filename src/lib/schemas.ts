import { z } from "zod";

export const auditInputSchema = z.object({
  teamSize: z.coerce.number().int().min(1).max(10000),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z
    .array(
      z.object({
        tool: z.enum(["cursor", "github-copilot", "claude", "chatgpt", "anthropic-api", "openai-api", "gemini", "windsurf"]),
        plan: z.string().min(1),
        monthlySpend: z.coerce.number().min(0).max(10000000),
        seats: z.coerce.number().int().min(1).max(10000)
      })
    )
    .min(1)
});

export const leadSchema = z.object({
  auditId: z.string().min(6),
  email: z.string().email(),
  companyName: z.string().max(120).optional().or(z.literal("")),
  role: z.string().max(120).optional().or(z.literal("")),
  teamSize: z.coerce.number().int().min(1).max(10000).optional(),
  website: z.string().max(0).optional()
});
