<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot/>
  </button>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Button.module.scss'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  type?: 'Main' | 'Secondary' | 'Transparent'
  corners?: 'None' | 'Sm' | 'Md' | 'Lg'
}

const $p = withDefaults(defineProps<IProps>(), {
  type: 'Main',
  corners: 'None'
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'click'): void
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
const buttonClasses = computed<Record<string, boolean>>(() => {
  return {
    [$s.Button]: true,
    [$s[`Button_Type${ $p.type }`]]: true,
    [$s[`Button_Corners${ $p.corners }`]]: true,
  }
})

/**
 * METHODS
 */
const handleClick = (): void => {
  $e('click')
}
</script>
