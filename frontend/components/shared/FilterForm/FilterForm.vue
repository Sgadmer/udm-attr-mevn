<template>
  <StickyContainer>
    <Input
      v-model:inputModel="formModel.place"
      label="Место"
    />
  </StickyContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './FilterForm.module.scss'

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
const formModel = $ref<Record<string, any>>({
  place: 'Test',
  keyWords: ['Test', 'Test2', 'Test3'],
  priceMin: 0,
  priceMax: 100000,
  dateStart: null,
  dateEnd: null,
})

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
