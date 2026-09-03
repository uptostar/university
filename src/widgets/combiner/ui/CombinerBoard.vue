<script setup lang="ts">
import { computed } from 'vue'
import type { ElementName } from '@/shared'
import { chemistry } from '@/entities/recipe'
import { ElementTile } from '@/entities/element'
import { CombineSlots, useCombiner } from '@/features/combine-elements'
import { useElementSearch } from '@/features/element-search'
import { useProgress } from '@/features/track-progress'

const { slotA, slotB, results, partners, pick } = useCombiner()
const { matches } = useElementSearch()
const { has } = useProgress()

interface Tile {
  element: ElementName
  hint: string
}

/**
 * Пока первый слот пуст — показываем всё.
 * Как только он выбран, в сетке остаются только реальные партнёры,
 * и на каждой плитке подписано, что из пары выйдет.
 */
const tiles = computed<Tile[]>(() => {
  if (!slotA.value) {
    return chemistry.elements.filter(matches).map((element) => ({ element, hint: '' }))
  }
  return partners.value
    .filter((partner) => matches(partner.element))
    .map((partner) => ({ element: partner.element, hint: partner.results.join(', ') }))
})

/**
 * Результат сложившейся пары. Саму карточку рисует страница через слот:
 * виджет не может тянуть другой виджет, это направление запрещено в FSD.
 */
const detail = computed(() => (slotA.value && slotB.value ? results.value[0] : undefined))
</script>

<template>
  <div>
    <CombineSlots />

    <slot v-if="detail" name="detail" :element="detail" />

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

    <div v-if="tiles.length" class="grid">
      <ElementTile
        v-for="tile in tiles"
        :key="tile.element"
        :element="tile.element"
        :hint="tile.hint"
        :depth="chemistry.depthOf(tile.element)"
        :obtained="has(tile.element)"
        @pick="pick"
      />
    </div>
    <p v-else class="empty">Ничего не найдено</p>
  </div>
</template>

<style scoped>
.hint {
  color: var(--dim);
  font-size: 13px;
  margin: 10px 0;
}

.hint b {
  color: var(--tx);
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
