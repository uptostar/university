<script setup lang="ts">
import { computed } from 'vue'
import { useStored, type ElementName } from '@/shared'
import { buildChain, chemistry, ChainStep } from '@/entities/recipe'
import { ElementTile } from '@/entities/element'
import { useSearchStore } from '@/features/element-search'
import { useProgressStore } from '@/features/track-progress'

const props = defineProps<{ target: ElementName | null }>()
const emit = defineEmits<{ select: [ElementName] }>()

const search = useSearchStore()
const progress = useProgressStore()

const steps = computed(() => (props.target ? buildChain(chemistry, props.target) : []))

/** Свёрнута цепочка или нет — запоминаем: у длинных элементов её каждый раз мотать неудобно. */
const chainOpen = useStored('chem-chain-open', true)

/** Список для выбора цели: ограничиваем, чтобы не рисовать 700 плиток разом. */
const VISIBLE = 400
const candidates = computed(() => chemistry.elements.filter(search.matches).slice(0, VISIBLE))
</script>

<template>
  <div>
    <template v-if="target">
      <!-- Карточку элемента подставляет страница: виджет виджет не импортирует. -->
      <slot name="detail" :element="target" />

      <button
        type="button"
        class="toggle section-title"
        :aria-expanded="chainOpen"
        aria-controls="chain-steps"
        @click="chainOpen = !chainOpen"
      >
        <span class="chevron" :class="{ open: chainOpen }" aria-hidden="true">▸</span>
        Цепочка с нуля — {{ steps.length }} шаг(ов)
        <span v-if="!chainOpen" class="collapsed">развернуть</span>
      </button>

      <div v-show="chainOpen" id="chain-steps" class="steps">
        <ChainStep
          v-for="(recipe, i) in steps"
          :key="recipe.number"
          :recipe="recipe"
          :step="i + 1"
          @pick="emit('select', $event)"
        />
        <p v-if="steps.length === 0" class="muted">
          Этот элемент доступен сразу — собирать нечего.
        </p>
      </div>
    </template>

    <p v-else class="empty">Выбери элемент — покажу пошаговую цепочку с нуля.</p>

    <h2 class="section-title">Выбрать элемент</h2>
    <div class="grid">
      <ElementTile
        v-for="element in candidates"
        :key="element"
        :element="element"
        :depth="chemistry.depthOf(element)"
        :obtained="progress.isMarked(element)"
        :markable="!chemistry.isBase(element)"
        @pick="emit('select', $event)"
        @toggle="progress.toggle(element, $event)"
      />
    </div>
    <p v-if="candidates.length === 0" class="empty">Ничего не найдено</p>
  </div>
</template>

<style scoped>
.toggle {
  display: flex;
  align-items: center;
  gap: 7px;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.toggle:hover {
  color: var(--acc);
}

.toggle:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 3px;
  border-radius: 4px;
}

.chevron {
  display: inline-block;
  font-size: 10px;
  transition: transform 0.15s;
}

.chevron.open {
  transform: rotate(90deg);
}

.collapsed {
  color: var(--acc2);
  text-transform: none;
  letter-spacing: 0;
  font-size: 11px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(172px, 1fr));
  gap: 8px;
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(144px, 1fr));
  }
}
</style>
