<template>
  <div>
    <AdminCatTabs/>
    <FiltersForm v-if="$adminStore.getSelectedTab === 'Tours'" :class="compFiltersClasses"/>
    <AdminKeywordsFilterForm v-else :class="compFiltersClasses"/>
    <AdminLists/>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../common.module.scss'
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
