<template>
  <div :class="{
    [$s.ScrollContainer]: true,
    [$s.ScrollContainer_Unstyled]: $p.unstyled
  }">
    <div
      :class="{
    [$s.ScrollContainer__ScrollbarContainer]: true,
    [$s.ScrollContainer__ScrollbarContainer_Unstyled]: $p.unstyled
   }"
      ref="scrollContainer"
    >
      <slot/>
    </div>

  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './ScrollContainer.module.scss'
import Scrollbar from 'smooth-scrollbar'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  unstyled?: boolean;
  noScrollbar?: boolean;
}

const $p = withDefaults(defineProps<IProps>(), {
  unstyled: false,
  noScrollbar: false
})

/**
 * EMITS
 */
interface IEmits {
}

const $e = defineEmits<IEmits>()

/**
 * DATA
 */
const scrollContainer = $ref(null)

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */

/**
 * HOOKS
 */
onMounted(() => {
  Scrollbar.init(scrollContainer)
})

/**
 * METHODS
 */

</script>

<style lang="scss">
@import '@styles/common.scss';

.scrollbar-track {
  border-radius: 6px;
  -moz-user-select: -moz-all;
  -webkit-user-select: all;
  -ms-user-select: all;
  user-select: all;
  background-color: cl('main', 0.1) !important;

  &:hover {
    cursor: pointer;
  }
}

.scrollbar-thumb {
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
