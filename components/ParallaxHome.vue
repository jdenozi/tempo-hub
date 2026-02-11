<template>
  <div class="relative">
    <!-- Progress bar -->
    <div ref="progressRef" class="fixed top-0 left-0 h-[2px] bg-[#d4a853] z-50 origin-left" style="transform: scaleX(0)" />

    <!-- ====== FIXED VIEWPORT ====== -->
    <div ref="viewportRef" class="fixed inset-0 z-0 overflow-hidden">

      <!-- Background (cool → warm transition) -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#0a0f2e] to-[#0f0728]" />
      <div ref="warmBgRef" class="absolute inset-0 opacity-0" style="background: radial-gradient(ellipse at 50% 65%, #2d1a00 0%, #1a0a2e 50%, #050816 100%)" />

      <!-- Stars (persistent across all scenes) -->
      <svg ref="starsRef" class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle v-for="s in stars" :key="s.id" :cx="s.cx" :cy="s.cy" :r="s.r" fill="white" :opacity="s.op" />
        <g v-for="(b, i) in brightStars" :key="'b' + b.id" :class="['twinkle', `tw-${i % 3}`]">
          <circle :cx="b.cx" :cy="b.cy" r="6" fill="white" opacity="0.06" />
          <circle :cx="b.cx" :cy="b.cy" r="1.5" fill="white" opacity="0.9" />
        </g>
      </svg>

      <!-- ==================== SCENE 1 : L'IMMENSITE ==================== -->
      <div ref="scene1Ref" class="absolute inset-0">
        <!-- Nebula -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs><filter id="nb"><feGaussianBlur stdDeviation="60" /></filter></defs>
          <ellipse cx="350" cy="300" rx="280" ry="200" fill="#7b2d8e" opacity="0.07" filter="url(#nb)" />
          <ellipse cx="1050" cy="550" rx="320" ry="220" fill="#d4a853" opacity="0.05" filter="url(#nb)" />
          <ellipse cx="750" cy="150" rx="200" ry="130" fill="#00b4d8" opacity="0.04" filter="url(#nb)" />
        </svg>
        <!-- Planet -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="pg" cx="35%" cy="35%" r="55%">
              <stop offset="0%" stop-color="#0f0520" />
              <stop offset="55%" stop-color="#1a0a2e" />
              <stop offset="78%" stop-color="#3d1f5c" />
              <stop offset="90%" stop-color="#d4a853" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="pgl" cx="50%" cy="50%" r="50%">
              <stop offset="65%" stop-color="#d4a853" stop-opacity="0" />
              <stop offset="85%" stop-color="#d4a853" stop-opacity="0.12" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
            </radialGradient>
            <clipPath id="pc"><circle cx="920" cy="340" r="150" /></clipPath>
          </defs>
          <circle cx="920" cy="340" r="230" fill="url(#pgl)" />
          <circle cx="920" cy="340" r="150" fill="url(#pg)" />
          <g clip-path="url(#pc)" stroke="#d4a853" stroke-width="0.6" fill="none" opacity="0.2">
            <ellipse cx="920" cy="260" rx="140" ry="18" />
            <ellipse cx="920" cy="300" rx="148" ry="30" />
            <ellipse cx="920" cy="340" rx="150" ry="45" />
            <ellipse cx="920" cy="380" rx="148" ry="30" />
            <ellipse cx="920" cy="420" rx="140" ry="18" />
            <ellipse cx="920" cy="340" rx="30" ry="150" />
            <ellipse cx="920" cy="340" rx="65" ry="150" />
            <ellipse cx="920" cy="340" rx="105" ry="150" />
          </g>
          <ellipse cx="920" cy="340" rx="240" ry="55" fill="none" stroke="#d4a853" stroke-width="4" opacity="0.06" transform="rotate(-18,920,340)" />
          <ellipse cx="920" cy="340" rx="240" ry="55" fill="none" stroke="#d4a853" stroke-width="1.2" opacity="0.25" transform="rotate(-18,920,340)" />
          <ellipse cx="920" cy="340" rx="260" ry="60" fill="none" stroke="#d4a853" stroke-width="0.4" opacity="0.12" stroke-dasharray="5 8" transform="rotate(-18,920,340)" />
        </svg>
        <!-- Text Scene 1 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p class="text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[#d4a853] mb-4 font-light">{{ client.profession }}</p>
          <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white uppercase tracking-wider leading-none">{{ client.name }}</h1>
          <div class="w-20 sm:w-28 h-px bg-gradient-to-r from-transparent via-[#d4a853] to-transparent mt-6 mb-6" />
          <p class="text-sm sm:text-base md:text-lg text-gray-300 font-light tracking-wide max-w-lg">Concentrez-vous sur votre activité</p>
        </div>
        <!-- Scroll indicator -->
        <div ref="scrollIndRef" class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span class="text-[0.55rem] uppercase tracking-[0.3em] text-[#d4a853]/50">Scroll</span>
          <svg class="w-4 h-4 text-[#d4a853]/50 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 9l6 6 6-6" /></svg>
        </div>
      </div>

      <!-- ==================== SCENE 2 : LA CONSTELLATION ==================== -->
      <div ref="scene2Ref" class="absolute inset-0" style="opacity:0">
        <svg ref="constSvg" class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <!-- Edges -->
          <line v-for="(e, i) in constEdges" :key="'ce' + i" :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" stroke="#d4a853" stroke-width="0.5" opacity="0" data-anim="edge" />
          <!-- Nodes -->
          <g v-for="n in constNodes" :key="'cn' + n.id" data-anim="node" style="opacity:0">
            <circle :cx="n.x" :cy="n.y" :r="n.r * 3" fill="#d4a853" opacity="0.08" />
            <circle :cx="n.x" :cy="n.y" :r="n.r" fill="#d4a853" opacity="0.7" />
          </g>
        </svg>
        <!-- Text Scene 2 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p class="text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[#d4a853]/70 mb-6 font-light">Notre mission</p>
          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white max-w-3xl leading-tight">
            Dans l'immensité du numérique,<br><span class="text-[#d4a853]">nous traçons votre route</span>
          </h2>
        </div>
      </div>

      <!-- ==================== SCENE 3 : L'EXPERTISE ==================== -->
      <div ref="scene3Ref" class="absolute inset-0" style="opacity:0">
        <!-- Grid + Buildings -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="gf" x1="0" y1="0.4" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4a853" stop-opacity="0" />
              <stop offset="40%" stop-color="#d4a853" stop-opacity="0.06" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0.15" />
            </linearGradient>
          </defs>
          <!-- Perspective grid (bottom half) -->
          <g stroke="url(#gf)" stroke-width="1" fill="none">
            <line v-for="y in gridH" :key="'gh' + y" x1="0" :y1="450 + y" x2="1440" :y2="450 + y" />
            <line v-for="x in gridV" :key="'gv' + x" x1="720" y1="450" :x2="x" y2="900" />
          </g>
          <!-- Buildings -->
          <g ref="buildingsGroup">
            <rect
              v-for="b in buildings"
              :key="'bl' + b.x"
              :x="b.x"
              :y="900 - b.h"
              :width="b.w"
              :height="b.h"
              fill="none"
              stroke="#d4a853"
              stroke-width="0.8"
              opacity="0.2"
              data-anim="building"
            />
          </g>
        </svg>
        <!-- Service cards -->
        <div class="absolute inset-0 flex items-center justify-center px-4">
          <div ref="cardsRef" class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-4xl w-full">
            <div v-for="svc in services" :key="svc.icon" class="svc-card" data-anim="card">
              <!-- Icon -->
              <svg class="w-10 h-10 mb-4 text-[#d4a853]" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon v-if="svc.icon === 'diamond'" points="20,2 38,20 20,38 2,20" />
                <path v-if="svc.icon === 'bolt'" d="M22 2L8 22h10l-4 16 16-22H18l4-14z" />
                <circle v-if="svc.icon === 'orbit'" cx="20" cy="20" r="14" />
                <circle v-if="svc.icon === 'orbit'" cx="20" cy="6" r="3" fill="currentColor" />
                <circle v-if="svc.icon === 'orbit'" cx="32" cy="26" r="3" fill="currentColor" />
                <circle v-if="svc.icon === 'orbit'" cx="8" cy="26" r="3" fill="currentColor" />
              </svg>
              <h3 class="text-white font-heading font-semibold text-lg mb-2">{{ svc.title }}</h3>
              <p class="text-gray-400 text-sm leading-relaxed">{{ svc.desc }}</p>
            </div>
          </div>
        </div>
        <!-- Label -->
        <p class="absolute top-[12%] left-1/2 -translate-x-1/2 text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[#d4a853]/70 font-light">Nos expertises</p>
      </div>

      <!-- ==================== SCENE 4 : L'HORIZON ==================== -->
      <div ref="scene4Ref" class="absolute inset-0" style="opacity:0">
        <!-- Horizon glow -->
        <div ref="horizonGlow" class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 75%, rgba(212,168,83,0.25) 0%, transparent 55%)" />
        <!-- Horizon line -->
        <div class="absolute left-0 right-0" style="top:65%; height:2px; background: linear-gradient(90deg, transparent 5%, #d4a853 50%, transparent 95%); opacity: 0.6" />
        <!-- Foreground silhouette -->
        <svg class="absolute bottom-0 left-0 right-0" style="height:35%" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,300 L0,180 L60,178 L90,130 L100,132 L115,85 L125,87 L140,120 L180,118 L220,155 L280,153 L310,110 L325,112 L340,65 L350,67 L365,42 L375,44 L390,90 L430,88 L470,135 L530,133 L570,155 L610,153 L640,110 L660,112 L680,72 L690,74 L705,55 L715,57 L730,95 L770,93 L810,130 L870,128 L910,150 L970,148 L1000,105 L1020,107 L1045,65 L1055,67 L1070,100 L1110,98 L1150,135 L1210,133 L1260,155 L1310,153 L1340,115 L1360,117 L1385,75 L1395,77 L1410,100 L1440,98 L1440,300Z" fill="#050816" />
        </svg>
        <!-- Text + CTA -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">Prêt à décoller ?</h2>
          <p class="text-gray-300 text-sm sm:text-base max-w-lg mb-10 font-light">Prenez rendez-vous pour en discuter,<br>c'est gratuit et sans engagement.</p>
          <NuxtLinkLocale to="/contact" class="cta-btn">
            Prendre rendez-vous
          </NuxtLinkLocale>
        </div>
        <!-- Footer -->
        <div class="absolute bottom-6 left-0 right-0 text-center">
          <p class="text-[0.6rem] text-gray-600 tracking-wider">
            &copy; {{ new Date().getFullYear() }} {{ client.name }} &mdash; {{ contact.email }}
          </p>
        </div>
      </div>

      <!-- Overlays -->
      <div class="absolute inset-0 pointer-events-none scanlines" aria-hidden="true" />
      <div class="absolute inset-0 pointer-events-none vignette" aria-hidden="true" />

    </div>
    <!-- END FIXED VIEWPORT -->

    <!-- Floating nav -->
    <nav ref="navRef" class="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 py-4 flex justify-between items-center">
      <NuxtLinkLocale to="/" class="text-white font-heading text-sm sm:text-base font-semibold tracking-widest uppercase opacity-80 hover:opacity-100 transition-opacity">
        {{ client.name }}
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/contact" class="text-[#d4a853] text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity">
        Contact
      </NuxtLinkLocale>
    </nav>

    <!-- ====== SCROLL DRIVER ====== -->
    <div ref="driverRef" style="height: 600vh" />
  </div>
</template>

<script setup lang="ts">
import { NuxtLinkLocale } from '#components'

const { client, contact } = useClientConfig()

const viewportRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const starsRef = ref<SVGElement>()
const warmBgRef = ref<HTMLElement>()
const scene1Ref = ref<HTMLElement>()
const scene2Ref = ref<HTMLElement>()
const scene3Ref = ref<HTMLElement>()
const scene4Ref = ref<HTMLElement>()
const constSvg = ref<SVGElement>()
const buildingsGroup = ref<SVGGElement>()
const cardsRef = ref<HTMLElement>()
const scrollIndRef = ref<HTMLElement>()
const horizonGlow = ref<HTMLElement>()
const navRef = ref<HTMLElement>()
const driverRef = ref<HTMLElement>()

const { hasAnimations } = useFeatures()

// --- Deterministic pseudo-random ---
function rand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// --- Stars ---
const stars = Array.from({ length: 350 }, (_, i) => ({
  id: i,
  cx: rand(i * 2) * 1440,
  cy: rand(i * 2 + 1) * 900,
  r: 0.3 + rand(i * 3) * 1,
  op: 0.12 + rand(i * 4) * 0.7,
}))
const brightStars = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  cx: rand(i * 5 + 1000) * 1440,
  cy: rand(i * 5 + 1001) * 750,
}))

