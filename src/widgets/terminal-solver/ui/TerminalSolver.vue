<script setup lang="ts">
import { computed, ref } from 'vue'
import { UiButton, UiTag, pluralize } from '@/shared'
import { likeness } from '@/entities/terminal'
import { MAX_ATTEMPTS, useTerminalStore, WordListInput } from '@/features/terminal-session'

const terminal = useTerminalStore()

/** Слово, по которому сейчас спрашиваем результат. */
const asking = ref<string | null>(null)

const best = computed(() => terminal.ranked[0])

/** Слов на экране бывает много, поэтому по умолчанию показываем только верх списка. */
const VISIBLE = 12
const showAll = ref(false)
const filter = ref('')

const shown = computed(() => {
  const needle = filter.value.trim().toUpperCase()
  const list = needle
    ? terminal.ranked.filter((guess) => guess.word.includes(needle))
    : terminal.ranked
  return showAll.value || needle ? list : list.slice(0, VISIBLE)
})

const hidden = computed(() => terminal.ranked.length - shown.value.length)

/** Кнопки ответа: подписаны тем, сколько кандидатов останется. */
const options = computed(() => {
  if (!asking.value) return []
  const counts = terminal.preview(asking.value)
  return counts.map((rest, matched) => ({ matched, rest, possible: rest > 0 }))
})

function answer(matched: number): void {
  if (!asking.value) return
  terminal.attempt(asking.value, matched)
  asking.value = null
}

function restart(): void {
  asking.value = null
  terminal.resetAttempts()
}
</script>

<template>
  <div>
    <WordListInput />

    <template v-if="terminal.words.length">
      <div class="status">
        <span class="chip" :class="{ low: terminal.attemptsLeft <= 2 }">
          {{ pluralize(terminal.attemptsLeft, 'попытка', 'попытки', 'попыток') }} осталось
        </span>
        <span class="chip">
          {{ pluralize(terminal.candidates.length, 'вариант', 'варианта', 'вариантов') }}
          из {{ terminal.words.length }}
        </span>
        <div class="grow" />
        <UiButton v-if="terminal.history.length" @click="terminal.undo">Отменить ход</UiButton>
        <UiButton v-if="terminal.history.length" @click="restart">Начать подбор заново</UiButton>
      </div>

      <p v-if="terminal.solved" class="banner ok">
        Пароль подобран: <b>{{ terminal.history.at(-1)?.word }}</b>
      </p>

      <p v-else-if="terminal.contradiction" class="banner bad">
        Ни одно слово не подходит под введённые числа. Где-то ошибка в ответе терминала —
        отмени последний ход и проверь цифру.
      </p>

      <p v-else-if="terminal.candidates.length === 1" class="banner ok">
        Остался один вариант — это и есть пароль: <b>{{ terminal.candidates[0] }}</b>
      </p>

      <template v-if="!terminal.solved && !terminal.contradiction">
        <template v-if="asking">
          <h2 class="section-title">Что показал терминал на слово {{ asking }}?</h2>
          <div class="answers">
            <button
              v-for="option in options"
              :key="option.matched"
              type="button"
              class="answer"
              :class="{ dead: !option.possible }"
              :disabled="!option.possible"
              @click="answer(option.matched)"
            >
              <span class="big num">{{ option.matched }}/{{ terminal.length }}</span>
              <span class="rest">
                {{
                  option.matched === terminal.length
                    ? 'пароль найден'
                    : `останется ${option.rest}`
                }}
              </span>
            </button>
          </div>
          <UiButton class="cancel" @click="asking = null">Отмена</UiButton>
        </template>

        <template v-else>
          <h2 class="section-title">
            Жми это слово<template v-if="best"> — {{ best.word }}</template>
          </h2>
          <p class="lead">
            Список отсортирован по выгодности: сверху то, что сильнее всего сузит выбор даже
            при самом неудачном ответе. Введи слово в терминал, вернись сюда и нажми на него —
            спрошу, сколько совпадений он показал.
          </p>

          <input
            v-if="terminal.candidates.length > VISIBLE"
            v-model="filter"
            class="filter"
            type="search"
            placeholder="Найти слово в списке"
            spellcheck="false"
            aria-label="Найти слово среди кандидатов"
          />

          <div class="cards">
            <button
              v-for="(guess, i) in shown"
              :key="guess.word"
              type="button"
              class="card"
              :class="{ top: i === 0 && !filter }"
              @click="asking = guess.word"
            >
              <span class="word">{{ guess.word }}</span>
              <span class="meta num">
                худший случай — {{ guess.worst }} · шанс угадать
                {{ Math.round(guess.chance * 100) }}%
              </span>
              <span v-if="i === 0 && !filter" class="mark">рекомендую</span>
            </button>
          </div>

          <UiButton v-if="hidden > 0" class="more" @click="showAll = true">
            Показать остальные {{ hidden }}
          </UiButton>
          <UiButton v-else-if="showAll && !filter" class="more" @click="showAll = false">
            Свернуть до {{ VISIBLE }}
          </UiButton>
          <p v-if="shown.length === 0" class="empty">Среди кандидатов такого слова нет</p>
        </template>
      </template>

      <template v-if="terminal.history.length">
        <h2 class="section-title">Ходы</h2>
        <div class="history">
          <div v-for="(item, i) in terminal.history" :key="i" class="row">
            <UiTag>{{ i + 1 }}</UiTag>
            <b>{{ item.word }}</b>
            <span class="num muted">{{ item.likeness }}/{{ terminal.length }}</span>
          </div>
        </div>
      </template>

      <template v-if="terminal.history.length && terminal.candidates.length > 1">
        <h2 class="section-title">Отпало</h2>
        <p class="dropped">
          <span
            v-for="word in terminal.words.filter((w) => !terminal.candidates.includes(w))"
            :key="word"
            class="out"
            :title="`совпадений с ${terminal.history[0].word}: ${likeness(word, terminal.history[0].word)}`"
          >
            {{ word }}
          </span>
        </p>
      </template>
    </template>

    <p v-else class="empty">
      Загрузи слова из терминала — дальше подскажу, что жать, и после каждого ответа отсею
      невозможное. Попыток всего {{ MAX_ATTEMPTS }}, так что порядок ходов важен.
    </p>
  </div>
