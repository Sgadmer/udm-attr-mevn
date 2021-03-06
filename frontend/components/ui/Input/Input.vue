<template>
  <div
    :class="{
    [$s.Input__Wrapper]: true,
    [$s.Input__Wrapper_Textarea]: $p.isTextarea,
  }"
    data-component="Input"
  >

    <input
      v-if="!$p.isTextarea"
      :class="compInputClasses"
      :value="compInputValue"
      @input="handleInput($event.target.value, $event.inputType)"
      placeholder=" "
      :type="$p.type"
      :disabled="$p.isDisabled"
    />

    <textarea
      v-else
      :class="compInputClasses"
      :value="compInputValue"
      @input="handleInput($event.target.value, $event.inputType)"
      placeholder=" "
      :disabled="$p.isDisabled"
      :maxlength="2000"
    />

    <span :class="{
      [$s.Input__Placeholder]: true,
      [$s.Input__Placeholder_Textarea]: $p.isTextarea,
    }">
      {{ $p.label }}
    </span>

  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Input.module.scss'
import _ from 'lodash'
import { REG_EXP } from '~@constants/regExps'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  /**
   * Контролирующая модель инпута (для задания значений из вне через v-model)
   */
  inputModel?: string | string[] | number | Date
  /**
   * Если нужно только отображать контент, передаваемый извне
   */
  inputValue?: string,
  /**
   * Текст для кастомного плейсхолдера
   */
  label?: string
  /**
   * При передаче сплиттера будет возвращать в модель массив строк,
   * разбитых по сплиттеру
   */
  modelSplit?: RegExp,
  /**
   * При передаче джойнера, будет выводить в инпут строку,
   * собранную по джойнеру
   */
  modelJoin?: string,
  /**
   * Эти символы будут удалены
   */
  charsToDelete?: RegExp,
  /**
   * Принимать и возвращать число.
   * Все __не__ цифры будут вырезаться автоматически
   */
  isNumber?: boolean,
  /**
   * Ограничевает максимально значение числа до указанного
   */
  maxNumber?: number
  /**
   * Заблокировать инпут
   * Инпут изменяется визаульно
   */
  isDisabled?: boolean,
  /**
   * Максимальная длина строки,
   * остальное обрежется
   */
  maxLength?: boolean | number,
  /**
   * Тип инпута
   */
  type?: 'text' | 'password'
  /**
   * Использовать textarea вместо input
   */
  isTextarea?: boolean,
  /**
   * Показать ошибку
   */
  isError?: boolean
}

const $p = withDefaults(defineProps<IProps>(), {
  inputModel: '',
  inputValue: '',
  label: '',
  modelSplit: null,
  modelJoin: null,
  charsToDelete: null,
  isNumber: false,
  maxNumber: null,
  isDisabled: false,
  maxLength: false,
  type: 'text',
  isTextarea: false,
  isError: false,
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'update:inputModel', newValue: Pick<IProps, 'inputModel'>): void
}

const $e = defineEmits<IEmits>()

/**
 * DATA
 */
let updateTrigger = $ref<string>('')

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */
const compInputValue = computed((): string => {
  updateTrigger // Костыль, чтобы обновить текст в инпуте

  if ($p.inputValue) return $p.inputValue
  else if ($p.modelJoin) return $p.inputModel.join($p.modelJoin)
  else if ($p.isNumber) return +$p.inputModel
  else return $p.inputModel
})

const compInputClasses = computed((): Record<string, boolean> => {
  return {
    [$s.Input__Input]: true,
    [$s.Input__Input_Disabled]: $p.isDisabled,
    [$s.Input__Textarea]: $p.isTextarea,
    [$s.Input_Error]: $p.isError
  }
})
/**
 * HOOKS
 */

/**
 * METHODS
 */
const handleInput = (value: string, eventType: string): void => {
  if ($p.inputValue || $p.isDisabled) return

  let newValue: Pick<IProps, 'inputModel'> = value
  if (
    _.isNumber($p.maxLength) && newValue.length > $p.maxLength
  ) newValue = newValue.slice(0, $p.maxLength)

  if ($p.charsToDelete) newValue = newValue.replace($p.charsToDelete, '')

  if ($p.modelSplit) {
    let newValueArr = newValue.trim().split($p.modelSplit)

    if (
      eventType.toLowerCase().includes('delete')
      && !newValueArr[newValueArr.length - 1]
    ) {
      newValueArr.pop()
    }

    if (newValueArr.length) {
      const lastItem = newValueArr[newValueArr.length - 1]
      newValueArr = _.compact(newValueArr)

      if (!lastItem) newValueArr.push('')
    }
    newValue = newValueArr

  } else if ($p.isNumber) {
    newValue = +newValue.replace(REG_EXP.ecxeptDigits, '')

    if (_.isNumber($p.maxNumber) && newValue > $p.maxNumber) newValue = +$p.maxNumber
  }

  updateTrigger = new String(newValue)
  $e('update:inputModel', newValue)

}

</script>
