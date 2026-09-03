<script setup lang="ts">
import { ThemeToggle } from '@/features/toggle-theme'
import { TerminalSolver } from '@/widgets/terminal-solver'
</script>

<template>
  <div>
    <div class="topbar">
      <RouterLink to="/" class="back">← Все предметы</RouterLink>
    </div>

    <header class="screen-head">
      <h1>Взлом <em>терминала</em></h1>
      <div class="grow" />
      <ThemeToggle />
    </header>

    <p class="intro">
      Терминал показывает, сколько букв слова стоит на своих местах. Каждый ответ отсекает часть
      вариантов: подходят только слова с ровно таким же числом совпадений. Здесь это считается за
      тебя, а порядок ходов подбирается так, чтобы уложиться в пять попыток даже при невезении.
    </p>

    <TerminalSolver />
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
</style>
