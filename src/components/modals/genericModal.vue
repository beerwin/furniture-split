<template>
  <div
    class="bg-neutral-950/50 fixed w-screen h-screen left-0 top-0 flex justify-around items-center"
    v-if="modelValue"
  >
    <div class="max-w-[90vw] min-w-[30vw] bg-white dark:bg-neutral-800 rounded-xl top shadow-2xl dark:shadow-neutral-950">
      <div class="p-2 border-b-1 border-neutral-100 dark:border-neutral-950 flex">
        <h1 class="text-2xl flex-1">
          <slot name="title"> </slot>
        </h1>
        <button class="px-2 cursor-pointer" @click="close">&#x2715;</button>
      </div>
      <div class="px-2 py-4 max-h-[80vh] overflow-auto">
        <slot> </slot>
      </div>
      <div class="px-2 flex border-t-1 border-neutral-100 dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-900 rounded-b-xl py-4">
        <div class="flex-1">
          <slot name="comments"> </slot>
        </div>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', !props.modelValue)
}
</script>
