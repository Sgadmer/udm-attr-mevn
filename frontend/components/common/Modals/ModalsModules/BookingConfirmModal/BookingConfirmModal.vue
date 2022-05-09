<template>
  <ModalBase
    title="Подтверждение брони"
  >
    <dl :class="$s.BookingConfirm__InfoList">
      <div :class="$s.BookingConfirm__InfoRow">
        <dt :class="$s.BookingConfirm__InfoTerm">Название:</dt>
        <dd :class="$s.BookingConfirm__InfoDesc">Путешествие в пельменую долину</dd>
      </div>
      <div :class="$s.BookingConfirm__InfoRow">
        <dt :class="$s.BookingConfirm__InfoTerm">Место проведения:</dt>
        <dd :class="$s.BookingConfirm__InfoDesc">Пельменая долина. Посёлок Зеч Буреч</dd>
      </div>
      <div :class="$s.BookingConfirm__InfoRow">
        <dt :class="$s.BookingConfirm__InfoTerm">Сроки проведения:</dt>
        <dd :class="$s.BookingConfirm__InfoDesc">19.04.2022 - 19.04.2022</dd>
      </div>
      <div :class="$s.BookingConfirm__InfoRow">
        <dt :class="$s.BookingConfirm__InfoTerm">Стоимость:</dt>
        <dd :class="$s.BookingConfirm__InfoDesc">3500 рублей</dd>
      </div>
    </dl>

    <Checkbox>
      Процедура оплаты тура производится между туристом и турагентом без участия Udm-attraction.<br/>
      Данные турсиста будут переданы турагенту для дальнейшего взаимодействия.<br/>
      Я ознакомилен и согласен с условиями бронирования тура.
    </Checkbox>

    <div :class="$s.BookingConfirm__Controls">
      <Button
        kind="Main"
        corners="Md"
        :class="$s.BookingConfirm__ConfirmBtn"
      >
        Подтвердить
      </Button>
    </div>

  </ModalBase>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './BookingConfirmModal.module.scss'

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
