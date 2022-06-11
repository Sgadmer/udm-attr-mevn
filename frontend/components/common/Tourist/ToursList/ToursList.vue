<template>
  <Tabs
    :tabs="tabs"
    @onTabChange="handleTabChange"
  />
  <ScrollContainer>
<!--    <LazyTourCard-->
<!--      v-for="i in 20"-->
<!--      type="tourist"-->
<!--    />-->
  </ScrollContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */

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
