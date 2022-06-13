<template>
  <ModalBase>
    <div :class="$s.TourModal__Row">
      <div :class="[$s.TourModal__Column, $s.TourModal__Left]">
        <TourSlider
          :images="compTour.addPhotos"
        />

        <div
          :class="$s.TourModal__Status"
          v-if="$route.name !== 'index'"
        >
          <span>Статус:&nbsp;&nbsp;&nbsp;</span>
          <Tag
            :type="compTour.status"
          >
            {{ EStatus[compTour.status] }}
          </Tag>

        </div>

        <Button
          kind="Secondary"
          corners="Md"
          :class="$s.TourModal__AcionBtn"
          @click="handleBookModalOpen"
          v-if="$route.name === 'index' && $userStore.getIsTourist"
        >
          Забронировать
        </Button>
        <Button
          kind="Secondary"
          corners="Md"
          :class="$s.TourModal__AcionBtn"
          @click="handleModalOpen(EModalsNames.AgentCancelModal)"
          v-if="$route.name === 'agent' && $toursStore.getTourStatus(compTour._id) !== 'CANCELED'"
        >
          Отменить тур
        </Button>
        <Button
          kind="Secondary"
          corners="Md"
          :class="$s.TourModal__AcionBtn"
          @click="handleModalOpen(EModalsNames.TouristCancelModal)"
          v-if="$route.name === 'tourist' &&  (
            $toursStore.getTouristBookStatus(compTour._id) !== 'CANCELED' &&
            compTour.status === 'ACTIVE'
            )"
        >
          Отменить бронь
        </Button>

        <Button
          kind="Main"
          corners="Md"
          :class="[$s.TourModal__AcionBtn, $s.TourModal__AcionBtn_Small]"
          @click="handleNewTourStatusChange(true)"
          v-if="$route.name === 'admin' && compTour.status === 'NEW'"
        >
          Одобрить
        </Button>
        <Button
          kind="Secondary"
          corners="Md"
          :class="[$s.TourModal__AcionBtn, $s.TourModal__AcionBtn_Small]"
          @click="handleNewTourStatusChange(false)"
          v-if="$route.name === 'admin' && compTour.status === 'NEW'"
        >
          Отклонить
        </Button>
        <Button
          kind="Main"
          corners="Md"
          :class="[$s.TourModal__AcionBtn, $s.TourModal__AcionBtn_Small]"
          @click="handleNewTourStatusChange(false)"
          v-if="$route.name === 'admin' && (compTour.status === 'ACTIVE' || compTour.status === 'PENDING')"
        >
          Заблокировать
        </Button>
        <Button
          kind="Secondary"
          corners="Md"
          :class="[$s.TourModal__AcionBtn, $s.TourModal__AcionBtn_Small]"
          @click="handleNewTourStatusChange(true)"
          v-if="$route.name === 'admin' && compTour.status === 'BLOCKED'"
        >
          Разблокировать
        </Button>

      </div>

      <div :class="$s.TourModal__Column">
        <ScrollContainer>
          <h2 :class="$s.TourModal__InfoTitle">
            {{ compTour.title }}
          </h2>

          <div :class="$s.TourModal__Info">
            <p :class="[$s.TourModal__InfoItem, $s.TourCard__InfoItem_Cut]">
              {{ compTour.place }}
            </p>

            <p :class="$s.TourModal__InfoItem">
              {{ formatJSONDate(compTour.dateStart) }} - {{ formatJSONDate(compTour.dateEnd) }}
            </p>

            <p :class="$s.TourModal__InfoItem">
              3500 ₽ / <small :class="$s.TourCard__InfoSmall">на 1 человека</small>
            </p>
          </div>

          <p :class="$s.TourModal__Description">
            {{ compTour.desc }}
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
import { useUserStore } from '~@store/user'
import { EStatus } from '~@models/status'
import * as dfns from 'date-fns'

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
const $userStore = useUserStore()

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */
const compTour = $computed((): Record<string, any> => $toursStore.getSelectedTour)

/**
 * HOOKS
 */

/**
 * METHODS
 */
const handleModalOpen = (modalName: EModalsNames): void => {
  $toursStore.setSelectedTourId(compTour._id)
  $modalsStore.setCurrentModalName(modalName)
}

const handleBookModalOpen = (): void => {
  if (!$userStore.getUserInfo.info) {
    $modalsStore.setCurrentModalName(EModalsNames.LoginModal)
  } else {
    $toursStore.setSelectedTourId(compTour._id)
    $modalsStore.setCurrentModalName(EModalsNames.BookingConfirmModal)
  }
}


const handleNewTourStatusChange = (isApproved: boolean): void => {

  const dateStart = dfns.getTime(dfns.parseJSON(compTour.dateStart))
  const dateEnd = dfns.getTime(dfns.parseJSON(compTour.dateEnd))
  const dateNow = dfns.getTime(new Date())

  let status = ''

  if (isApproved) {
    if (dateNow <= dateStart) status = 'ACTIVE'
    else if (dateNow >= dateStart && dateNow < dateEnd) status = 'PENDING'
    else status = 'CANCELED'
  } else {
    status = 'BLOCKED'
  }

  $fetch('/api/tour', {
    method: 'PUT',
    body: {
      id: compTour._id,
      status
    }
  }).then(res => {
    $toursStore.updateTour(compTour._id, res)
  }).catch(e => {
    console.error(e)
  })
}

</script>
