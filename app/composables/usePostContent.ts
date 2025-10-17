import { reactive, ref } from "vue";
import { z, ZodError } from "zod";

// Define error types
type ValidationPostContentError = {
  _tag: "ValidationPostError";
  name: string;
  message: string;
  zodErrors: ZodError;
};

type NetworkPostContentError = {
  _tag: "NetworkPostContentError";
  statusCode: number;
  message: string;
};

type PostContentError = ValidationPostContentError | NetworkPostContentError;

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

type PostContentForm = z.infer<typeof postContentSchema>;

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
type SubmitPostError = { success: false; statusCode: number; message: string };
type SubmitPostResult = SubmitPostSuccess | SubmitPostError;

// Composable function to handle post content submission
export function usePostContent(
  submitPost: (data: PostContentForm) => Promise<SubmitPostResult>
) {
  const form = reactive<PostContentForm>({
    title: "",
    content: "",
  });
  const errors = ref<PostContentError | null>(null);
  const pending = ref(false);

  errors.value = null;
  const submit = async () => {
    const parsed = postContentSchema.safeParse(form);
    if (!parsed.success) {
      errors.value = {
        _tag: "ValidationPostError",
        name: parsed.error.name,
        message: parsed.error.message,
        zodErrors: parsed.error,
      };
      return;
    }

    pending.value = true;
    const response = await submitPost(parsed.data);

    if (!response.success) {
      errors.value = {
        _tag: "NetworkPostContentError",
        statusCode: response.statusCode,
        message: response.message,
      };
    }
    pending.value = false;
  };

  return { form, errors, pending, submit };
}
