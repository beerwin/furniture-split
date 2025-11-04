<template>
  <GenericModal v-model="modalOpen" @update:modelValue="modelChange">
    <template v-slot:title>
      <slot name="title"></slot>
    </template>
    <template v-slot:default>
      <slot></slot>
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
      <button :class="defaultButtonClasses" @click="no">
        <slot name="no">
          {{ getText('generic.No') }}
        </slot>
      </button>
      <button :class="actionButtonClasses" @click="confirm">
        <slot name="yes">
          {{ getText('generic.Yes') }}
        </slot>
      </button>
    </template>
  </GenericModal>
</template>
<script setup lang="ts">
import { actionButtonClasses, defaultButtonClasses } from '../../utils/classLists'
import GenericModal from './genericModal.vue'
import { useLangaugeStore } from '../../stores/language'
import { ref } from 'vue'
import { ConfirmationModalState } from '../../types/dialogs/confirmationModalState'
let dialogResult: (value: PromiseLike<ConfirmationModalState> | ConfirmationModalState) => void
const modalOpen = ref(false)

const languageStore = useLangaugeStore()

const { getText } = languageStore

async function open() {
  modalOpen.value = true
  return new Promise<ConfirmationModalState>((resolve) => {
    dialogResult = resolve
  })
}

function confirm() {
  dialogResult(ConfirmationModalState.Yes)
  modalOpen.value = false
}

function no() {
  dialogResult(ConfirmationModalState.No)
  modalOpen.value = false
}

function cancel() {
  dialogResult(ConfirmationModalState.Cancel)
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
