<template>
  <header :class="$s.Header" :key="$userStore.getIsKeepAuth">
    <Logo
      :useMobile="true"
    />
    <div :class="$s.Header__Controls">

      <div
        :class="$s.Header__UserWrapper"
        v-if="compIsAuthorized"
      >
        <p
          :class="$s.Header__User"
          @click="handleAccountRedirect"
        >
          {{ compUserName }}
        </p>
      </div>
      <Button
        kind="Transparent"
        corners="Sm"
        @click="handleLogout"
        v-if="compIsAuthorized"
      >
        Выйти
      </Button>


      <Button
        kind="Transparent"
        corners="Sm"
        :class="$s.Header__Login"
        @click="handleModalOpen(EModalsNames.LoginModal)"
        v-if="!compIsAuthorized"
      >
        Вход
      </Button>
      <Button
        kind="Main"
        corners="Sm"
        @click="handleModalOpen(EModalsNames.SignupModal)"
        v-if="!compIsAuthorized"
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
import { useUserStore } from '~@store/user'
import { useToursStore } from '~/store/tours'

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
const $userStore = useUserStore()
const $toursStore = useToursStore()

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */
const compUserName = computed((): string => {
  const userInfo = $userStore.getUserInfo

  switch (userInfo.existType) {
    case 'admin':
      return `Админ: ${ userInfo.info.surname } ${ userInfo.info.name[0] }. ${ userInfo.info.patronymic && userInfo.info.patronymic[0] + '.' }`
    case 'agent':
      return userInfo.info.corpName
    case 'tourist':
      return `${ userInfo.info.surname } ${ userInfo.info.name[0] }. ${ userInfo.info.patronymic && userInfo.info.patronymic[0] + '.' }`
  }
})

const compIsAuthorized = computed(() => {
  return Boolean($userStore.getUserInfo.existType)
})

/**
 * HOOKS
 */


/**
 * METHODS
 */
const handleLogout = (): void => {
  $userStore.$reset()
  $toursStore.loadAllTours()
  navigateTo(`/`)
}

const handleModalOpen = (modalName: EModalsNames): void => {
  $modalsStore.setCurrentModalName(modalName)
}

const handleAccountRedirect = (): void => {
  navigateTo(`/${ $userStore.getUserInfo.existType }`)
}
</script>
