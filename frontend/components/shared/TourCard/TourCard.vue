<template>
  <div :class="$s.TourCard">

    <img
      src="@assets/images/dev/pelmen.png"
      alt="tour card image"
      :class="$s.TourCard__Image"
    />

    <div :class="$s.TourCard__Promo">
      <h3 :class="$s.TourCard__Title">
        Путешествие в пельменную долину
      </h3>

      <p :class="$s.TourCard__Description">
        Путешествие в пельменную долину Путешествие в пельменную долину Путешествие в пельменную долину Путешествие в
        пельменную долину Путешествие в пельменную долину Путешествие в пельменную долину Путеш в пельменную долину
        Путешествие в пельменную долину Путешествие в пельменную долину Путеш в пельменную долину
        Путешествие в пельменную долину Путешествие в пельменную долину Путеш в пельменную долину
        Путешествие в пельменную долину Путешествие в пельменную долину Путеш в пельменную долину
        Путешествие в пельменную долину Путешествие в пельменную долину Путеш в пельменную долину
      </p>
    </div>

    <div :class="$s.TourCard__Info">
      <p :class="[$s.TourCard__InfoItem, $s.TourCard__InfoItem_Cut]">
        Пельменая долина Посёлок Зеч Буреч
      </p>

      <p :class="$s.TourCard__InfoItem">
        19.04.22 - 19.04.22
      </p>

      <p :class="$s.TourCard__InfoItem">
        3500 ₽ / <small :class="$s.TourCard__InfoSmall">на 1 человека</small>
      </p>
    </div>

    <div :class="$s.TourCard__Controls">
      <Button
        kind="Secondary"
        corners="Md"
        @click="handleTourModalOpen"
      >
        Подробнее
      </Button>

      <Button
        kind="Main"
        corners="Md"
      >
        Забронировать
      </Button>
    </div>

  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './TourCard.module.scss'
import { useModalsStore } from '~@store/modals'
import { EModalsNames } from '~@constants/modals'

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
const $modalsStore = useModalsStore()

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
const handleTourModalOpen = (): void => {
  $modalsStore.setCurrentModalName(EModalsNames.TourModal)
}

</script>
