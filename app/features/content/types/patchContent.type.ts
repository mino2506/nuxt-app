import type { z, ZodError } from "zod";
import {
  patchContentFormSchema,
  patchContentResponseDataSchema,
  patchContentResponseSchema,
} from "~/features/content/schema/patchContent.schema";

// Request types
export type PatchContentForm = z.infer<typeof patchContentFormSchema>;

// Response types
export type PatchContentResponseData = z.infer<
  typeof patchContentResponseDataSchema
>;
export type PatchContentResponse = z.infer<typeof patchContentResponseSchema>;

// Result types
export type SubmitPatchContentSuccess = {
  success: true;
  statusCode: number;
  data: PatchContentResponseData;
};
export type SubmitPatchContentFailure = {
  success: false;
  statusCode: number;
  message: string;
};
export type SubmitPatchContentResult =
  | SubmitPatchContentSuccess
  | SubmitPatchContentFailure;

// Error types
export type ValidationPatchContentError = {
  _tag: "ValidationPatchContentError";
  name: string;
  message: string;
  zodErrors: ZodError<PatchContentForm>;
};
export type NetworkPatchContentError = {
  _tag: "NetworkPatchContentError";
  statusCode: number;
  message: string;
};
export type UnknownPatchContentError = {
  _tag: "UnknownPatchContentError";
  message: string;
};
export type PatchContentError =
  | ValidationPatchContentError
  | NetworkPatchContentError
  | UnknownPatchContentError;
