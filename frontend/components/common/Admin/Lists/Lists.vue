<template>
  <component :is="`${$adminStore.getSelectedTab}List`"/>
</template>

<script lang='ts'>
import TouristsList from './TouristsList'
import AgentsList from './AgentsList'
import ToursList from './ToursList'


export default {
  components: {
    TouristsList,
    AgentsList,
    ToursList
  }
}
</script>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../../common.module.scss'
import { useAdminStore } from '~@store/admin'

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
const $adminStore = useAdminStore()

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
