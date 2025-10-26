<script setup lang="ts">
import { useGetContents } from "~/composables/useGetContents";

const { data, pending, error, refresh } = await useGetContents();
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">
      Contents List
    </h2>
    <div v-if="pending" class="mb-4 text-blue-400">Loading...</div>
    <div v-else-if="error" class="mb-4 text-red-700">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <ul v-for="item in data" :key="item.id" class="mb-4 p-4 list-disc border rounded">
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
              <div class="text-sm text-gray-500">Created at: {{ item.createdAt }}</div>
              <div class="text-sm text-gray-500">Updated at: {{ item.updatedAt }}</div>
            </div>
          </div>
        </NuxtLink>
      </ul>
    </div>
  </div>
</template>