import { reactive, toRefs } from "vue";
import { z, ZodError } from "zod";

// Define Zod schema for post content
const postContentFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be at most 1000 characters"),
});
export type PostContentForm = z.infer<typeof postContentFormSchema>;

// Define error types
type ValidationPostContentError = {
  _tag: "ValidationPostContentError";
  name: string;
  message: string;
  zodErrors: ZodError<PostContentForm>;
};
type NetworkPostContentError = {
  _tag: "NetworkPostContentError";
  statusCode: number;
  message: string;
};
type UnknownPostContentError = {
  _tag: "UnknownPostContentError";
  message: string;
};
type PostContentError =
  | ValidationPostContentError
  | NetworkPostContentError
  | UnknownPostContentError;

// Define types for submitPost function result
type SubmitPostResponseData = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type SubmitPostSuccess = {
  success: true;
  statusCode: number;
  data: SubmitPostResponseData;
};
type SubmitPostFailure = {
  success: false;
  statusCode: number;
  message: string;
};
export type SubmitPostResult = SubmitPostSuccess | SubmitPostFailure;

// Composable function to handle post content submission
export function usePostContent(
  submitPost: (data: PostContentForm) => Promise<SubmitPostResult>
) {
  type State = {
    form: PostContentForm;
    error: PostContentError | null;
    data: SubmitPostResponseData | null;
    pending: boolean;
    success: boolean;
  };
  type Event =
    | { type: "Start" }
    | { type: "ValidationError"; error: ValidationPostContentError }
    | { type: "NetworkError"; error: NetworkPostContentError }
    | { type: "UnknownError"; error: UnknownPostContentError }
    | { type: "Success"; data: SubmitPostResponseData }
    | { type: "Finish" };

  const state = reactive<State>({
    form: { title: "", content: "" },
    error: null,
    data: null,
    pending: false,
    success: false,
  });

  const reduce = (s: State, ev: Event): State => {
    switch (ev.type) {
      case "Start":
        return { ...s, pending: true, success: false, error: null, data: null };
      case "ValidationError":
        return { ...s, error: ev.error, success: false };
      case "NetworkError":
        return { ...s, error: ev.error, success: false };
      case "UnknownError":
        return { ...s, error: ev.error, success: false };
      case "Success":
        return { ...s, success: true, error: null, data: ev.data };
      case "Finish":
        return { ...s, pending: false };
    }
  };

  const dispatch = (ev: Event) => Object.assign(state, reduce(state, ev));

  const submit = async (): Promise<SubmitPostResult> => {
    try {
      if (state.pending)
        return {
          success: false,
          statusCode: 409,
          message: "Already submitting",
        };

      dispatch({ type: "Start" });

      const parsed = postContentFormSchema.safeParse(state.form);
      if (!parsed.success) {
        const error = {
          _tag: "ValidationPostContentError" as const,
          name: parsed.error.name,
          message: parsed.error.message,
          zodErrors: parsed.error,
        } satisfies ValidationPostContentError;

        dispatch({ type: "ValidationError", error });
        return { success: false, statusCode: 422, message: "Validation error" };
      }

      const response = await submitPost(parsed.data);
      if (!response.success) {
        const error = {
          _tag: "NetworkPostContentError" as const,
          statusCode: response.statusCode,
          message: response.message,
        } satisfies NetworkPostContentError;

        dispatch({ type: "NetworkError", error });
        return response;
      }

      dispatch({ type: "Success", data: response.data });
      return response;
    } catch (e) {
      const error = {
        _tag: "UnknownPostContentError" as const,
        message: "An unknown error occurred during submission",
      } satisfies UnknownPostContentError;

      dispatch({ type: "UnknownError", error });
      return { success: false, statusCode: 500, message: error.message };
    } finally {
      dispatch({ type: "Finish" });
    }
  };

  return { ...toRefs(state), submit };
}
