import z from 'zod';

export const AppListenParams = z.object({
  hostname: z.string().default('127.0.0.1'),
  port: z.number().default(4000),
  debug: z.boolean().default(false)
});

export type AppListenParamsInput = z.input<typeof AppListenParams>;
