<template>
  <section :class="$s.AllTours">
    <div :class="$s.AllTours__TitleWrap">
      <h2>Туры</h2>
      <p :class="$s.AllTours__Promo">
        Почувствуй Удмуртию!
      </p>
    </div>
    <ScrollContainer>
      <LazyTourCard v-for="i in 20"/>
    </ScrollContainer>
  </section>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './AllTours.module.scss'

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
 * HOOKS
 */

/**
 * METHODS
 */

</script>
