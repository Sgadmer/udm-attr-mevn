<template>
  <div :class="$s.TourCard">

    <img
      :src="$p.data.mainPhoto"
      alt="tour card image"
      :class="$s.TourCard__Image"
    />

    <div :class="$s.TourCard__Promo">
      <h3 :class="$s.TourCard__Title">
        {{ $p.data.title }}
      </h3>

      <p :class="$s.TourCard__Description">
        {{ $p.data.desc }}
      </p>
    </div>

    <div :class="$s.TourCard__Info">
      <p :class="[$s.TourCard__InfoItem, $s.TourCard__InfoItem_Cut]">
        {{ $p.data.place }}
      </p>

      <p :class="$s.TourCard__InfoItem">
        {{ formatJSONDate($p.data.dateStart) }} - {{ formatJSONDate($p.data.dateEnd) }}
      </p>

      <p :class="$s.TourCard__InfoItem">
        {{ $p.data.price }} ₽ / <small :class="$s.TourCard__InfoSmall">на 1 человека</small>
      </p>
    </div>

    <div
      v-if="$p.type === 'common'"
      :class="$s.TourCard__Controls"
    >
      <Button
        kind="Secondary"
        corners="Md"
        @click="handleModalOpen(EModalsNames.TourModal)"
      >
        Подробнее
      </Button>

      <Button
        kind="Main"
        corners="Md"
        @click="handleModalOpen(EModalsNames.BookingConfirmModal)"
      >
        Забронировать
      </Button>
    </div>

    <div
      v-if="$p.type === 'tourist'"
      :class="$s.TourCard__Controls"
    >

      <Button
        kind="Main"
        corners="Md"
        @click="handleModalOpen(EModalsNames.TourModal)"
      >
        Подробнее
      </Button>
    </div>

    <div
      v-if="$p.type === 'agent' || $p.type === 'admin'"
      :class="$s.TourCard__Controls"
    >
      <Tag
        type="Success"
        :class="$s.TourCard__Tag"
      >
        {{ $p.data.status }}
      </Tag>

      <Button
        kind="Secondary"
        corners="Md"
        @click="handleModalOpen(EModalsNames.TourModal)"
      >
        Подробнее
      </Button>

      <Button
        kind="Main"
        corners="Md"
        @click="handleModalOpen(EModalsNames.TouristsListModal)"
      >
        Туристы
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
import { formatJSONDate } from '~@utils/helpers'
import { useToursStore } from '~@store/tours'

/**
 * TYPES
 */
type TCardType = 'common' | 'tourist' | 'agent' | 'admin'


/**
 * PROPS
 */
interface IProps {
  type?: TCardType
  data: Record<string, any>
}

const $p = withDefaults(defineProps<IProps>(), {
  type: 'common',
  data: () => {
    return {}
  },
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
const $modalsStore = useModalsStore()
const $toursStore = useToursStore()

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
const handleModalOpen = (modalName: EModalsNames): void => {
  $toursStore.setSelectedTourId($p.data._id)
  $modalsStore.setCurrentModalName(modalName)
}

</script>
