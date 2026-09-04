<script setup lang="ts">
import { ThemeToggle } from '@/features/toggle-theme'
import { EpigraphySolver } from '@/widgets/epigraphy-solver'
</script>

<template>
  <div>
    <div class="topbar">
      <RouterLink to="/" class="back">← Все предметы</RouterLink>
    </div>

    <header class="screen-head">
      <h1>История: <em>эпиграфика</em></h1>
      <div class="grow" />
      <ThemeToggle />
    </header>

    <p class="intro">
      На кафедре истории два зачёта и экзамен: «Реставратор», «Эпиграфика» и «Исследование
      Лос-Сантоса». Здесь разобрана «Эпиграфика», где надпись читают по таблице знаков.
      Письменность в задании меняется — попадаются и египетская «Стена храма», и
      «Славянский устав», — поэтому таблиц две, переключаются кнопками. В игре таблица
      открывается поверх самой надписи и ест время; держи её тут: жмёшь знаки в том
      порядке, в каком они на стене, и перевод собирается сам.
    </p>

    <EpigraphySolver />

    <h2 class="section-title">Зачёт I — «Реставратор»</h2>
    <p class="text">
      Сборка разбитого саркофага: в центре подсвечен пунктирный силуэт, фрагменты разбросаны
      по краям экрана, вверху счётчик собранного и таймер на две минуты. Всего двенадцать
      кусков. Подсказывать тут нечего — это чистая моторика, и решателя не будет: начинай
      с крупных фрагментов, они задают, куда встанут мелкие.
    </p>

    <h2 class="section-title">Экзамен — «Исследование Лос-Сантоса»</h2>
    <p class="text">
      Разбора пока нет: до экзамена дело ещё не дошло. Появится материал — появится и гайд.
    </p>
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

.intro {
  color: var(--dim);
  font-size: 14px;
  max-width: 72ch;
  margin-bottom: 20px;
}

.text {
  color: var(--dim);
  font-size: 14px;
  max-width: 72ch;
}
</style>
