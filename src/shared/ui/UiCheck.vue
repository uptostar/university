<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    /** Подпись для скринридера. */
    label?: string
    /** Круглая метка — для угла плитки. По умолчанию квадратная, для списков. */
    round?: boolean
    disabled?: boolean
  }>(),
  { label: '', round: false, disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label class="check" :class="{ round, disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :aria-label="label || undefined"
      @change="onChange"
      @click.stop
    />
    <span class="box" aria-hidden="true">
      <svg viewBox="0 0 16 16"><path d="M3.5 8.4 6.4 11.4 12.5 4.8" /></svg>
    </span>
    <span v-if="$slots.default" class="text"><slot /></span>
  </label>
</template>

<style scoped>
.check {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
}

.check.disabled {
  cursor: default;
}

/* Свой чекбокс вместо системного: тот не умеет в токены темы.
   Настоящий input остаётся на месте и невидим — фокус, клавиатура и скринридеры работают как есть. */
input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  margin: 0;
  pointer-events: none;
}

.box {
  width: 19px;
  height: 19px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg2);
  border: 1.5px solid var(--line);
  border-radius: 5px;
  transition: background 0.12s, border-color 0.12s;
}

.round .box {
  border-radius: 50%;
}

.check:hover .box {
  border-color: var(--acc);
}

.check.disabled .box {
  opacity: 0.4;
  border-color: var(--line);
}

input:focus-visible + .box {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
}

svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: var(--onacc);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 16;
  stroke-dashoffset: 16;
  transition: stroke-dashoffset 0.16s ease-out;
}

input:checked + .box {
  background: var(--acc);
  border-color: var(--acc);
}

input:checked + .box svg {
  stroke-dashoffset: 0;
}

.text {
  font-size: 12.5px;
  color: var(--dim);
}

.check:hover .text {
  color: var(--tx);
}
</style>
