<script setup lang="ts">
import { ThemeToggle } from '@/features/toggle-theme'
import { SubjectGrid } from '@/widgets/subject-grid'
</script>

<template>
  <div>
    <div class="corner"><ThemeToggle /></div>
    <SubjectGrid />
  </div>
</template>

<style scoped>
.corner {
  display: flex;
  justify-content: flex-end;
}
</style>
