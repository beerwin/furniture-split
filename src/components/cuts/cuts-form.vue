<template>
  <div>
    <h1 :class="h1Classes">{{ getText('cuts.PageTitle') }}: {{ formName }}</h1>
    <form novalidate @submit.prevent="calculate">
      <div :class="[...fieldWrapperClasses, ...cardClasses]">
        <div :class="fieldGroupClasses">
          <label :class="labelClasses">
            {{ getText('cuts.SheetSizes') }}
          </label>
          <select :class="fieldClasses" v-model="selectedSheetSize" @change="setSheetSizes">
            <option v-for="(size, index) in rawSheetSizes" :key="index" :value="index">
              {{ size }}
            </option>
          </select>
        </div>
        <div :class="fieldGroupClasses">
          <ValidationObserver
            value-key="sheetLength"
            :errors="errors"
            :value="sheetLength"
            v-slot="{ errorState }"
          >
            <label :class="labelClasses" for="sheetLength">{{ getText('cuts.SheetLength') }}</label>
            <input
              :class="getFieldClasses(errorState)"
              type="number"
              id="sheetLength"
              v-model="sheetLength"
            />
          </ValidationObserver>
        </div>
        <div :class="fieldGroupClasses">
          <ValidationObserver
            value-key="sheetWidth"
            :errors="errors"
            :value="sheetWidth"
            v-slot="{ errorState }"
          >
            <label :class="labelClasses" for="sheetWidth"> {{ getText('cuts.SheetWidth') }} </label>
            <input
              :class="getFieldClasses(errorState)"
              type="number"
              id="sheetWidth"
              v-model="sheetWidth"
            />
          </ValidationObserver>
        </div>
        <div :class="fieldGroupClasses">
          <ValidationObserver value-key="kerf" :errors="errors" :value="kerf" v-slot="{ errorState }">
            <label :class="labelClasses" for="kerf"> {{ getText('cuts.Kerf') }} </label>
            <input :class="getFieldClasses(errorState)" type="number" id="kerf" v-model="kerf" />
          </ValidationObserver>
        </div>
        <div :class="fieldGroupClasses">
          <ValidationObserver
            value-key="waste"
            :errors="errors"
            :value="waste"
            v-slot="{ errorState }"
          >
            <label :class="labelClasses" for="waste"> {{ getText('cuts.Waste') }} </label>
            <input :class="getFieldClasses(errorState)" type="number" id="waste" v-model="waste" />
          </ValidationObserver>
        </div>
      </div>
      <div :class="cardClasses">
        <h2 :class="h2Classes">{{ getText('cuts.PartsHeader') }} ({{ parts.length }})</h2>
        <button :class="defaultButtonClasses" @click.stop.prevent="addPart">
          {{ getText('cuts.AddItem') }}
        </button>
        <ValidationObserver value-key="parts" :errors="errors" :value="parts">
          <div
            class="max-h-[50vh] overflow-auto py-2 my-2 border-1 inset-shadow-sm inset-shadow-neutral-300 dark:inset-shadow-gray-950 border-neutral-100 dark:border-gray-900 rounded-md bg-neutral-100 dark:bg-gray-900"
          >
            <div
              v-for="(part, index) in parts"
              :key="part.id"
              :class="fieldWrapperClasses"
              class="border-t-2 border-neutral-100 dark:border-gray-800 pt-2 mt-2"
            >
              <ValidationObserver :valueKey="`parts.${index}`" :errors="errors">
                <div :class="fieldGroupClasses">
                  <ValidationObserver
                    :valueKey="`parts.${index}.name`"
                    :errors="errors"
                    :value="part.name"
                    v-slot="{ errorState }"
                  >
                    <label :class="labelClasses">{{ getText('cuts.ItemName') }}</label>
                    <input :class="getFieldClasses(errorState)" type="text" v-model="part.name" />
                  </ValidationObserver>
                </div>
                <div :class="fieldGroupClasses">
                  <ValidationObserver
                    :valueKey="`parts.${index}.width`"
                    :errors="errors"
                    :value="part.width"
                    v-slot="{ errorState }"
                  >
                    <label :class="labelClasses">{{ getText('cuts.ItemLength') }}</label>
                    <input :class="getFieldClasses(errorState)" type="number" v-model="part.width" />
                  </ValidationObserver>
                </div>
                <div :class="fieldGroupClasses">
                  <ValidationObserver
                    :value-key="`parts.${index}.height`"
                    :errors="errors"
                    :value="part.height"
                    v-slot="{ errorState }"
                  >
                    <label :class="labelClasses">{{ getText('cuts.ItemWidth') }}</label>
                    <input :class="getFieldClasses(errorState)" type="number" v-model="part.height" />
                  </ValidationObserver>
                </div>
                <div :class="fieldGroupClasses">
                  <label :class="labelClasses"
                    ><input type="checkbox" v-model="part.canRotate" />
                    {{ getText('cuts.CanRotate') }}</label
                  >
                </div>
                <div :class="fieldGroupClasses">
                  <button
                    :class="dangerButtonClasses"
                    @click.stop.prevent="() => askRemovePart(part)"
                  >
                    {{ getText('cuts.RemoveItem') }}
                  </button>
                </div>
              </ValidationObserver>
            </div>
          </div>
        </ValidationObserver>
      </div>
      <button :class="defaultButtonClasses" @click.stop.prevent="addPart">
        {{ getText('cuts.AddItem') }}
      </button>
      <button :class="actionButtonClasses" type="submit" :disabled="errors.size > 0">
        {{ getText('cuts.CalculateSheets') }}
      </button>
    </form>

    <ConfirmationModal ref="confirmationModal">
      <template v-slot:title> {{ getText('cuts.DeleteItem') }} {{ itemToRemove.name }} ? </template>
      <template v-slot:default>
        <p>{{ getText('cuts.RemoveItemQuestion') }}</p>
      </template>
      <template v-slot:yes>
        {{ getText('generic.YesRemove') }}
      </template>
    </ConfirmationModal>
  </div>
