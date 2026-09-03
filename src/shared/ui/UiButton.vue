<script setup lang="ts">
withDefaults(defineProps<{ active?: boolean }>(), { active: false })
</script>

<template>
  <button type="button" class="ui-button" :class="{ active }">
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.ui-button:hover {
  border-color: var(--acc);
  color: var(--acc);
}

.ui-button:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

.ui-button.active {
  background: var(--acc);
  color: var(--onacc);
  border-color: var(--acc);
  font-weight: 600;
}
</style>
