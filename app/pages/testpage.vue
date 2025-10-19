<script setup lang="ts">
import { z } from 'zod';
const { data, pending, error, refresh } = await useFetch('http://localhost/api/contents')

const contentSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
const contentArraySchema = contentSchema.array();
type Content = z.infer<typeof contentSchema>;

const parsed = contentArraySchema.safeParse(data.value);
const contents: Content[] = parsed.success ? parsed.data : [];

</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Title</th>
          <th>Content</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in contents" :key="index">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ item.title }}

          </td>
          <td>
            {{ item.content }}

          </td>
          <td>
            {{ item.created_at }}
          </td>
          <td>
            {{ item.updated_at }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
