import { computed, onMounted, onUnmounted, readonly, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export interface AnimationLifecycle {
  isVisible: Readonly<Ref<boolean>>
  isPaused: ComputedRef<boolean>
  isMobile: Readonly<Ref<boolean>>
  isReducedMotion: Readonly<Ref<boolean>>
}

export function useAnimationLifecycle(containerRef: Ref<HTMLElement | null>): AnimationLifecycle {
  const isVisible = ref(false)
  const isTabHidden = ref(false)
  const isMobile = ref(false)
  const isReducedMotion = ref(false)

  const isPaused = computed(() => isTabHidden.value || !isVisible.value)

  let observer: IntersectionObserver | null = null

  function onVisibilityChange() {
    isTabHidden.value = document.hidden
  }

  onMounted(() => {
    if (!import.meta.client) return

    isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    isMobile.value = window.matchMedia('(max-width: 768px)').matches
    isTabHidden.value = document.hidden

    observer = new IntersectionObserver(
      ([entry]) => { isVisible.value = entry.isIntersecting },
      { threshold: 0.1 }
    )

    if (containerRef.value) {
      observer.observe(containerRef.value)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    isVisible: readonly(isVisible),
    isPaused,
    isMobile: readonly(isMobile),
    isReducedMotion: readonly(isReducedMotion),
  }
}
