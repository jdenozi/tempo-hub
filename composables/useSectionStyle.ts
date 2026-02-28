import { computed } from 'vue'

/** Visual props shared by all section wrappers. */
export interface SectionVisualProps {
  sectionBg?: 'default' | 'alt' | 'transparent' | 'starfield' | 'nebula' | 'planet-horizon' | 'grid-station' | 'orbital' | 'retro-scan'
  sectionSpacing?: 'compact' | 'normal' | 'spacious'
  sectionBorder?: 'none' | 'glow' | 'subtle'
  titleStyle?: 'standard' | 'large' | 'hero'
  dividerAfter?: 'none' | 'line' | 'gradient' | 'stars'
  columns?: '2' | '3' | '4' | 'auto'
}

const ANIMATED_PRESETS = ['starfield', 'nebula', 'planet-horizon', 'grid-station', 'orbital', 'retro-scan'] as const

export function useSectionStyle(props: SectionVisualProps) {
  const bgClass = computed(() => {
    switch (props.sectionBg) {
      case 'alt': return 'gradient-section-alt'
      case 'transparent': return 'bg-transparent'
      // Animated presets: fallback class, actual animation handled by the section component
      case 'starfield':
      case 'nebula':
      case 'planet-horizon':
      case 'grid-station':
      case 'orbital':
      case 'retro-scan': return 'gradient-section-alt'
      default: return 'gradient-section'
    }
  })

  const spacingClass = computed(() => {
    switch (props.sectionSpacing) {
      case 'compact': return 'py-12 md:py-16'
      case 'spacious': return 'py-24 md:py-32'
      default: return 'section-padding'
    }
  })

  const borderClass = computed(() => {
    switch (props.sectionBorder) {
      case 'glow': return 'border-glow'
      case 'subtle': return 'border border-white/10'
      default: return ''
    }
  })

  const titleClass = computed(() => {
    switch (props.titleStyle) {
      case 'large': return 'text-hero text-white text-glow'
      case 'hero': return 'text-display text-white text-glow'
      default: return 'text-hero text-white text-glow'
    }
  })

  const isAnimatedBg = computed(() =>
    ANIMATED_PRESETS.includes(props.sectionBg as typeof ANIMATED_PRESETS[number]),
  )

  return { bgClass, spacingClass, borderClass, titleClass, isAnimatedBg }
}
