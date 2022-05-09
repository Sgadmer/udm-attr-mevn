<template>
  <label
    :class="$s.Checkbox"
    data-component="Checkbox"
  >
    <input type="checkbox" :class="$s.Checkbox__Input">
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

</script>

<style>

</style>
