<template>
  <ul>
    <li
      v-for="item in items"
      :key="item.name"
      :class="itemClasses(item)"
      @click="() => emitValue(item.name)"
    >
      <span>{{ item.name }}</span>
      <span>{{ item.updatedAt }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { menuItemClasses } from '../../utils/classLists'
const props = defineProps(['items', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

function itemClasses(item: { name: string; createdAt: number }) {
  console.log('item', item.name, 'model', props.modelValue)
  if (item.name === props.modelValue) {
    return [...menuItemClasses, 'bg-sky-700', 'text-neutral-900']
  }
  return menuItemClasses
}

function emitValue(value: string) {
  emit('update:modelValue', value)
}
</script>
