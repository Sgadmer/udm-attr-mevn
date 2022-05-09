<template>
  <ModalBase
    title="Вход"
  >
    <FormContainer
      orientation="Column"
      :class="$s.LoginModal__FormContainer"
    >

      <div :class="$s.LoginModal__FormFields">
        <Input
          v-model:inputModel="formModel.email"
          label="Email"
        />
        <Input
          v-model:inputModel="formModel.password"
          type="password"
          label="Пароль"
          :class="$s.LoginModal__PasswordInput"
        />
        <Checkbox>
          Оставаться в системе
        </Checkbox>
      </div>

      <div :class="$s.LoginModal__Controls">
        <Button
          kind="Main"
          corners="Md"
        >
          Войти
        </Button>

        <p :class="$s.LoginModal__ControlsSeparator">
          ИЛИ
        </p>

        <Button
          kind="Secondary"
          corners="Md"
        >
          Зарегистрироваться
        </Button>
      </div>

    </FormContainer>
  </ModalBase>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './LoginModal.module.scss'

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
