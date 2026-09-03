<script setup lang="ts">
import type { ElementName } from '@/shared'
import { UiTag } from '@/shared'
import { ElementPill } from '@/entities/element/@x/recipe'
import type { Recipe } from '../model/types'

withDefaults(
  defineProps<{
    recipe: Recipe
    /** Показывать результат справа от «=». Выключено на карточке самого результата. */
    withResult?: boolean
    withNumber?: boolean
  }>(),
  { withResult: true, withNumber: true },
)

defineEmits<{ pick: [ElementName] }>()
</script>

<template>
  <div class="row">
    <slot name="lead" />
    <UiTag v-if="withNumber">{{ String(recipe.number).padStart(3, '0') }}</UiTag>
    <ElementPill :element="recipe.a" @pick="$emit('pick', $event)" />
    <span class="op">+</span>
    <ElementPill :element="recipe.b" @pick="$emit('pick', $event)" />
    <template v-if="withResult">
      <span class="eq">=</span>
      <ElementPill :element="recipe.result" @pick="$emit('pick', $event)" />
    </template>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  font-size: 13.5px;
  padding: 5px 0;
  border-bottom: 1px solid var(--line);
}

.row:last-child {
  border-bottom: 0;
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
