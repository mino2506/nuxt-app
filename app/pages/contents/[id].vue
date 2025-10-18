<script setup lang="ts">
import { contentResponseSchema, type Content } from "~/core/schema/contents/contents.dto";

const route = useRoute()

const { data, pending, error } = await useFetch(`http://localhost/api/contents/${route.params.id}`)

const parsed = contentResponseSchema.safeParse(data.value);
const item: Content | null = parsed.success ? parsed.data.data : null;

</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div class="flex-row m-4 p-4 border rounded">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-2xl font-bold">{{ item?.title }}</h2>
          <p class="text-sm text-gray-500">Id: {{ item?.id }}</p>
        </div>
        <div class="border-t pt-4">
          <div class="mb-4 h-1 ">
            <p class="mb-4 p-2 bg-gray-300 text-gray-900">{{ item?.content }}</p>
          </div>
          <div class="flex justify-end space-x-2 mx-2">
            <p class="text-sm text-gray-700">Created at: {{ item?.createdAt }}</p>
            <p class="text-sm text-gray-700">Updated at: {{ item?.updatedAt }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center m-4">
    <NuxtLink to="/contents" class="text-blue-500 hover:underline">Back to Contents List</NuxtLink>
  </div>
</template>