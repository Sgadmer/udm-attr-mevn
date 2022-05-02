<template>
  <header :class="$s.Header">
    <Logo/>
    <div>
      <Button
        kind="Transparent"
        corners="Sm"
        :class="$s.Header__Login"
        @click="handleLogin"
      >
        Вход
      </Button>
      <Button
        kind="Main"
        corners="Sm"
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
const handleLogin = (): void => {
  console.log('login')
}
</script>
