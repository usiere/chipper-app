export const useFavorites = defineStore('favorites', () => {
  const { $api } = useNuxtApp()

  const posts = ref([])
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const isUserFavorited = computed(() => (userId) => {
    return users.value.some(user => user.id === userId)
  })

  const isPostFavorited = computed(() => (postId) => {
    return posts.value.some(post => post.id === postId)
  })

  async function fetchFavorites() {
    loading.value = true
    error.value = null

    try {
      const response = await $api.get('/favorites')
      posts.value = response.data.posts || []
      users.value = response.data.users || []
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to fetch favorites'
      console.error('Failed to fetch favorites:', e)
    } finally {
      loading.value = false
    }
  }

  async function favoriteUser(user) {
    try {
      await $api.post(`/users/${user.id}/favorite`)
      users.value.push(user)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to favorite user'
      throw e
    }
  }

  async function unfavoriteUser(userId) {
    try {
      await $api.delete(`/users/${userId}/favorite`)
      users.value = users.value.filter(u => u.id !== userId)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to unfavorite user'
      throw e
    }
  }

  async function favoritePost(post) {
    try {
      await $api.post(`/posts/${post.id}/favorite`)
      posts.value.push(post)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to favorite post'
      throw e
    }
  }

  async function unfavoritePost(postId) {
    try {
      await $api.delete(`/posts/${postId}/favorite`)
      posts.value = posts.value.filter(p => p.id !== postId)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to unfavorite post'
      throw e
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    posts,
    users,
    loading,
    error,
    isUserFavorited,
    isPostFavorited,
    fetchFavorites,
    favoriteUser,
    unfavoriteUser,
    favoritePost,
    unfavoritePost,
    clearError
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}