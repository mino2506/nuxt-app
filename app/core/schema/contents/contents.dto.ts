import * as z from 'zod';

export const contentSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export const contentArraySchema = contentSchema.array();

export type Content = z.infer<typeof contentSchema>;
export type Contents = z.infer<typeof contentArraySchema>;