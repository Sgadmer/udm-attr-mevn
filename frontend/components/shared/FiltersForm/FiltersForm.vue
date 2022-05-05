<template>
  <StickyContainer>
    <FormContainer
      orientation="Row"
    >

      <div :class="$s.FiltersForm__FormControls">
        <Input
          v-model:inputModel="formModel.place"
          label="Место"
          :charsToDelete="REG_EXP.ecxeptLetters"
        />
        <Input
          v-model:inputModel="formModel.keywords"
          label="Ключевые слова"
          modelJoin=", "
          :modelSplit="REG_EXP.commaSeparator"
          :charsToDelete="REG_EXP.exceptBaseList"
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
          />
          <Datepicker
            v-model:datepickerModel="formModel.dateEnd"
            inputLabel="Дата до"
            :minDate="formModel.dateStart"
          />
        </div>

      </div>
      <Button
        kind="Main"
        corners="Md"
        @click="handleFormSubmit"
      >
        Искать
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
import { IFiltersForm } from '@models/filtersForm/formModels'
import { REG_EXP } from '@constants/regExps'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
}

// const $p = withDefaults(defineProps<IProps>(), {})

/**
 * EMITS
 */
interface IEmits {
}

const $e = defineEmits<IEmits>()

/**
 * DATA
 */
const formModel = $ref<IFiltersForm>({
  place: '',
  keywords: [],
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

async function handleModelChange(): void {
  if (formModel.priceMax > 100000) formModel.priceMax = 100000

  if (formModel.priceMin > formModel.priceMax) {
    formModel.priceMin = formModel.priceMax
  }

  if (formModel.priceMax < formModel.priceMin) {
    formModel.priceMax = formModel.priceMin
  }
}

const handleFormSubmit = async (): void => {
  const isFormCorrect = await $v.value.$validate()
  if (isFormCorrect) {
    console.log('submit allowed!')
  }
}


</script>
