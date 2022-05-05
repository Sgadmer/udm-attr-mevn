<template>
  <form
    :class="compFormClasses"
    @submit.prevent
  >
    <slot/>
  </form>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './FormContainer.module.scss'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  orientation?: 'Row' | 'Column'
}

const $p = withDefaults(defineProps<IProps>(), {
  orientation: 'Row'
})

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
const compFormClasses = computed((): Record<string, boolean> => {
  return {
    [`${ $s.FormContainer }`]: true,
    [$s[`FormContainer_${ $p.orientation }`]]: true,
  }
})

/**
 * HOOKS
 */

/**
 * METHODS
 */

</script>
