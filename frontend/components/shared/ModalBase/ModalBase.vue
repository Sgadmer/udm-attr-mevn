<template>
  <div :class="$s.ModalBase">

    <header :class="$s.ModalBase__Header">
      <Logo/>
      <Button
        kind="Secondary"
        corners="Circle"
        @click="handleModalClose"
      >
        X
      </Button>
    </header>

    <ScrollContainer
      :unstyled="true"
    >
      <div :class="$s.ModalBase__ContentWrapper">
        <h2
          v-if="$p.title"
          :class="$s.ModalBase__Title"
          v-html="$p.title"
        />

        <slot name="beforeContent"/>
        <div
          :class="$s.ModalBase__Content"
        >
          <slot/>
        </div>

      </div>
    </ScrollContainer>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './ModalBase.module.scss'
import { useModalsStore } from '~@store/modals'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  title?: string
}

const $p = withDefaults(defineProps<IProps>(), {
  title: null
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'onBeforeClose'): void
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
const handleModalClose = (): void => {
  $e('onBeforeClose')
  $modalsStore.setCurrentModalName(null)
}
</script>
