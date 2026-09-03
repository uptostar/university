<script setup lang="ts">
import type { ElementName } from '@/shared'
import { useProgress } from '../model/progress'

const props = defineProps<{ element: ElementName }>()
const { has, toggle } = useProgress()
</script>

<template>
  <input
    type="checkbox"
    class="checkbox"
    :checked="has(props.element)"
    :aria-label="`Получено: ${props.element}`"
    @change="toggle(props.element, ($event.target as HTMLInputElement).checked)"
  />
</template>

<style scoped>
.checkbox {
  width: 19px;
  height: 19px;
  flex: 0 0 auto;
  accent-color: var(--acc);
  cursor: pointer;
}
</style>
