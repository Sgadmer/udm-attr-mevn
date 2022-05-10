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
import TouristCancelModal from './ModalsModules/TouristCancelModal/TouristCancelModal'
import AgentCancelModal from './ModalsModules/AgentCancelModal/AgentCancelModal'
import TouristsListModal from './ModalsModules/TouristsListModal/TouristsListModal'
import CreateTourModal from './ModalsModules/CreateTourModal/CreateTourModal'

export default {
  components: {
    TourModal,
    BookingConfirmModal,
    LoginModal,
    SignupModal,
    TouristCancelModal,
    AgentCancelModal,
    TouristsListModal,
    CreateTourModal
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
