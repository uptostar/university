<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProgressStore } from '../model/store'

const { count, total, percent } = storeToRefs(useProgressStore())
</script>

<template>
  <div>
    <span class="num muted">{{ count }} / {{ total }}</span>
    <div class="bar"><i :style="{ width: percent + '%' }" /></div>
  </div>
</template>

<style scoped>
.bar {
  height: 6px;
  background: var(--bg3);
  border-radius: 3px;
  overflow: hidden;
  margin: 4px 0 16px;
}

.bar i {
  display: block;
  height: 100%;
  background: var(--acc);
  transition: width 0.25s;
}
</style>
