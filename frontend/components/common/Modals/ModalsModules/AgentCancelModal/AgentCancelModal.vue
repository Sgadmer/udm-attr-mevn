<template>
  <ModalBase
    title="Отмена тура"
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

    <Checkbox
      v-model:checkboxModel="formModel.isAgree"
      :isError="$findError($v.$errors, 'isAgree')"
    >
      В случае оплаты тура туристом, процедура возврата денежных средств производится между туристом и турагентом без
      участия Udm-attraction.<br/>
      Я ознакомлен/на и согласен/на с условиями отмены тура.
    </Checkbox>

    <div :class="$s.Modals__Controls">
      <Button
        kind="Main"
        corners="Md"
        :class="$s.Modals__ConfirmBtn"
        @click="handleTourCancel"
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
import { useToursStore } from '~/store/tours'
import { useUserStore } from '~/store/user'
import { useModalsStore } from '~/store/modals'
import { and, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

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
const formModel = $ref({
  isAgree: false
})

const validationRules = {
  isAgree: {
    valid: and(required, (v) => {
      return v === true
    })
  }
}

const $v = useVuelidate(validationRules, formModel)


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
const handleTourCancel = async (): Promise<void> => {
  const isFormCorrect = await $v.value.$validate()
  if (!isFormCorrect) return

  $fetch('/api/tour', {
    method: 'PUT',
    body: {
      id: compTour._id,
      status: 'CANCELED',
    }
  }).then((res: Record<string, any>): void => {
    $modalsStore.setCurrentModalName(null)
    $toursStore.updateTour(compTour._id, res)
  }).catch(e => {
    console.error(e)
  })
}

</script>
