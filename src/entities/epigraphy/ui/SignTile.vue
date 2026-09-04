<script setup lang="ts">
import { computed } from 'vue'
import { describe, isAmbiguous } from '../model/decode'
import { pictureUrl } from '../model/picture'
import type { Sign, SignSet } from '../model/types'

const props = withDefaults(
  defineProps<{
    set: SignSet
    sign: Sign
    /** В разобранной надписи буквы подписаны отдельно, и подпись плитки там лишняя. */
    letters?: boolean
  }>(),
  { letters: true },
)

const src = computed(() => pictureUrl(props.set, props.sign))
const many = computed(() => isAmbiguous(props.sign))
const label = computed(() => describe(props.sign))
</script>

<template>
  <span class="tile">
    <img class="pic" :src="src" :alt="label" loading="lazy" decoding="async" />
    <span v-if="letters" class="letters" :class="{ many }">{{ sign.letters.join(' ') }}</span>
  </span>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

/* Плитка вырезана из игры вместе с песочным фоном — он же и делает её узнаваемой,
   поэтому фон не убираем, а лишь скругляем под остальной интерфейс. */
.pic {
  display: block;
  width: 100%;
  max-width: 68px;
  height: auto;
  border-radius: 5px;
}

.letters {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--dim);
}

/* Несколько букв на знак — как в игре, оранжевым: такой знак придётся разгадывать. */
.letters.many {
  color: var(--acc);
}
</style>
