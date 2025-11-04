<template>
  <slot :errorState="errorState"></slot>
  <span v-if="errorState" class="basis-full flex flex-wrap px-2">
    <small class="basis-full text-red-900" v-for="(v, k) in ownErrors" :key="k">{{ v[1] }}</small>
  </span>
</template>

<script setup lang="ts">
import type { ErrorItem } from '@/types/validation/errorItem'
import { computed } from 'vue'
interface Props {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  value?: any
  valueKey?: string
  errors?: Map<string, ErrorItem>
}

const { valueKey, errors } = defineProps<Props>()

const ownErrors = computed(() => {
  return errors?.get(valueKey ?? '')
})

const errorState = computed(() => (ownErrors.value?.size ?? 0) > 0)
</script>
