import { describe, it, expect } from 'vitest'
import { rand, useParallaxData } from '../useParallaxData'

describe('rand', () => {
  it('is deterministic — same seed always produces the same value', () => {
    expect(rand(42)).toBe(rand(42))
    expect(rand(0)).toBe(rand(0))
    expect(rand(99999)).toBe(rand(99999))
  })

  it('returns a value between 0 and 1', () => {
    for (let i = 0; i < 100; i++) {
      const v = rand(i)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('different seeds produce different values', () => {
    expect(rand(1)).not.toBe(rand(2))
    expect(rand(100)).not.toBe(rand(200))
  })
})

describe('useParallaxData', () => {
  const data = useParallaxData()

  it('returns all expected keys', () => {
    const keys = Object.keys(data)
    expect(keys).toContain('stars')
    expect(keys).toContain('brightStars')
    expect(keys).toContain('dustParticles')
    expect(keys).toContain('ringDustParticles')
    expect(keys).toContain('asteroids')
    expect(keys).toContain('constNodes')
    expect(keys).toContain('constEdges')
    expect(keys).toContain('tendrils')
    expect(keys).toContain('orbitalParticles')
    expect(keys).toContain('gridH')
    expect(keys).toContain('gridV')
    expect(keys).toContain('services')
    expect(keys).toContain('COS_TILT')
    expect(keys).toContain('SIN_TILT')
  })

  it('stars has 450 items with required fields', () => {
    expect(data.stars).toHaveLength(450)
    expect(data.stars[0]).toHaveProperty('id')
    expect(data.stars[0]).toHaveProperty('cx')
    expect(data.stars[0]).toHaveProperty('cy')
    expect(data.stars[0]).toHaveProperty('r')
    expect(data.stars[0]).toHaveProperty('op')
  })

  it('brightStars has 24 items', () => {
    expect(data.brightStars).toHaveLength(24)
    expect(data.brightStars[0]).toHaveProperty('cx')
    expect(data.brightStars[0]).toHaveProperty('cy')
  })

  it('dustParticles has 60 items with color field', () => {
    expect(data.dustParticles).toHaveLength(60)
    expect(data.dustParticles[0]).toHaveProperty('color')
  })

  it('ringDustParticles has 27 items (8+7+6+6)', () => {
    expect(data.ringDustParticles).toHaveLength(27)
    expect(data.ringDustParticles[0]).toHaveProperty('rx')
    expect(data.ringDustParticles[0]).toHaveProperty('ry')
    expect(data.ringDustParticles[0]).toHaveProperty('angle')
    expect(data.ringDustParticles[0]).toHaveProperty('speed')
  })

  it('asteroids has 17 items', () => {
    expect(data.asteroids).toHaveLength(17)
    expect(data.asteroids[0]).toHaveProperty('rot')
  })

  it('constNodes has 42 items', () => {
    expect(data.constNodes).toHaveLength(42)
  })

  it('constEdges has at most 50 items', () => {
    expect(data.constEdges.length).toBeLessThanOrEqual(50)
    expect(data.constEdges.length).toBeGreaterThan(0)
  })

  it('tendrils has at most 12 items', () => {
    expect(data.tendrils.length).toBeLessThanOrEqual(12)
    expect(data.tendrils.length).toBeGreaterThan(0)
    expect(data.tendrils[0]).toHaveProperty('d')
  })

  it('orbitalParticles has 14 items', () => {
    expect(data.orbitalParticles).toHaveLength(14)
  })

  it('gridH and gridV are correct', () => {
    expect(data.gridH).toEqual([10, 30, 60, 100, 150, 210, 280, 360, 450])
    expect(data.gridV).toEqual([-300, -100, 80, 240, 400, 560, 720, 880, 1040, 1200, 1360, 1540, 1740])
  })

  it('services has 3 items with icon, title, desc', () => {
    expect(data.services).toHaveLength(3)
    for (const svc of data.services) {
      expect(svc).toHaveProperty('icon')
      expect(svc).toHaveProperty('title')
      expect(svc).toHaveProperty('desc')
    }
  })

  it('COS_TILT and SIN_TILT are derived from -15 degrees', () => {
    const rad = -15 * Math.PI / 180
    expect(data.COS_TILT).toBe(Math.cos(rad))
    expect(data.SIN_TILT).toBe(Math.sin(rad))
  })

  it('produces identical data on every call (deterministic)', () => {
    const data2 = useParallaxData()
    expect(data.stars[0].cx).toBe(data2.stars[0].cx)
    expect(data.constNodes[5].x).toBe(data2.constNodes[5].x)
    expect(data.ringDustParticles[10].angle).toBe(data2.ringDustParticles[10].angle)
  })
})
