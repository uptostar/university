<script setup lang="ts">
import { computed, ref } from 'vue'
import { UiButton, normalize, type ElementName } from '@/shared'
import { chemistry, RecipeRow } from '@/entities/recipe'
import { useSearchStore } from '@/features/element-search'
import { ObtainedCheckbox, ProgressBar, useProgressStore } from '@/features/track-progress'

const emit = defineEmits<{ select: [ElementName] }>()

const search = useSearchStore()
const progress = useProgressStore()

const hideObtained = ref(false)

const rows = computed(() =>
  chemistry.recipes
    .filter((recipe) => {
      if (!search.isActive) return true
      return [recipe.result, recipe.a, recipe.b].some((name) =>
        normalize(name).includes(search.normalized),
      )
    })
    .filter((recipe) => !hideObtained.value || !progress.isMarked(recipe.result)),
)

function onClear(): void {
  if (confirm('Очистить прогресс?')) progress.clear()
}
</script>

<template>
  <div>
    <div class="toolbar">
      <UiButton :active="hideObtained" @click="hideObtained = !hideObtained">
        Скрыть полученные
      </UiButton>
      <div class="grow" />
      <UiButton @click="onClear">Очистить прогресс</UiButton>
    </div>

    <ProgressBar />

    <div class="list">
      <RecipeRow
        v-for="recipe in rows"
        :key="recipe.number"
        :recipe="recipe"
        @pick="emit('select', $event)"
      >
        <template #lead>
          <ObtainedCheckbox :element="recipe.result" />
        </template>
      </RecipeRow>
    </div>
    <p v-if="rows.length === 0" class="empty">Пусто</p>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
