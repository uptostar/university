<script setup lang="ts">
import { computed } from 'vue'
import { pluralize, type ElementName } from '@/shared'
import { chemistry, levelBadge, levelNote, levelTitle } from '@/entities/recipe'
import { ElementTile } from '@/entities/element'
import { useSearchStore } from '@/features/element-search'
import { useProgressStore } from '@/features/track-progress'

const emit = defineEmits<{ select: [ElementName] }>()

const search = useSearchStore()
const progress = useProgressStore()

/** Раскладка считается один раз: граф после загрузки не меняется. */
const allLevels = chemistry.levels()
const total = chemistry.elements.length
const deepest = Math.max(...allLevels.map((level) => level.depth))
/** Самый населённый уровень задаёт масштаб столбиков на диаграмме. */
const biggest = Math.max(...allLevels.map((level) => level.elements.length))

/** Поиск сужает уровни, но не схлопывает их — видно, на какой ступени сидит найденное. */
const levels = computed(() =>
  allLevels
    .map((level) => ({ ...level, elements: level.elements.filter(search.matches) }))
    .filter((level) => level.elements.length > 0),
)

const found = computed(() => levels.value.reduce((sum, level) => sum + level.elements.length, 0))

function barHeight(count: number): string {
  return `${(count / biggest) * 100}%`
}
</script>

<template>
  <div>
    <p class="lead">
      Уровень — сколько синтезов отделяет элемент от четырёх стартовых, если идти самым коротким
      путём. Всё на уровне N собирается только из того, что лежит ниже, так что список читается
      сверху вниз как порядок прокачки.
    </p>

    <div class="chart" role="img" aria-label="Сколько элементов на каждом уровне">
      <div
        v-for="level in allLevels"
        :key="level.depth"
        class="col"
        :title="`${levelTitle(level.depth)}: ${level.elements.length}`"
      >
        <span class="bar" :style="{ height: barHeight(level.elements.length) }" />
        <span class="tick num">{{ levelBadge(level.depth) }}</span>
      </div>
    </div>

    <p class="summary num">
      {{ pluralize(total, 'элемент', 'элемента', 'элементов') }} · самый глубокий уровень —
      {{ deepest }}<template v-if="search.isActive"> · найдено {{ found }}</template>
    </p>

    <section v-for="level in levels" :key="level.depth" class="level">
      <header class="head">
        <h2 class="name">{{ levelTitle(level.depth) }}</h2>
        <span class="count num">{{ level.elements.length }}</span>
        <span class="note">{{ levelNote(level.depth) }}</span>
      </header>

      <div class="grid">
        <ElementTile
          v-for="element in level.elements"
          :key="element"
          :element="element"
          :obtained="progress.isMarked(element)"
          :markable="!chemistry.isBase(element)"
          @pick="emit('select', $event)"
          @toggle="progress.toggle(element, $event)"
        />
      </div>
    </section>

    <p v-if="levels.length === 0" class="empty">Ничего не найдено</p>
  </div>
</template>

<style scoped>
.lead {
  color: var(--dim);
  font-size: 13.5px;
  max-width: 68ch;
  margin: 6px 0 14px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 64px;
  padding-bottom: 14px;
  margin-bottom: 6px;
}

.col {
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.bar {
  width: 100%;
  min-height: 2px;
  background: var(--acc);
  border-radius: 2px 2px 0 0;
  opacity: 0.75;
}

.col:hover .bar {
  opacity: 1;
}

.tick {
  position: absolute;
  bottom: -14px;
  font-size: 9.5px;
  color: var(--dim);
}

.summary {
  color: var(--dim);
  font-size: 12.5px;
  margin-bottom: 18px;
}

.level {
  margin-bottom: 22px;
}

.head {
  display: flex;
  align-items: baseline;
  gap: 9px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--line);
}

.name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.count {
  color: var(--dim);
  font-size: 12.5px;
}

.note {
  color: var(--dim);
  font-size: 12.5px;
  margin-left: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(172px, 1fr));
  gap: 8px;
}

@media (max-width: 640px) {
  .note {
    margin-left: 0;
    flex-basis: 100%;
  }
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(144px, 1fr));
  }
}
</style>
