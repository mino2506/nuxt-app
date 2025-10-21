<script setup lang="ts">
import { usePostContent } from "#imports"
import { submitPostCreateContent } from "~/features/content/api/createContent";
import { getContentResponseSchema } from "~/features/content/schema/getContent.schema";
import type { GetContentResponseData } from "~/features/content/types/getContent.type";
import { useGetContent } from "~/composables/useGetContent"

const route = useRoute()
const { fetchData, fetchPending, fetchError } = await useGetContent(route.params.id as string);

const { form, error, pending, success, submit } = usePostContent((data) => submitPostCreateContent(data));

if (fetchPending.value === false) {
  form.value.title = fetchData.value?.title || "";
  form.value.content = fetchData.value?.content || "";
}

</script>

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Create New Content</h1>

    <form @submit.prevent="submit">
      <div class="mb-3">
        <p class="text-sm text-gray-500">Id: {{ fetchData?.id }}</p>
      </div>

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
      <p>{{ error._tag }}</p>
    </div>

    <div v-if="success" class="text-green-600 mt-3">
      <p>Content edited successfully!</p>
    </div>
  </div>
</template>
