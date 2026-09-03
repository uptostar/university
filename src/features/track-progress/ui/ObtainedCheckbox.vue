<script setup lang="ts">
import { computed } from 'vue'
import { UiCheck, type ElementName } from '@/shared'
import { chemistry } from '@/entities/recipe'
import { useProgressStore } from '../model/store'

const props = withDefaults(defineProps<{ element: ElementName; text?: string }>(), { text: '' })

const progress = useProgressStore()

/** Базовые элементы и «Время» есть всегда — отмечать нечего. */
const locked = computed(() => chemistry.isBase(props.element))

const label = computed(() =>
  locked.value ? `${props.element}: доступен с самого начала` : `Получено: ${props.element}`,
)
</script>

<template>
  <UiCheck
    :model-value="progress.has(element)"
    :disabled="locked"
    :label="label"
    @update:model-value="progress.toggle(element, $event)"
  >
    <template v-if="text">{{ text }}</template>
  </UiCheck>
</template>
