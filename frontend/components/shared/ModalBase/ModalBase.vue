<template>
  <div :class="$s.ModalBase">
    <div :class="$s.ModalBase__ContentWrapper">
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

      <h2
        v-if="$p.title"
        :class="$s.ModalBase__Title"
      >
        {{ $p.title }}
      </h2>

      <ScrollContainer
        :unstyled="true"
        :class="$s.ModalBase__Content"
      >
        <slot/>
      </ScrollContainer>
    </div>
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
  $modalsStore.setCurrentModalName(null)
}

</script>
