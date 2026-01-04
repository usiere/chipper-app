export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const data = ref([])
  const loading = ref(false)
  const error = ref(null)

  const posts = computed(() => data.value)

  async function fetchPosts() {
    loading.value = true
    error.value = null

    try {
      const response = await $api.get('/posts')
      data.value = response.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to fetch posts'
      console.error('Failed to fetch posts:', e)
    } finally {
      loading.value = false
    }
  }

  async function createPost(postData) {
    loading.value = true
    error.value = null

    try {
      const response = await $api.post('/posts', postData)
      data.value.unshift(response.data)
      return response.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to create post'
      throw e
    } finally {
      loading.value = false
    }
  }

  function addPost(post) {
    data.value.unshift(post)
  }

  function clearError() {
    error.value = null
  }

  return {
    data,
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    addPost,
    clearError
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}