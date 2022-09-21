import z from 'zod';

const AppMetadataSchema = z.object({
  title: z.string().default('Eviate'),
  description: z.string().default(''),
  version: z.string().default('1.0.0')
});

// TODO: Complete this
const AppOpenAPISchema = z.object({});

export const AppParamsSchema = z.object({
  metadata: AppMetadataSchema.default({}),
  state: z.record(z.string(), z.any()).default({})
});

export type AppParamsInput = z.input<typeof AppParamsSchema>;
export type AppMetadata = z.output<typeof AppMetadataSchema>;
