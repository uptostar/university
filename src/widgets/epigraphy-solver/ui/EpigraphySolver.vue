<script setup lang="ts">
import { computed, ref } from 'vue'
import { pluralize, UiButton } from '@/shared'
import { describe, isAmbiguous, signOf, SignTile, WORD_BREAK } from '@/entities/epigraphy'
import { useEpigraphyStore } from '@/features/epigraphy-session'

const epi = useEpigraphyStore()

const search = ref('')
const guess = ref('')

/** Пиктограммы описаны словами и потому ищутся; у буквенного письма описывать нечего. */
const described = computed(() => epi.set.signs.some((sign) => sign.picture))

/** Плитки таблицы, отфильтрованные по букве или по тому, что нарисовано. */
const tiles = computed(() => {
  const needle = search.value.trim().toLowerCase()
  if (!needle) return epi.set.signs
  return epi.set.signs.filter(
    (sign) =>
      sign.picture?.includes(needle) ||
      sign.letters.some((letter) => letter.toLowerCase() === needle),
  )
})

/** Набранные знаки вместе с их описанием из таблицы — шаблону так удобнее. */
const slots = computed(() =>
  epi.picks.map((pick, index) => {
    const sign = pick.id === WORD_BREAK ? undefined : signOf(epi.set, pick.id)
    return {
      index,
      pick,
      sign,
      /** Знак с несколькими буквами, по которому выбор ещё не сделан. */
      open: !!sign && isAmbiguous(sign) && pick.letter === null,
    }
  }),
)
</script>

<template>
  <div>
    <h2 class="section-title">Перевод</h2>

    <div class="reading" :class="{ blank: !epi.picks.length }">
      <span v-if="epi.picks.length">{{ epi.reading }}</span>
      <span v-else>Нажимай знаки в таблице ниже в том порядке, в каком они идут на стене</span>
    </div>

    <div class="status">
      <span class="chip">{{ pluralize(epi.signCount, 'знак', 'знака', 'знаков') }}</span>
      <span v-if="epi.undecided" class="chip warn">
        {{ pluralize(epi.variants, 'вариант', 'варианта', 'вариантов') }} прочтения
      </span>
      <span v-else-if="epi.picks.length" class="chip ok">читается однозначно</span>
      <div class="grow" />
      <UiButton :disabled="!epi.picks.length" @click="epi.pushBreak">Пробел</UiButton>
      <UiButton :disabled="!epi.picks.length" @click="epi.backspace">Стереть знак</UiButton>
      <UiButton :disabled="!epi.picks.length" @click="epi.clear">Очистить</UiButton>
    </div>

    <p v-if="epi.undecided" class="hint">
      Оранжевые знаки означают сразу несколько букв — какая нужна, подсказывает слово.
      Выбери букву прямо под знаком, и она встанет в перевод.
    </p>

    <template v-if="epi.picks.length">
      <h2 class="section-title">Набранное</h2>
      <div class="strip">
        <template v-for="slot in slots" :key="slot.index">
          <span v-if="!slot.sign" class="gap" aria-label="промежуток между словами" />
          <span v-else class="slot" :class="{ open: slot.open }">
            <SignTile :set="epi.set" :sign="slot.sign" :letters="false" />
            <span v-if="slot.sign.letters.length === 1" class="picked">
              {{ slot.sign.letters[0] }}
            </span>
            <span v-else class="choices">
              <button
                v-for="letter in slot.sign.letters"
                :key="letter"
                type="button"
                class="choice"
                :class="{ on: slot.pick.letter === letter }"
                @click="epi.choose(slot.index, letter)"
              >
                {{ letter }}
              </button>
            </span>
          </span>
        </template>
      </div>
    </template>

    <h2 class="section-title">Таблица знаков — {{ epi.set.title }}</h2>

    <div v-if="epi.sets.length > 1" class="sets">
      <UiButton
        v-for="item in epi.sets"
        :key="item.id"
        :active="item.id === epi.set.id"
        @click="epi.selectSet(item.id)"
      >
        {{ item.title }}
      </UiButton>
    </div>

    <p class="hint">
      {{ epi.set.script }}. Найди на стене знак, отыщи его здесь и нажми — буква сама
      встанет в перевод.<template v-if="described"> Поиск понимает и букву, и то, что
      нарисовано: «сова», «зигзаг», «птенец».</template>
    </p>

    <input
      v-model="search"
      class="filter"
      type="search"
      :placeholder="described ? 'Буква или что нарисовано' : 'Буква'"
      spellcheck="false"
      :aria-label="described ? 'Найти знак по букве или по рисунку' : 'Найти знак по букве'"
    />

    <div class="table">
      <button
        v-for="sign in tiles"
        :key="sign.id"
        type="button"
        class="key"
        :title="describe(sign)"
        @click="epi.push(sign.id)"
      >
        <SignTile :set="epi.set" :sign="sign" />
      </button>
    </div>
    <p v-if="!tiles.length" class="empty">Такого знака в таблице нет</p>

    <h2 class="section-title">Сверить догадку</h2>
    <p class="hint">
      Если уже понял, что написано, набери это здесь — покажу, какими знаками фраза
      записывается. Сойдётся со стеной — можно сдавать.
    </p>
    <div class="guess">
      <input
        v-model="guess"
        class="filter wide"
        type="text"
        placeholder="Например: писец обязан знать знаки"
        spellcheck="false"
        aria-label="Догадка на русском"
        @keyup.enter="epi.fromText(guess)"
      />
      <UiButton :disabled="!guess.trim()" @click="epi.fromText(guess)">Показать знаки</UiButton>
    </div>

    <p class="source">
      Откуда данные: {{ epi.set.source }}. Письменность в задании меняется — она написана
      в его шапке рядом со словом «эпиграфика». Если знаки на экране не из этой таблицы,
      переключи набор кнопками выше.
    </p>
  </div>
