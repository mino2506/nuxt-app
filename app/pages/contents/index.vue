<script setup lang="ts">
import { contentArraySchema, type Contents } from "~/core/schema/contents/contents.dto";

const { data, pending, error, refresh } = await useFetch('http://localhost/api/contents')

const parsed = contentArraySchema.safeParse(data.value);
const contents: Contents = parsed.success ? parsed.data.sort((c, p) => c.updated_at > p.updated_at ? -1 : 1) : [];
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">
      Contents List
    </h2>
    <div v-if="pending" class="mb-4 text-blue-400">Loading...</div>
    <div v-else-if="error" class="mb-4 text-red-700">Error: {{ error.message }}</div>
    <div v-else>
      <ul v-for="item in contents" :key="item.id" class="mb-4 p-4 list-disc border rounded">
        <NuxtLink :to="{ name: 'contents-id', params: { id: item.id } }">
          <div class="flex-row">
            <div class="text-sm text-gray-500 mb-1">Id: {{ item.id }}</div>
            <div class="ml-4">
              <li class="m-1 p-3 font-bold">
                <div>
                  {{ item.title }}
                </div>
              </li>
            </div>
            <div class="flex justify-end space-x-2">
              <div class="text-sm text-gray-500">Created at: {{ item.created_at }}</div>
              <div class="text-sm text-gray-500">Updated at: {{ item.updated_at }}</div>
            </div>
          </div>
        </NuxtLink>
      </ul>
    </div>
  </div>
</template>