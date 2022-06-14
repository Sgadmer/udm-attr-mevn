  <template>
  <div :class="{
    [$s.Tag]: true,
    [$s[`Tag_${$p.type}`]]: true
  }">
    <slot/>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Tag.module.scss'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  type?: 'NEW' | 'ACTIVE' | 'PENDING' | 'FINISHED' | 'CANCELED' | 'BOOK_CANCELED' | 'BLOCKED',
}

const $p = withDefaults(defineProps<IProps>(), {
  type: 'NEW'
})

/**
 * EMITS
 */
interface IEmits {}

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
