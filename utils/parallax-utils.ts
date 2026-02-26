/**
 * Pure utility functions for the parallax system.
 * Pure utility functions for the parallax system (lerp, clamp).
 */


/**
 * Linear interpolation between two values.
 * Useful for smooth animations and transitions.
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0 to 1)
 * @returns Interpolated value
 *
 * @example
 * lerp(0, 10, 0.5) // 5
 * lerp(100, 200, 0.25) // 125
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Clamps a value between min and max bounds.
 * Useful for constraining scroll progress, opacity, or other bounded values.
 *
 * @param value - Value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 *
 * @example
 * clamp(15, 0, 10) // 10
 * clamp(-5, 0, 10) // 0
 * clamp(5, 0, 10) // 5
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

