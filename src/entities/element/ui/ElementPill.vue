<script setup lang="ts">
import type { ElementName } from '@/shared'
import ElementIcon from './ElementIcon.vue'

defineProps<{ element: ElementName }>()
defineEmits<{ pick: [ElementName] }>()
</script>

<template>
  <button type="button" class="pill" @click="$emit('pick', element)">
    <ElementIcon :element="element" :size="18" />
    {{ element }}
  </button>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--bg3);
  border: 1px solid var(--line);
  border-radius: 7px;
  padding: 3px 8px;
  font-size: 13px;
  cursor: pointer;
}

.pill:hover {
  border-color: var(--acc);
  color: var(--acc);
}

.pill:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 1px;
}
</style>
