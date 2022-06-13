<template>
  <FormContainer
    orientation="Column"
    :class="$s.SignupModal__FormContainer"
  >

    <div :class="$s.SignupModal__FormFields">
      <Input
        v-model:inputModel="formModel.email"
        label="Email *"
        :isError="$findError($v.$errors, 'email')"
      />
      <Input
        v-model:inputModel="formModel.password"
        type="password"
        label="Пароль *"
        :isError="$findError($v.$errors, 'password')"
      />
      <Input
        v-model:inputModel="formModel.passwordRepeat"
        type="password"
        label="Повтор пароля *"
        :isError="$findError($v.$errors, 'passwordRepeat')"
      />
      <Input
        v-model:inputModel="formModel.phone"
        label="Телефон*"
        :isError="$findError($v.$errors, 'phone')"
      />
      <Input
        v-model:inputModel="formModel.name"
        label="Имя *"
        :isError="$findError($v.$errors, 'name')"
      />
      <Input
        v-model:inputModel="formModel.surname"
        label="Фамилия *"
        :isError="$findError($v.$errors, 'surname')"
      />
      <Input
        v-model:inputModel="formModel.patronymic"
        label="Отчество (при наличии)"
      />
    </div>

    <Button
      kind="Main"
      corners="Md"
      @click="handleSubmit"
    >
      Зарегистрироваться
    </Button>


  </FormContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './SignupModal.module.scss'
import useVuelidate from '@vuelidate/core'
import { and, email, maxLength, minLength, required, sameAs } from '@vuelidate/validators'
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
  email: '',
  password: '',
  passwordRepeat: '',
  phone: '',
  name: '',
  surname: '',
  patronymic: '',
})

const validationRules = {
  email: {
    emailValid: and(required, email)
  },
  password: {
    minLength: and(required, minLength(8))
  },
  passwordRepeat: {
    sameAsMain: and(required, (value) => value === formModel.password)
  },
  phone: {
    phoneValid: and(required, minLength(11), maxLength(11))
  },
  name: { required },
  surname: { required },
}

const $modalsStore = useModalsStore()
const $v = useVuelidate(validationRules, formModel)
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

  const { data, error } = await useFetch('/api/tourist', { method: 'POST', body: formModel })
  $modalsStore.setCurrentModalName(null)
}

</script>
