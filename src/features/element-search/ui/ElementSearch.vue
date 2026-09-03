<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useElementSearch } from '../model/search'

const { query } = useElementSearch()
const input = ref<HTMLInputElement | null>(null)

/** «/» ставит курсор в поиск, Escape убирает — руки не уходят с клавиатуры. */
function onKeydown(event: KeyboardEvent): void {
  if (event.key === '/' && document.activeElement !== input.value) {
    event.preventDefault()
    input.value?.focus()
  }
  if (event.key === 'Escape' && document.activeElement === input.value) {
    input.value?.blur()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="bar">
    <input
      ref="input"
      v-model="query"
      type="search"
      placeholder="Поиск элемента…  (нажми / для фокуса)"
      autocomplete="off"
      spellcheck="false"
      aria-label="Поиск элемента"
    />
  </div>
</template>

<style scoped>
.bar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--bg);
  padding: 8px 0 10px;
}

input {
  width: 100%;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 13px 15px;
  color: var(--tx);
  font: inherit;
  font-size: 16px;
  outline: none;
}

input:focus {
  border-color: var(--acc);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--acc) 18%, transparent);
}
</style>
