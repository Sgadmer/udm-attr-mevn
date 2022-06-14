<template>

  <div
    :class="$s.Tabs__List"
  >
    <swiper
      :slidesPerView="'auto'"
      :class="$s.Tabs__Slider"
    >
      <swiper-slide
        v-for="(tab, i) in $p.tabs"
        :key="tab.text + i"
        :class="$s.Tabs__Slide"
      >
        <Button
          kind="Transparent"
          :class="{
              [$s.Tabs__Tab]: true,
              [$s.Tabs__Tab_Selected]: tab.selected,
              [$s.Tabs__Tab_Big]: $p.isBig
            }"
          @click="handleTabChange(i)"
        >
          {{ tab.text }}
        </Button>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Tabs.module.scss'
import { Swiper, SwiperSlide } from 'swiper/vue'

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
  tabs: any,
  isBig?: boolean
}

const $p = withDefaults(defineProps<IProps>(), {
  tabs: () => [] as ITab[],
  isBig: false,
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
