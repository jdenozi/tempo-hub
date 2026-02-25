<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-300">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="w-full rounded-card border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  id?: string
}>(), {
  modelValue: '',
  label: '',
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  id: undefined,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
