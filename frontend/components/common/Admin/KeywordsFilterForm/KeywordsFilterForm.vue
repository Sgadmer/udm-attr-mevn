<template>
  <StickyContainer>
    <FormContainer>
      <Input
        v-model:inputModel="formModel.keywords"
        label="Ключевые слова (через запятую)"
        modelJoin=", "
        :modelSplit="REG_EXP.commaSeparator"
        :charsToDelete="REG_EXP.exceptBaseList"
      />
      <Button
        corners="Md"
      >
        Искать
      </Button>
    </FormContainer>
  </StickyContainer>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './KeywordsFilterForm.module.scss'
import { REG_EXP } from '~@constants/regExps'

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
const formModel = $ref({
  keywords: []
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
