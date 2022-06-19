<template>
  <h2 class="NewAddress">
    <span>Сайт обзавёлся своим хостингом! =)</span>
    <span>&#8595;</span>
    <Button
      @click="handleRedirect"
    >
      udm-attr.ru
    </Button>
  </h2>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */

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
const handleRedirect = ()=>{
  window.location.href = "https://udm-attr.ru/";
}

</script>

<style scoped>
.NewAddress {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
