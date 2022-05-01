<template>
  <section :class="$s.SliderForm">
    <div :class="$s.SliderForm__SliderWrapper">
      <video
        :class="$s.SliderForm__SliderVideo"
        autoplay
        muted
        loop
      >
        <source src="@assets/videos/clouds/clouds.webm" type="video/webm">
        <source src="@assets/videos/clouds/clouds.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <h2 :class="$s.SliderForm__SliderTitle">Туры по Удмуртии</h2>
      <img
        src="@assets/images/attractions/1.png"
        alt="attraction slider"
        :class="$s.SliderForm__SliderImage"
      />
    </div>
  </section>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './SliderForm.module.scss'

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

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */

/**
 * METHODS
 */

</script>
