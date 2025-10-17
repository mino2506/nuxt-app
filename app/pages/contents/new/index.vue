<script setup lang="ts">
import { ref } from "vue"
import { z } from "zod"

const createContentScehma = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be at most 1000 characters"),
})
type CreateContent = z.infer<typeof createContentScehma>

const title = ref("")
const description = ref("")

const errors = ref<string[]>([])
const success = ref(false)

const submitForm = async () => {
  errors.value = []
  success.value = false

  // バリデーション
  const parsed = createContentScehma.safeParse({
    title: title.value,
    content: description.value,
  })

  if (!parsed.success) {
    if (errors.value.length > 0) return
  } else {
    try {
      const res = await $fetch("http://localhost/api/contents", {
        method: "POST",
        body: { title: title.value, content: description.value, },
      })
      success.value = true
    } catch (e) {
      errors.value.push("送信に失敗しました。")
    }
  }


}
</script>

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Create New Content</h1>

    <form @submit.prevent="submitForm">
      <!-- <div class="mb-3">
        <p class="text-sm text-gray-500">Id: {{ item?.id }}</p>
      </div> -->

      <div class="mb-3">
        <label>Title</label>
        <input v-model="title" type="text" class="border w-full p-2 rounded" />
      </div>

      <div class="mb-3">
        <label>Description</label>
        <textarea v-model="description" class="border w-full p-2 rounded"></textarea>
      </div>

      <div class="flex justify-center">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </form>

    <div v-if="errors.length" class="text-red-600 mt-3">
      <ul>
        <li v-for="err in errors" :key="err">{{ err }}</li>
      </ul>
    </div>

    <div v-if="success" class="text-green-600 mt-3">
      送信が完了しました。
    </div>
  </div>
</template>
