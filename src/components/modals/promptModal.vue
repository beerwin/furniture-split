<template>
  <GenericModal v-model="modalOpen" @update:modelValue="modelChange">
    <template v-slot:title>
      <slot name="title"></slot>
    </template>
    <template v-slot:default>
      <label>
        <slot></slot>
      </label>
      <input type="text" :class="fieldClasses" v-model="content" />
    </template>
    <template v-slot:comments>
      <slot name="comments"> </slot>
    </template>
    <template v-slot:actions>
      <button :class="defaultButtonClasses" @click="cancel">
        <slot name="cancel">
          {{ getText('generic.Cancel') }}
        </slot>
      </button>
      <button :class="actionButtonClasses" @click="confirm">
        <slot name="yes">
          {{ getText('generic.OK') }}
        </slot>
      </button>
    </template>
  </GenericModal>
</template>
<script setup lang="ts">
import { actionButtonClasses, defaultButtonClasses, fieldClasses } from '../../utils/classLists'
import GenericModal from './genericModal.vue'
import { useLangaugeStore } from '../../stores/language'
import { ref } from 'vue'
const props = defineProps<{
  value?: string
}>()
let dialogResult: (value: PromiseLike<string | false> | string | false) => void

const modalOpen = ref(false)
const content = ref(props.value)

const languageStore = useLangaugeStore()

const { getText } = languageStore

async function open() {
  modalOpen.value = true
  return new Promise<string | false>((resolve) => {
    dialogResult = resolve
  })
}

function confirm() {
  dialogResult(content.value ?? '')
  modalOpen.value = false
}

function cancel() {
  dialogResult(false)
  modalOpen.value = false
}

function modelChange(value: boolean) {
  if (!value) {
    cancel()
  }
}

defineExpose({
  open,
})
</script>
