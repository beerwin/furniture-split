<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import GenericModal from '../modals/genericModal.vue'
import FileList from '../lists/fileList.vue'
import {
  actionButtonClasses,
  defaultButtonClasses,
  fieldClasses,
  labelClasses,
} from '../../utils/classLists'
import { useLangaugeStore } from '../../stores/language'
import { FileDialogMode } from '../../types/dialogs/dialogModes'
import ConfirmationModal from '../modals/confirmationModal.vue'
let resolvePromiseVal: (value: PromiseLike<string> | string) => void
let rejectPromiseVal: (value: PromiseLike<boolean> | boolean) => void
const props = defineProps({
  dialogMode: {
    type: Number,
    default: FileDialogMode.MODE_OPEN,
  },
})

const items = ref([
  {
    name: 'Test',
    createdAt: Date.now().valueOf(),
  },
  {
    name: 'Test 1',
    createdAt: Date.now().valueOf(),
  },
  {
    name: 'Test 2',
    createdAt: Date.now().valueOf(),
  },
  {
    name: 'Test 3',
    createdAt: Date.now().valueOf(),
  },
  {
    name: 'Test 4',
    createdAt: Date.now().valueOf(),
  },
  {
    name: 'Test 5',
    createdAt: Date.now().valueOf(),
  },
  {
    name: 'Test 6',
    createdAt: Date.now().valueOf(),
  },
  {
    name: 'Test 7',
    createdAt: Date.now().valueOf(),
  },
])

const languageStore = useLangaugeStore()

const { getText } = languageStore

const name = ref<string>('')
const modalOpen = ref(false)
const confirmationModal = useTemplateRef('confirmFileOverwrite')

async function open(fileName: string | null | undefined) {
  name.value = fileName ?? ''
  modalOpen.value = true
  return new Promise((resolve, reject) => {
    resolvePromiseVal = resolve
    rejectPromiseVal = reject
  })
}

async function confirm() {
  if (
    props.dialogMode === FileDialogMode.MODE_SAVE &&
    items.value.find((i) => i.name === name.value)
  ) {
    const answer = await confirmationModal.value?.open()
    if (!answer) {
      return
    }
  }
  modalOpen.value = false
  resolvePromiseVal(name.value)
}

function close() {
  modalOpen.value = false
  rejectPromiseVal(false)
}

function onModalUpdate(v: boolean) {
  if (!v) {
    close()
  }
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <GenericModal v-model="modalOpen" @update:modelValue="onModalUpdate">
    <template v-slot:title> {{ getText('generic.Open') }} </template>
    <FileList :items="items" v-model="name"></FileList>
    <template v-slot:comments>
      <div>
        <label :class="labelClasses"> {{ getText('generic.FileName') }} </label>
        <input :class="fieldClasses" type="text" v-model="name" />
      </div>
    </template>
    <template v-slot:actions>
      <button :class="defaultButtonClasses" @click="close">{{ getText('generic.Cancel') }}</button>
      <button :class="actionButtonClasses" @click="confirm" :disabled="!name">
        <slot name="mainActionText">{{ getText('generic.Open') }}</slot>
      </button>
    </template>
  </GenericModal>

  <ConfirmationModal ref="confirmFileOverwrite">
    <template v-slot:title>
      {{ getText('generic.fileExists') }}
    </template>
    {{ getText('generic.FileExistsOverwrite') }}
    <template v-slot:yes>
      {{ getText('generic.YesOverwrite') }}
    </template>
  </ConfirmationModal>
</template>
