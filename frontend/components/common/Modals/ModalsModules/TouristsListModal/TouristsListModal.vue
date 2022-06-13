<template>
  <ModalBase
    :title="`Список туристов тура</br>'${compTour.title}'`"
  >
    <template #beforeContent>
      <Tabs
        :tabs="tabs"
        @onTabChange="handleTabChange"
      />
    </template>

    <ListCardUser
      v-for="tourist in compTour.tourists"
      :data="{bookStatus: tourist.bookStatus,...tourist.touristId}"
      :key="tourist._id"
      type="agent"
    />

  </ModalBase>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './TouristsListModal.module.scss'
import { useToursStore } from '~/store/tours'

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
const $toursStore = useToursStore()

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */
const compTour = $computed((): Record<string, any> => $toursStore.getSelectedTour)

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
