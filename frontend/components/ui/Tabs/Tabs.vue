<template>
  <div :class="$s.Tabs__List">
    <Button
      v-for="(tab, i) in $p.tabs"
      kind="Transparent"
      :class="{
        [$s.Tabs__Tab]: true,
        [$s.Tabs__Tab_Selected]: tab.selected
      }"
      @click="handleTabChange(i)"
    >
      {{ tab.text }}
    </Button>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Tabs.module.scss'

/**
 * TYPES
 */
interface ITab {
  text: string,
  value: any,
  selected?: boolean
}

/**
 * PROPS
 */
interface IProps {
  tabs: any
}

const $p = withDefaults(defineProps<IProps>(), {
  tabs: () => [] as ITab[],
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'onTabChange', newValue: any): void
}

const $e = defineEmits<IEmits>()

/**
 * DATA
 */

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
const handleTabChange = (index: number): void => {
  $p.tabs.forEach((tab, i) => {
    if (index === i) {
      tab.selected = true
      $e('onTabChange', tab.value)
    } else {
      tab.selected = false
    }
  })
}

</script>
