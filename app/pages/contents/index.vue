<script setup lang="ts">
import { contentArraySchema, type Contents } from "~/core/schema/contents/contents.dto";

const { data, pending, error, refresh } = await useFetch('http://localhost/api/contents')

const parsed = contentArraySchema.safeParse(data.value);
const contents: Contents = parsed.success ? parsed.data : [];
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
        <li class="m-1 p-3 font-bold">
          <div>
            <NuxtLink :to="{ name: 'contents-id', params: { id: item.id } }">{{ item.title }}</NuxtLink>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>