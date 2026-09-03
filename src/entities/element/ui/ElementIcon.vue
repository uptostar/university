<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ElementName } from '@/shared'
import { emojiOf, imageUrlOf, USE_IMAGES } from '../model/icon'

const props = withDefaults(defineProps<{ element: ElementName; size?: number }>(), { size: 30 })

const broken = ref(false)
const emoji = computed(() => emojiOf(props.element))
const src = computed(() => imageUrlOf(props.element))
const showImage = computed(() => USE_IMAGES && !broken.value)
const box = computed(() => `${props.size}px`)
</script>

<template>
  <span class="icon" aria-hidden="true">
    <img v-if="showImage" :src="src" alt="" @error="broken = true" />
    <template v-else>{{ emoji }}</template>
  </span>
</template>

<style scoped>
.icon {
  width: v-bind(box);
  height: v-bind(box);
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(v-bind(box) * 0.74);
  line-height: 1;
}

.icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
