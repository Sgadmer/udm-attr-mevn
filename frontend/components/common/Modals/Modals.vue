<template>
  <transition name="fadeFaster">
    <component :is="$modalsStore.getCurrentModalName"/>
  </transition>
</template>

<script lang='ts'>
import TourModal from './ModalsModules/TourModal/TourModal'
import BookingConfirmModal from './ModalsModules/BookingConfirmModal/BookingConfirmModal'
import LoginModal from './ModalsModules/LoginModal/LoginModal'
import SignupModal from './ModalsModules/SignupModal/SignupModal'

export default {
  components: {
    TourModal,
    BookingConfirmModal,
    LoginModal,
    SignupModal,
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
