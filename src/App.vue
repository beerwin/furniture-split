<script setup lang="ts">
import CutsForm from './components/cuts/cuts-form.vue'
import LanguageSelector from './components/language/language-selector.vue'
import CutsResults from './components/cuts/cuts-results.vue'
import MainMenu from './components/navigation/mainMenu.vue'

</script>

<template>
  <div class="bg-white shadow-2xl shadow-neutral-400 flex">
    <div class="flex-grow-1">
      <MainMenu></MainMenu>
    </div>
    <LanguageSelector class="flex-grow-0"></LanguageSelector>
  </div>
  <div>
    <CutsForm></CutsForm>
    <CutsResults></CutsResults>
  </div>
</template>

<style scoped></style>
