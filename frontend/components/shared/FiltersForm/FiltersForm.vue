<template>
  <StickyContainer>
    <form :class="$s.FiltersForm__Form">

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
        <Input
          v-model:inputModel="formModel.priceMin"
          label="Цена от"
          :isNumber="true"
        />
        <Input
          v-model:inputModel="formModel.priceMax"
          label="Цена до"
          :isNumber="true"
        />
        <Input
          v-model:inputModel="formModel.dateStart"
          label="Дата начала"
        />
        <Input
          v-model:inputModel="formModel.dateEnd"
          label="Дата окончания"
        />
      </div>
      <Button
        kind="Main"
        corners="Md"
      >
        Искать
      </Button>
    </form>
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
  keywords: ['Test', 'Test2', 'Test3'],
  priceMin: 0,
  priceMax: 100000,
  dateStart: null,
  dateEnd: null,
})

const validationRules = {
  place: {required},
  keywords: {required},
  priceMin: {
    between: between(0, 100)
  },
  priceMax: {
    between: between(0, 100)
  },
  dateStart: {},
  dateEnd: {},
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

async function handleModelChange() {

  const isFormCorrect = await $v.value.$validate()
  console.log(isFormCorrect, $v.value, formModel)
  if (!isFormCorrect) return

}

</script>
