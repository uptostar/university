<script setup lang="ts">
import { UiButton } from '@/shared'
import { useTheme } from '../model/theme'

const { toggle } = useTheme()
</script>

<template>
  <UiButton title="Светлая / тёмная тема" aria-label="Переключить тему" @click="toggle">
    ◐
  </UiButton>
</template>
