<template>
  <ModalBase
    title="Отказ от бронирования тура"
  >
    <dl :class="$s.Modals__InfoList">
      <div :class="$s.Modals__InfoRow">
        <dt :class="$s.Modals__InfoTerm">Название:</dt>
        <dd :class="$s.Modals__InfoDesc">{{ compTour.title }}</dd>
      </div>
      <div :class="$s.Modals__InfoRow">
        <dt :class="$s.Modals__InfoTerm">Место проведения:</dt>
        <dd :class="$s.Modals__InfoDesc">{{ compTour.place }}</dd>
      </div>
      <div :class="$s.Modals__InfoRow">
        <dt :class="$s.Modals__InfoTerm">Сроки проведения:</dt>
        <dd :class="$s.Modals__InfoDesc"> {{ formatJSONDate(compTour.dateStart) }} - {{
            formatJSONDate(compTour.dateEnd)
          }}
        </dd>
      </div>
      <div :class="$s.Modals__InfoRow">
        <dt :class="$s.Modals__InfoTerm">Стоимость:</dt>
        <dd :class="$s.Modals__InfoDesc">{{ compTour.price }} рублей</dd>
      </div>
    </dl>

    <Checkbox>
      В случае оплаты тура туристом, процедура возврата денежных средств производится между туристом и турагентом без участия Udm-attraction.<br/>
      Я ознакомлен/на и согласен/на с условиями отказа от тура.
    </Checkbox>

    <div :class="$s.Modals__Controls">
      <Button
        kind="Main"
        corners="Md"
        :class="$s.Modals__ConfirmBtn"
        @click="handleBookCancel"
      >
        Подтвердить
      </Button>
    </div>

  </ModalBase>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../../Modals.module.scss'
import { formatJSONDate } from '~@utils/helpers'
import { useToursStore } from '~@store/tours'
import { useUserStore } from '~/store/user'
import { useModalsStore } from '~/store/modals'

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
const $modalsStore = useModalsStore()

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
const handleBookCancel = (): void => {
  $fetch('/api/tour/tourist', {
    method: 'PUT',
    body: {
      tourId: compTour._id,
      touristId: $userStore.getUserInfo.info._id,
      status: 'CANCELED',
      operation: 'change'
    }
  }).then(res => {
    $modalsStore.setCurrentModalName(null)
    $toursStore.updateTour(compTour._id, res)
  }).catch(e => {
    console.error(e)
  })
}

</script>
