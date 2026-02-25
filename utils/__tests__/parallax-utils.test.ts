import { describe, it, expect } from 'vitest'
import { rand, lerp, clamp } from '../parallax-utils'

describe('parallax-utils', () => {
  describe('rand()', () => {
    it('should return a value between 0 and 1', () => {
      const result = rand(42)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })

    it('should be deterministic (same seed = same result)', () => {
      const seed = 12345
      const result1 = rand(seed)
      const result2 = rand(seed)
      expect(result1).toBe(result2)
    })

    it('should produce different results for different seeds', () => {
      const result1 = rand(1)
      const result2 = rand(2)
      expect(result1).not.toBe(result2)
    })
  })

  describe('lerp()', () => {
    it('should return start value when t=0', () => {
      expect(lerp(0, 10, 0)).toBe(0)
      expect(lerp(100, 200, 0)).toBe(100)
    })

    it('should return end value when t=1', () => {
      expect(lerp(0, 10, 1)).toBe(10)
      expect(lerp(100, 200, 1)).toBe(200)
    })

    it('should return midpoint when t=0.5', () => {
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(100, 200, 0.5)).toBe(150)
    })

    it('should interpolate correctly at arbitrary t values', () => {
      expect(lerp(0, 100, 0.25)).toBe(25)
      expect(lerp(0, 100, 0.75)).toBe(75)
      expect(lerp(10, 20, 0.3)).toBe(13)
    })

    it('should work with negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0)
      expect(lerp(-100, -50, 0.5)).toBe(-75)
    })

    it('should work with t values outside [0, 1]', () => {
      expect(lerp(0, 10, 1.5)).toBe(15)
      expect(lerp(0, 10, -0.5)).toBe(-5)
    })
  })

  describe('clamp()', () => {
    it('should return value when within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
    })

    it('should clamp to max when value exceeds max', () => {
      expect(clamp(15, 0, 10)).toBe(10)
      expect(clamp(100, 0, 50)).toBe(50)
    })

    it('should clamp to min when value is below min', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(-100, -50, 50)).toBe(-50)
    })

    it('should work with negative bounds', () => {
      expect(clamp(-5, -10, -1)).toBe(-5)
      expect(clamp(-15, -10, -1)).toBe(-10)
      expect(clamp(5, -10, -1)).toBe(-1)
    })

    it('should work with floating point values', () => {
      expect(clamp(0.5, 0, 1)).toBe(0.5)
      expect(clamp(1.5, 0, 1)).toBe(1)
      expect(clamp(-0.5, 0, 1)).toBe(0)
    })
  })
})
