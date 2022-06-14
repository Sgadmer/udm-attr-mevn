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
          v-model:inputModel="formModel.corpName"
          label="Компания"
          :charsToDelete="REG_EXP.ecxeptLetters"
          v-if="$p.type === 'agent'"
        />

        <Input
          v-model:inputModel="formModel.surname"
          label="Фамилия"
          :charsToDelete="REG_EXP.ecxeptLetters"
          v-if="$p.type === 'tourist'"
        />
        <Input
          v-model:inputModel="formModel.name"
          label="Имя"
          :charsToDelete="REG_EXP.ecxeptLetters"
          v-if="$p.type === 'tourist'"
        />
        <Input
          v-model:inputModel="formModel.patronymic"
          label="Отчество"
          :charsToDelete="REG_EXP.ecxeptLetters"
          v-if="$p.type === 'tourist'"
        />

        <Input
          v-model:inputModel="formModel.phone"
          label="Телефон"
        />
        <Input
          v-model:inputModel="formModel.email"
          label="email"
        />
        <Checkbox
          v-model:checkboxModel="formModel.isBlocked"
        >
          Заблокирован
        </Checkbox>
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
import $s from './FiltersForm.module.scss'
import { IFiltersFormAdmin } from '~@models/filtersForm/formModels'
import { REG_EXP } from '~@constants/regExps'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  type: 'tourist' | 'agent'
}

const $p = withDefaults(defineProps<IProps>(), {
  type: 'tourist'
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
const formModel = $ref<IFiltersFormAdmin>({
  corpName: '',
  surname: '',
  name: '',
  patronymic: '',
  phone: '',
  email: '',
  isBlocked: false,
})
let isFiltersOpen = $ref<boolean>(false)

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */

/**
 * HOOKS
 */

/**
 * METHODS
 */

const handleFormSubmit = async (): Promise<void> => {
  toggleMobileFilters()
  $e('onSubmit', formModel)
}

const toggleMobileFilters = (): void => {
  isFiltersOpen = !isFiltersOpen
}
</script>
