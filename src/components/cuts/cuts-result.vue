<template>
  <div
    class="w-full shadow-neutral-300 dark:shadow-gray-950 shadow-md border-1 border-neutral-100 dark:border-gray-950 hover:shadow-neutral-500 dark:hover:shadow-gray-800 hover:border-neutral-200 dark:hover:border-gray-800 rounded-md overflow-hidden m-2"
  >
    <h3 :class="h3Classes">{{ title }}</h3>
    <img class="w-full" :src="image" />
  </div>
</template>

<script setup lang="ts">
import { h3Classes } from '../../utils/classLists'

defineProps<{
  title?: string
  image: string
}>()
</script>

<style scoped>
div {
  cursor: pointer;
}
</style>
