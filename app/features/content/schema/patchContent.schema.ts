import { z } from "zod";

// Zod schema for patch content form
export const patchContentFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be at most 100 characters")
      .optional(),
    content: z
      .string()
      .min(1, "Content is required")
      .max(1000, "Content must be at most 1000 characters")
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one of title or content must be provided",
  });

// Response schema for patch content
export const patchContentResponseDataSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export const patchContentResponseSchema = z.object({
  data: patchContentResponseDataSchema,
});
