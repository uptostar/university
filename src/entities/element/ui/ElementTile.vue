<script setup lang="ts">
import type { ElementName } from '@/shared'
import ElementIcon from './ElementIcon.vue'

withDefaults(
  defineProps<{
    element: ElementName
    /** Что получится — подпись под названием. */
    hint?: string
    /** Число в углу: сколько синтезов от базовых элементов. */
    depth?: number
    /** Уже получен — гасим плитку. */
    obtained?: boolean
  }>(),
  { hint: '', depth: undefined, obtained: false },
)

defineEmits<{ pick: [ElementName] }>()
</script>

<template>
  <button type="button" class="tile" :class="{ obtained }" @click="$emit('pick', element)">
    <ElementIcon :element="element" />
    <span class="name">
      {{ element }}
      <span v-if="hint" class="hint">= {{ hint }}</span>
    </span>
    <span v-if="depth !== undefined" class="depth" title="шагов от базовых элементов">
      {{ Number.isFinite(depth) ? depth : '—' }}
    </span>
  </button>
</template>

<style scoped>
.tile {
  position: relative;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 26px 10px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  overflow: hidden;
}

.tile:hover {
  border-color: var(--acc);
  background: var(--bg3);
}

.tile:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 1px;
}

.name {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.hint {
  display: block;
  margin-top: 2px;
  font-size: 11.5px;
  font-weight: 400;
  color: var(--acc2);
}

.depth {
  position: absolute;
  top: 5px;
  right: 7px;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--dim);
  opacity: 0.7;
}

.tile.obtained {
  opacity: 0.42;
}

.tile.obtained .name {
  text-decoration: line-through;
}
</style>
