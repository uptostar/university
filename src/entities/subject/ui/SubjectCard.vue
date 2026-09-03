<script setup lang="ts">
import { computed } from 'vue'
import { formatDay, pad2 } from '@/shared'
import type { ScheduledSubject } from '../model/schedule'

const props = defineProps<{ subject: ScheduledSubject }>()
defineEmits<{ open: [ScheduledSubject] }>()

const badge = computed(() => {
  if (props.subject.state === 'locked') return formatDay(props.subject.unlockAt)
  return props.subject.state === 'ready' ? 'Гайд готов' : 'Гайда пока нет'
})

const note = computed(() => {
  if (props.subject.state === 'ready') return props.subject.note ?? 'Открыть разбор'
  if (props.subject.state === 'locked') return `Откроется ${formatDay(props.subject.unlockAt)}`
  return props.subject.isFresh ? 'Открылся сегодня — разбор в работе' : 'Разбор в работе'
})
</script>

<template>
  <component
    :is="subject.state === 'ready' ? 'button' : 'div'"
    class="card"
    :class="subject.state"
    :type="subject.state === 'ready' ? 'button' : undefined"
    @click="subject.state === 'ready' && $emit('open', subject)"
  >
    <span class="badge" :class="subject.state">{{ badge }}</span>
    <span class="index">{{ pad2(subject.index + 1) }}</span>
    <span class="emoji" aria-hidden="true">{{ subject.emoji }}</span>
    <span class="title">{{ subject.name }}</span>
    <span class="note">{{ note }}</span>
  </component>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 14px 14px 13px;
  text-align: left;
  min-height: 132px;
}

.card.ready {
  cursor: pointer;
  border-color: color-mix(in srgb, var(--acc) 45%, var(--line));
}

.card.ready:hover {
  border-color: var(--acc);
  background: var(--bg3);
}

.card.ready:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

.card.locked {
  border-style: dashed;
  opacity: 0.5;
}

.index {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: var(--dim);
}

.emoji {
  font-size: 26px;
  line-height: 1;
}

.title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.4px;
}

.note {
  margin-top: auto;
  color: var(--dim);
  font-size: 12.5px;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-radius: 20px;
  padding: 3px 9px;
  border: 1px solid;
}

.badge.ready {
  color: var(--acc);
  border-color: color-mix(in srgb, var(--acc) 40%, transparent);
  background: color-mix(in srgb, var(--acc) 10%, transparent);
}

.badge.pending {
  color: var(--acc2);
  border-color: color-mix(in srgb, var(--acc2) 40%, transparent);
  background: color-mix(in srgb, var(--acc2) 10%, transparent);
}

.badge.locked {
  color: var(--dim);
  border-color: var(--line);
}

@media (max-width: 520px) {
  .card {
    min-height: 120px;
    padding: 12px;
  }
}
</style>
