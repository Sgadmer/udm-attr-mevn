<template>
  <FiltersForm
    :class="$s.Common__FiltersForm"
    @onSubmit="handleFiltersChange"
  />
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
      v-show="selectedTab === '' || card.status === selectedTab"
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
  all = '',
  new = 'NEW',
  current = 'PENDING',
  future = 'ACTIVE',
  past = 'FINISHED',
  canceled = 'CANCELED',
  blocked = 'BLOCKED'
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
    text: 'Новые',
    value: ETabs.new,
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
let savedFormData: Record<string, any> = {
  agentId: $userStore.getUserInfo.info._id
}
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
    params: savedFormData
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
const handleCreateTourModalOpen = (): void => {
  $modalsStore.setCurrentModalName(EModalsNames.CreateTourModal)
}

const handleTabChange = (selectedTabValue: ETabs): void => {
  selectedTab = selectedTabValue
  handleFiltersChange({ status: selectedTabValue })
}

const handleFiltersChange = (formData: Record<string, any>) => {
  $toursStore.setAccountTours([])

  savedFormData = { ...savedFormData, ...formData }

  $fetch('/api/tour/params', {
    method: 'GET',
    params: savedFormData,
  }).then((res: Record<string, any>[]) => {
    $toursStore.setAccountTours(res)
  })
    .catch(e => {
      console.error(e)
    })

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