</template>
<script setup lang="ts">
import { useCalculatorForm } from '../../stores/calculatorForm'
import { useLangaugeStore } from '../../stores/language'
import { storeToRefs } from 'pinia'
import {
  actionButtonClasses,
  cardClasses,
  dangerButtonClasses,
  defaultButtonClasses,
  fieldClasses,
  fieldErrorClasses,
  fieldGroupClasses,
  fieldWrapperClasses,
  h1Classes,
  h2Classes,
  labelClasses,
} from '../../utils/classLists'
import { computed, ref, useTemplateRef } from 'vue'
import ValidationObserver from '../validation/validationObserver.vue'
import type { Part } from '../../types/cuts/part'
import ConfirmationModal from '../modals/confirmationModal.vue'
import { calculateCuts } from '../../controller/cuts/cutsController'

const formStore = useCalculatorForm()
const languageStore = useLangaugeStore()
const confirmationModal = useTemplateRef('confirmationModal')

const { sheetLength, sheetWidth, kerf, waste, parts, formName } = storeToRefs(formStore)

const { addPart, removePart, updateSheetSizes, errorBag } = formStore

const { getText } = languageStore

const itemToRemove = ref()

const rawSheetSizes = ref({
  '3050x1300': '3050 x 1300 mm (10 x 4.25 ft)',
  '2800x1300': '2800 x 1300 mm (10 x 4.25 ft)',
  '2440x1220': '2440 x 1120 mm (10 x 4.25 ft)',
  '1830x915': '1830 x 915 mm (10 x 4.25 ft)',
  '1220x610': '1220 x 610 mm (10 x 4.25 ft)',
  '': languageStore.getText('cuts.Custom'),
})

const selectedSheetSize = ref('2440x1220')

const errors = computed(() => {
  return errorBag()
})

function getFieldClasses(errorState: boolean): string[] {
  if (!errorState) {
    return fieldClasses
  }

  return [...fieldClasses, ...fieldErrorClasses]
}

function setSheetSizes() {
  const selectedSize = selectedSheetSize.value

  if (selectedSize.length > 0) {
    const x: Array<string> = selectedSize.split('x')
    const length = parseInt(x[0] ?? '0')
    const width = parseInt(x[1] ?? '0')
    updateSheetSizes(length, width)
  }
}

async function askRemovePart(part: Part) {
  itemToRemove.value = part
  const confirm = await confirmationModal.value?.open()
  if (confirm === true) {
    removePart(part)
  }
}

function calculate() {
  calculateCuts()
}
</script>
