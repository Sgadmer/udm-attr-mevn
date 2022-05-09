<template>
  <footer :class="$s.Footer">
    <Logo
      :class="$s.Footer__Logo"
    />
    <p
      :class="[$s.Footer__TextSecondary,$s.Footer__Promo]"
    >
      Наслаждайтесь путешествиями с нами
    </p>

    <div :class="$s.Footer__Info">
      <p>Руслан Хазиев</p>
      <p>Ижевск</p>
      <p>2022 г.</p>
    </div>
  </footer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Footer.module.scss'

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

</script>
