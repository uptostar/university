<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatDay, formatIn, pluralize } from '@/shared'
import {
  buildSchedule,
  DAY_STARTS_AT_HOUR,
  SubjectCard,
  type ScheduledSubject,
} from '@/entities/subject'

const router = useRouter()

/**
 * Время держим реактивным: страницу могут оставить открытой на ночь, а день ивента
 * переключается в 07:00 МСК — расписание должно обновиться само, без перезагрузки.
 */
const now = ref(new Date())
let timer: number | undefined

function refresh(): void {
  now.value = new Date()
}

onMounted(() => {
  timer = window.setInterval(refresh, 60_000)
  document.addEventListener('visibilitychange', refresh)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
  document.removeEventListener('visibilitychange', refresh)
})

const schedule = computed(() => buildSchedule(now.value))

const summary = computed(() => {
  const { openCount, subjects, readyCount, next, daysToNext, hoursToRollover } = schedule.value
  const head =
    `Открыто ${openCount} из ${subjects.length} · ` +
    `готов${readyCount === 1 ? '' : 'о'} ${pluralize(readyCount, 'гайд', 'гайда', 'гайдов')}`
  if (!next) return `${head} · все предметы открыты`

  // За сутки до открытия полезнее часы: до 07:00 МСК может остаться и двадцать часов, и один.
  const when =
    daysToNext <= 1
      ? `через ${pluralize(hoursToRollover, 'час', 'часа', 'часов')}`
      : formatIn(daysToNext)
  return `${head} · следующий ${when}, ${formatDay(next.unlockAt)}`
})

const todayLine = computed(() => {
  const { today, subjects } = schedule.value
  const fresh = subjects.find((subject) => subject.isFresh)
  if (!fresh) return `День ивента — ${formatDay(today)}.`
  return `День ивента — ${formatDay(today)}, открылся предмет ${String(fresh.index + 1).padStart(2, '0')}: ${fresh.name}.`
})

function open(subject: ScheduledSubject): void {
  if (subject.route) router.push({ name: subject.route })
}
</script>

<template>
  <div>
    <div class="hero">
      <p class="eyebrow">Универ · ивент</p>
      <h1>Шпаргалки к экзаменам</h1>
      <p class="lead">
        С 1 сентября открывается по одному предмету в день, новый день наступает
        в {{ DAY_STARTS_AT_HOUR }}:00 по Москве. Номер слева — день: 01 — первое число,
        02 — второе, и так до десятого. Тыкай открытый — внутри разбор, поиск и чеклист.
      </p>
      <p class="today">{{ todayLine }}</p>
    </div>

    <h2 class="section-title">{{ summary }}</h2>

    <div class="grid">
      <SubjectCard
        v-for="subject in schedule.subjects"
        :key="subject.name"
        :subject="subject"
        @open="open"
      />
    </div>
  </div>
</template>

<style scoped>
.hero {
  padding: 26px 0 22px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 22px;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--acc);
  margin-bottom: 10px;
}

.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(26px, 5vw, 40px);
  line-height: 1.05;
  letter-spacing: -1.2px;
  text-wrap: balance;
  margin-bottom: 10px;
}

.lead {
  color: var(--dim);
  max-width: 56ch;
  font-size: 14.5px;
}

.today {
  margin-top: 10px;
  color: var(--acc);
  font-weight: 500;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(232px, 1fr));
  gap: 10px;
}

@media (max-width: 520px) {
  .hero h1 {
    font-size: 27px;
  }

  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
}
</style>