// --- Constellation (Scene 2) ---
const constNodes = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: 120 + rand(i * 17 + 3000) * 1200,
  y: 120 + rand(i * 17 + 3001) * 650,
  r: 2 + rand(i * 17 + 3002) * 2.5,
}))
const constEdges: { x1: number; y1: number; x2: number; y2: number }[] = []
for (let i = 0; i < constNodes.length; i++) {
  for (let j = i + 1; j < constNodes.length; j++) {
    const dx = constNodes[i].x - constNodes[j].x
    const dy = constNodes[i].y - constNodes[j].y
    if (Math.sqrt(dx * dx + dy * dy) < 230 && constEdges.length < 50) {
      constEdges.push({ x1: constNodes[i].x, y1: constNodes[i].y, x2: constNodes[j].x, y2: constNodes[j].y })
    }
  }
}

// --- Grid (Scene 3) ---
const gridH = [10, 30, 60, 100, 150, 210, 280, 360, 450]
const gridV = [-300, -100, 80, 240, 400, 560, 720, 880, 1040, 1200, 1360, 1540, 1740]
const buildings = [
  { x: 140, w: 26, h: 130 }, { x: 240, w: 16, h: 70 }, { x: 360, w: 34, h: 170 },
  { x: 470, w: 20, h: 90 }, { x: 590, w: 28, h: 145 }, { x: 710, w: 18, h: 195 },
  { x: 830, w: 24, h: 105 }, { x: 950, w: 36, h: 160 }, { x: 1070, w: 18, h: 75 },
  { x: 1190, w: 30, h: 140 }, { x: 1310, w: 16, h: 95 },
]

