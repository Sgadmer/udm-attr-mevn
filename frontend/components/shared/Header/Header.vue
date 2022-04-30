<template>
  <header :class="$s.Header">
    <Logo/>
    <div>
      <Button
        type="Transparent"
        corners="Sm"
        :class="$s.Header__Login"
        @click="handleLogin"
      >
        Вход
      </Button>
      <Button
        type="Main"
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
 * METHODS
 */
const handleLogin = (): void =>{
  console.log('login')
}
</script>
