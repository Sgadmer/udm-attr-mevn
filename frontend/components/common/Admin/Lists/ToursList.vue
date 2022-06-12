<template>
  <div :class="[$s.Common__Row, $s.Common__Row_Center]">
    <Tabs
      :tabs="tabs"
      @onTabChange="handleTabChange"
      class="ToursList__Tabs"
    />
  </div>
  <ScrollContainer>
    <TourCard
      v-for="card in $toursStore.getAccountTours"
      :key="card._id"
      type="admin"
      :data="card"
    />
  </ScrollContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../../common.module.scss'
import { useToursStore } from '~/store/tours'

/**
 * TYPES
 */
enum ETabs {
  all = 'all',
  current = 'current',
  future = 'future',
  past = 'past',
  canceled = 'canceled',
  blocked = 'blocked'
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
    text: 'Текущие',
    value: ETabs.current,
  },
  {
    text: 'Предстоящие',
    value: ETabs.future,
  },
  {
    text: 'Прошедшие',
    value: ETabs.past,
  },
  {
    text: 'Отмененные',
    value: ETabs.canceled,
  },
  {
    text: 'Заблокированные',
    value: ETabs.blocked,
  },
])

const $toursStore = useToursStore()

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */

/**
 * HOOKS
 */
onBeforeMount((): void => {
  $fetch('/api/tour')
    .then((res: Record<string, any>[]): void => {
      $toursStore.setAccountTours(res)
    })
    .catch(e => {
      console.error(e)
    })
})

/**
 * METHODS
 */
const handleTabChange = (selectedTabValue: ETabs): void => {
  selectedTab = selectedTabValue
}

</script>

<style scoped lang="scss">
.ToursList {
  &__Tabs {
    width: auto;
    margin-right: 35px;
  }

  &__CreateBtn {
    margin-bottom: 4px;
  }
}
</style>
