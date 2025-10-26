import { z } from "zod";
import { getContentResponseDataSchema } from "~/features/content/schema/getContent.schema";

export const getContentArrayResponseDataSchema =
  getContentResponseDataSchema.array();
export const getContentArrayResponseSchema = z.object({
  data: getContentArrayResponseDataSchema,
});
