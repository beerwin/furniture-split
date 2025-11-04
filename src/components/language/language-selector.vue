<template>
  <div>
    <label> {{ getText('generic.ChooseLanguage') }}</label>
    <select :class="fieldClasses" v-model="language" @change="languageSelected">
      <option v-for="(key, languageOption) in languageOptions" :key="key">
        {{ languageOption }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useLangaugeStore } from '../../stores/language'
import { storeToRefs } from 'pinia'
import { fieldClasses } from '../../utils/classLists'

const languageStore = useLangaugeStore()

const { language, languageOptions } = storeToRefs(languageStore)

const { setLanguage, getText } = languageStore

// // @ts-ignore
// languageStore.$subscribe((mutation, state) => {
//   setLanguage(state.language)
// })

function languageSelected() {
  setLanguage(language.value)
}
</script>