</template>

<style scoped>
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.chip {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  background: var(--bg3);
  border: 1px solid var(--line);
  color: var(--dim);
  border-radius: 20px;
  padding: 4px 11px;
}

.chip.low {
  color: var(--acc);
  border-color: color-mix(in srgb, var(--acc) 45%, transparent);
  background: color-mix(in srgb, var(--acc) 10%, transparent);
}

.banner {
  border-radius: var(--r);
  padding: 12px 14px;
  margin-bottom: 16px;
  font-size: 14.5px;
}

.banner.ok {
  background: color-mix(in srgb, var(--acc) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--acc) 45%, transparent);
}

.banner.bad {
  background: color-mix(in srgb, var(--acc2) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--acc2) 45%, transparent);
}

.lead {
  color: var(--dim);
  font-size: 13.5px;
  max-width: 68ch;
  margin-bottom: 12px;
}

.filter {
  width: 100%;
  max-width: 320px;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 9px 12px;
  margin-bottom: 10px;
  color: var(--tx);
  font: inherit;
  font-size: 14px;
  outline: none;
}

.filter:focus {
  border-color: var(--acc);
}

.more {
  margin-top: 10px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(214px, 1fr));
  gap: 8px;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 12px 13px;
  text-align: left;
  cursor: pointer;
}

.card:hover {
  border-color: var(--acc);
  background: var(--bg3);
}

.card:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

.card.top {
  border-color: var(--acc);
}

.word {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1.5px;
}

.meta {
  font-size: 11.5px;
  color: var(--dim);
}

.mark {
  position: absolute;
  top: 10px;
  right: 11px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--acc);
}

.answers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.answer {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-start;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 12px 14px;
  cursor: pointer;
}

.answer:hover:not(.dead) {
  border-color: var(--acc);
  background: var(--bg3);
}

.answer:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

.answer.dead {
  opacity: 0.35;
  cursor: not-allowed;
}

.big {
  font-size: 19px;
  font-weight: 600;
}

.rest {
  font-size: 11.5px;
  color: var(--dim);
}

.cancel {
  margin-bottom: 8px;
}

.history {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 0;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}

.row:last-child {
  border-bottom: 0;
}

.row b {
  font-family: var(--font-mono);
  letter-spacing: 1px;
}

.dropped {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.out {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--dim);
  background: var(--bg3);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 3px 8px;
  text-decoration: line-through;
}
</style>
