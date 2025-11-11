<template>
  <div v-if="results.length > 0">
    <div :class="cardClasses">
      <h2 :class="h2Classes">{{ getText('cuts.Results') }}</h2>
      <div class="flex flex-column gap-1 md:block">
        <CutsResult
          v-for="(result, index) in results"
          :key="result"
          :title="index.toString()"
          :image="result"
          @click="() => openModal(result, index)"
        ></CutsResult>
      </div>
    </div>
    <GenericModal v-model="modal">
      <template v-slot:title>
        {{ currentResultIndex }}
      </template>
      <img :src="currentResult" />
    </GenericModal>
  </div>
</template>

<script setup lang="ts">
import { useLangaugeStore } from '../../stores/language'
import { useResultStore } from '../../stores/resultStore'
import { storeToRefs } from 'pinia'
import CutsResult from './cuts-result.vue'
import { cardClasses, h2Classes } from '../../utils/classLists'
import { ref } from 'vue'
import GenericModal from '../modals/genericModal.vue'

const languageStore = useLangaugeStore()
const resultStore = useResultStore()

const { results } = storeToRefs(resultStore)

const { getText } = languageStore

const modal = ref(false)
const currentResult = ref<string>()
const currentResultIndex = ref<number>()

function openModal(result: string, index: number) {
  currentResult.value = result
  currentResultIndex.value = index
  modal.value = true
}
</script>
