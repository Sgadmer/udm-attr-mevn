<template>
  <ModalBase>
    <div :class="$s.TourModal__Row">
      <div :class="[$s.TourModal__Column, $s.TourModal__Left]">
        <TourSlider
          :images="tour.addPhotos"
        />

        <div
          :class="$s.TourModal__Status"
          v-if="$route.name !== 'index'"
        >
          <span>Статус:&nbsp;&nbsp;&nbsp;</span>
          <Tag type="Success">{{ tour.status }}</Tag>
        </div>

        <Button
          kind="Secondary"
          corners="Md"
          :class="$s.TourModal__AcionBtn"
          @click="handleModalOpen(EModalsNames.BookingConfirmModal)"
          v-if="$route.name === 'index'"
        >
          Забронировать
        </Button>
        <Button
          kind="Secondary"
          corners="Md"
          :class="$s.TourModal__AcionBtn"
          @click="handleModalOpen(EModalsNames.AgentCancelModal)"
          v-if="$route.name === 'agent'"
        >
          Отменить тур
        </Button>
        <Button
          kind="Secondary"
          corners="Md"
          :class="$s.TourModal__AcionBtn"
          @click="handleModalOpen(EModalsNames.TouristCancelModal)"
          v-if="$route.name === 'tourist'"
        >
          Отменить бронь
        </Button>
      </div>

      <div :class="$s.TourModal__Column">
        <ScrollContainer>
          <h2 :class="$s.TourModal__InfoTitle">
            {{ tour.title }}
          </h2>

          <div :class="$s.TourModal__Info">
            <p :class="[$s.TourModal__InfoItem, $s.TourCard__InfoItem_Cut]">
              {{ tour.place }}
            </p>

            <p :class="$s.TourModal__InfoItem">
              {{ formatJSONDate(tour.dateStart) }} - {{ formatJSONDate(tour.dateEnd) }}
            </p>

            <p :class="$s.TourModal__InfoItem">
              3500 ₽ / <small :class="$s.TourCard__InfoSmall">на 1 человека</small>
            </p>
          </div>

          <p :class="$s.TourModal__Description">
            {{ tour.desc }}
          </p>
        </ScrollContainer>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './TourModal.module.scss'
import { EModalsNames } from '~@constants/modals'
import { useModalsStore } from '~@store/modals'
import { useToursStore } from '~@store/tours'
import { formatJSONDate } from '~@utils/helpers'

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
const $toursStore = useToursStore()
let tour = $ref<Record<string, any>>($toursStore.getSelectedTour)

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
  $modalsStore.setCurrentModalName(modalName)
}

</script>
