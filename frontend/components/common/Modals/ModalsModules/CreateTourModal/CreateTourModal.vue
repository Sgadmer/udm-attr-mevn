<template>
  <ModalBase
    title="Создание тура"
  >
    <FormContainer orientation="Column">
      <InputFile
        :allowedExt="['.jpg', '.jpeg', '.png']"
        label="Загрузить главное фото"
        :showImages="true"
      />
      <InputFile
        :allowedExt="['.jpg', '.jpeg', '.png']"
        label="Загрузить дополнительные фото (макс. 10)"
        :maxCount="10"
        :showImages="true"
      />
      <div :class="$s.Modals__ShortControls">
        <Input
          v-model:inputModel="formModel.title"
          label="Название"
        />
        <Input
          v-model:inputModel="formModel.price"
          label="Стоимость"
          :isNumber="true"
          :maxLength="6"
        />
        <Input
          v-model:inputModel="formModel.place"
          label="Место проведения"
        />
        <div :class="$s.Modals__Row">
          <Datepicker
            v-model:datepickerModel="formModel.dateStart"
            inputLabel="Дата с"
            :maxDate="formModel.dateEnd"
            :class="$s.Modals__DatepickerFirst"
          />
          <Datepicker
            v-model:datepickerModel="formModel.dateEnd"
            inputLabel="Дата по"
            :minDate="formModel.dateStart"
          />
        </div>
        <Input
          v-model:inputModel="formModel.desc"
          label="Описание"
          :isTextarea="true"
        />
      </div>

      <Checkbox
        :class="$s.Modals__AgreeCheckbox"
      >
        Я подтверждаю, что мой  тур  не содержит информации, противоречащей правилам сайта.<br/>
        Я беру на себя всю ответственность за информацию, предоставленную в этой заявке.<br/>
        Я согласен/на с тем, что заявка может быть заблокирована по решению администрации в одностороннем порядке без предварительного уведомления.
      </Checkbox>

      <div :class="$s.Modals__Controls">
        <Button
          kind="Main"
          corners="Md"
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
  title: '',
  price: null,
  dateStart: null,
  dateEnd: null,
  desc: '',
})

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
