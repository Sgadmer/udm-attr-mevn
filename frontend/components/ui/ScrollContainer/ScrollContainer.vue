<template>
  <div :class="$s.ScrollContainer">
    <PerfectScrollbar
      :class="$s.ScrollContainer__ScrollbarContainer"
      :options="scrollbarOptions"
    >
      <slot/>
    </PerfectScrollbar>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './ScrollContainer.module.scss'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

/**
 * TYPES
 */

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
const scrollbarOptions = ref({
  handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
  wheelSpeed: 3,
  wheelPropagation: false,
  swipeEasing: false,
  scrollingThreshold: 0,
})

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

</script>

<style lang="scss">
@import '@styles/common.scss';

.ps__rail-y {
  border-radius: 6px;
  margin: 60px 0;
  -moz-user-select: -moz-all;
  -webkit-user-select: all;
  -ms-user-select: all;
  user-select: all;

  &:hover {
    background-color: cl('main', 0.1) !important;
    cursor: pointer;
  }

  &:active {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }

}

.ps__thumb-y {
  background-color: cl('main', 0.5) !important;

  &:hover {
    cursor: -webkit-grab;
    cursor: grab;
  }

  &:active {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }
}
</style>
