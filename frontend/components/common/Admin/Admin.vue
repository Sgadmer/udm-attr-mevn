<template>
  <div>
    <AdminCatTabs/>
    <AdminLists/>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
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
