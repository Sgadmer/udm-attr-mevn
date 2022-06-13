<template>
  <div :class="$s.ListCard">
    <dl :class="$s.ListCard__Row">
      <div>
        <dt :class="$s.ListCard__Term">{{ compUserTitle }}</dt>
        <dd :class="$s.ListCard__Desc"
        v-if="$p.type === 'adminTourist'"
        >
          {{ $p.data.surname }}. {{ $p.data.name[0] }}.  {{ $p.data.patronymic[0] ? $p.data.patronymic[0] + '.' : ''}}
        </dd>
        <dd :class="$s.ListCard__Desc"
            v-if="$p.type === 'adminAgent'"
        >
          {{ $p.data.corpName }}
        </dd>
      </div>
      <div>
        <dt :class="$s.ListCard__Term">Телефон</dt>
        <dd :class="$s.ListCard__Desc">{{ $p.data.phone }}</dd>
      </div>
      <div>
        <dt :class="$s.ListCard__Term">Email</dt>
        <dd :class="$s.ListCard__Desc">{{ $p.data.email }}</dd>
      </div>
      <div>
        <dt :class="$s.ListCard__Term">{{ $p.type === 'agent' ? 'Статус брони' : 'Статус' }}</dt>
        <dd :class="$s.ListCard__Desc">
          <Tag type="Success" v-if="$p.type === 'agent'">{{ $p.data.bookStatus }}</Tag>
          <Tag type="Success" v-else>isActive: {{ $p.data.isActive }}</Tag>
        </dd>
      </div>
      <div
        v-if="$p.type === 'adminTourist' || $p.type ==='adminAgent'"
        :class="$s.ListCard__Controls"
      >
        <Button
          kind="Main"
          corners="Md"
          @click="changeUserActiveStatus(false)"
          v-if="$p.data.isActive"
        >
          Заблокировать
        </Button>
        <Button
          kind="Secondary"
          corners="Md"
          @click="changeUserActiveStatus(true)"
          v-if="!$p.data.isActive"
        >
          Разблокировать
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
  (e: 'onUpdate', newData: Record<string, any>): void
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
const changeUserActiveStatus = (isActive): void => {
  const userType = $p.type === 'adminTourist' ? 'tourist' : 'agent'

  $fetch(`/api/${ userType }`, {
    method: 'PUT',
    body: {
      id: $p.data._id,
      isActive: isActive,
    }
  })
    .then(res => {
      $e('onUpdate',res)
    })
    .catch(e => {
      console.error(e)
    })
}

</script>
