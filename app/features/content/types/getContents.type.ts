import type { z } from "zod";
import { getContentArrayResponseDataSchema } from "~/features/content/schema/getContents.schema";

export type ContentArrayResponseData = z.infer<
  typeof getContentArrayResponseDataSchema
>;
