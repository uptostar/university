<script setup lang="ts">
import { AUTHOR, AUTHOR_URL, DONATION_URL } from '@/shared'
</script>

<template>
  <footer v-if="AUTHOR || DONATION_URL" class="footer">
    <p v-if="AUTHOR" class="by">
      <span class="label">Powered by</span>
      <a v-if="AUTHOR_URL" :href="AUTHOR_URL" target="_blank" rel="noopener noreferrer">
        {{ AUTHOR }}
      </a>
      <b v-else>{{ AUTHOR }}</b>
    </p>

    <a
      v-if="DONATION_URL"
      class="donate"
      :href="DONATION_URL"
      target="_blank"
      rel="noopener noreferrer"
    >
      Поддержать
    </a>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 40px;
  padding-top: 16px;
  flex: 0 0 auto;
  border-top: 1px solid var(--line);
  font-size: 13px;
  color: var(--dim);
}

.by {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  opacity: 0.75;
}

.by b,
.by a {
  color: var(--tx);
  font-weight: 600;
  text-decoration: none;
}

.by a:hover {
  color: var(--acc);
}

.donate {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg2);
  border: 1px solid color-mix(in srgb, var(--acc) 45%, var(--line));
  border-radius: 8px;
  padding: 7px 14px;
  color: var(--acc);
  font-weight: 500;
  text-decoration: none;
}

.donate:hover {
  background: color-mix(in srgb, var(--acc) 10%, transparent);
  border-color: var(--acc);
}

.donate:focus-visible {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

@media (max-width: 520px) {
  .donate {
    margin-left: 0;
  }
}
</style>
