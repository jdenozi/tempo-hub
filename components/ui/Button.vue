<template>
  <component
    :is="to ? NuxtLinkLocale : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="disabled || loading"
    :class="[baseClasses, variantClasses[variant], sizeClasses[size]]"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </component>
</template>

<script setup lang="ts">
import { NuxtLinkLocale } from '#components'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  to: undefined,
  type: 'button',
  disabled: false,
  loading: false,
})

const baseClasses = 'inline-flex items-center justify-center font-medium rounded-card transition-all duration-default focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-950 disabled:opacity-50 disabled:cursor-not-allowed'

const variantClasses = {
  primary: 'bg-primary-500 text-secondary-950 hover:bg-primary-400 active:bg-primary-600 hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]',
  secondary: 'bg-white/10 text-white hover:bg-white/15 active:bg-white/20 hover:shadow-[0_0_10px_rgba(212,168,83,0.1)]',
  outline: 'border-2 border-primary-500/50 text-primary-500 hover:bg-primary-500/10 active:bg-primary-500/20 hover:shadow-[0_0_15px_rgba(212,168,83,0.2)]',
  ghost: 'text-gray-300 hover:bg-white/10 active:bg-white/15',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}
</script>
