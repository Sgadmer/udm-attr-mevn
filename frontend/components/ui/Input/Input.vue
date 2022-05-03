<template>
  <div :class="$s.Input__Wrapper">

    <input
      :class="$s.Input__Input"
      :value="inputValue"
      @input="handleInput($event.target.value, $event.inputType)"
      placeholder=" "
      type="text"
    />

    <span :class="$s.Input__Placeholder">
      {{ $p.label }}
    </span>

  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Input.module.scss'
const { $_ } = useNuxtApp()
import { REG_EXP } from '@constants/regExps'

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
  inputModel?: string | string[] | number
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
}

const $p = withDefaults(defineProps<IProps>(), {
  inputModel: '',
  label: '',
  modelSplit: null,
  modelJoin: null,
  charsToDelete: null,
  isNumber: false
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'update:inputModel'): void
}

const $e = defineEmits<IEmits>()

/**
 * DATA
 */

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */
const inputValue = computed((): string => {
  if ($p.modelJoin) return $p.inputModel.join($p.modelJoin)
  else if ($p.isNumber) return +$p.inputModel
  else return $p.inputModel
})

/**
 * HOOKS
 */

/**
 * METHODS
 */
const handleInput = (value: string, eventType: string): void => {
  let newValue: Pick<IProps, 'inputModel'>

  if ($p.charsToDelete) value = value.replace($p.charsToDelete, '')

  if ($p.modelSplit) {
    let newValueArr = value.trim().split($p.modelSplit)

    if (
      eventType.toLowerCase().includes('delete')
      && !newValueArr[newValueArr.length - 1]
    ) {
      newValueArr.pop()
    }

    if (newValueArr.length) {
      const lastItem = newValueArr[newValueArr.length - 1]
      newValueArr = $_.compact(newValueArr)

      if (!lastItem) newValueArr.push('')
    }
    newValue = newValueArr

  } else if ($p.isNumber) {
    newValue = +value.replace(REG_EXP.ecxeptDigits, '')
  } else {
    newValue = new String(value)
  }

  $e('update:inputModel', null) //Костыль для обновления модели
  nextTick(()=>{
    $e('update:inputModel', newValue)
  })

}

</script>
