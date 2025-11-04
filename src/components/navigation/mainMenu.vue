<template>
  <nav class="pl-2">
    <ul class="flex">
      <li :class="menuItemClasses">
        {{ getText('menu.File') }}
        <ul
          class="absolute bg-white rounded-md shadow-lg py-2 top-full -ml-6 hidden group-hover:block min-w-30 transition-all"
        >
          <li :class="menuItemClasses" @click="fileNewClick">
            {{ getText('menu.FileNew') }}
          </li>
          <li :class="menuItemClasses" @click="fileOpenClick">
            {{ getText('menu.FileOpen') }}
          </li>
          <li :class="menuItemClasses" @click="fileSaveAsClick">
            {{ getText('menu.FileSaveAs') }}
          </li>
        </ul>
      </li>
    </ul>
  </nav>
  <PromptModal ref="promptForName" :value="formName">
    <template v-slot:title>
      {{ getText('generic.EnterName') }}
    </template>
    {{ getText('generic.Name') }}
  </PromptModal>
  <TriStateConfirmationModal ref="askForSaveAs">
    <template v-slot:title>
      {{ getText('generic.Confirm') }}
    </template>
    {{ getText('generic.askForSave') }}
  </TriStateConfirmationModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLangaugeStore } from '../../stores/language'
import { menuItemClasses } from '../../utils/classLists'
import { useCalculatorForm } from '../../stores/calculatorForm'
import PromptModal from '../modals/promptModal.vue'
import { useTemplateRef } from 'vue'
import TriStateConfirmationModal from '../modals/triStateConfirmationModal.vue'
import { newForm, fileOpen, fileSaveAs } from '../../controller/cuts/cutsController'
import type { TriStateConfirmationInterface } from '../../types/dialogs/triStateconfirmationInterface'
import type { PromptModalInterface } from '../../types/dialogs/promptModalInterface'

const languageStore = useLangaugeStore()
const { getText } = languageStore

const formState = useCalculatorForm()
const promptForName = useTemplateRef('promptForName')
const askForSaveAs = useTemplateRef('askForSaveAs')
const { formName } = storeToRefs(formState)

async function fileNewClick() {
  await newForm(
    askForSaveAs.value as TriStateConfirmationInterface,
    promptForName.value as PromptModalInterface,
  )
}

async function fileOpenClick() {
  await fileOpen(
    askForSaveAs.value as TriStateConfirmationInterface,
    promptForName.value as PromptModalInterface,
  )
}

async function fileSaveAsClick() {
  await fileSaveAs(promptForName.value as PromptModalInterface)
}


// window.ipcRenderer?.on('file.new', fileNewClick)

// window.ipcRenderer?.on('file.open', fileOpenClick)

// window.ipcRenderer?.on('file.saveAs', fileSaveAsClick)

// window.ipcRenderer?.on('language.change', (event, payload) => {
//   console.log('Language change requested:', payload);
//   setLanguage(payload);
// })

defineExpose({
  fileNewClick,
});

</script>
