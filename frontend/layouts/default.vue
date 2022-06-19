<template>
  <main :class="$s.Layouts__MainDefault">
    <slot/>
  </main>
</template>

<script setup lang='ts'>
import $s from './layouts.module.scss'
import { useUserStore } from '~@store/user'

/**
 * IMPORTS
 */

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
const $userStore = useUserStore()


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
