export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const data = ref([])
  const newPosts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const posts = computed(() => data.value)
  const hasNewPosts = computed(() => newPosts.value.length > 0)

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

  async function checkForNewPosts() {
    try {
      const response = await $api.get('/posts')
      const fetchedPosts = response.data

      // Find posts that aren't in current list
      const currentIds = new Set(data.value.map(p => p.id))
      const newOnes = fetchedPosts.filter(p => !currentIds.has(p.id))

      if (newOnes.length > 0) {
        newPosts.value = newOnes
      }
    } catch (e) {
      console.error('Failed to check for new posts:', e)
    }
  }

  function loadNewPosts() {
    data.value = [...newPosts.value, ...data.value]
    newPosts.value = []
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
    newPosts,
    hasNewPosts,
    loading,
    error,
    fetchPosts,
    createPost,
    addPost,
    checkForNewPosts,
    loadNewPosts,
    clearError
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}