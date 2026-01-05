<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        by <strong>{{ post.user.name }}</strong>
      </div>
      <FollowButton :user="post.user" />
    </div>
    <p>
      {{ post.body }}
    </p>
    <!-- Display image if present -->
    <img
      v-if="post.image_url"
      :src="post.image_url"
      :alt="post.title"
      class="w-full max-w-md rounded-lg shadow-md"
    />
    <FavoritePostButton :post="post" />
  </div>
</template>