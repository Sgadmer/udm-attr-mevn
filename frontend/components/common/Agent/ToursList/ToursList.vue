<template>
  <div :class="[$s.Common__Row, $s.Common__Row_Center]">
    <Tabs
      :tabs="tabs"
      @onTabChange="handleTabChange"
      class="ToursList__Tabs"
    />
    <Button
      kind="Main"
      corners="Md"
      class="ToursList__CreateBtn"
      @click="handleCreateTourModalOpen"
    >
      Создать&nbsp;&nbsp;&nbsp;+
    </Button>
  </div>
  <ScrollContainer>
    <LazyTourCard
      v-for="card in $toursStore.getAccountTours"
      :key="card._id"
      type="agent"
      :data="card"
    />
  </ScrollContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../../common.module.scss'
import { EModalsNames } from '~/constants/modals'
import { useModalsStore } from '~@store/modals'
import { useUserStore } from '~@store/user'
import { useToursStore } from '~@store/tours'

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
const $userStore = useUserStore()
const $modalsStore = useModalsStore()
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

  $fetch('/api/tour/params', {
    method: 'GET',
    params: {
      agentId: $userStore.getUserInfo.info._id
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

const handleCreateTourModalOpen = (): void => {
  $modalsStore.setCurrentModalName(EModalsNames.CreateTourModal)
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