</template>

<style scoped>
.reading {
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 16px 18px;
  min-height: 62px;
  display: flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  line-height: 1.5;
  word-break: break-word;
}

.reading.blank {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: normal;
  color: var(--dim);
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0 4px;
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

.chip.warn {
  color: var(--acc);
  border-color: color-mix(in srgb, var(--acc) 45%, transparent);
  background: color-mix(in srgb, var(--acc) 10%, transparent);
}

.chip.ok {
  color: var(--acc2);
  border-color: color-mix(in srgb, var(--acc2) 45%, transparent);
  background: color-mix(in srgb, var(--acc2) 10%, transparent);
}

.hint {
  color: var(--dim);
  font-size: 13.5px;
  max-width: 68ch;
  margin: 8px 0 12px;
}

/* Набранная надпись: знаки идут строкой и переносятся, как на стене. */
.strip {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 6px;
}

.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 76px;
  padding: 7px 4px 6px;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
}

.slot.open {
  border-color: color-mix(in srgb, var(--acc) 55%, transparent);
}

/* Промежуток между словами — просто разрыв в строке. */
.gap {
  width: 22px;
  align-self: stretch;
  min-height: 40px;
}

.picked {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 600;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3px;
}

/* Букв в группе бывает до пяти — держим кнопки узкими, чтобы слот не вытягивался. */
.choice {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.3;
  background: var(--bg3);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 1px 0;
  width: 21px;
  text-align: center;
  cursor: pointer;
}

.choice:hover {
  border-color: var(--acc);
  color: var(--acc);
}

.choice:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

.choice.on {
  background: var(--acc);
  color: var(--onacc);
  border-color: var(--acc);
}

.sets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.filter {
  width: 100%;
  max-width: 320px;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 9px 12px;
  margin-bottom: 12px;
  color: var(--tx);
  font: inherit;
  font-size: 14px;
  outline: none;
}

.filter:focus {
  border-color: var(--acc);
}

.filter.wide {
  max-width: 420px;
  margin-bottom: 0;
}

.table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 8px;
}

.key {
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 8px 6px 7px;
  cursor: pointer;
}

.key:hover {
  border-color: var(--acc);
  background: var(--bg3);
}

.key:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

.guess {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.source {
  color: var(--dim);
  font-size: 12.5px;
  max-width: 72ch;
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

@media (max-width: 520px) {
  .reading {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .slot {
    width: 64px;
  }
}
</style>
