<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const postsStore = usePosts()
const favoritesStore = useFavorites()

// Fetch posts on page load
await postsStore.fetchPosts()

// Fetch favorites if user is authenticated
if (!user.isGuest) {
  await favoritesStore.fetchFavorites()
}
</script>

<template>
  <PostForm
    v-if="!user.isGuest" />
  <div v-if="postsStore.loading && !postsStore.posts.length" class="text-center py-8">
    Loading posts...
  </div>
  <div v-else-if="postsStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {{ postsStore.error }}
  </div>
  <div class="grid gap-16">
    <PostItem
      v-for="post in postsStore.posts"
      :key="post.id"
      v-bind="{ post }" />
  </div>
</template>
