<script setup lang="ts">
import { SiteFooter } from '@/widgets/site-footer'
</script>

<template>
  <div class="wrap">
    <RouterView />
    <SiteFooter />
  </div>
</template>

<style scoped>
.wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 16px 14px 64px;
}
</style>
