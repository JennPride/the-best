import { z } from "zod";

export const HealthResponse = z.object({
  status: z.string(),
});

export type HealthResponse = z.infer<typeof HealthResponse>;
