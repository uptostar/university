<script setup lang="ts">
import { computed } from 'vue'
import type { ElementName } from '@/shared'
import { buildChain, chemistry, ChainStep } from '@/entities/recipe'
import { ElementTile } from '@/entities/element'
import { useElementSearch } from '@/features/element-search'
import { useProgress } from '@/features/track-progress'

const props = defineProps<{ target: ElementName | null }>()
const emit = defineEmits<{ select: [ElementName] }>()

const { matches } = useElementSearch()
const { has } = useProgress()

const steps = computed(() => (props.target ? buildChain(chemistry, props.target) : []))

/** Список для выбора цели: ограничиваем, чтобы не рисовать 700 плиток разом. */
const VISIBLE = 400
const candidates = computed(() => chemistry.elements.filter(matches).slice(0, VISIBLE))
</script>

<template>
  <div>
    <template v-if="target">
      <!-- Карточку элемента подставляет страница: виджет виджет не импортирует. -->
      <slot name="detail" :element="target" />

      <h2 class="section-title">Цепочка с нуля — {{ steps.length }} шаг(ов)</h2>
      <div class="steps">
        <ChainStep
          v-for="(recipe, i) in steps"
          :key="recipe.number"
          :recipe="recipe"
          :step="i + 1"
          @pick="emit('select', $event)"
        />
      </div>
      <p v-if="steps.length === 0" class="muted">
        Этот элемент доступен сразу — собирать нечего.
      </p>
    </template>

    <p v-else class="empty">Выбери элемент — покажу пошаговую цепочку с нуля.</p>

    <h2 class="section-title">Выбрать элемент</h2>
    <div class="grid">
      <ElementTile
        v-for="element in candidates"
        :key="element"
        :element="element"
        :depth="chemistry.depthOf(element)"
        :obtained="has(element)"
        @pick="emit('select', $event)"
      />
    </div>
    <p v-if="candidates.length === 0" class="empty">Ничего не найдено</p>
  </div>
</template>

<style scoped>
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
