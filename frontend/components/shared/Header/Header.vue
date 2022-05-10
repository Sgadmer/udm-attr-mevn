<template>
  <header :class="$s.Header">
    <Logo/>
    <div :class="$s.Header__Controls">
      <p :class="$s.Header__User">
        Хазиев Р.Н.
      </p>
      <Button
        kind="Transparent"
        corners="Sm"
        :class="$s.Header__Login"
        @click="handleModalOpen(EModalsNames.LoginModal)"
      >
        Вход
      </Button>
      <Button
        kind="Main"
        corners="Sm"
        @click="handleModalOpen(EModalsNames.SignupModal)"
      >
        Регистрация
      </Button>
    </div>
  </header>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Header.module.scss'
import { EModalsNames } from '~/constants/modals'
import { useModalsStore } from '~@store/modals'

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

const handleModalOpen = (modalName: EModalsNames): void => {
  $modalsStore.setCurrentModalName(modalName)
}
</script>
