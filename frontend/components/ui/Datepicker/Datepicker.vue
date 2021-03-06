<template>
  <div data-component="Datepicker">
    <ClientOnly>
      <Datepicker
        v-model="localModel"
        @update:modelValue="handleDate"
        :format="pickerProps.format"
        :locale="pickerProps.locale"
        :monthNameFormat="pickerProps.monthNameFormat"
        :clearable="pickerProps.clearable"
        :autoApply="pickerProps.autoApply"
        :minDate="$p.noDateRange ? null : compMinDate"
        :maxDate="$p.noDateRange ? null : compMaxDate"
        :closeOnScroll="pickerProps.closeOnScroll"
        :enableTimePicker="pickerProps.enableTimePicker"
        :class="$s.Datepicker"

      >
        <template #dp-input="{ value, onInput, onEnter, onTab, onClear }">
          <Input
            :inputValue="value"
            :label="$p.inputLabel"
            :isError="$p.isError"
          />
        </template>
      </Datepicker>
    </ClientOnly>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Datepicker.module.scss'
import Datepicker from '@vuepic/vue-datepicker'
import * as dfns from 'date-fns'


/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  inputLabel?: string,
  minDate?: Date | string,
  maxDate?: Date | string,
  noDateRange?: boolean,
  datepickerModel?: Date,
  isError?: boolean
}

const $p = withDefaults(defineProps<IProps>(), {
  inputLabel: '',
  minDate: null,
  maxDate: null,
  datepickerModel: null,
  isError: false,
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'update:datepickerModel'): void
}

const $e = defineEmits<IEmits>()

/**
 * DATA
 */
const localModel = $ref<Date>()
const pickerProps = $ref<Record<string, any>>({
  format: 'dd.MM.yyyy',
  monthNameFormat: 'long',
  locale: 'ru',
  clearable: true,
  autoApply: true,
  enableTimePicker: false,
  closeOnScroll: true,
})

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */
const compMinDate = computed((): Date | string => {
  if (!$p.minDate) return new Date()
  else return $p.minDate
})

const compMaxDate = computed((): Date | string => {
  if (!$p.maxDate) return dfns.add(new Date(), { months: 3 })
  else return $p.maxDate
})

/**
 * HOOKS
 */

/**
 * METHODS
 */
const handleDate = (modelData) => {
  $e('update:datepickerModel', modelData)
}

</script>
