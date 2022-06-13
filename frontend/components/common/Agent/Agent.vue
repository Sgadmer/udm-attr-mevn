<template>
  <div>
    <h2 :class="$s.Common__PageTitle">Мои туры</h2>
    <ToursList/>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../common.module.scss'
import ToursList from './ToursList/ToursList'

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
