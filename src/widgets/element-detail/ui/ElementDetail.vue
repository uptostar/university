<script setup lang="ts">
import { computed } from 'vue'
import { UiButton, type ElementName } from '@/shared'
import { ElementIcon } from '@/entities/element'
import { chemistry, RecipeRow } from '@/entities/recipe'
import { ObtainedCheckbox } from '@/features/track-progress'

const props = defineProps<{ element: ElementName; showChainButton?: boolean }>()
defineEmits<{ pick: [ElementName]; chain: [ElementName] }>()

const madeBy = computed(() => chemistry.recipesFor(props.element))
const usedIn = computed(() => chemistry.usesOf(props.element))
const depth = computed(() => chemistry.depthOf(props.element))

const baseNote = computed(() =>
  props.element === 'Время'
    ? 'Открывается само после 100 элементов'
    : 'Базовый элемент — есть с самого начала',
)

/** Показываем не больше 80 применений: у «Человека» их под сотню, это уже простыня. */
const VISIBLE_USES = 80
const shownUses = computed(() => usedIn.value.slice(0, VISIBLE_USES))
</script>

<template>
  <section class="detail">
    <header class="head">
      <ElementIcon :element="element" :size="44" />
      <h3>{{ element }}</h3>
      <span class="depth num">шагов от базы: {{ Number.isFinite(depth) ? depth : '—' }}</span>
      <ObtainedCheckbox :element="element" text="получено" class="mark" />
    </header>

    <h2 class="section-title">Как получить</h2>
    <div class="list">
      <RecipeRow
        v-for="recipe in madeBy"
        :key="recipe.number"
        :recipe="recipe"
        :with-result="false"
        @pick="$emit('pick', $event)"
      />
      <p v-if="madeBy.length === 0" class="muted">{{ baseNote }}</p>
    </div>

    <h2 class="section-title">Используется в ({{ usedIn.length }})</h2>
    <div class="list">
      <RecipeRow
        v-for="recipe in shownUses"
        :key="recipe.number"
        :recipe="recipe"
        @pick="$emit('pick', $event)"
      />
      <p v-if="usedIn.length === 0" class="muted">Пока ни в чём — это конечный элемент.</p>
      <p v-else-if="usedIn.length > VISIBLE_USES" class="muted">
        …и ещё {{ usedIn.length - VISIBLE_USES }}. Найди нужное через поиск.
      </p>
    </div>

    <div v-if="showChainButton" class="actions">
      <UiButton @click="$emit('chain', element)">Показать цепочку с нуля →</UiButton>
    </div>
  </section>
</template>

<style scoped>
.detail {
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 16px;
  margin-bottom: 14px;
}

.head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.head h3 {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  letter-spacing: -0.5px;
  text-wrap: balance;
}

.depth {
  font-size: 10.5px;
  background: var(--bg3);
  border: 1px solid var(--line);
  color: var(--dim);
  border-radius: 5px;
  padding: 2px 6px;
}

.mark {
  margin-left: auto;
}

@media (max-width: 520px) {
  .mark {
    margin-left: 0;
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.list .muted {
  font-size: 13.5px;
  padding: 5px 0;
}

.actions {
  margin-top: 12px;
}
</style>
