<template>
  <label
    :class="{
    [$s.Checkbox]: true,
    [$s.Checkbox_Error]: $p.isError
    }"
    data-component="Checkbox"
  >
    <input type="checkbox" :class="$s.Checkbox__Input" @change="handleTabChange($event)">
    <span :class="$s.Checkbox__Text">
      <slot/>
    </span>
  </label>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Checkbox.module.scss'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  isError?: boolean
}

const $p = withDefaults(defineProps<IProps>(), {
  isError: false,
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'update:checkboxModel', newValue: boolean): void
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

/**
 * HOOKS
 */

/**
 * METHODS
 */
const handleTabChange = (e): void => {
  $e('update:checkboxModel', e.target.checked)
}

</script>

<style>

</style>
