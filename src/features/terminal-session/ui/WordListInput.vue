<script setup lang="ts">
import { ref, watch } from 'vue'
import { UiButton } from '@/shared'
import { useTerminalStore } from '../model/store'

const terminal = useTerminalStore()
const text = ref(terminal.words.join('\n'))

/** Если список сбросили извне — подтягиваем текст обратно в поле. */
watch(
  () => terminal.words,
  (words) => {
    if (words.join('\n') !== text.value.toUpperCase().trim()) text.value = words.join('\n')
  },
)

function apply(): void {
  terminal.setWords(text.value)
}

function fromDump(): void {
  const found = terminal.setWordsFromDump(text.value)
  text.value = found.join('\n')
}
</script>

<template>
  <section class="input">
    <h2 class="section-title">Слова с экрана</h2>
    <p class="lead">
      Впиши слова из терминала — по одному в строке или через пробел, регистр не важен. Если
      текст откуда-то копируется, вставь его целиком и жми «Выдернуть слова»: адреса ячеек и
      мусор он выкинет сам, а разорванные переносом куски покажет отдельно.
    </p>

    <textarea
      v-model="text"
      rows="7"
      spellcheck="false"
      autocapitalize="characters"
      placeholder="АРХИВ&#10;ШАЙБА&#10;ГРАНИ&#10;…"
      aria-label="Список слов из терминала"
    />

    <div class="actions">
      <UiButton active @click="apply">Загрузить список</UiButton>
      <UiButton @click="fromDump">Выдернуть слова из мусора</UiButton>
      <UiButton v-if="terminal.words.length" @click="terminal.clear">Очистить</UiButton>
    </div>

    <p v-if="terminal.words.length" class="count num">
      Загружено {{ terminal.words.length }}, длина слова — {{ terminal.length }}
    </p>

    <p v-if="terminal.leftovers.length" class="warn">
      Не собрались: {{ terminal.leftovers.join(', ') }}. Это половинки слов, разорванных
      переносом строки — экран свёрстан в две колонки, и продолжение оказывается не следом,
      а через одну ячейку. Допиши их в поле целиком и загрузи список заново.
    </p>

    <p v-if="terminal.oddWords.length" class="warn">
      Не та длина: {{ terminal.oddWords.join(', ') }}. В терминале все слова одинаковые —
      скорее всего опечатка или склеенный кусок.
    </p>
  </section>
</template>

<style scoped>
.input {
  margin-bottom: 20px;
}

.lead {
  color: var(--dim);
  font-size: 13.5px;
  max-width: 68ch;
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 12px 14px;
  color: var(--tx);
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.5;
  text-transform: uppercase;
  resize: vertical;
  outline: none;
}

textarea:focus {
  border-color: var(--acc);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--acc) 18%, transparent);
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.count {
  margin-top: 10px;
  font-size: 12.5px;
  color: var(--dim);
}

.warn {
  margin-top: 10px;
  font-size: 13px;
  max-width: 72ch;
  color: var(--acc);
}
</style>
