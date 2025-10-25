<script setup lang="ts">
import { until } from "@vueuse/core";
import { useGetContent } from "~/composables/useGetContent"
import { usePatchContent } from "~/composables/usePatchContent";

const route = useRoute()
const { data: getData, pending: getPending, error: getError } =
  await useGetContent(route.params.id as string);

const {
  form: patchForm,
  error: patchError,
  pending: patchPending,
  success: patchSuccess,
  submit: patchSubmit
} = usePatchContent(route.params.id as string)

// initialize form
await until(getData).toBeTruthy(); // wait for getData to be available
patchForm.value = {
  title: getData.value!.title ?? "",
  content: getData.value!.content ?? "",
};
</script>

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Create New Content</h1>

    <div v-if="getPending" class="mb-4 text-blue-400">Loading...</div>

    <div v-else-if="getError" class="mb-4 text-red-700">
      Error: {{ getError.message }}
    </div>

    <div v-else>
      <div v-if="patchForm">
        <form @submit.prevent="patchSubmit">
          <div class="flex justify-end mb-3">
            <p class="text-sm text-gray-500">Id: {{ getData?.id }}</p>
          </div>

          <div class="mb-3">
            <div class="mb-1">
              <label>Title</label>
            </div>
            <input v-model="patchForm.title" type="text" class="border w-full p-2 rounded" />
          </div>

          <div class="mb-3">
            <div class="mb-1">
              <label>Description</label>
            </div>
            <textarea v-model="patchForm.content" class="border w-full p-2 rounded"></textarea>
          </div>

          <div class="flex justify-center">
            <button type="submit" :disabled="patchPending" class="
          bg-blue-500 text-white px-4 py-2 rounded 
          hover:bg-blue-600 hover:cursor-pointer 
          disabled:bg-gray-400 disabled:cursor-not-allowed
          ">
              Submit
            </button>
          </div>
        </form>

        <div v-if="patchError !== null" class="text-red-600 mt-3">
          <p>{{ patchError._tag }}</p>
        </div>

        <div v-if="patchSuccess" class="text-green-600 mt-3">
          <p>Content edited successfully!</p>
        </div>

      </div>

    </div>

  </div>
</template>
