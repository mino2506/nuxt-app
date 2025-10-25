import { reactive, toRefs } from "vue";
import { postContentFormSchema } from "~/features/content/schema/postContent.schema";
import type {
  PostContentForm,
  ValidationPostContentError,
  NetworkPostContentError,
  UnknownPostContentError,
  PostContentError,
  PostContentResponseData,
  SubmitPostContentResult,
} from "~/features/content/types/postContent.type";

type State = {
  form: PostContentForm;
  error: PostContentError | null;
  data: PostContentResponseData | null;
  pending: boolean;
  success: boolean;
};
type Event =
  | { type: "Start" }
  | { type: "ValidationError"; error: ValidationPostContentError }
  | { type: "NetworkError"; error: NetworkPostContentError }
  | { type: "UnknownError"; error: UnknownPostContentError }
  | { type: "Success"; data: PostContentResponseData }
  | { type: "Finish" };
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

// Composable function to handle post content submission
export function usePostContent(
  submitPost: (data: PostContentForm) => Promise<SubmitPostContentResult>
) {
  const state = reactive<State>({
    form: { title: "", content: "" },
    error: null,
    data: null,
    pending: false,
    success: false,
  });

  const dispatch = (ev: Event) => Object.assign(state, reduce(state, ev));

  const submit = async (): Promise<SubmitPostContentResult> => {
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
