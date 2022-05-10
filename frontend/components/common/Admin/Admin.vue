<template>
  <div>
    <AdminCatTabs/>
    <AdminKeywordsFilterForm :class="compFiltersClasses"/>
    <FiltersForm :class="compFiltersClasses"/>
    <AdminLists/>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../common.module.scss'

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
const compFiltersClasses = computed(() => {
  return {
    [$s.Common__FiltersForm]: true,
    [$s.Common__FiltersForm_Admin]: true,
  }
})

/**
 * HOOKS
 */

/**
 * METHODS
 */

</script>
