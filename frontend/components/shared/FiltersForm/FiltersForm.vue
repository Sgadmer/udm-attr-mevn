<template>
  <StickyContainer>
    <FormContainer
      orientation="Row"
    >

      <div
        :class="{
        [$s.FiltersForm__FormControls]: true,
        [$s.FiltersForm__HiddenFilters]: !isFiltersOpen,
      }"
      >
        <Input
          v-model:inputModel="formModel.place"
          label="Место"
          :charsToDelete="REG_EXP.ecxeptLetters"
        />
        <div :class="$s.FiltersForm__ControlsForm">
          <Input
            v-model:inputModel="formModel.priceMin"
            label="Цена от"
            :isNumber="true"
            :maxLength="6"
          />
          <Input
            v-model:inputModel="formModel.priceMax"
            label="Цена до"
            :isNumber="true"
            :maxLength="6"
          />
        </div>

        <div :class="$s.FiltersForm__ControlsForm">
          <Datepicker
            v-model:datepickerModel="formModel.dateStart"
            inputLabel="Дата от"
            :maxDate="formModel.dateEnd"
            :noDateRange="$p.isAdmin"
          />
          <Datepicker
            v-model:datepickerModel="formModel.dateEnd"
            inputLabel="Дата до"
            :minDate="formModel.dateStart"
            :noDateRange="$p.isAdmin"
          />
        </div>

      </div>
      <Button
        kind="Main"
        corners="Md"
        @click="handleFormSubmit"
        :class="{
        [$s.FiltersForm__HiddenFilters]: !isFiltersOpen,
      }"
      >
        Искать
      </Button>

      <Button
        kind="Secondary"
        corners="Md"
        @click="toggleMobileFilters"
        v-if="!isFiltersOpen"
        :class="{
        [$s.FiltersForm__HiddenFilters_FilterBTN]: true,
      }"
      >
        Фильтры
      </Button>
    </FormContainer>
  </StickyContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import useVuelidate from '@vuelidate/core'
import { required, between } from '@vuelidate/validators'
import $s from './FiltersForm.module.scss'
import { IFiltersForm } from '~@models/filtersForm/formModels'
import { REG_EXP } from '~@constants/regExps'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  isAdmin?: boolean
}

const $p = withDefaults(defineProps<IProps>(), {
  isAdmin: false
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'onSubmit', formModel: Record<string, any>): void
}

const $e = defineEmits<IEmits>()

/**
 * DATA
 */
const formModel = $ref<IFiltersForm>({
  place: '',
  priceMin: 0,
  priceMax: 100000,
  dateStart: null,
  dateEnd: null,
})

const validationRules = {
  priceMin: {
    between: between(0, 100000)
  },
  priceMax: {
    between: between(0, 100000)
  },
}
const $v = useVuelidate(validationRules, formModel)
let isFiltersOpen = $ref<boolean>(false)


/**
 * WATCHERS
 */
watch(formModel, handleModelChange, { deep: true })

/**
 * COMPUTED
 */

/**
 * HOOKS
 */

/**
 * METHODS
 */

function handleModelChange(): void {
  if (formModel.priceMax > 100000) formModel.priceMax = 100000

  if (formModel.priceMin > formModel.priceMax) {
    formModel.priceMin = formModel.priceMax
  }

  if (formModel.priceMax < formModel.priceMin) {
    formModel.priceMax = formModel.priceMin
  }
}

const handleFormSubmit = async (): Promise<void> => {
  const isFormCorrect = await $v.value.$validate()
  if (isFormCorrect) {
    toggleMobileFilters()
    $e('onSubmit', formModel)
  }
}

const toggleMobileFilters = (): void => {
  isFiltersOpen = !isFiltersOpen
}

</script>
