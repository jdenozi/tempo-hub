/**
 * Static data arrays for the ParallaxHome component.
 * Extracted to reduce component size — all values are deterministic
 * (seeded pseudo-random) and computed once at import time.
 */

import { markRaw } from 'vue'

// --- Deterministic pseudo-random ---
export function rand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export function useParallaxData() {
  // --- Stars ---
  const stars = markRaw(Array.from({ length: 450 }, (_, i) => ({
    id: i,
    cx: rand(i * 2) * 1440,
    cy: rand(i * 2 + 1) * 900,
    r: 0.3 + rand(i * 3) * 1,
    op: 0.12 + rand(i * 4) * 0.7,
  })))

  const brightStars = markRaw(Array.from({ length: 24 }, (_, i) => ({
    id: i,
    cx: rand(i * 5 + 1000) * 1440,
    cy: rand(i * 5 + 1001) * 750,
  })))

  // --- Floating dust particles ---
  const dustParticles = markRaw(Array.from({ length: 60 }, (_, i) => ({
    id: i,
    cx: rand(i * 7 + 5000) * 1440,
    cy: rand(i * 7 + 5001) * 900,
    r: 0.5 + rand(i * 7 + 5002) * 1.5,
    op: 0.05 + rand(i * 7 + 5003) * 0.15,
    color: rand(i * 7 + 5004) > 0.6 ? '#d4a853' : rand(i * 7 + 5004) > 0.3 ? '#b03060' : '#8090a0',
  })))

  // --- Ring dust particles (orbit Saturn) ---
  const RING_TILT_DEG = -15
  const RING_TILT_RAD = RING_TILT_DEG * Math.PI / 180
  const COS_TILT = Math.cos(RING_TILT_RAD)
  const SIN_TILT = Math.sin(RING_TILT_RAD)

  const ringOrbits = [
    { rx: 1050, ry: 200, count: 8, speed: 0.4 },
    { rx: 950, ry: 180, count: 7, speed: 0.55 },
    { rx: 850, ry: 160, count: 6, speed: 0.7 },
    { rx: 750, ry: 140, count: 6, speed: 0.9 },
  ]

  const ringDustParticles = markRaw(ringOrbits.flatMap((orbit, oi) =>
    Array.from({ length: orbit.count }, (_, pi) => {
      const id = oi * 10 + pi
      const startAngle = (pi / orbit.count) * 360 + rand(id * 13 + 9000) * 60
      return {
        id,
        rx: orbit.rx,
        ry: orbit.ry,
        angle: startAngle,
        speed: orbit.speed + rand(id * 13 + 9005) * 0.15,
        r: 2.5 + rand(id * 13 + 9001) * 5,
        opacity: 0.2 + rand(id * 13 + 9002) * 0.4,
        color: rand(id * 13 + 9003) > 0.4 ? '#d4a853' : '#d08030',
      }
    }),
  ))

  // --- Asteroids (Scene 1) ---
  const asteroids = markRaw(Array.from({ length: 17 }, (_, i) => ({
    id: i,
    cx: rand(i * 11 + 7000) * 1440,
    cy: rand(i * 11 + 7001) * 900,
    rx: 1.5 + rand(i * 11 + 7002) * 4,
    ry: 1 + rand(i * 11 + 7003) * 3,
    rot: rand(i * 11 + 7004) * 360,
  })))

  // --- Constellation (Scene 2) ---
  const constNodes = markRaw(Array.from({ length: 42 }, (_, i) => ({
    id: i,
    x: 120 + rand(i * 17 + 3000) * 1200,
    y: 120 + rand(i * 17 + 3001) * 650,
    r: 2 + rand(i * 17 + 3002) * 2.5,
  })))

  const constEdges: { x1: number; y1: number; x2: number; y2: number }[] = markRaw([])
  for (let i = 0; i < constNodes.length; i++) {
    for (let j = i + 1; j < constNodes.length; j++) {
      const dx = constNodes[i].x - constNodes[j].x
      const dy = constNodes[i].y - constNodes[j].y
      if (Math.sqrt(dx * dx + dy * dy) < 200 && constEdges.length < 50) {
        constEdges.push({ x1: constNodes[i].x, y1: constNodes[i].y, x2: constNodes[j].x, y2: constNodes[j].y })
      }
    }
  }

  // --- Energy tendrils ---
  const tendrils: { d: string }[] = markRaw([])
  for (let i = 0; i < constEdges.length && tendrils.length < 12; i += 4) {
    const e = constEdges[i]
    const mx = (e.x1 + e.x2) / 2 + (rand(i + 8000) - 0.5) * 80
    const my = (e.y1 + e.y2) / 2 + (rand(i + 8001) - 0.5) * 80
    tendrils.push({ d: `M${e.x1},${e.y1} Q${mx},${my} ${e.x2},${e.y2}` })
  }

  // --- Orbital particles ---
  const orbitalParticles = markRaw(constNodes.slice(0, 14).map((n, i) => ({
    id: i,
    cx: n.x + (10 + rand(i + 9000) * 15) * Math.cos(rand(i + 9001) * Math.PI * 2),
    cy: n.y + (10 + rand(i + 9000) * 15) * Math.sin(rand(i + 9001) * Math.PI * 2),
  })))

  // --- Grid (Scene 3) ---
  const gridH = markRaw([10, 30, 60, 100, 150, 210, 280, 360, 450])
  const gridV = markRaw([-300, -100, 80, 240, 400, 560, 720, 880, 1040, 1200, 1360, 1540, 1740])

  // --- Services ---
  const services = markRaw([
    { icon: 'diamond', title: 'Design', desc: 'Sites web sur-mesure, modernes et performants.' },
    { icon: 'bolt', title: 'Performance', desc: 'Optimisation SEO et temps de chargement minimal.' },
    { icon: 'orbit', title: 'Accompagnement', desc: 'Suivi personnalisé et formation à la gestion du site.' },
    { icon: 'code', title: 'Développement', desc: 'Applications web robustes avec Vue, Nuxt et TypeScript.' },
    { icon: 'shield', title: 'Hébergement', desc: 'Déploiement, maintenance et sécurité de votre site.' },
    { icon: 'connect', title: 'Intégrations', desc: 'Stripe, Cal.com, n8n et outils métier connectés.' },
  ])

  return {
    stars,
    brightStars,
    dustParticles,
    ringDustParticles,
    asteroids,
    constNodes,
    constEdges,
    tendrils,
    orbitalParticles,
    gridH,
    gridV,
    services,
    COS_TILT,
    SIN_TILT,
  }
}
