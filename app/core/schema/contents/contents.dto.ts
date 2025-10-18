import * as z from "zod";

export const contentSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export const contentArraySchema = contentSchema.array();

export const contentResponseSchema = z.object({
  data: contentSchema,
});
export const contentArrayResponseSchema = z.object({
  data: contentArraySchema,
});

export type Content = z.infer<typeof contentSchema>;
export type Contents = z.infer<typeof contentArraySchema>;
