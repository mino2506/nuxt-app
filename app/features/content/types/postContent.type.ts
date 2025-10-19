import type { z, ZodError } from "zod";
import {
  postContentResponseDataSchema,
  postContentResponseSchema,
} from "~/features/content/schema/postContent.schema";
import { postContentFormSchema } from "~/features/content/schema/postContent.schema";

// Request types
export type PostContentForm = z.infer<typeof postContentFormSchema>;

// Response types
export type PostContentResponseData = z.infer<
  typeof postContentResponseDataSchema
>;
export type PostContentResponse = z.infer<typeof postContentResponseSchema>;

// Result types
export type SubmitPostCreateContentSuccess = {
  success: true;
  statusCode: number;
  data: PostContentResponseData;
};
export type SubmitPostCreateContentFailure = {
  success: false;
  statusCode: number;
  message: string;
};
export type SubmitPostCreateContentResult =
  | SubmitPostCreateContentSuccess
  | SubmitPostCreateContentFailure;

// Error types
export type ValidationPostContentError = {
  _tag: "ValidationPostContentError";
  name: string;
  message: string;
  zodErrors: ZodError<PostContentForm>;
};
export type NetworkPostContentError = {
  _tag: "NetworkPostContentError";
  statusCode: number;
  message: string;
};
export type UnknownPostContentError = {
  _tag: "UnknownPostContentError";
  message: string;
};
export type PostContentError =
  | ValidationPostContentError
  | NetworkPostContentError
  | UnknownPostContentError;
