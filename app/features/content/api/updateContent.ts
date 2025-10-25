import type {
  PatchContentForm,
  SubmitPatchContentResult,
} from "~/features/content/types/patchContent.type";
import { isFetchError } from "~/utils/isFetchError";
import { patchContentResponseSchema } from "~/features/content/schema/patchContent.schema";

// Function to submit the post content
export async function submitPatchContent(
  id: string | number,
  form: PatchContentForm
): Promise<SubmitPatchContentResult> {
  try {
    const response = await $fetch.raw(`http://localhost/api/contents/${id}`, {
      method: "PATCH",
      body: form,
    });
    if (response.status !== 200) {
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

    const parsedResponse = patchContentResponseSchema.safeParse(response._data);
    if (!parsedResponse.success) {
      return {
        success: false,
        statusCode: 500,
        message: "Invalid response format from server",
      };
    }

    return {
      success: true,
      statusCode: response.status,
      data: parsedResponse.data.data,
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