// --- Services (Scene 3) ---
const services = [
  { icon: 'diamond', title: 'Design', desc: 'Sites web sur-mesure, modernes et performants.' },
  { icon: 'bolt', title: 'Performance', desc: 'Optimisation SEO et temps de chargement minimal.' },
  { icon: 'orbit', title: 'Accompagnement', desc: 'Suivi personnalisé et formation à la gestion du site.' },
]

// --- GSAP Parallax ---
onMounted(async () => {
  if (!hasAnimations.value) return
  const gsapModule = await useGsap()
  if (!gsapModule) return
  const { gsap } = gsapModule
  const d = driverRef.value!

  // Progress bar
  gsap.to(progressRef.value, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: d, start: 'top top', end: 'bottom bottom', scrub: 0 },
  })

  // Stars drift
  gsap.to(starsRef.value, {
    yPercent: -20, ease: 'none',
    scrollTrigger: { trigger: d, start: 'top top', end: 'bottom bottom', scrub: 1 },
  })

  // Warm background fade
  gsap.to(warmBgRef.value, {
    opacity: 0.7, ease: 'none',
    scrollTrigger: { trigger: d, start: '60% top', end: '82% top', scrub: 1 },
  })

  // Scroll indicator
  gsap.to(scrollIndRef.value, {
    opacity: 0, yPercent: -300, ease: 'none',
    scrollTrigger: { trigger: d, start: '2% top', end: '8% top', scrub: 1 },
  })

  // ========== SCENE 1 → out ==========
  gsap.to(scene1Ref.value, {
    opacity: 0, yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: d, start: '18% top', end: '30% top', scrub: 1 },
  })

  // ========== SCENE 2 → in ==========
  gsap.fromTo(scene2Ref.value,
    { opacity: 0, yPercent: 8 },
    { opacity: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: d, start: '24% top', end: '34% top', scrub: 1 },
    },
  )
  // Constellation nodes
  if (constSvg.value) {
    gsap.fromTo(constSvg.value.querySelectorAll('[data-anim="node"]'),
      { scale: 0, opacity: 0, transformOrigin: 'center' },
      { scale: 1, opacity: 1, stagger: 0.02, ease: 'none',
        scrollTrigger: { trigger: d, start: '26% top', end: '36% top', scrub: 1 },
      },
    )
    gsap.fromTo(constSvg.value.querySelectorAll('[data-anim="edge"]'),
      { opacity: 0 },
      { opacity: 0.3, stagger: 0.01, ease: 'none',
        scrollTrigger: { trigger: d, start: '28% top', end: '38% top', scrub: 1 },
      },
    )
  }
  // SCENE 2 → out
  gsap.to(scene2Ref.value, {
    opacity: 0, yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: d, start: '48% top', end: '58% top', scrub: 1 },
  })

  // ========== SCENE 3 → in ==========
  gsap.fromTo(scene3Ref.value,
    { opacity: 0, yPercent: 8 },
    { opacity: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: d, start: '52% top', end: '62% top', scrub: 1 },
    },
  )
  // Buildings rise
  if (buildingsGroup.value) {
    gsap.fromTo(buildingsGroup.value.querySelectorAll('[data-anim="building"]'),
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, stagger: 0.02, ease: 'none',
        scrollTrigger: { trigger: d, start: '54% top', end: '63% top', scrub: 1 },
      },
    )
  }
  // Service cards
  if (cardsRef.value) {
    gsap.fromTo(cardsRef.value.querySelectorAll('[data-anim="card"]'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04, ease: 'none',
        scrollTrigger: { trigger: d, start: '56% top', end: '65% top', scrub: 1 },
      },
    )
  }
  // SCENE 3 → out
  gsap.to(scene3Ref.value, {
    opacity: 0, yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: d, start: '74% top', end: '82% top', scrub: 1 },
  })

  // ========== SCENE 4 → in ==========
  gsap.fromTo(scene4Ref.value,
    { opacity: 0, yPercent: 8 },
    { opacity: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: d, start: '78% top', end: '88% top', scrub: 1 },
    },
  )
  // Horizon glow intensify
  gsap.fromTo(horizonGlow.value,
    { opacity: 0 },
    { opacity: 1, ease: 'none',
      scrollTrigger: { trigger: d, start: '80% top', end: '92% top', scrub: 1 },
    },
  )
})
</script>

<style scoped>
.scanlines {
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
}
.vignette {
  background: radial-gradient(ellipse at center, transparent 40%, rgba(5,8,22,0.5) 100%);
}

/* Service cards */
.svc-card {
  background: rgba(212, 168, 83, 0.04);
  border: 1px solid rgba(212, 168, 83, 0.12);
  backdrop-filter: blur(12px);
  border-radius: 4px;
  padding: 1.75rem;
}

/* CTA button */
.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  border-radius: 2px;
  text-decoration: none;
  background: linear-gradient(135deg, #d4a853, #c4943f);
  color: #050816;
  transition: all 0.3s ease;
}
.cta-btn:hover {
  box-shadow: 0 0 30px rgba(212, 168, 83, 0.4);
  transform: translateY(-2px);
}

/* Twinkle */
@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
.tw-0 { animation: twinkle 3s ease-in-out infinite; }
.tw-1 { animation: twinkle 4.5s ease-in-out infinite 0.7s; }
.tw-2 { animation: twinkle 2.8s ease-in-out infinite 1.4s; }
</style>
