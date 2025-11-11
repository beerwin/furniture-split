<template>
  <nav class="pl-2">
    <ul class="flex">
      <MenuItem item-type="text-only">
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
      <MenuItem item-type="text-only">
        {{ getText('menu.Sheets')}}
        <template v-slot:submenu>
          <ul :class="dropDownMenuClasses">
            <MenuItem @click="addNewSheetClick">
              {{ getText('menu.SheetsAddPiece') }}
            </MenuItem>
            <MenuItem separator></MenuItem>
            <MenuItem :enabled="!formHasErrors" @click="calculateSheetsClick" :key="`formError-${formHasErrors}`">
              {{ getText('menu.SheetsCalculateSheets') }}
            </MenuItem>
          </ul>
        </template>
      </MenuItem>
      <MenuItem item-type="text-only">
        {{ getText('menu.Theme') }}
        <template v-slot:submenu>
          <ul :class="dropDownMenuClasses">
            <MenuItem item-type="checkbox" :checked="theme === 'light'" @click="setThemeLight">
              {{ getText('menu.ThemeLight') }}
            </MenuItem>
            <MenuItem item-type="checkbox" :checked="theme === 'dark'" @click="setThemeDark">
              {{ getText('menu.ThemeDark') }}
            </MenuItem>
            <MenuItem item-type="checkbox" :checked="theme === 'system'" @click="setThemeSystem">
              {{ getText('menu.ThemeSystem') }} 
            </MenuItem>
          </ul>
        </template>
      </MenuItem>
      <MenuItem item-type="text-only">
        {{ getText('menu.Language') }}
        <template v-slot:submenu>
          <ul :class="dropDownMenuClasses">
            <MenuItem 
              v-for="(item, index) in languageOptions" 
              :key="index" @click="setLanguage(index)" 
              item-type="checkbox" 
              :checked="language === index"
            >
              {{ item }}
            </MenuItem>
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
import { computed, useTemplateRef } from 'vue'
import TriStateConfirmationModal from '../modals/triStateConfirmationModal.vue'
import { newForm, fileOpen, fileSaveAs, closeQuery, calculateCuts } from '../../controller/cuts/cutsController'
import type { TriStateConfirmationInterface } from '../../types/dialogs/triStateconfirmationInterface'
import type { PromptModalInterface } from '../../types/dialogs/promptModalInterface'
import MenuItem from '../lists/MenuItem.vue'
import { useThemeStore } from '../../stores/themeStore'

const languageStore = useLangaugeStore()
const { languageOptions, language } = storeToRefs(languageStore);
const { getText, setLanguage } = languageStore
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore);
const { setTheme } = themeStore;

const formState = useCalculatorForm()
const promptForName = useTemplateRef('promptForName')
const askForSaveAs = useTemplateRef('askForSaveAs')
const { formName } = storeToRefs(formState)
const { errorBag, addPart } = formState

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

const formHasErrors = computed(() => {
  return errorBag().size > 0;
});

async function calculateSheetsClick() {
  if (formHasErrors.value) {
    return;
  }
  calculateCuts();
}

function addNewSheetClick() {
  addPart();
}

window.api?.on('app-close-query', async () => {
  await closeQuery(
    askForSaveAs.value as TriStateConfirmationInterface,
    promptForName.value as PromptModalInterface,
  );
});

function setThemeLight() {
  setTheme('light');
}

function setThemeDark() {
  setTheme('dark');
}

function setThemeSystem() {
  setTheme('system'); 
}

defineExpose({
  fileNewClick,
});

</script>
