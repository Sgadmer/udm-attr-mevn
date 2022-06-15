<template>
  <section :class="$s.PromoSlider">
    <div :class="$s.PromoSlider__Wrapper">
      <video
        :class="$s.PromoSlider__Video"
        autoplay
        muted
        loop
      >
        <source src="@assets/videos/clouds/clouds.webm" type="video/webm">
        <source src="@assets/videos/clouds/clouds.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <h2 :class="$s.PromoSlider__Title">Туры по Удмуртии</h2>
      <transition name="fade">
        <img
          :src="imagePath"
          :key="imagePath"
          alt="attraction slider"
          :class="$s.PromoSlider__Image"
        />
      </transition>
    </div>
  </section>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './PromoSlider.module.scss'
import url from 'url'

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
const imagesMaxCount: Readonly<number> = 11
let currentImageCount = $ref<number>(1)
let imageChangeTimer = $ref<number | null>(null)

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */
const imagePath = computed<string>(() => `./_nuxt/images/attractions/${ currentImageCount }.png`)

/**
 * HOOKS
 */
onMounted((): void => {
  imageChangeTimer = setInterval(() => {
    if (currentImageCount < imagesMaxCount) currentImageCount++
    else currentImageCount = 1
  }, 3000)
})

onBeforeUnmount((): void => {
  clearInterval(imageChangeTimer)
})

/**
 * METHODS
 */

</script>
