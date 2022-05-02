<template>
  <div :class="$s.StickyContainer">
    <slot/>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './StickyContainer.module.scss'

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
