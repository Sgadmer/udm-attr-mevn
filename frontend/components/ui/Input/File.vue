<template>
  <div
    data-component="InputFile"
    :class="{
    [$s.Input__FileWrapper]: true,
    [$s.Input_Error]: $p.isError
  }"
  >
    <Button
      @click="handleLoadBtnClick"
      :class="$s.Input__LoadBtn"
    >
      {{ label }}
    </Button>
    <input
      type="file"
      ref="fileInputRef"
      :accept="compAllowedExt"
      :multiple="$p.maxCount > 1"
      @change="handleFileLoading($event)"
      hidden
    >

    <small v-if="preparedImages.length">
      <br/>Файлов загружено: {{ preparedImages.length }}
    </small>

    <div
      v-if="$p.showImages && preparedImages.length"
      :class="$s.Input__ImagesContainer"
    >

      <div
        v-for="(img, i) in preparedImages"
        :key="'prevImg' + i"
        :class="$s.Input__ImageWrapper"
      >
        <img
          :src="img"
          alt="loaded image"
          :class="$s.Input__LoadedImage"
        />


        <button
          :class="$s.Input__DeleteImageBtn"
          @click="handleImageDelete(i)"
        >
          X
        </button>

        <span :class="$s.Input__ImageCounter">
          {{ i + 1 }}
        </span>

      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>

/**
 * IMPORTS
 */
import $s from './Input.module.scss'
import _ from 'lodash'
import { compressAccurately } from 'image-conversion'

/**
 * TYPES
 */

/**
 * PROPS
 */
interface IProps {
  allowedExt: string[],
  label?: string,
  maxCount?: number,
  showImages?: boolean,
  isError?: boolean
}

const $p = withDefaults(defineProps<IProps>(), {
  allowedExt: () => [],
  label: 'Загрузить',
  maxCount: 1,
  showImages: false,
  isError: false
})

/**
 * EMITS
 */
interface IEmits {
  (e: 'update:inputModel', newValue: any): void
}

const $e = defineEmits<IEmits>()

/**
 * DATA
 */
const fileInputRef = $ref(null)
const preparedImages = $ref([])

/**
 * WATCHERS
 */

/**
 * COMPUTED
 */
const compAllowedExt = computed(() => {
  if ($p.allowedExt.length) return $p.allowedExt.join(', ')
  else return ''
})

/**
 * HOOKS
 */

/**
 * METHODS
 */

const handleLoadBtnClick = (): void => {
  fileInputRef.click()
}

const handleImageDelete = (index: number): void => {
  _.remove(preparedImages, (img, i) => {
    return i === index
  })
}

const compressImage = async (img) => {
  const res = await compressAccurately(img, 200)
  return URL.createObjectURL(res)
}

const handleFileLoading = (e: HTMLInputEvent): void => {
  const files = [...e.target.files]
  files.length = $p.maxCount
  preparedImages.length = 0
  const fd = new FormData()

  if ($p.showImages) {
    files.forEach(file => {
      compressImage(file).then(res => {
        preparedImages.push(res)
        fd.append('img', res)
      })
    })
  }

  fileInputRef.value = null

  $e('update:inputModel', fd)
}

</script>
