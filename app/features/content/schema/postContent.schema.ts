import { z } from "zod";

// Zod schema for post content form
export const postContentFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be at most 1000 characters"),
});

// Response schema for post content
export const postContentResponseDataSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export const postContentResponseSchema = z.object({
  data: postContentResponseDataSchema,
});
