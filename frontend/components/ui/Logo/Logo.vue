<template>
  <p :class="$s.Logo" @click="handleLogoClick">
    <span :class="{
      [$s.Logo__Udm]: true,
      [$s.Logo_DesctopOnly]: $p.useMobile
    }">
      Udm</span>
    <span
      :class="{[$s.Logo_DesctopOnly]: $p.useMobile}"
    >
      -attraction</span>

    <span
      :class="{
        [$s.Logo__Udm]: true,
        [$s.Logo_MobileOnly]: true,
      }"
      v-if="$p.useMobile"
    >
      Udm
    </span>
    <span
      :class="{[$s.Logo_MobileOnly]: true}"
      v-if="$p.useMobile"
    >
      -attr</span>
  </p>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Logo.module.scss'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  useMobile?: boolean
}

const $p = withDefaults(defineProps<IProps>(), {
  useMobile: false
})

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
const handleLogoClick = (): void => {
  navigateTo('/')
}

</script>
