<template>
  <transition name="fadeFaster">
    <component :is="$modalsStore.getCurrentModalName"/>
  </transition>
</template>

<script lang='ts'>
import TourModal from './ModalsModules/TourModal/TourModal'

export default {
  components: {
    TourModal
  }
}
</script>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Modals.module.scss'
import { useModalsStore } from '~@store/modals'

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
const $modalsStore = useModalsStore()

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
