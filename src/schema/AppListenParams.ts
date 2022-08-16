import z from 'zod';

const AppListenParams = z.object({
  hostname: z.string().default('0.0.0.0'),
  port: z.number().default(4000),
  debug: z.boolean().default(false)
});

export type AppListenParamsInput = z.input<typeof AppListenParams>;
