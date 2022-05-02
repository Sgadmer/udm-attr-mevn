<template>
  <div :class="$s.Input__Wrapper">

    <input
      :class="$s.Input__Input"
      :value="inputValue"
      @input="handleInput($event.target.value)"
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
  inputModel?: string | string[]
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
}

const $p = withDefaults(defineProps<IProps>(), {
  inputModel: '',
  label: '',
  modelSplit: null,
  modelJoin: null,
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
  else return $p.inputModel
})

/**
 * HOOKS
 */

/**
 * METHODS
 */
const handleInput = (value: string): void => {
  let newValue: string | string[]

  if ($p.modelSplit) newValue = value.trim().split($p.modelSplit)
  else newValue = value

  $e('update:inputModel', newValue)
}

</script>
