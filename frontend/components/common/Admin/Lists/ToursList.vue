<template>
  <FiltersForm
    :class="[$s.Common__FiltersForm, $s.Common__FiltersForm_Admin]"
    :isAdmin="true"
    @onSubmit="handleFiltersChange"
  />

    <Tabs
      :tabs="tabs"
      @onTabChange="handleTabChange"
    />
  <ScrollContainer>
    <TourCard
      v-for="card in $toursStore.getAccountTours"
      :key="card._id"
      type="admin"
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
import { useToursStore } from '~/store/tours'
import { useAdminStore } from '~/store/admin'

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

const $toursStore = useToursStore()
const $adminStore = useAdminStore()

let savedFormData: Record<string, any> = {}
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
</style>
