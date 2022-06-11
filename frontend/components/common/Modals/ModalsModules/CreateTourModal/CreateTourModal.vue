<template>
  <ModalBase
    title="Создание тура"
  >
    <FormContainer orientation="Column">
      <InputFile
        v-model:inputModel="formModel.mainPhoto"
        :allowedExt="['.jpg', '.jpeg', '.png']"
        label="Загрузить главное фото"
        :showImages="true"
        :isError="$findError($v.$errors, 'mainPhoto')"
      />
      <InputFile
        v-model:inputModel="formModel.addPhotos"
        :allowedExt="['.jpg', '.jpeg', '.png']"
        label="Загрузить дополнительные фото (макс. 10)"
        :maxCount="10"
        :showImages="true"
        :isError="$findError($v.$errors, 'addPhotos')"
      />
      <div :class="$s.Modals__ShortControls">
        <Input
          v-model:inputModel="formModel.title"
          label="Название"
          :isError="$findError($v.$errors, 'title')"
        />
        <Input
          v-model:inputModel="formModel.price"
          label="Стоимость"
          :isNumber="true"
          :maxNumber="100000"
          :isError="$findError($v.$errors, 'price')"
        />
        <Input
          v-model:inputModel="formModel.place"
          label="Место проведения"
          :isError="$findError($v.$errors, 'place')"
        />
        <div :class="$s.Modals__Row">
          <Datepicker
            v-model:datepickerModel="formModel.dateStart"
            inputLabel="Дата с"
            :maxDate="formModel.dateEnd"
            :class="$s.Modals__DatepickerFirst"
            :isError="$findError($v.$errors, 'dateStart')"
          />
          <Datepicker
            v-model:datepickerModel="formModel.dateEnd"
            inputLabel="Дата по"
            :minDate="formModel.dateStart"
            :isError="$findError($v.$errors, 'dateEnd')"
          />
        </div>
        <Input
          v-model:inputModel="formModel.desc"
          label="Описание"
          :isTextarea="true"
          :maxLength="2000"
          :isError="$findError($v.$errors, 'desc')"
        />
      </div>

      <Checkbox
        v-model:checkboxModel="formModel.agree"
        :class="$s.Modals__AgreeCheckbox"
        :isError="$findError($v.$errors, 'agree')"
      >
        Я подтверждаю, что мой тур не содержит информации, противоречащей правилам сайта.<br/>
        Я беру на себя всю ответственность за информацию, предоставленную в этой заявке.<br/>
        Я согласен/на с тем, что заявка может быть заблокирована по решению администрации в одностороннем порядке без
        предварительного уведомления.
      </Checkbox>

      <div :class="$s.Modals__Controls">
        <Button
          kind="Main"
          corners="Md"
          @click="handleSubmit"
        >
          Отправить заявку
        </Button>
      </div>
    </FormContainer>
  </ModalBase>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from '../../Modals.module.scss'
import { and, maxLength, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { useUserStore } from '~/store/user'
import { useToursStore } from '~/store/tours'
import { useModalsStore } from '~/store/modals'

const { $findError } = useNuxtApp()

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
  mainPhoto: null,
  addPhotos: null,
  title: 'fgh',
  price: 345,
  place: 'efgere',
  dateStart: Date.now(),
  dateEnd: Date.now(),
  desc: 'fwefwf',
  agree: true,
})

const validationRules = {
  mainPhoto: {
    valid: required
  },
  addPhotos: {
    valid: required
  },
  title: { required },
  price: {
    valid: and(required, maxLength(2000))
  },
  place: { required },
  dateStart: {
    valid: required
  },
  dateEnd: {
    valid: required
  },
  desc: {
    valid: and(required, maxLength(2000))
  },
  agree: {
    valid: and(required, (v) => {
      return v === true
    })
  }
}

const $v = useVuelidate(validationRules, formModel)
const $userStore = useUserStore()
const $toursStore = useToursStore()
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
const handleSubmit = async (): Promise<void> => {
  const isFormCorrect = await $v.value.$validate()

  if (!isFormCorrect) return

  let fd = new FormData()

  Object.entries(formModel).forEach(([key, value]) => {

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        fd.append(key, item)
      })
    }
    fd.append(key, value)
  })
  fd.append('agentId', $userStore.getUserInfo.info._id)


  $fetch('/api/tour', {
    method: 'POST',
    body: fd,
  }).then(newTour => {
    $toursStore.setAccountTours([...$toursStore.getAccountTours, newTour])
    $modalsStore.setCurrentModalName(null)
  }).catch(e => {
    console.error(e)
  })
}

</script>
