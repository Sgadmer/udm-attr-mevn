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
        v-model:inputModel="formModel.corpName"
        label="ФИО или название организации *"
        :isError="$findError($v.$errors, 'corpName')"
      />
      <Input
        v-model:inputModel="formModel.inn"
        label="ИНН *"
        :isError="$findError($v.$errors, 'inn')"
      />
      <Input
        v-model:inputModel="formModel.director"
        label="Руководитель *"
        :isError="$findError($v.$errors, 'director')"
      />
      <Input
        v-model:inputModel="formModel.phone"
        label="Контактный телефон *"
        :isError="$findError($v.$errors, 'phone')"
      />
      <Input
        v-model:inputModel="formModel.corpAddress"
        label="Адрес *"
        :isError="$findError($v.$errors, 'corpAddress')"
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
import { and, email, maxLength, minLength, required, sameAs } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
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
const formModel = $ref({
  email: '',
  password: '',
  passwordRepeat: '',
  corpName: '',
  inn: '',
  director: '',
  phone: '',
  corpAddress: '',
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
  corpName: { required },
  inn: {
    innValid: and(required, (value) => value.length === 10 || value.length === 12)
  },
  director: { required },
  phone: {
    phoneValid: and(required, minLength(11), maxLength(11))
  },
  corpAddress: { required },
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
  console.log(isFormCorrect, $v.value.$errors, formModel)

  if (!isFormCorrect) return

  const { data, error } = await useFetch('/api/agent', { method: 'POST', body: formModel })
  $modalsStore.setCurrentModalName(null)
}
</script>
