<script setup lang="ts">
import { SiteFooter } from '@/widgets/site-footer'
</script>

<template>
  <div class="wrap">
    <main class="content">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
/* Колонка во всю высоту экрана: контент растягивается, подвал прижимается к низу
   даже на короткой странице, но уезжает вниз, как только контента становится больше. */
.wrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  max-width: 1180px;
  margin: 0 auto;
  padding: 16px 14px 32px;
}

.content {
  flex: 1 0 auto;
}
</style>
