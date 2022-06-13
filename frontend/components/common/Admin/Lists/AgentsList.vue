<template>
  <FiltersFormAdmin
    :class="[$s.Common__FiltersForm, $s.Common__FiltersForm_Admin]"
    type="agent"
    @onSubmit="handleFiltersChange"
  />

  <div :class="[$s.Common__Row, $s.Common__Row_Center]">
    <Tabs
      :tabs="tabs"
      @onTabChange="handleTabChange"
      class="ToursList__Tabs"
    />
  </div>
  <ScrollContainer>
    <ListCardUser
      v-for="(agent, i) in agents"
      type="adminAgent"
      :data="agent"
      @onUpdate="(newData)=>handleCardUpdate(newData,i)"
    />
  </ScrollContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../../common.module.scss'

/**
 * TYPES
 */
enum ETabs {
  all = 'all',
  active = 'active',
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
    text: 'Активные',
    value: ETabs.active,
  },
  {
    text: 'Заблокированные',
    value: ETabs.blocked,
  },
])

let agents = $ref<Record<string, any>[]>([])
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
  $fetch('/api/agent')
    .then((res: Record<string, any>[]) => {
      agents = res
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

const handleCardUpdate = (newData: Record<string, any>, index: number): void => {
  agents[index] = newData
}

const handleFiltersChange = (formData: Record<string, any>) => {
  console.log(formData)

  $fetch('/api/agent/params', {
    method: 'GET',
    params: formData,
  }).then((res: Record<string, any>[]) => {
    agents = res
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
