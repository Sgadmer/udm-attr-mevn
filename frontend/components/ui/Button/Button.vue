<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    :type="$p.type"
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
  /**
   * Стилевой тип кнопки
   */
  kind?: 'Main' | 'Secondary' | 'Transparent'
  /**
   * Скругление углов
   */
  corners?: 'None' | 'Sm' | 'Md' | 'Circle'
  /**
   * Тип кнопки
   */
  type?: 'button' | 'submit' | 'reset'
}


const $p = withDefaults(defineProps<IProps>(), {
  kind: 'Main',
  corners: 'None',
  type: 'button'
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
    [$s[`Button_Kind${ $p.kind }`]]: true,
    [$s[`Button_Corners${ $p.corners }`]]: true,
  }
})

/**
 * HOOKS
 */

/**
 * METHODS
 */
const handleClick = (): void => {
  $e('click')
}
</script>
