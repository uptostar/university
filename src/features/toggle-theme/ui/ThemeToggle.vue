<script setup lang="ts">
import { UiButton } from '@/shared'
import { useThemeStore } from '../model/store'

const theme = useThemeStore()
</script>

<template>
  <UiButton title="Светлая / тёмная тема" aria-label="Переключить тему" @click="theme.toggle">
    ◐
  </UiButton>
</template>
