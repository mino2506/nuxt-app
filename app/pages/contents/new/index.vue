<script setup lang="ts">
import { usePostContent } from "#imports"
import { submitPostContent } from "~/features/content/api/createContent";

const { form, error, pending, success, submit } =
  usePostContent((data) => submitPostContent(data));
</script>

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Create New Content</h1>

    <form @submit.prevent="submit">
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
      <p>Content created successfully!</p>
    </div>
  </div>
</template>
