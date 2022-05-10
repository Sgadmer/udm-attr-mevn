<template>
  <ModalBase
    title="Отмена тура"
  >
    <dl :class="$s.Modals__InfoList">
      <div :class="$s.Modals__InfoRow">
        <dt :class="$s.Modals__InfoTerm">Название:</dt>
        <dd :class="$s.Modals__InfoDesc">Путешествие в пельменую долину</dd>
      </div>
      <div :class="$s.Modals__InfoRow">
        <dt :class="$s.Modals__InfoTerm">Место проведения:</dt>
        <dd :class="$s.Modals__InfoDesc">Пельменая долина. Посёлок Зеч Буреч</dd>
      </div>
      <div :class="$s.Modals__InfoRow">
        <dt :class="$s.Modals__InfoTerm">Сроки проведения:</dt>
        <dd :class="$s.Modals__InfoDesc">19.04.2022 - 19.04.2022</dd>
      </div>
      <div :class="$s.Modals__InfoRow">
        <dt :class="$s.Modals__InfoTerm">Стоимость:</dt>
        <dd :class="$s.Modals__InfoDesc">3500 рублей</dd>
      </div>
    </dl>

    <Checkbox>
      В случае оплаты тура туристом, процедура возврата денежных средств производится между туристом и турагентом без участия Udm-attraction.<br/>
      Я ознакомлен/на и согласен/на с условиями отмены тура.
    </Checkbox>

    <div :class="$s.Modals__Controls">
      <Button
        kind="Main"
        corners="Md"
        :class="$s.Modals__ConfirmBtn"
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
import $s from '../../Modals.module.scss'

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
