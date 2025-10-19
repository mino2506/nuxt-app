import { z } from "zod";

export const getContentResponseDataSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export const getContentResponseSchema = z.object({
  data: getContentResponseDataSchema,
});
