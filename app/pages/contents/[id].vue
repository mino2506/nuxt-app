<script setup lang="ts">
import { getContentResponseSchema } from "~/features/content/schema/getContent.schema";;
import type { GetContentResponseData } from "~/features/content/types/getContent.type";
import { useGetContent } from "~/composables/useGetContent";

const route = useRoute()
// const { data, pending, error } = await useFetch(`http://localhost/api/contents/${route.params.id}`)
const { data, pending, error } = useGetContent(route.params.id as string);

// TODO: Toastで表示するようにする
// TODO: Composableにする
async function deleteContent() {
  if (!data) return;

  if (!confirm("本当に削除しますか？")) return;

  if (data.value) {
    const config = useRuntimeConfig();
    const url = `/contents/${data.value.id}`;
    try {
      const response = await $fetch.raw(url, {
        baseURL: config.public.apiBase,
        method: "DELETE",
      });

      if (response.status !== 204) {
        alert("Failed to delete content");
        return;
      }

      alert("Content deleted successfully");

      await navigateTo("/contents");
    } catch (e) {
      alert("An error occurred while deleting the content");
    }
  }
}

</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <div class="flex-row m-4 p-4 border rounded">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-2xl font-bold">{{ data.title }}</h2>
          <p class="text-sm text-gray-500">Id: {{ data.id }}</p>
        </div>
        <div class="border-t pt-4">
          <div class="mb-4 h-1 ">
            <p class="mb-4 p-2 bg-gray-300 text-gray-900">{{ data.content }}</p>
          </div>
          <div class="flex justify-end space-x-2 mx-2">
            <p class="text-sm text-gray-700">Created at: {{ data.createdAt }}</p>
            <p class="text-sm text-gray-700">Updated at: {{ data.updatedAt }}</p>
          </div>
        </div>
      </div>
      <div class="flex justify-center m-4">
        <div class="flex-row space-y-4">
          <div class="flex justify-center">
            <NuxtLink to="/contents" class="
      bg-blue-800 text-white px-4 py-2 rounded 
      hover:bg-blue-400 hover:cursor-pointer
      ">
              Back to Contents List
            </NuxtLink>
          </div>
          <div class="flex justify-center">
            <NuxtLink :to="`/contents/edit/${data.id}`" class="
      bg-blue-800 text-white px-4 py-2 rounded 
      hover:bg-blue-400 hover:cursor-pointer
      ">
              Edit
            </NuxtLink>
          </div>
          <div class="flex justify-center">
            <button @click="deleteContent" class="
      bg-red-800 text-white px-4 py-2 rounded 
      hover:bg-red-400 hover:cursor-pointer
    ">
              Delete
            </button>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>