<template>
  <Tabs
    :tabs="tabs"
    @onTabChange="handleTabChange"
  />
  <ScrollContainer>
    <LazyTourCard
      v-for="card in $toursStore.getAccountTours"
      :key="card._id"
      type="tourist"
      :data="card"
    />
  </ScrollContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */

import { useToursStore } from '~@store/tours'
import { useUserStore } from '~@store/user'

/**
 * TYPES
 */
enum ETabs {
  all = 'all',
  current = 'current',
  future = 'future',
  past = 'past',
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
])

const $toursStore = useToursStore()
const $userStore = useUserStore()
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

  $fetch('/api/tour/params', {
    method: 'GET',
    params: {
      touristId: $userStore.getUserInfo.info._id
    }
  }).then((res: Record<string, any>[]) => {
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
