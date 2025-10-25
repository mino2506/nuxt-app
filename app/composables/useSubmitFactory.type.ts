import type { ZodError } from "zod";

// Result types
export type SubmitSuccess<Data> = {
  success: true;
  statusCode: number;
  data: Data;
};
export type SubmitFailure = {
  success: false;
  statusCode: number;
  message: string;
};
export type SubmitResult<Data> = SubmitSuccess<Data> | SubmitFailure;

// Error types
export type SubmitValidationError<Form> = {
  _tag: "SubmitValidationError";
  name: string;
  message: string;
  zodErrors: ZodError<Form>;
};
export type SubmitNetworkError = {
  _tag: "SubmitNetworkError";
  statusCode: number;
  message: string;
};
export type SubmitUnknownError = {
  _tag: "SubmitUnknownError";
  message: string;
};
export type SubmitError<Form> =
  | SubmitValidationError<Form>
  | SubmitNetworkError
  | SubmitUnknownError;
