<script setup lang="ts">
import type { ElementName } from '@/shared'
import { ElementPill } from '@/entities/element/@x/recipe'
import type { Recipe } from '../model/types'

defineProps<{ recipe: Recipe; step: number }>()
defineEmits<{ pick: [ElementName] }>()
</script>

<template>
  <div class="step">
    <span class="n">{{ step }}</span>
    <ElementPill :element="recipe.a" @pick="$emit('pick', $event)" />
    <span class="op">+</span>
    <ElementPill :element="recipe.b" @pick="$emit('pick', $event)" />
    <span class="eq">=</span>
    <ElementPill :element="recipe.result" @pick="$emit('pick', $event)" />
  </div>
</template>

<style scoped>
.step {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-left: 3px solid var(--acc);
  border-radius: var(--r);
  padding: 8px 11px;
  font-size: 14px;
  flex-wrap: wrap;
}

.n {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--dim);
  font-size: 12px;
  min-width: 24px;
}

.op {
  color: var(--dim);
  font-family: var(--font-mono);
}

.eq {
  color: var(--acc);
  font-family: var(--font-mono);
  font-weight: 600;
}
</style>
