<template>
  <section :class="$s.AllTours">
    <div :class="$s.AllTours__TitleWrap">
      <h2>Туры</h2>
      <p :class="$s.AllTours__Promo">
        Почувствуй Удмуртию!
      </p>
    </div>
    <ScrollContainer>
      <TourCard
        v-for="card in $toursStore.getAccountTours"
        :key="card._id"
        type="common"
        :data="card"
      />
    </ScrollContainer>
  </section>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './AllTours.module.scss'
import { useToursStore } from '~/store/tours'
import { useUserStore } from '~/store/user'

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
const $toursStore = useToursStore()
const $userStore = useUserStore()

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */

/**
 * HOOKS
 */
onBeforeMount((): void => {
  $toursStore.loadAllTours()
})

/**
 * METHODS
 */

</script>
