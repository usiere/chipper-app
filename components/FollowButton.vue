<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const favoritesStore = useFavorites()
const currentUser = useUser()
const loading = ref(false)

const isFollowing = computed(() => {
  return favoritesStore.isUserFavorited(props.user.id)
})

const canFollow = computed(() => {
  // Can't follow yourself
  return !currentUser.isGuest && currentUser.data.id !== props.user.id
})

async function toggleFollow() {
  if (!canFollow.value) return

  loading.value = true

  try {
    if (isFollowing.value) {
      await favoritesStore.unfavoriteUser(props.user.id)
    } else {
      await favoritesStore.favoriteUser(props.user)
    }
  } catch (error) {
    console.error('Failed to toggle follow:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    v-if="canFollow"
    @click="toggleFollow"
    :disabled="loading"
    class="font-medium text-sm px-2 rounded-full disabled:opacity-50"
    :class="isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-blue-200 text-blue-700'"
  >
    {{ loading ? '...' : (isFollowing ? 'Unfollow' : 'Follow') }}
  </button>
</template>