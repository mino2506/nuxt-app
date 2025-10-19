<script setup lang="ts">
import { usePostContent } from "#imports"
import type { PostContentForm, SubmitPostCreateContentResult } from "~/features/content/types/postContent.type";
import { isFetchError } from "~/utils/isFetchError";
import { postContentResponseSchema } from "~/features/content/schema/postContent.schema";

// Function to submit the post content
async function submitPost(formData: PostContentForm): Promise<SubmitPostCreateContentResult> {
  try {
    const response = await $fetch.raw("http://localhost/api/contents", {
      method: "POST",
      body: formData,
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
      data: parsed.data.data
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
      (fe?.message ?? "Unknown error");

    return { success: false, statusCode: status, message: String(serverMessage) };
  }
}

const { form, error, pending, success, submit } = usePostContent((data) => submitPost(data));
</script>

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Create New Content</h1>

    <form @submit.prevent="submit">
      <!-- <div class="mb-3">
        <p class="text-sm text-gray-500">Id: {{ item?.id }}</p>
      </div> -->

      <div class="mb-3">
        <label>Title</label>
        <input v-model="form.title" type="text" class="border w-full p-2 rounded" />
      </div>

      <div class="mb-3">
        <label>Description</label>
        <textarea v-model="form.content" class="border w-full p-2 rounded"></textarea>
      </div>

      <div class="flex justify-center">
        <button type="submit" :disabled="pending" class="
          bg-blue-500 text-white px-4 py-2 rounded 
          hover:bg-blue-600 hover:cursor-pointer 
          disabled:bg-gray-400 disabled:cursor-not-allowed
          ">
          Submit
        </button>
      </div>
    </form>

    <div v-if="error !== null" class="text-red-600 mt-3">
      <pre>{{ JSON.stringify(error._tag) }}</pre>
    </div>

    <div v-if="success" class="text-green-600 mt-3">
      送信が完了しました。
    </div>
  </div>
</template>
