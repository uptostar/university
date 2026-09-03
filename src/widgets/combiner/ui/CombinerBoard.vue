<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { ElementName } from '@/shared'
import { chemistry, levelBadge, levelNote, levelTitle } from '@/entities/recipe'
import { ElementTile } from '@/entities/element'
import { CombineSlots, useCombinerStore } from '@/features/combine-elements'
import { useSearchStore } from '@/features/element-search'
import { useProgressStore } from '@/features/track-progress'

const combiner = useCombinerStore()
const { slotA, slotB, partners, resolved } = storeToRefs(combiner)
const search = useSearchStore()
const progress = useProgressStore()

interface Tile {
  element: ElementName
  hint: string
}

interface Group {
  key: string
  depth: number
  tiles: Tile[]
}

/** Полный список раскладывается по уровням — так видно, с чего вообще начинать. */
const grouped = computed<Group[]>(() =>
  chemistry
    .levels()
    .map((level) => ({
      key: String(level.depth),
      depth: level.depth,
      tiles: level.elements.filter(search.matches).map((element) => ({ element, hint: '' })),
    }))
    .filter((group) => group.tiles.length > 0),
)

/**
 * Как только выбран первый элемент, уровни только мешают: партнёров немного,
 * и важен не их возраст, а что из пары выйдет. Показываем плоским списком.
 */
const partnerTiles = computed<Tile[]>(() =>
  partners.value
    .filter((partner) => search.matches(partner.element))
    .map((partner) => ({ element: partner.element, hint: partner.results.join(', ') })),
)

const totalShown = computed(() =>
  slotA.value
    ? partnerTiles.value.length
    : grouped.value.reduce((sum, group) => sum + group.tiles.length, 0),
)
</script>

<template>
  <div>
    <CombineSlots />

    <!-- Карточку результата рисует страница: виджет не может тянуть другой виджет. -->
    <slot v-if="resolved" name="detail" :element="resolved" />

    <p class="hint">
      <template v-if="!slotA">
        Выбери первый элемент — список сразу сузится до тех, с чем он реально комбинируется.
        <span class="num muted">Всего {{ chemistry.elements.length }}</span>
      </template>
      <template v-else>
        С <b>{{ slotA }}</b> комбинируется
        <span class="num muted">{{ partners.length }}</span> элементов<template v-if="slotB">
          · нажми другой, чтобы заменить B</template
        >
      </template>
    </p>

    <template v-if="!slotA">
      <section v-for="group in grouped" :key="group.key" class="group">
        <header class="head">
          <span class="badge num">{{ levelBadge(group.depth) }}</span>
          <h3 class="title">{{ levelTitle(group.depth) }}</h3>
          <span class="count num">{{ group.tiles.length }}</span>
          <span class="note">{{ levelNote(group.depth) }}</span>
        </header>

        <div class="grid">
          <ElementTile
            v-for="tile in group.tiles"
            :key="tile.element"
            :element="tile.element"
            :depth="group.depth"
            :obtained="progress.isMarked(tile.element)"
            :markable="!chemistry.isBase(tile.element)"
            @pick="combiner.pick"
            @toggle="progress.toggle(tile.element, $event)"
          />
        </div>
      </section>
    </template>

    <div v-else class="grid">
      <ElementTile
        v-for="tile in partnerTiles"
        :key="tile.element"
        :element="tile.element"
        :hint="tile.hint"
        :depth="chemistry.depthOf(tile.element)"
        :obtained="progress.isMarked(tile.element)"
        :markable="!chemistry.isBase(tile.element)"
        @pick="combiner.pick"
        @toggle="progress.toggle(tile.element, $event)"
      />
    </div>

    <p v-if="totalShown === 0" class="empty">Ничего не найдено</p>
  </div>
</template>

<style scoped>
.hint {
  color: var(--dim);
  font-size: 13px;
  margin: 10px 0 16px;
}

.hint b {
  color: var(--tx);
}

.group {
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

.badge {
  background: var(--acc);
  color: var(--onacc);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

.title {
  font-family: var(--font-display);
  font-size: 15px;
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
