<template>
  <div :class="$s.ListCard">
    <dl :class="$s.ListCard__Row">
      <div>
        <dt :class="$s.ListCard__Term">{{ compUserTitle }}</dt>
        <dd :class="$s.ListCard__Desc">{{ $p.data.touristId.name }}</dd>
      </div>
      <div>
        <dt :class="$s.ListCard__Term">Телефон</dt>
        <dd :class="$s.ListCard__Desc">{{ $p.data.touristId.phone }}</dd>
      </div>
      <div>
        <dt :class="$s.ListCard__Term">Email</dt>
        <dd :class="$s.ListCard__Desc">{{ $p.data.touristId.email }}</dd>
      </div>
      <div>
        <dt :class="$s.ListCard__Term">{{ $p.type === 'agent' ? 'Статус брони' : 'Статус' }}</dt>
        <dd :class="$s.ListCard__Desc">
          <Tag type="Success">{{ $p.data.bookStatus }}</Tag>
        </dd>
      </div>
      <div
        v-if="$p.type === 'adminTourist' || $p.type ==='adminAgent'"
        :class="$s.ListCard__Controls"
      >
        <Button
          kind="Main"
          corners="Md"
        >
          Заблокировать
        </Button>
        <Button
          kind="Secondary"
          corners="Md"
        >
          Разаблокировать
        </Button>
      </div>
    </dl>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './ListCard.module.scss'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  type?: 'agent' | 'adminTourist' | 'adminAgent',
  data: Record<string, any>
}

const $p = withDefaults(defineProps<IProps>(), {
  type: 'agent',
  data: () => {
    return {}
  }
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
const compUserTitle = computed((): string => {
  switch ($p.type) {
    case 'agent':
      return 'ФИО'
      break
    case 'adminTourist':
      return 'ФИО'
      break
    case 'adminAgent':
      return 'Компания (или ФИО)'
      break
  }
})

/**
 * HOOKS
 */

/**
 * METHODS
 */

</script>
