<script setup lang="ts"></script>

<template>
  <span class="ui-tag"><slot /></span>
</template>

<style scoped>
.ui-tag {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 10.5px;
  background: var(--bg3);
  border: 1px solid var(--line);
  color: var(--dim);
  border-radius: 5px;
  padding: 2px 6px;
}
</style>
