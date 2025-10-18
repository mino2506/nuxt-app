import { reactive, ref } from "vue";
import { z, ZodError } from "zod";

// Define Zod schema for post content
const postContentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be at most 1000 characters"),
});
export type PostContentForm = z.infer<typeof postContentSchema>;

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
type SubmitPostSuccess = {
  success: true;
  data: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
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
  const form = reactive<PostContentForm>({
    title: "",
    content: "",
  });
  const error = ref<PostContentError | null>(null);
  const pending = ref(false);
  const success = ref(false);

  error.value = null;
  const submit = async () => {
    try {
      error.value = null;
      success.value = false;

      if (pending.value)
        return { success: false, statusCode: 0, message: "Already submitting" };

      const parsed = postContentSchema.safeParse(form);
      if (!parsed.success) {
        error.value = {
          _tag: "ValidationPostContentError" as const,
          name: parsed.error.name,
          message: parsed.error.message,
          zodErrors: parsed.error,
        } satisfies ValidationPostContentError;
        return;
      }

      pending.value = true;

      const response = await submitPost(parsed.data);
      if (!response.success) {
        error.value = {
          _tag: "NetworkPostContentError" as const,
          statusCode: response.statusCode,
          message: response.message,
        } satisfies NetworkPostContentError;

        success.value = false;
      }

      error.value = null;
      success.value = true;
    } catch (e) {
      error.value = {
        _tag: "UnknownPostContentError" as const,
        message: "An unknown error occurred during submission",
      } satisfies UnknownPostContentError;
      success.value = false;
    } finally {
      pending.value = false;
    }
  };

  return { form, error, pending, success, submit };
}
