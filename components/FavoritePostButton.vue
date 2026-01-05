<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const favoritesStore = useFavorites()
const currentUser = useUser()
const loading = ref(false)

const isFavorited = computed(() => {
  return favoritesStore.isPostFavorited(props.post.id)
})

const canFavorite = computed(() => {
  return !currentUser.isGuest
})

async function toggleFavorite() {
  if (!canFavorite.value) return

  loading.value = true

  try {
    if (isFavorited.value) {
      await favoritesStore.unfavoritePost(props.post.id)
    } else {
      await favoritesStore.favoritePost(props.post)
    }
  } catch (error) {
    console.error('Failed to toggle favorite post:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    v-if="canFavorite"
    @click="toggleFavorite"
    :disabled="loading"
    class="flex items-center justify-center gap-2 p-4 rounded-lg disabled:opacity-50 transition-colors"
    :class="isFavorited ? 'bg-red-500 text-white' : 'bg-red-200 text-red-500'"
  >
    <HeartIconSolid v-if="isFavorited" class="h-6" />
    <HeartIcon v-else class="h-6 stroke-current" />
    <span class="font-bold">
      {{ loading ? 'Loading...' : (isFavorited ? 'Remove from favorites' : 'Add to my favorites') }}
    </span>
  </button>
</template>