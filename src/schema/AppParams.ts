import z from 'zod';

export const AppParamsSchema = z.object({
  state: z.record(z.string(), z.any()).default({})
});

export type AppParamsInput = z.input<typeof AppParamsSchema>;
