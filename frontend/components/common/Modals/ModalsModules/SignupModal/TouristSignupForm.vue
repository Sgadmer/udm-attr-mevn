<template>
  <FormContainer
    orientation="Column"
    :class="$s.SignupModal__FormContainer"
  >

    <div :class="$s.SignupModal__FormFields">
      <Input
        v-model:inputModel="formModel.email"
        label="Email *"
      />
      <Input
        v-model:inputModel="formModel.password"
        type="password"
        label="Пароль *"
      />
      <Input
        v-model:inputModel="formModel.passwordRepeat"
        type="password"
        label="Повтор пароля *"
      />
      <Input
        v-model:inputModel="formModel.email"
        label="Телефон*"
      />
      <Input
        v-model:inputModel="formModel.email"
        label="Фамилия *"
      />
      <Input
        v-model:inputModel="formModel.email"
        label="Имя *"
      />
      <Input
        v-model:inputModel="formModel.email"
        label="Отчество (при наличии)"
      />
    </div>

    <Button
      kind="Main"
      corners="Md"
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
  secondName: '',
  firstName: '',
  lastName: '',
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
