<script setup lang="ts">
import { UiCheck, type ElementName } from '@/shared'
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
    /** Показывать метку «получено». Плитка сама ничего не знает про прогресс — решает виджет. */
    markable?: boolean
  }>(),
  { hint: '', depth: undefined, obtained: false, markable: false },
)

defineEmits<{ pick: [ElementName]; toggle: [boolean] }>()
</script>

<template>
  <div class="tile" :class="{ obtained, markable }">
    <button type="button" class="main" @click="$emit('pick', element)">
      <ElementIcon :element="element" />
      <span class="name">
        {{ element }}
        <span v-if="hint" class="hint">= {{ hint }}</span>
      </span>
    </button>

    <UiCheck
      v-if="markable"
      class="mark"
      round
      :model-value="obtained"
      :label="`Получено: ${element}`"
      @update:model-value="$emit('toggle', $event)"
    />

    <span v-if="depth !== undefined" class="depth" title="шагов от базовых элементов">
      {{ Number.isFinite(depth) ? depth : '—' }}
    </span>
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  overflow: hidden;
}

.tile:hover {
  border-color: var(--acc);
  background: var(--bg3);
}

.tile:focus-within {
  border-color: var(--acc);
}

/* Основная кнопка занимает всю плитку, метка и глубина лежат поверх неё в углах. */
.main {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 10px 10px 10px;
  background: none;
  border: 0;
  cursor: pointer;
  text-align: left;
}

.markable .main {
  padding-right: 34px;
}

.tile:not(.markable) .main {
  padding-right: 26px;
}

.main:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: -2px;
  border-radius: var(--r);
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

.mark {
  position: absolute;
  top: 7px;
  right: 7px;
}

.depth {
  position: absolute;
  right: 9px;
  bottom: 6px;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--dim);
  opacity: 0.7;
  pointer-events: none;
}

/* Гасим только содержимое: сама метка должна оставаться читаемой и кликабельной. */
.tile.obtained .main {
  opacity: 0.45;
}

.tile.obtained .name {
  text-decoration: line-through;
}
</style>
