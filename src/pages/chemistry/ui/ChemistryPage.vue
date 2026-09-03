<script setup lang="ts">
import { ref } from 'vue'
import { UiButton, type ElementName } from '@/shared'
import { ElementSearch } from '@/features/element-search'
import { ThemeToggle } from '@/features/toggle-theme'
import { useCombiner } from '@/features/combine-elements'
import { CombinerBoard } from '@/widgets/combiner'
import { RecipePath } from '@/widgets/recipe-path'
import { RecipeBook } from '@/widgets/recipe-book'
import { ElementDetail } from '@/widgets/element-detail'

type Tab = 'mix' | 'path' | 'book'

const TABS: { id: Tab; label: string }[] = [
  { id: 'mix', label: 'Комбинировать' },
  { id: 'path', label: 'Как сделать' },
  { id: 'book', label: 'Список' },
]

const tab = ref<Tab>('mix')
const target = ref<ElementName | null>(null)
const { startFrom } = useCombiner()

function toTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Из любой вкладки можно провалиться в цепочку конкретного элемента. */
function showChain(element: ElementName): void {
  target.value = element
  tab.value = 'path'
  toTop()
}

/** Внутри вкладки «Как сделать» переключаем цель, не уходя со вкладки. */
function selectTarget(element: ElementName): void {
  target.value = element
  toTop()
}

/** Клик по ингредиенту в верстаке начинает с него новую пару. */
function openInCombiner(element: ElementName): void {
  startFrom(element)
  toTop()
}
</script>

<template>
  <div>
    <div class="topbar">
      <RouterLink to="/" class="back">← Все предметы</RouterLink>
    </div>

    <header class="screen-head">
      <h1>Верстак <em>алхимика</em></h1>
      <nav class="tabs">
        <UiButton
          v-for="item in TABS"
          :key="item.id"
          :active="tab === item.id"
          @click="tab = item.id"
        >
          {{ item.label }}
        </UiButton>
      </nav>
      <div class="grow" />
      <ThemeToggle />
    </header>

    <ElementSearch />

    <CombinerBoard v-if="tab === 'mix'">
      <template #detail="{ element }">
        <ElementDetail
          :element="element"
          show-chain-button
          @pick="openInCombiner"
          @chain="showChain"
        />
      </template>
    </CombinerBoard>

    <RecipePath v-else-if="tab === 'path'" :target="target" @select="selectTarget">
      <template #detail="{ element }">
        <ElementDetail :element="element" @pick="selectTarget" />
      </template>
    </RecipePath>

    <RecipeBook v-else @select="showChain" />
  </div>
</template>

<style scoped>
.topbar {
  padding: 4px 0 8px;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--dim);
  font-size: 13px;
  text-decoration: none;
}

.back:hover {
  color: var(--acc);
}

.tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
