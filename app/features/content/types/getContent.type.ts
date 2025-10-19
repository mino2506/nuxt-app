import type { z } from "zod";
import { getContentResponseDataSchema } from "~/features/content/schema/getContent.schema";

export type GetContentResponseData = z.infer<
  typeof getContentResponseDataSchema
>;
