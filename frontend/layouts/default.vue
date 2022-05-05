<template>
  <main :class="$s.Layouts__MainDefault">
    <Header/>
    <slot/>
    <Footer/>
  </main>
</template>

<script setup lang='ts'>
import $s from './layouts.module.scss'

/**
 * IMPORTS
 */

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {}

// const $p = withDefaults(defineProps<IProps>(), {})

/**
 * EMITS
 */
interface IEmits {}

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
