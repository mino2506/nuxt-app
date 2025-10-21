import type { ZodType } from "zod";
import { ref, reactive, toRefs } from "vue";
import type {
  SubmitValidationError,
  SubmitNetworkError,
  SubmitUnknownError,
  SubmitError,
  SubmitResult,
} from "~/composables/useFormSubmitFactory.type";

// Composable function to handle post content submission
export function useFormSubmitFactory<Form, Data>(
  schema: ZodType<Form, unknown>,
  requestFn: (form: Form) => Promise<SubmitResult<Data>>
) {
  const form = ref<Form>({} as Form);
  const data = ref<Data | null>(null);
  const state = reactive<State>({
    error: null,
    pending: false,
    success: false,
  });

  type State = {
    error: SubmitError<Form> | null;
    pending: boolean;
    success: boolean;
  };

  type Event =
    | { type: "SubmitStart" }
    | { type: "SubmitValidationError"; error: SubmitValidationError<Form> }
    | { type: "SubmitNetworkError"; error: SubmitNetworkError }
    | { type: "SubmitUnknownError"; error: SubmitUnknownError }
    | { type: "SubmitSuccess"; payload: Data }
    | { type: "SubmitFinish" };

  const reduce = (s: State, ev: Event): State => {
    switch (ev.type) {
      case "SubmitStart":
        return { ...s, pending: true, success: false, error: null };
      case "SubmitValidationError":
        return { ...s, error: ev.error, success: false };
      case "SubmitNetworkError":
        return { ...s, error: ev.error, success: false };
      case "SubmitUnknownError":
        return { ...s, error: ev.error, success: false };
      case "SubmitSuccess":
        return { ...s, success: true, error: null };
      case "SubmitFinish":
        return { ...s, pending: false };
    }
  };

  const dispatch = (ev: Event) => Object.assign(state, reduce(state, ev));

  const submit = async (): Promise<SubmitResult<Data>> => {
    try {
      if (state.pending)
        return {
          success: false,
          statusCode: 409,
          message: "Already submitting",
        };

      dispatch({ type: "SubmitStart" });

      const parsed = schema.safeParse(form.value);
      if (!parsed.success) {
        const error = {
          _tag: "SubmitValidationError" as const,
          name: parsed.error.name,
          message: parsed.error.message,
          zodErrors: parsed.error,
        } satisfies SubmitValidationError<Form>;

        dispatch({ type: "SubmitValidationError", error });
        return {
          success: false,
          statusCode: 422,
          message: "Submit validation error",
        };
      }

      const res = await requestFn(parsed.data);
      if (!res.success) {
        const error = {
          _tag: "SubmitNetworkError" as const,
          statusCode: res.statusCode,
          message: res.message,
        } satisfies SubmitNetworkError;

        dispatch({ type: "SubmitNetworkError", error });
        return res;
      }

      data.value = res.data;
      dispatch({ type: "SubmitSuccess", payload: res.data });
      return res;
    } catch (e) {
      const error = {
        _tag: "SubmitUnknownError" as const,
        message: "An unknown error occurred during submission",
      } satisfies SubmitUnknownError;

      dispatch({ type: "SubmitUnknownError", error });
      return { success: false, statusCode: 500, message: error.message };
    } finally {
      dispatch({ type: "SubmitFinish" });
    }
  };

  return { form, data, ...toRefs(state), submit };
}
