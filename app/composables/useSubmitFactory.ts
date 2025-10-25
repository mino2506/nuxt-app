import type { ZodType } from "zod";
import { ref, reactive, toRefs } from "vue";
import type {
  SubmitValidationError,
  SubmitNetworkError,
  SubmitUnknownError,
  SubmitError,
  SubmitResult,
} from "~/composables/useSubmitFactory.type";

export interface SubmitCore<Form, Data> {
  form: Ref<Form | null>;
  data: Ref<Data | null>;
  error: Ref<SubmitError<Form> | null>;
  pending: Ref<boolean>;
  success: Ref<boolean>;
  submit: () => Promise<SubmitResult<Data>>;
}

/**
 * Factory to build a submit handler with schema validation and a tiny state machine.
 *
 * @typeParam Form - Raw form shape before validation.
 * @typeParam Data - Success payload from requestFn.
 *
 * @param schema - Zod schema used to validate `form` before submitting.
 * @param requestFn - Async function that performs the request. Must return `SubmitResult<Data>`.
 *
 * @returns { form, data, error, pending, success, submit }
 *
 * @remarks
 * - Concurrency: multiple clicks are de-duped (`pending` 中は 409 を返す)。
 * - State machine events:
 *   SubmitStart → (ValidationError | NetworkError | UnknownError | Success) → SubmitFinish
 * - Invariant: `SubmitFinish` は必ず finally で dispatch され、`pending` は必ず false に戻る。
 * - Separation: フォーム値は `form`、結果は `data` に格納し、副作用は `submit()` に集約。
 */
export function useSubmitFactory<Form, Data>(
  schema: ZodType<Form, Form>,
  requestFn: (form: Form) => Promise<SubmitResult<Data>>
): SubmitCore<Form, Data> {
  const form: Ref<Form | null> = ref(null); // TODO: 初期値の型安全性の確保
  const data: Ref<Data | null> = ref(null);

  // 状態管理
  interface State {
    error: SubmitError<Form> | null;
    pending: boolean;
    success: boolean;
  }

  type Event =
    | { type: "SubmitStart" }
    | { type: "SubmitValidationError"; error: SubmitValidationError<Form> }
    | { type: "SubmitNetworkError"; error: SubmitNetworkError }
    | { type: "SubmitUnknownError"; error: SubmitUnknownError }
    | { type: "SubmitSuccess"; payload: Data }
    | { type: "SubmitFinish" };

  const state: State = reactive({
    error: null,
    pending: false,
    success: false,
  });

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
      // 防二重送信
      if (state.pending)
        return {
          success: false,
          statusCode: 409,
          message: "Already submitting",
        };

      dispatch({ type: "SubmitStart" });

      // Zod バリデーション
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

      // リクエスト送信
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

      // 成功時処理
      data.value = res.data;
      dispatch({ type: "SubmitSuccess", payload: res.data });
      return res;
    } catch (e) {
      // 不明なエラー処理
      const error = {
        _tag: "SubmitUnknownError" as const,
        message: "An unknown error occurred during submission",
      } satisfies SubmitUnknownError;

      dispatch({ type: "SubmitUnknownError", error });
      return { success: false, statusCode: 500, message: error.message };
    } finally {
      // 常に pending をリセット
      dispatch({ type: "SubmitFinish" });
    }
  };

  return { form, data, ...toRefs(state), submit };
}
