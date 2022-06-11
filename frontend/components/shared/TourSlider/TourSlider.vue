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
        v-for="(img, i) in $p.images"
        :key="img + i"
        :class="$s.TourSlider__MainSlide"
      >
        <img
          :class="$s.TourSlider__MainSlideImage"
          :src="img"
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
        v-for="(img, i) in $p.images"
        :key="img + i"
        :class="$s.TourSlider__ThumbSlide"
      >
        <img
          :class="$s.TourSlider__ThumbSlideImage"
          :src="img"
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
  images: string[]
}

const $p = withDefaults(defineProps<IProps>(), {
  images: () => []
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
