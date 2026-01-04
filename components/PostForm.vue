<script setup>
const postsStore = usePosts()

const title = ref('')
const body = ref('')
const imageFile = ref(null)
const loading = ref(false)
const error = ref(null)

function handleFileChange(event) {
  imageFile.value = event.target.files[0]
}

async function submit() {
  if (!title.value.trim() || !body.value.trim()) return

  loading.value = true
  error.value = null

  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('body', body.value)

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    await postsStore.createPost(formData)

    // Clear form on success
    title.value = ''
    body.value = ''
    imageFile.value = null
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to create post'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form
    class="grid gap-4 mb-16"
    @submit.prevent="submit">
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    <input
      v-model="title"
      placeholder="Post title"
      :disabled="loading"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base disabled:opacity-50">
    <textarea
      v-model="body"
      placeholder="What is happening?!"
      :disabled="loading"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base disabled:opacity-50"></textarea>
    <input
      type="file"
      accept="image/*"
      @change="handleFileChange"
      :disabled="loading"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base disabled:opacity-50">
    <button
      type="submit"
      :disabled="loading || !title.trim() || !body.trim()"
      class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50">
      {{ loading ? 'Posting...' : 'Post' }}
    </button>
  </form>
</template>