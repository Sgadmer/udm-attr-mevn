<template>
  <Tabs
    :tabs="tabs"
    :isBig="true"
    @onTabChange="handleTabChange"
  />
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './CatTabs.module.scss'
import { useAdminStore } from '~@store/admin'

/**
 * TYPES
 */
type TSectionNames = 'Tourists' | 'Agents' | 'Tours'

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
const tabs = $ref([
  {
    text: 'Туристы',
    value: 'Tourists',
    selected: true
  },
  {
    text: 'Турагенты',
    value: 'Agents',
  },
  {
    text: 'Туры',
    value: 'Tours',
  },
])

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
const handleTabChange = (selectedTabValue: TSectionNames): void => {
  $adminStore.setSelectedTab(selectedTabValue)
}

</script>
