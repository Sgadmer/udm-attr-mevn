<template>
  <ModalBase
    title="Список туристов тура</br>“Путешествие в пельменную долину”"
  >
    <template #beforeContent>
      <Tabs
        :tabs="tabs"
        @onTabChange="handleTabChange"
      />
    </template>

    <ListCardTourist/>

  </ModalBase>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './TouristsListModal.module.scss'

/**
 * TYPES
 */
enum ETabs {
  all = 'all',
  active = 'active',
  canceled = 'canceled',
}


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
let selectedTab = $ref<ETabs>(ETabs.all)
const tabs = $ref([
  {
    text: 'Все',
    value: ETabs.all,
    selected: true
  },
  {
    text: 'Активная бронь',
    value: ETabs.active,
  },
  {
    text: 'Отмененая бронь',
    value: ETabs.canceled,
  },
])

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
const handleTabChange = (selectedTabValue: ETabs): void => {
  selectedTab = selectedTabValue
}


</script>
