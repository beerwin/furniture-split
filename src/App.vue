<script setup lang="ts">
import CutsForm from './components/cuts/cuts-form.vue'
import LanguageSelector from './components/language/language-selector.vue'
import CutsResults from './components/cuts/cuts-results.vue'
import MainMenu from './components/navigation/mainMenu.vue'

</script>

<template>
  <div class="bg-white dark:bg-gray-900 shadow-2xl shadow-neutral-400 dark:shadow-gray-950 text-neutral-900 dark:text-neutral-200 flex">
    <div class="flex-grow-1">
      <MainMenu></MainMenu>
    </div>
    <LanguageSelector class="flex-grow-0"></LanguageSelector>
  </div>
  <div class="bg-white dark:bg-gray-950 text-neutral-900 dark:text-neutral-200">
    <CutsForm></CutsForm>
    <CutsResults></CutsResults>
  </div>
</template>

<style scoped></style>
