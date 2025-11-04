<template>
  <div
    class="flex-none 2xl:w-[15%] xl:w-[18%] lg:w-[23%] md:w-[30%] sm:w-[40%] w-[90%] shadow-neutral-300 shadow-md border-1 border-neutral-100 hover:shadow-neutral-500 hover:border-neutral-200"
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
