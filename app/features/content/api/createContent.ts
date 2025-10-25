import type {
  PostContentForm,
  SubmitPostContentResult,
} from "~/features/content/types/postContent.type";
import { isFetchError } from "~/utils/isFetchError";
import { postContentResponseSchema } from "~/features/content/schema/postContent.schema";

// Function to submit the post content
export async function submitPostContent(
  form: PostContentForm
): Promise<SubmitPostContentResult> {
  try {
    const response = await $fetch.raw("http://localhost/api/contents", {
      method: "POST",
      body: form,
    });
    if (response.status !== 201) {
      return {
        success: false,
        statusCode: response.status,
        message: "Failed to create content",
      };
    }
    if (!response._data) {
      return {
        success: false,
        statusCode: 500,
        message: "No data returned from server",
      };
    }

    const parsed = postContentResponseSchema.safeParse(response._data);
    if (!parsed.success) {
      return {
        success: false,
        statusCode: 500,
        message: "Invalid response format from server",
      };
    }

    return {
      success: true,
      statusCode: response.status,
      data: parsed.data.data,
    };
  } catch (e) {
    if (!isFetchError(e)) {
      return {
        success: false,
        statusCode: 500,
        message: "An unknown error occurred",
      };
    }
    const fe = e;
    const status = fe?.response?.status ?? 500;
    const serverMessage =
      (fe?.response?._data as any)?.message ??
      (fe?.data as any)?.message ??
      fe?.message ??
      "Unknown error";

    return {
      success: false,
      statusCode: status,
      message: String(serverMessage),
    };
  }
}
