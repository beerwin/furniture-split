<template>
  <nav class="pl-2">
    <ul class="flex">
      <MenuItem>
        {{ getText('menu.File') }}
        <template v-slot:submenu>
          <ul :class="dropDownMenuClasses">
            <MenuItem @click="fileNewClick" accesskey="Ctrl + N"> {{ getText('menu.FileNew') }} </MenuItem>            
            <MenuItem @click="fileOpenClick" accesskey="Ctrl + O"> {{ getText('menu.FileOpen') }} </MenuItem>
            <MenuItem @click="fileSaveAsClick" accesskey="Ctrl + S">{{ getText('menu.FileSaveAs') }}</MenuItem>
            <MenuItem separator></MenuItem>
            <MenuItem @click="fileExitClick" accesskey="Ctrl + Q">{{ getText('menu.FileExit') }}</MenuItem>
          </ul>
        </template>
      </MenuItem>
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
import { dropDownMenuClasses } from '../../utils/classLists'
import { useCalculatorForm } from '../../stores/calculatorForm'
import PromptModal from '../modals/promptModal.vue'
import { useTemplateRef } from 'vue'
import TriStateConfirmationModal from '../modals/triStateConfirmationModal.vue'
import { newForm, fileOpen, fileSaveAs } from '../../controller/cuts/cutsController'
import type { TriStateConfirmationInterface } from '../../types/dialogs/triStateconfirmationInterface'
import type { PromptModalInterface } from '../../types/dialogs/promptModalInterface'
import MenuItem from '../lists/MenuItem.vue'
import { ConfirmationModalState } from '../../types/dialogs/confirmationModalState'

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

async function fileExitClick() {
    window.api?.send('close-query');
}

window.api?.on('app-close-query', async () => {
  if (!formState.isDirty()) {
    window.api?.send('app-close-confirmed');
    return;
  }
  const response = await askForSaveAs.value?.open();
  if (response === ConfirmationModalState.Cancel) {
    return;
  }

  if (response === ConfirmationModalState.Yes) {
    await fileSaveAs(promptForName.value as PromptModalInterface);
  }

  window.api?.send('app-close-confirmed');
});

defineExpose({
  fileNewClick,
});

</script>
