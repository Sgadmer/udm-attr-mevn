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
          :isError="$findError($v.$errors, 'email')"
        />
        <Input
          v-model:inputModel="formModel.password"
          type="password"
          label="Пароль"
          :class="$s.LoginModal__PasswordInput"
          :isError="$findError($v.$errors, 'password')"
        />
        <!--        <Checkbox-->
        <!--          v-model:checkboxModel="formModel.isKeepAuth"-->
        <!--        >-->
        <!--          Оставаться в системе-->
        <!--        </Checkbox>-->
      </div>

      <div :class="$s.LoginModal__Controls">
        <Button
          kind="Main"
          corners="Md"
          @click="handleSubmit"
        >
          Войти
        </Button>

        <p :class="$s.LoginModal__ControlsSeparator">
          ИЛИ
        </p>

        <Button
          kind="Secondary"
          corners="Md"
          @click="handleModalOpen(EModalsNames.SignupModal)"
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
import useVuelidate from '@vuelidate/core'
import { and, email, minLength, required } from '@vuelidate/validators'
import { EModalsNames } from '~/constants/modals'
import { useModalsStore } from '~@store/modals'
import { useUserStore } from '~/store/user'
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
  isKeepAuth: true,
})
const $modalsStore = useModalsStore()
const $userStore = useUserStore()

const validationRules = {
  email: {
    emailValid: and(required, email)
  },
  password: {
    minLength: and(required, minLength(8))
  }
}

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

  console.log(isFormCorrect, $v.value, formModel)
  if (!isFormCorrect) return

  const { data, error } = await useFetch('/api/user/check', {
    method: 'GET',
    params: {
      email: formModel.email,
      password: formModel.password,
    }
  })

  const foundUser = data.value
  if (foundUser.isExist) {
    $userStore.setIsKeepAuth(formModel.isKeepAuth)
    $userStore.setUserInfo(foundUser)
    navigateTo(`/${ foundUser.existType }`)
    setTimeout(() => {
      handleModalOpen(null)
    }, 500)
  }

}

const handleModalOpen = (modalName: EModalsNames): void => {
  $modalsStore.setCurrentModalName(modalName)
}
</script>
