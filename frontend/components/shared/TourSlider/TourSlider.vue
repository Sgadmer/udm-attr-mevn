<template>
  <div :class="$s.TourSlider__Wrapper">
    <swiper
      @swiper="setMainController"
      :modules="swiperModules"
      :navigation="true"
      :controller="thumbController"
      :spaceBetween="30"
      :preloadImages="false"
      :class="$s.TourSlider__MainSlider"
    >
      <swiper-slide
        v-for="i in 20"
        :class="$s.TourSlider__MainSlide"
        :key="'main' + i"
      >
        <img
          :class="$s.TourSlider__MainSlideImage"
          src="@assets/images/dev/pelmen.png"
          alt="tour slider slide"
        />
      </swiper-slide>
    </swiper>

    <swiper
      @swiper="setThumbController"
      :modules="swiperModules"
      :controller="mainController"
      :slidesPerView="'auto'"
      :spaceBetween="10"
      :preloadImages="false"
      :slideToClickedSlide="true"
    >
      <swiper-slide
        v-for="i in 20"
        :key="'thumb' + i"
        :class="$s.TourSlider__ThumbSlide"
      >
        <img
          :class="$s.TourSlider__ThumbSlideImage"
          src="@assets/images/dev/pelmen.png"
          alt="tour slider slide"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './TourSlider.module.scss'
import { Navigation, Controller } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

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
const swiperModules = [
  Navigation, Controller
]
const mainController = $ref<Record<string, any>>({
  control: null,
})

const thumbController = $ref<Record<string, any>>({
  control: null,
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
const setMainController = (swiper) => {
  mainController.control = swiper
}

const setThumbController = (swiper) => {
  thumbController.control = swiper
}

</script>

<style>
</style>
