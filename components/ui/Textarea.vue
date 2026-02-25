<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-300">
      {{ label }}
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      class="w-full rounded-card border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  id?: string
}>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  required: false,
  disabled: false,
  rows: 4,
  id: undefined,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
