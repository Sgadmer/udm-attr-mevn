<template>
  <FiltersForm
    :class="$s.Common__FiltersForm"
    @onSubmit="handleFiltersChange"
  />
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
import $s from '../../common.module.scss'
import { useToursStore } from '~@store/tours'
import { useUserStore } from '~@store/user'

/**
 * TYPES
 */
enum ETabs {
  all = '',
  current = 'PENDING',
  future = 'ACTIVE',
  past = 'FINISHED',
  canceled = 'CANCELED',
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
let savedFormData: Record<string, any> = {
  touristId: $userStore.getUserInfo.info._id
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
const handleTabChange = (selectedTabValue: ETabs): void => {
  selectedTab = selectedTabValue
  handleFiltersChange({ status: selectedTabValue })
}

const handleFiltersChange = (formData: Record<string, any>) => {

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
