<template>

  <ModalBase
    title="Регистрация"
  >

    <template #beforeContent>
      <Tabs
        :tabs="tabs"
        @onTabChange="handleTabChange"
      />
    </template>
    <transition name="fadeFaster" mode="out-in">
      <component :is="selectedForm"/>
    </transition>
  </ModalBase>
</template>

<script lang='ts'>
import TouristSignupForm from './TouristSignupForm'
import AgentSignupForm from './AgentSignupForm'

export default {
  components: {
    TouristSignupForm,
    AgentSignupForm
  }
}
</script>


<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './SignupModal.module.scss'

/**
 * TYPES
 */
type TFormNames = 'TouristSignupForm' | 'AgentSignupForm'

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
let selectedForm = $ref<TFormNames>('TouristSignupForm')
const tabs = $ref([
  {
    text: 'Турист',
    value: 'TouristSignupForm',
    selected: true
  },
  {
    text: 'Турагент',
    value: 'AgentSignupForm',
  },
])

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
const handleTabChange = (selectedTabValue: TFormNames): void => {
  selectedForm = selectedTabValue
}

</script>
