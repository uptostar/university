<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { UiButton } from '@/shared'
import { ElementIcon } from '@/entities/element'
import { useCombinerStore } from '../model/store'

const combiner = useCombinerStore()
const { slotA, slotB, results } = storeToRefs(combiner)
</script>

<template>
  <div class="slots">
    <button type="button" class="slot" :class="{ filled: slotA }" @click="combiner.clearA">
      <template v-if="slotA">
        <ElementIcon :element="slotA" />
        <b>{{ slotA }}</b>
      </template>
      <span v-else class="ph">Элемент A</span>
    </button>

    <span class="op">+</span>

    <button type="button" class="slot" :class="{ filled: slotB }" @click="combiner.clearB">
      <template v-if="slotB">
        <ElementIcon :element="slotB" />
        <b>{{ slotB }}</b>
      </template>
      <span v-else class="ph">Элемент B</span>
    </button>

    <span class="op">=</span>

    <div class="result" :class="{ empty: results.length === 0 }">
      <template v-if="results.length">
        <span v-for="(name, i) in results" :key="name" class="res">
          <span v-if="i > 0" class="slash">/</span>
          <ElementIcon :element="name" />
          {{ name }}
        </span>
      </template>
      <template v-else-if="slotA && slotB">нет рецепта</template>
      <template v-else>…</template>
    </div>

    <UiButton @click="combiner.reset">Сброс</UiButton>
  </div>
</template>

<style scoped>
.slots {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.slot {
  display: flex;
  align-items: center;
  gap: 9px;
  background: var(--bg2);
  border: 1.5px dashed var(--line);
  border-radius: var(--r);
  padding: 9px 13px;
  min-width: 170px;
  min-height: 58px;
  cursor: pointer;
  text-align: left;
}

.slot.filled {
  border-style: solid;
  border-color: var(--acc2);
}

.slot b {
  font-weight: 600;
}

.slot:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

.ph {
  color: var(--dim);
  font-size: 13px;
}

.op {
  font-family: var(--font-mono);
  font-size: 19px;
  color: var(--dim);
}

.result {
  display: flex;
  align-items: center;
  gap: 9px;
  background: var(--acc);
  color: var(--onacc);
  border: 1px solid var(--acc);
  border-radius: var(--r);
  padding: 9px 16px;
  min-height: 58px;
  font-weight: 600;
  font-size: 17px;
}

.result.empty {
  background: var(--bg3);
  color: var(--dim);
  border-color: var(--line);
  font-weight: 400;
  font-size: 14px;
}

.res {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.slash {
  opacity: 0.6;
}

@media (max-width: 520px) {
  .slot {
    min-width: 0;
    flex: 1 1 42%;
  }
}
</style>
