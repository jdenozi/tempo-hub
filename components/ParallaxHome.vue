<template>
  <div class="relative">

    <!-- ====== PERSISTENT SSR BACKGROUND ====== -->
    <!-- Always visible (SSR + client). Prevents flash during ClientOnly hydration swap. -->
    <!-- z-[-1]: sits behind viewport (z-0) but is always present. -->
    <div class="fixed inset-0 z-[-1] bg-gradient-to-b from-[#0e0616] via-[#150a28] to-[#180a30]" aria-hidden="true" />
    <!-- Progress bar -->
    <div ref="progressRef" class="fixed top-0 left-0 h-[2px] bg-[#d4a853] z-50 origin-left" style="transform: scaleX(0)" />

    <!-- ====== FIXED VIEWPORT ====== -->
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen bg-gradient-to-b from-[#0e0616] via-[#150a28] to-[#180a30]">
          <!-- Hero Section -->
          <section class="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <p class="text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[#d4a853] mb-4 font-light">{{ client.profession }}</p>
            <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white uppercase tracking-wider leading-none">{{ client.name }}</h1>
            <div class="w-20 sm:w-28 h-px bg-gradient-to-r from-transparent via-[#d4a853] to-transparent mt-6 mb-6" />
            <p class="text-sm sm:text-base md:text-lg text-gray-300 font-light tracking-wide max-w-lg">{{ $t('home.scene1Subtitle') }}</p>
          </section>

          <!-- Mission -->
          <section class="py-20 flex flex-col items-center justify-center text-center px-4">
            <p class="text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[#d4a853]/70 mb-6 font-light">{{ $t('home.scene2Label') }}</p>
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white max-w-3xl leading-tight" v-html="$t('home.scene2Title')"></h2>
          </section>

          <!-- Expertise -->
          <section class="py-20 flex flex-col items-center justify-center px-4">
            <h2 class="text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.3em] text-[#d4a853] font-heading font-semibold mb-6 md:mb-10">{{ $t('home.scene3Label') }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl w-full">
              <div v-for="svc in services" :key="svc.icon" class="svc-card">
              <svg class="w-10 h-10 mb-4 text-[#d4a853]" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon v-if="svc.icon === 'diamond'" points="20,2 38,20 20,38 2,20" />
                <path v-if="svc.icon === 'bolt'" d="M22 2L8 22h10l-4 16 16-22H18l4-14z" />
                <circle v-if="svc.icon === 'orbit'" cx="20" cy="20" r="14" />
                <circle v-if="svc.icon === 'orbit'" cx="20" cy="6" r="3" fill="currentColor" />
                <circle v-if="svc.icon === 'orbit'" cx="32" cy="26" r="3" fill="currentColor" />
                <circle v-if="svc.icon === 'orbit'" cx="8" cy="26" r="3" fill="currentColor" />
                <path v-if="svc.icon === 'code'" d="M14 12L4 20l10 8M26 12l10 8-10 8M18 32l4-24" />
                <rect v-if="svc.icon === 'shield'" x="6" y="4" width="28" height="32" rx="2" />
                <path v-if="svc.icon === 'shield'" d="M20 4v32M6 20h28" />
                <circle v-if="svc.icon === 'shield'" cx="20" cy="20" r="5" />
                <circle v-if="svc.icon === 'connect'" cx="10" cy="10" r="4" />
                <circle v-if="svc.icon === 'connect'" cx="30" cy="10" r="4" />
                <circle v-if="svc.icon === 'connect'" cx="20" cy="30" r="4" />
                <line v-if="svc.icon === 'connect'" x1="13" y1="12" x2="17" y2="27" />
                <line v-if="svc.icon === 'connect'" x1="27" y1="12" x2="23" y2="27" />
                <line v-if="svc.icon === 'connect'" x1="14" y1="10" x2="26" y2="10" />
              </svg>
                <h3 class="text-white font-heading font-semibold text-lg mb-2">{{ svc.title }}</h3>
                <p class="text-gray-400 text-sm leading-relaxed">{{ svc.desc }}</p>
              </div>
            </div>
          </section>

          <!-- CTA -->
          <section class="py-20 flex flex-col items-center justify-center text-center px-4">
            <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">{{ $t('home.scene4Title') }}</h2>
            <p class="text-gray-300 text-sm sm:text-base max-w-lg mb-10 font-light" v-html="$t('home.scene4Subtitle')"></p>
            <NuxtLinkLocale to="/rendez-vous" class="cta-btn">{{ $t('home.ctaButton') }}</NuxtLinkLocale>
          </section>

          <!-- Footer -->
          <div class="text-center pb-6">
            <p class="text-[0.6rem] text-gray-600 tracking-wider">&copy; {{ new Date().getFullYear() }} {{ client.name }} &mdash; {{ contact.email }}</p>
          </div>
        </div>
      </template>
    <div ref="viewportRef" class="fixed inset-0 z-0 overflow-hidden" style="will-change: transform">

      <!-- Background (deep space → warm transition) -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e0616] via-[#150a28] to-[#180a30]" />
      <div ref="warmBgRef" class="absolute inset-0 opacity-0" style="background: radial-gradient(ellipse at 50% 65%, #2d1a00 0%, #1a0a2e 50%, #0e0616 100%); will-change: opacity" />

      <!-- Stars (persistent) -->
      <svg ref="starsRef" class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="will-change: transform, opacity">
        <circle v-for="s in stars" :key="s.id" :cx="s.cx" :cy="s.cy" :r="s.r" fill="white" :opacity="s.op" />
        <g v-for="(b, i) in brightStars" :key="'b' + b.id" :class="['twinkle', `tw-${i % 3}`]">
          <circle :cx="b.cx" :cy="b.cy" r="6" fill="white" opacity="0.06" />
          <circle :cx="b.cx" :cy="b.cy" r="1.5" fill="white" opacity="0.9" />
        </g>
      </svg>

      <!-- Floating dust particles -->
      <svg ref="dustRef" class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="will-change: transform, opacity">
        <circle
          v-for="p in dustParticles"
          :key="'dust' + p.id"
          :cx="p.cx"
          :cy="p.cy"
          :r="p.r"
          :fill="p.color"
          :opacity="p.op"
          :class="'dust-drift dust-drift-' + (p.id % 4)"
        />
      </svg>

      <!-- Shooting stars -->
      <div class="shooting-star" />
      <div class="shooting-star shooting-star-2" />
      <div class="shooting-star shooting-star-3" />

      <!-- ===== PERSISTENT SATURN PLANET (animated from bottom-left to top-left) ===== -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="saturn-body" cx="60%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#0a0418" />
            <stop offset="35%" stop-color="#12082a" />
            <stop offset="60%" stop-color="#2a1548" />
            <stop offset="82%" stop-color="#5c3070" />
            <stop offset="93%" stop-color="#d4a853" stop-opacity="0.45" />
            <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="saturn-atmo" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stop-color="#d4a853" stop-opacity="0" />
            <stop offset="78%" stop-color="#d4a853" stop-opacity="0.06" />
            <stop offset="90%" stop-color="#d08030" stop-opacity="0.03" />
            <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="saturn-ring-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#d4a853" stop-opacity="0" />
            <stop offset="12%" stop-color="#d4a853" stop-opacity="0.25" />
            <stop offset="35%" stop-color="#d4a853" stop-opacity="0.15" />
            <stop offset="50%" stop-color="#d4a853" stop-opacity="0.04" />
            <stop offset="65%" stop-color="#d4a853" stop-opacity="0.15" />
            <stop offset="88%" stop-color="#d4a853" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
          </linearGradient>
          <clipPath id="saturn-clip-behind">
            <rect x="-1500" y="0" width="3000" height="1500" />
          </clipPath>
          <clipPath id="saturn-clip-front">
            <rect x="-1500" y="-1500" width="3000" height="1500" />
          </clipPath>
          <clipPath id="pc-saturn"><circle cx="0" cy="0" r="550" /></clipPath>
          <filter id="ring-blur"><feGaussianBlur stdDeviation="2.5" /></filter>
          <filter id="dust-blur"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>

        <!-- Planet group: GSAP animates SVG transform from bottom-left to top-left -->
        <g ref="saturnGroupRef" transform="translate(-120, 1020)">
          <!-- Atmospheric glow -->
          <circle cx="0" cy="0" r="850" fill="url(#saturn-atmo)" />

          <!-- Back ring (behind planet) -->
          <g clip-path="url(#saturn-clip-behind)">
            <ellipse cx="0" cy="0" rx="1050" ry="200" fill="none" stroke="url(#saturn-ring-g)" stroke-width="65" opacity="0.18" transform="rotate(-15)" />
            <ellipse cx="0" cy="0" rx="950" ry="180" fill="none" stroke="url(#saturn-ring-g)" stroke-width="40" opacity="0.12" transform="rotate(-15)" />
            <ellipse cx="0" cy="0" rx="850" ry="160" fill="none" stroke="url(#saturn-ring-g)" stroke-width="18" opacity="0.08" transform="rotate(-15)" />
          </g>

          <!-- Planet body -->
          <circle cx="0" cy="0" r="550" fill="url(#saturn-body)" />

          <!-- Surface atmospheric bands -->
          <g clip-path="url(#pc-saturn)" opacity="0.12">
            <ellipse cx="0" cy="-280" rx="540" ry="55" fill="none" stroke="#d4a853" stroke-width="1.2" />
            <ellipse cx="0" cy="-180" rx="548" ry="70" fill="none" stroke="#b03060" stroke-width="0.8" />
            <ellipse cx="0" cy="-80" rx="550" ry="85" fill="none" stroke="#d4a853" stroke-width="1.4" />
            <ellipse cx="0" cy="30" rx="548" ry="80" fill="none" stroke="#d08030" stroke-width="1" />
            <ellipse cx="0" cy="140" rx="540" ry="65" fill="none" stroke="#d4a853" stroke-width="0.7" />
            <ellipse cx="0" cy="240" rx="525" ry="55" fill="none" stroke="#b03060" stroke-width="0.8" />
            <ellipse cx="0" cy="340" rx="500" ry="45" fill="none" stroke="#d4a853" stroke-width="0.6" />
            <ellipse cx="0" cy="420" rx="460" ry="38" fill="none" stroke="#d08030" stroke-width="0.5" />
          </g>

          <!-- Storm details -->
          <ellipse cx="-160" cy="-100" rx="50" ry="28" fill="none" stroke="#d4a853" stroke-width="0.5" opacity="0.1" transform="rotate(8,-160,-100)" />
          <ellipse cx="100" cy="-200" rx="35" ry="18" fill="none" stroke="#d08030" stroke-width="0.4" opacity="0.08" />
          <ellipse cx="-80" cy="-260" rx="25" ry="12" fill="none" stroke="#d4a853" stroke-width="0.3" opacity="0.07" />

          <!-- Front ring (in front of planet) -->
          <g clip-path="url(#saturn-clip-front)">
            <ellipse cx="0" cy="0" rx="1050" ry="200" fill="none" stroke="url(#saturn-ring-g)" stroke-width="65" opacity="0.22" transform="rotate(-15)" filter="url(#ring-blur)" />
            <ellipse cx="0" cy="0" rx="950" ry="180" fill="none" stroke="url(#saturn-ring-g)" stroke-width="40" opacity="0.16" transform="rotate(-15)" />
            <ellipse cx="0" cy="0" rx="850" ry="160" fill="none" stroke="url(#saturn-ring-g)" stroke-width="18" opacity="0.1" transform="rotate(-15)" />
            <!-- Ring band details (animated flow) -->
            <ellipse cx="0" cy="0" rx="1100" ry="210" fill="none" stroke="#d4a853" stroke-width="0.8" opacity="0.06" stroke-dasharray="12 18" transform="rotate(-15)" class="ring-flow ring-flow-1" />
            <ellipse cx="0" cy="0" rx="1000" ry="190" fill="none" stroke="#d4a853" stroke-width="0.6" opacity="0.05" stroke-dasharray="8 14" transform="rotate(-15)" class="ring-flow ring-flow-2" />
            <ellipse cx="0" cy="0" rx="900" ry="170" fill="none" stroke="#d4a853" stroke-width="0.5" opacity="0.05" stroke-dasharray="5 10" transform="rotate(-15)" class="ring-flow ring-flow-3" />
            <ellipse cx="0" cy="0" rx="800" ry="150" fill="none" stroke="#d4a853" stroke-width="0.4" opacity="0.04" stroke-dasharray="4 8" transform="rotate(-15)" class="ring-flow ring-flow-4" />
          </g>

          <!-- Ring shadow on planet surface -->
          <ellipse cx="0" cy="-160" rx="550" ry="30" fill="#0e0616" opacity="0.12" />

          <!-- ===== ORBITING RING DUST (GSAP animated on elliptical paths) ===== -->
          <g ref="ringDustRef">
            <circle
              v-for="p in ringDustParticles"
              :key="'rd' + p.id"
              :data-dust="p.id"
              cx="0" cy="0"
              :r="p.r"
              :fill="p.color"
              :opacity="p.opacity"
            />
          </g>
        </g>
      </svg>

      <!-- ==================== SCENE 1 : L'IMMENSITÉ (img.png - Berkey) ==================== -->
      <div ref="scene1Ref" class="absolute inset-0">

        <!-- Nebula — warm reds, oranges, magentas (Berkey palette) -->
        <svg v-once class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <filter id="nb"><feGaussianBlur stdDeviation="60" /></filter>
            <filter id="nb-lg"><feGaussianBlur stdDeviation="100" /></filter>
            <filter id="nb-xl"><feGaussianBlur stdDeviation="140" /></filter>
          </defs>
          <!-- Core red/orange mass (center-right, behind ships) -->
          <ellipse cx="900" cy="350" rx="400" ry="320" fill="#c02020" opacity="0.06" filter="url(#nb-xl)" />
          <ellipse cx="1000" cy="300" rx="300" ry="250" fill="#d04820" opacity="0.055" filter="url(#nb-lg)" />
          <ellipse cx="800" cy="400" rx="250" ry="200" fill="#b03060" opacity="0.05" filter="url(#nb-lg)" />
          <!-- Amber accent highlights -->
          <ellipse cx="1050" cy="350" rx="200" ry="150" fill="#d4a853" opacity="0.045" filter="url(#nb)" />
          <ellipse cx="600" cy="250" rx="180" ry="130" fill="#d04040" opacity="0.035" filter="url(#nb)" />
          <!-- Deeper atmosphere (purple-red edges) -->
          <ellipse cx="250" cy="600" rx="350" ry="280" fill="#8b1a4a" opacity="0.04" filter="url(#nb-xl)" />
          <ellipse cx="1250" cy="650" rx="280" ry="200" fill="#7b2d5e" opacity="0.03" filter="url(#nb-lg)" />
          <!-- Cool accent (sparse, for contrast) -->
          <ellipse cx="350" cy="150" rx="160" ry="100" fill="#1a3060" opacity="0.04" filter="url(#nb)" />
          <!-- Secondary nebula wisps (deeper atmosphere) -->
          <ellipse cx="500" cy="500" rx="220" ry="160" fill="#d04820" opacity="0.035" filter="url(#nb-lg)" />
          <ellipse cx="1200" cy="200" rx="250" ry="120" fill="#b03060" opacity="0.04" filter="url(#nb)" />
          <ellipse cx="150" cy="450" rx="200" ry="140" fill="#c02020" opacity="0.03" filter="url(#nb-lg)" />
          <ellipse cx="750" cy="700" rx="300" ry="180" fill="#1a3060" opacity="0.035" filter="url(#nb-xl)" />
        </svg>

        <!-- God-rays from behind planet (warm amber/orange) -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="ray1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#d4a853" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="ray2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#d08030" stop-opacity="0.06" />
              <stop offset="100%" stop-color="#d08030" stop-opacity="0" />
            </linearGradient>
          </defs>
          <g ref="raysRef" opacity="0.7">
            <polygon points="920,340 1440,0 1440,120" fill="url(#ray2)" />
            <polygon points="920,340 1440,180 1440,300" fill="url(#ray1)" />
            <polygon points="920,340 1440,400 1440,550" fill="url(#ray2)" />
            <polygon points="920,340 1440,650 1440,800" fill="url(#ray1)" />
            <polygon points="920,340 1100,0 1260,0" fill="url(#ray2)" />
            <polygon points="920,340 650,0 800,0" fill="url(#ray2)" opacity="0.4" />
            <polygon points="920,340 920,900 1100,900" fill="url(#ray2)" opacity="0.35" />
            <polygon points="920,340 400,0 550,0" fill="url(#ray2)" opacity="0.2" />
          </g>
        </svg>

        <!-- Distant moon -->
        <svg v-once class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="moon-g" cx="45%" cy="40%" r="50%">
              <stop offset="0%" stop-color="#c0c8d8" />
              <stop offset="70%" stop-color="#8090a0" />
              <stop offset="100%" stop-color="#506070" stop-opacity="0.6" />
            </radialGradient>
            <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
              <stop offset="50%" stop-color="#a0b0c0" stop-opacity="0" />
              <stop offset="80%" stop-color="#a0b0c0" stop-opacity="0.06" />
              <stop offset="100%" stop-color="#a0b0c0" stop-opacity="0" />
            </radialGradient>
          </defs>
          <circle cx="250" cy="180" r="60" fill="url(#moon-glow)" />
          <circle cx="250" cy="180" r="22" fill="url(#moon-g)" opacity="0.6" />
          <circle cx="243" cy="174" r="3" fill="#405060" opacity="0.3" />
          <circle cx="256" cy="182" r="2" fill="#405060" opacity="0.25" />
          <circle cx="248" cy="190" r="1.5" fill="#405060" opacity="0.2" />
        </svg>

        <!-- Shooting stars (SVG streaks) -->
        <svg v-once class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="ss-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
              <stop offset="50%" stop-color="#ffffff" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0.4" />
            </linearGradient>
          </defs>
          <line x1="320" y1="60" x2="440" y2="108" stroke="url(#ss-grad)" stroke-width="1.5" stroke-linecap="round" class="ss-line-1" />
          <line x1="850" y1="40" x2="970" y2="88" stroke="url(#ss-grad)" stroke-width="1.2" stroke-linecap="round" class="ss-line-2" />
          <line x1="1180" y1="130" x2="1280" y2="170" stroke="url(#ss-grad)" stroke-width="1" stroke-linecap="round" class="ss-line-3" />
        </svg>

        <!-- Planet (warmer tones, Berkey-inspired) -->
        <svg ref="planetGridRef" class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
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
              <stop offset="85%" stop-color="#d4a853" stop-opacity="0.14" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
            </radialGradient>
            <clipPath id="pc"><circle cx="920" cy="340" r="150" /></clipPath>
          </defs>
          <circle cx="920" cy="340" r="240" fill="url(#pgl)" />
          <circle cx="920" cy="340" r="150" fill="url(#pg)" />
          <g clip-path="url(#pc)" stroke="#d4a853" stroke-width="0.6" fill="none" opacity="0.2">
            <!-- Parallèles (fixes) -->
            <ellipse cx="920" cy="260" rx="140" ry="18" />
            <ellipse cx="920" cy="300" rx="148" ry="30" />
            <ellipse cx="920" cy="340" rx="150" ry="45" />
            <ellipse cx="920" cy="380" rx="148" ry="30" />
            <ellipse cx="920" cy="420" rx="140" ry="18" />
            <!-- Méridiens (animés par GSAP — rotation axe Y) -->
            <ellipse v-for="m in 6" :key="'mer' + m" :data-mer="m" cx="920" cy="340" rx="0" ry="150" />
          </g>
          <!-- Surface craters -->
          <circle cx="940" cy="325" r="12" fill="none" stroke="#d4a853" stroke-width="0.5" opacity="0.12" />
          <circle cx="895" cy="365" r="8" fill="none" stroke="#d4a853" stroke-width="0.4" opacity="0.10" />
          <!-- Atmospheric band -->
          <ellipse cx="920" cy="308" rx="120" ry="8" fill="none" stroke="#d08030" stroke-width="0.8" opacity="0.08" />
          <!-- Orbital rings (warm) -->
          <ellipse cx="920" cy="340" rx="240" ry="55" fill="none" stroke="#d4a853" stroke-width="4" opacity="0.06" transform="rotate(-18,920,340)" />
          <ellipse cx="920" cy="340" rx="240" ry="55" fill="none" stroke="#d4a853" stroke-width="1.2" opacity="0.25" transform="rotate(-18,920,340)" />
          <ellipse cx="920" cy="340" rx="260" ry="60" fill="none" stroke="#d4a853" stroke-width="0.4" opacity="0.12" stroke-dasharray="5 8" transform="rotate(-18,920,340)" />
          <ellipse cx="920" cy="340" rx="200" ry="40" fill="none" stroke="#d4a853" stroke-width="0.5" opacity="0.08" stroke-dasharray="3 6" transform="rotate(35,920,340)" />
        </svg>

        <!-- Asteroid debris field -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g opacity="0.15">
            <template v-for="a in asteroids" :key="'ast' + a.id">
              <ellipse :cx="a.cx" :cy="a.cy" :rx="a.rx" :ry="a.ry" :transform="`rotate(${a.rot},${a.cx},${a.cy})`" fill="#2a2040" stroke="#504070" stroke-width="0.3" />
              <ellipse :cx="a.cx + a.rx * 0.2" :cy="a.cy - a.ry * 0.15" :rx="a.rx * 0.35" :ry="a.ry * 0.3" :transform="`rotate(${a.rot},${a.cx},${a.cy})`" fill="none" stroke="#607080" stroke-width="0.4" opacity="0.25" />
            </template>
          </g>
        </svg>

        <!-- Data readout -->
        <div class="data-readout absolute top-16 left-6 sm:left-10">
          <span class="beacon-dot" /> SYS.ONLINE <span class="mx-1 text-[#d4a853]/15">//</span> STELLAR RELAY
        </div>

        <!-- Text Scene 1 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p class="text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[#d4a853] mb-4 font-light retro-glow">{{ client.profession }}</p>
          <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white uppercase tracking-wider leading-none retro-title">{{ client.name }}</h1>
          <div class="w-20 sm:w-28 h-px bg-gradient-to-r from-transparent via-[#d4a853] to-transparent mt-6 mb-6" />
          <p class="text-sm sm:text-base md:text-lg text-gray-300 font-light tracking-wide max-w-lg">{{ $t('home.scene1Subtitle') }}</p>
        </div>
        <!-- Scroll indicator -->
        <div ref="scrollIndRef" class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span class="text-[0.55rem] uppercase tracking-[0.3em] text-[#d4a853]/50">Scroll</span>
          <svg class="w-4 h-4 text-[#d4a853]/50 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 9l6 6 6-6" /></svg>
        </div>
      </div>
      <template v-if="scenesReady">

      <!-- ==================== SCENE 2 : LA CONSTELLATION (img_2.png - Bioluminescent) ==================== -->
      <div ref="scene2Ref" class="absolute inset-0" style="opacity:0">

        <!-- Atmospheric magenta/coral color bands (img_2 style) -->
        <div class="absolute inset-0" style="background:
          linear-gradient(180deg, transparent 20%, rgba(176,48,96,0.06) 35%, rgba(208,72,32,0.04) 45%, rgba(176,48,96,0.08) 55%, rgba(120,40,140,0.05) 65%, transparent 80%),
          radial-gradient(ellipse at 30% 60%, rgba(176,48,96,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 40%, rgba(120,40,140,0.06) 0%, transparent 45%)" />

        <!-- Constellation network -->
        <svg ref="constSvg" class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <filter id="jf-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="s2-glow-sm">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <!-- Energy tendrils -->
          <path
            v-for="(t, i) in tendrils"
            :key="'tend' + i"
            :d="t.d"
            fill="none"
            stroke="#d4a853"
            stroke-width="0.4"
            opacity="0"
            stroke-dasharray="4 6"
            data-anim="tendril"
          />

          <!-- Edges -->
          <line v-for="(e, i) in constEdges" :key="'ce' + i" :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" stroke="#d4a853" stroke-width="0.5" opacity="0" data-anim="edge" :class="i % 5 === 0 ? 'data-stream-a' : i % 5 === 1 ? 'data-stream-b' : i % 7 === 0 ? 'data-stream-c' : ''" stroke-dasharray="8 4" />

          <!-- Nodes -->
          <g v-for="n in constNodes" :key="'cn' + n.id" data-anim="node" style="opacity:0">
            <circle :cx="n.x" :cy="n.y" :r="n.r * 3" fill="#d4a853" opacity="0.08" />
            <circle :cx="n.x" :cy="n.y" :r="n.r" fill="#d4a853" opacity="0.7" />
          </g>

          <!-- Orbital particles -->
          <g v-for="orb in orbitalParticles" :key="'orb' + orb.id" :class="'orbit-particle orbit-p-' + (orb.id % 3)">
            <circle :cx="orb.cx" :cy="orb.cy" :r="2 + (orb.id % 3)" fill="#d4a853" :opacity="0.4 + (orb.id % 3) * 0.1" :filter="(2 + (orb.id % 3)) > 3 ? 'url(#s2-glow-sm)' : undefined" />
          </g>
        </svg>

        <!-- Data readout -->
        <div class="data-readout absolute top-16 right-6 sm:right-10 text-right">
          <span class="beacon-dot" /> NETWORK MAP <span class="mx-1 text-[#d4a853]/15">//</span> {{ constNodes.length }} NODES
          <span class="beacon-blink ml-1 text-[#d4a853]">_</span>
        </div>

        <!-- Text Scene 2 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p class="text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[#d4a853]/70 mb-6 font-light retro-glow">{{ $t('home.scene2Label') }}</p>
          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white max-w-3xl leading-tight retro-title" v-html="$t('home.scene2Title')">
          </h2>
        </div>
      </div>

      <!-- ==================== SCENE 3 : L'EXPERTISE (Futuristic City) ==================== -->
      <div ref="scene3Ref" class="absolute inset-0" style="opacity:0">

        <!-- City atmospheric glow -->
        <div class="absolute inset-0" style="background:
          radial-gradient(ellipse at 50% 95%, rgba(212,168,83,0.25) 0%, rgba(212,168,83,0.08) 25%, transparent 55%),
          radial-gradient(ellipse at 30% 85%, rgba(80,160,220,0.12) 0%, transparent 40%),
          radial-gradient(ellipse at 75% 88%, rgba(80,160,220,0.08) 0%, transparent 35%),
          radial-gradient(ellipse at 50% 70%, rgba(176,48,96,0.06) 0%, transparent 40%),
          linear-gradient(180deg, transparent 40%, rgba(10,15,46,0.3) 60%, rgba(5,8,22,0.7) 80%, rgba(5,8,22,0.95) 100%)" />

        <!-- City SVG -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="gf" x1="0" y1="0.4" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4a853" stop-opacity="0" />
              <stop offset="40%" stop-color="#d4a853" stop-opacity="0.05" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0.12" />
            </linearGradient>
            <linearGradient id="ground-fog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#150a28" stop-opacity="0" />
              <stop offset="30%" stop-color="#150a28" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#0e0616" stop-opacity="0.98" />
            </linearGradient>
            <linearGradient id="beam-gold" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#d4a853" stop-opacity="0.15" />
              <stop offset="40%" stop-color="#d4a853" stop-opacity="0.04" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="beam-cyan" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#50a0dc" stop-opacity="0.12" />
              <stop offset="50%" stop-color="#50a0dc" stop-opacity="0.03" />
              <stop offset="100%" stop-color="#50a0dc" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="bld-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1a2850" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#0c1225" stop-opacity="0.95" />
            </linearGradient>
            <linearGradient id="haze-h" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#150a28" stop-opacity="0" />
              <stop offset="50%" stop-color="#0e1535" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#150a28" stop-opacity="0" />
            </linearGradient>
            <filter id="city-glow"><feGaussianBlur stdDeviation="8" /></filter>
            <filter id="neon-glow"><feGaussianBlur stdDeviation="4" /></filter>
            <filter id="holo-glow"><feGaussianBlur stdDeviation="6" /></filter>
            <linearGradient id="road-reflection" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#d4a853" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#0e0616" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <!-- Perspective grid -->
          <g stroke="url(#gf)" stroke-width="0.8" fill="none" opacity="0.5">
            <line v-for="y in gridH" :key="'gh' + y" x1="0" :y1="450 + y" x2="1440" :y2="450 + y" />
            <line v-for="x in gridV" :key="'gv' + x" x1="720" y1="450" :x2="x" y2="900" />
          </g>

          <!-- ===== MASSIVE LIGHT BEAMS ===== -->
          <rect x="660" y="50" width="22" height="550" fill="url(#beam-gold)" opacity="0.7" />
          <rect x="668" y="80" width="6" height="520" fill="#d4a853" opacity="0.03" />
          <rect x="310" y="180" width="16" height="480" fill="url(#beam-cyan)" opacity="0.6" />
          <rect x="1080" y="120" width="18" height="520" fill="url(#beam-gold)" opacity="0.5" />
          <rect x="150" y="250" width="12" height="440" fill="url(#beam-cyan)" opacity="0.4" />
          <rect x="1300" y="200" width="14" height="480" fill="url(#beam-gold)" opacity="0.35" />
          <rect x="870" y="160" width="10" height="460" fill="url(#beam-cyan)" opacity="0.3" />
          <rect x="500" y="220" width="10" height="440" fill="url(#beam-gold)" opacity="0.25" />

          <!-- ===== FUTURISTIC CITY ===== -->
          <g ref="buildingsGroup">
            <!-- === FAR BACKGROUND SKYLINE === -->
            <g data-anim="building" opacity="0.18">
              <rect x="0" y="540" width="30" height="120" fill="#111830" />
              <rect x="6" y="548" width="1.5" height="1.5" fill="#d4a853" opacity="0.42" />
              <rect x="10" y="573" width="1.5" height="1.5" fill="#d4a853" opacity="0.24" />
              <rect x="6" y="631" width="1.5" height="1.5" fill="#d4a853" opacity="0.42" />
              <rect x="35" y="520" width="20" height="140" fill="#111830" />
              <rect x="39" y="600" width="1.5" height="1.5" fill="#d4a853" opacity="0.33" />
              <rect x="38" y="536" width="1.5" height="1.5" fill="#d4a853" opacity="0.27" />
              <rect x="46" y="602" width="1.5" height="1.5" fill="#d4a853" opacity="0.21" />
              <rect x="60" y="550" width="35" height="110" fill="#111830" />
              <rect x="85" y="638" width="1.5" height="1.5" fill="#d4a853" opacity="0.41" />
              <rect x="105" y="530" width="18" height="130" fill="#111830" />
              <rect x="111" y="592" width="1.5" height="1.5" fill="#d4a853" opacity="0.38" />
              <rect x="108" y="632" width="1.5" height="1.5" fill="#d4a853" opacity="0.44" />
              <rect x="130" y="545" width="25" height="115" fill="#111830" />
              <rect x="146" y="593" width="1.5" height="1.5" fill="#d4a853" opacity="0.28" />
              <rect x="139" y="647" width="1.5" height="1.5" fill="#d4a853" opacity="0.30" />
              <rect x="135" y="598" width="1.5" height="1.5" fill="#d4a853" opacity="0.23" />
              <rect x="170" y="520" width="22" height="140" fill="#111830" />
              <rect x="182" y="558" width="1.5" height="1.5" fill="#d4a853" opacity="0.44" />
              <rect x="184" y="583" width="1.5" height="1.5" fill="#d4a853" opacity="0.36" />
              <rect x="200" y="538" width="28" height="122" fill="#111830" />
              <rect x="205" y="613" width="1.5" height="1.5" fill="#d4a853" opacity="0.29" />
              <rect x="223" y="622" width="1.5" height="1.5" fill="#d4a853" opacity="0.47" />
              <rect x="420" y="525" width="20" height="135" fill="#111830" />
              <rect x="432" y="554" width="1.5" height="1.5" fill="#d4a853" opacity="0.41" />
              <rect x="423" y="614" width="1.5" height="1.5" fill="#d4a853" opacity="0.27" />
              <rect x="450" y="540" width="30" height="120" fill="#111830" />
              <rect x="455" y="574" width="1.5" height="1.5" fill="#d4a853" opacity="0.46" />
              <rect x="465" y="580" width="1.5" height="1.5" fill="#d4a853" opacity="0.34" />
              <rect x="480" y="530" width="15" height="130" fill="#111830" />
              <rect x="485" y="582" width="1.5" height="1.5" fill="#d4a853" opacity="0.31" />
              <rect x="487" y="624" width="1.5" height="1.5" fill="#d4a853" opacity="0.48" />
              <rect x="520" y="545" width="25" height="115" fill="#111830" />
              <rect x="525" y="627" width="1.5" height="1.5" fill="#d4a853" opacity="0.39" />
              <rect x="540" y="643" width="1.5" height="1.5" fill="#d4a853" opacity="0.27" />
              <rect x="537" y="598" width="1.5" height="1.5" fill="#d4a853" opacity="0.28" />
              <rect x="550" y="535" width="18" height="125" fill="#111830" />
              <rect x="561" y="568" width="1.5" height="1.5" fill="#d4a853" opacity="0.41" />
              <rect x="553" y="569" width="1.5" height="1.5" fill="#d4a853" opacity="0.45" />
              <rect x="558" y="591" width="1.5" height="1.5" fill="#d4a853" opacity="0.28" />
              <rect x="980" y="530" width="22" height="130" fill="#111830" />
              <rect x="997" y="607" width="1.5" height="1.5" fill="#d4a853" opacity="0.46" />
              <rect x="1010" y="545" width="30" height="115" fill="#111830" />
              <rect x="1019" y="633" width="1.5" height="1.5" fill="#d4a853" opacity="0.35" />
              <rect x="1033" y="608" width="1.5" height="1.5" fill="#d4a853" opacity="0.24" />
              <rect x="1050" y="525" width="20" height="135" fill="#111830" />
              <rect x="1056" y="625" width="1.5" height="1.5" fill="#d4a853" opacity="0.37" />
              <rect x="1180" y="540" width="25" height="120" fill="#111830" />
              <rect x="1196" y="619" width="1.5" height="1.5" fill="#d4a853" opacity="0.32" />
              <rect x="1190" y="562" width="1.5" height="1.5" fill="#d4a853" opacity="0.35" />
              <rect x="1210" y="530" width="18" height="130" fill="#111830" />
              <rect x="1213" y="645" width="1.5" height="1.5" fill="#d4a853" opacity="0.23" />
              <rect x="1240" y="548" width="30" height="112" fill="#111830" />
              <rect x="1248" y="640" width="1.5" height="1.5" fill="#d4a853" opacity="0.33" />
              <rect x="1245" y="602" width="1.5" height="1.5" fill="#d4a853" opacity="0.31" />
              <rect x="1257" y="620" width="1.5" height="1.5" fill="#d4a853" opacity="0.28" />
              <rect x="1300" y="535" width="22" height="125" fill="#111830" />
              <rect x="1316" y="541" width="1.5" height="1.5" fill="#d4a853" opacity="0.40" />
              <rect x="1304" y="627" width="1.5" height="1.5" fill="#d4a853" opacity="0.47" />
              <rect x="1315" y="574" width="1.5" height="1.5" fill="#d4a853" opacity="0.43" />
              <rect x="1330" y="520" width="28" height="140" fill="#111830" />
              <rect x="1336" y="562" width="1.5" height="1.5" fill="#d4a853" opacity="0.33" />
              <rect x="1347" y="525" width="1.5" height="1.5" fill="#d4a853" opacity="0.49" />
              <rect x="1370" y="540" width="35" height="120" fill="#111830" />
              <rect x="1381" y="609" width="1.5" height="1.5" fill="#d4a853" opacity="0.43" />
              <rect x="1389" y="558" width="1.5" height="1.5" fill="#d4a853" opacity="0.46" />
              <rect x="1382" y="626" width="1.5" height="1.5" fill="#d4a853" opacity="0.35" />
              <rect x="1410" y="530" width="30" height="130" fill="#111830" />
              <rect x="1417" y="582" width="1.5" height="1.5" fill="#d4a853" opacity="0.43" />
            </g>
            <!-- Atmospheric haze layer 1 -->
            <g data-anim="building">
              <rect x="0" y="640" width="1440" height="30" fill="url(#haze-h)" opacity="0.5" />
            </g>
            <!-- Building 1 -->
            <g data-anim="building">
<rect x="20" y="620" width="110" height="180" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="34" y="530" width="82" height="90" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.7" />
<rect x="48" y="440" width="55" height="90" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.6" />
<line x1="20" y1="440" x2="130" y2="440" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="20" y1="440" x2="20" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="130" y1="440" x2="130" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="20" y1="440" x2="130" y2="440" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="20" y1="470" x2="130" y2="470" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="500" x2="130" y2="500" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="530" x2="130" y2="530" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="560" x2="130" y2="560" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="590" x2="130" y2="590" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="620" x2="130" y2="620" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="650" x2="130" y2="650" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="680" x2="130" y2="680" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="710" x2="130" y2="710" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="740" x2="130" y2="740" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="20" y1="770" x2="130" y2="770" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<g class="flicker-a">
<rect x="29" y="448" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="38" y="448" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="47" y="448" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="56" y="448" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="65" y="448" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="74" y="448" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="92" y="448" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="101" y="448" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="110" y="448" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="119" y="448" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
</g>
<rect x="29" y="473" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="47" y="473" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="56" y="473" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="65" y="473" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="75" y="473" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="83" y="473" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="93" y="473" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="101" y="473" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="110" y="473" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="119" y="473" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="29" y="497" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="38" y="497" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="48" y="497" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="57" y="497" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="65" y="498" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="74" y="497" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="83" y="497" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="92" y="497" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="101" y="497" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="110" y="497" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="119" y="497" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="30" y="522" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="39" y="522" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="57" y="522" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="66" y="522" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="75" y="522" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="84" y="522" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="93" y="522" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="101" y="522" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="110" y="522" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="119" y="522" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="30" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="38" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="47" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="56" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="66" y="547" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="74" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="83" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="93" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="101" y="547" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="110" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="120" y="546" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="29" y="571" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="38" y="571" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="48" y="571" width="2.5" height="2.5" fill="#80d0ff" opacity="0.6" />
<rect x="56" y="571" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="65" y="571" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="74" y="571" width="2.5" height="2.5" fill="#80d0ff" opacity="0.8" />
<rect x="83" y="571" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="93" y="571" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="101" y="571" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="110" y="571" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="119" y="571" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="29" y="595" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="47" y="596" width="2.5" height="2.5" fill="#80d0ff" opacity="0.15" />
<rect x="56" y="595" width="2.5" height="2.5" fill="#80d0ff" opacity="0.6" />
<rect x="65" y="596" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="74" y="596" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="83" y="596" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="92" y="595" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="101" y="595" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="110" y="595" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="119" y="595" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="30" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="38" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="47" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="56" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="65" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="74" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="84" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="92" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="101" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="110" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="119" y="620" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="57" y="645" width="2.5" height="2.5" fill="#80d0ff" opacity="0.4" />
<rect x="65" y="644" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="74" y="644" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="83" y="645" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="101" y="645" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="110" y="644" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="120" y="645" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="29" y="669" width="2.5" height="2.5" fill="#80d0ff" opacity="0.7" />
<rect x="38" y="669" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="56" y="669" width="2.5" height="2.5" fill="#80d0ff" opacity="0.15" />
<rect x="65" y="669" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="74" y="669" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="83" y="669" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="92" y="669" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="102" y="669" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="110" y="669" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="119" y="669" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<g class="flicker-b">
<rect x="30" y="693" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="38" y="693" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="47" y="694" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="56" y="694" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="65" y="694" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="75" y="694" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="83" y="694" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="93" y="694" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="101" y="694" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="110" y="694" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="119" y="694" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
</g>
<rect x="30" y="718" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="38" y="718" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="47" y="718" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="56" y="718" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="92" y="718" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="101" y="718" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="110" y="718" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="119" y="718" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="29" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="38" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="47" y="743" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="56" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="66" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="74" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="83" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="92" y="743" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="101" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="119" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="30" y="767" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="48" y="767" width="2.5" height="2.5" fill="#80d0ff" opacity="0.8" />
<rect x="66" y="767" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="74" y="767" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="83" y="767" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="101" y="767" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="111" y="767" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="119" y="767" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="30" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="38" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="57" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="65" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="74" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="83" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="92" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="101" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="119" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<!-- Neon bar on Building 1 roof -->
<rect x="55" y="432" width="40" height="4" rx="2" fill="#d4a853" opacity="0.8" filter="url(#neon-glow)" class="neon-pulse-slow"/>
<line x1="75" y1="440" x2="75" y2="393" stroke="#6878a0" stroke-width="1.2" />
<circle cx="75" cy="393" r="2.5" fill="#d4a853" opacity="0.85" class="beacon beacon-1" />
<circle cx="75" cy="393" r="8" fill="#d4a853" opacity="0.1" filter="url(#neon-glow)" />
<line x1="69" y1="417" x2="81" y2="417" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Chimney smoke on Building 1 -->
            <g data-anim="building" class="chimney-smoke">
              <ellipse cx="90" cy="435" rx="6" ry="4" fill="#1a2545" opacity="0.15" class="smoke-drift"/>
              <ellipse cx="90" cy="428" rx="8" ry="5" fill="#1a2545" opacity="0.10" class="smoke-drift-slow"/>
              <ellipse cx="90" cy="420" rx="10" ry="6" fill="#1a2545" opacity="0.06" class="smoke-drift"/>
            </g>
            <!-- Building 2 -->
            <g data-anim="building">
<rect x="160" y="380" width="28" height="420" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="177" y="380" width="11" height="420" fill="#1e2850" opacity="0.3" />
<line x1="160" y1="380" x2="188" y2="380" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
<line x1="160" y1="380" x2="160" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="188" y1="380" x2="188" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="160" y1="380" x2="188" y2="380" stroke="#50a0dc" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="160" y1="410" x2="188" y2="410" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="440" x2="188" y2="440" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="470" x2="188" y2="470" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="500" x2="188" y2="500" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="530" x2="188" y2="530" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="560" x2="188" y2="560" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="590" x2="188" y2="590" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="620" x2="188" y2="620" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="650" x2="188" y2="650" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="680" x2="188" y2="680" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="710" x2="188" y2="710" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="740" x2="188" y2="740" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="160" y1="770" x2="188" y2="770" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="165" y="388" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="164" y="412" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="182" y="412" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="165" y="435" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="182" y="436" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="164" y="459" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="182" y="460" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="164" y="483" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="165" y="507" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="182" y="507" width="2.5" height="2.5" fill="#80d0ff" opacity="0.8" />
<rect x="165" y="531" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="182" y="531" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="165" y="554" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="182" y="554" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="164" y="578" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="164" y="602" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="182" y="602" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="164" y="626" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="182" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="165" y="649" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="182" y="650" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="165" y="673" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="182" y="673" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="165" y="697" width="2.5" height="2.5" fill="#80d0ff" opacity="0.15" />
<rect x="182" y="697" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="164" y="720" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="182" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="164" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="182" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="164" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="182" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="165" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="182" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<line x1="174" y1="380" x2="174" y2="336" stroke="#6878a0" stroke-width="1.2" />
<circle cx="174" cy="336" r="2.5" fill="#50a0dc" opacity="0.85" class="beacon beacon-1" />
<circle cx="174" cy="336" r="8" fill="#50a0dc" opacity="0.1" filter="url(#neon-glow)" />
<line x1="168" y1="358" x2="180" y2="358" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 3 -->
            <g data-anim="building">
<rect x="195" y="420" width="24" height="380" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="209" y="420" width="10" height="380" fill="#1e2850" opacity="0.3" />
<line x1="195" y1="420" x2="219" y2="420" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="195" y1="420" x2="195" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="219" y1="420" x2="219" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="195" y1="420" x2="219" y2="420" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="195" y1="452" x2="219" y2="452" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="483" x2="219" y2="483" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="515" x2="219" y2="515" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="547" x2="219" y2="547" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="578" x2="219" y2="578" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="610" x2="219" y2="610" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="642" x2="219" y2="642" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="673" x2="219" y2="673" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="705" x2="219" y2="705" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="737" x2="219" y2="737" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="195" y1="768" x2="219" y2="768" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="213" y="428" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="200" y="453" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="213" y="452" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="200" y="477" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="213" y="477" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="200" y="501" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="213" y="501" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="200" y="525" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="213" y="525" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="199" y="549" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="213" y="549" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="200" y="574" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="213" y="574" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="200" y="598" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="213" y="598" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="200" y="622" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="199" y="647" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="213" y="646" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="199" y="670" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="213" y="670" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="199" y="695" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="199" y="719" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="200" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="213" y="743" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="199" y="767" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="213" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="199" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="213" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<line x1="207" y1="420" x2="207" y2="369" stroke="#6878a0" stroke-width="1.2" />
<circle cx="207" cy="369" r="2.5" fill="#d4a853" opacity="0.85" class="beacon beacon-2" />
<circle cx="207" cy="369" r="8" fill="#d4a853" opacity="0.1" filter="url(#neon-glow)" />
<line x1="201" y1="394" x2="213" y2="394" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 4 -->
            <g data-anim="building">
<rect x="250" y="500" width="130" height="300" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="328" y="500" width="52" height="300" fill="#1e2850" opacity="0.3" />
<line x1="250" y1="500" x2="380" y2="500" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="250" y1="500" x2="250" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="380" y1="500" x2="380" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="250" y1="500" x2="380" y2="500" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="250" y1="530" x2="380" y2="530" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="250" y1="560" x2="380" y2="560" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="250" y1="590" x2="380" y2="590" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="250" y1="620" x2="380" y2="620" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="250" y1="650" x2="380" y2="650" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="250" y1="680" x2="380" y2="680" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="250" y1="710" x2="380" y2="710" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="250" y1="740" x2="380" y2="740" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="250" y1="770" x2="380" y2="770" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<g class="flicker-b">
<rect x="261" y="508" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="270" y="508" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="279" y="508" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="297" y="508" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="305" y="508" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="314" y="508" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="323" y="508" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="332" y="508" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="341" y="508" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="350" y="508" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="359" y="508" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="368" y="508" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
</g>
<rect x="261" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="269" y="532" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="279" y="532" width="2.5" height="2.5" fill="#80d0ff" opacity="0.8" />
<rect x="297" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="306" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="315" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="324" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="341" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="359" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="368" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="261" y="556" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="270" y="555" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="279" y="556" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="297" y="556" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="305" y="556" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="314" y="556" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="324" y="555" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="332" y="556" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="341" y="556" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="350" y="556" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="359" y="556" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="368" y="555" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="261" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="269" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="279" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="288" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="297" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="306" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="324" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="332" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="340" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="350" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="359" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="368" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="261" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="269" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="279" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="288" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="297" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="306" y="603" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="314" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="323" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="332" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="341" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="349" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="358" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="367" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="261" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="270" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="296" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="305" y="626" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="314" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="323" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="332" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="341" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="350" y="626" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="261" y="650" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="279" y="650" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="287" y="650" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="296" y="650" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="323" y="650" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="341" y="650" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="350" y="650" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="359" y="650" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="368" y="650" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="270" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="279" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="287" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="297" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="305" y="673" width="2.5" height="2.5" fill="#80d0ff" opacity="0.6" />
<rect x="314" y="674" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="323" y="673" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="332" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="341" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="350" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="358" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="368" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<g class="flicker-a">
<rect x="261" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="270" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="279" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="288" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="306" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="314" y="697" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="324" y="697" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="332" y="697" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="341" y="697" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="350" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="368" y="697" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
</g>
<rect x="260" y="721" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="270" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="288" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="296" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="305" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="323" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="332" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="341" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="350" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="358" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="367" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="261" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="269" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="278" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="287" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="314" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="323" y="744" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="332" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="341" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="350" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="359" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="368" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="261" y="768" width="2.5" height="2.5" fill="#80d0ff" opacity="0.2" />
<rect x="270" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="287" y="768" width="2.5" height="2.5" fill="#80d0ff" opacity="0.5" />
<rect x="305" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="314" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="323" y="768" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="350" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="359" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="367" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="261" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="270" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="278" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="288" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="297" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="305" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="314" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="324" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="332" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="341" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="350" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="358" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="368" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="230" y="497" width="169" height="6" fill="none" stroke="#5a6a90" stroke-width="0.6" />
<line x1="230" y1="497" x2="400" y2="497" stroke="#d4a853" stroke-width="1" opacity="0.35" />
            </g>
            <!-- Building 4 curved dome + rooftop antennas -->
            <g v-once data-anim="building">
              <path d="M 250,497 Q 315,480 380,497" fill="#1a2850" stroke="#6878a0" stroke-width="0.8" opacity="0.7"/>
              <line x1="280" y1="493" x2="280" y2="478" stroke="#6878a0" stroke-width="0.8" opacity="0.6"/>
              <circle cx="280" cy="478" r="1.5" fill="#d4a853" opacity="0.7" class="beacon-blink"/>
              <line x1="315" y1="489" x2="315" y2="471" stroke="#6878a0" stroke-width="0.8" opacity="0.6"/>
              <circle cx="315" cy="471" r="1.2" fill="#50a0dc" opacity="0.7"/>
              <line x1="350" y1="493" x2="350" y2="478" stroke="#6878a0" stroke-width="0.8" opacity="0.6"/>
              <circle cx="350" cy="478" r="1.5" fill="#d4a853" opacity="0.8" class="beacon-blink-slow"/>
            </g>
            <!-- Building 5 -->
            <g data-anim="building">
<rect x="410" y="350" width="40" height="450" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="434" y="350" width="16" height="450" fill="#1e2850" opacity="0.3" />
<line x1="410" y1="350" x2="450" y2="350" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
<line x1="410" y1="350" x2="410" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="450" y1="350" x2="450" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="410" y1="350" x2="450" y2="350" stroke="#50a0dc" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="410" y1="380" x2="450" y2="380" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="410" x2="450" y2="410" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="440" x2="450" y2="440" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="470" x2="450" y2="470" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="500" x2="450" y2="500" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="530" x2="450" y2="530" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="560" x2="450" y2="560" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="590" x2="450" y2="590" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="620" x2="450" y2="620" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="650" x2="450" y2="650" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="680" x2="450" y2="680" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="710" x2="450" y2="710" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="740" x2="450" y2="740" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="410" y1="770" x2="450" y2="770" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="414" y="358" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="424" y="358" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="434" y="358" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="444" y="358" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="415" y="381" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="424" y="381" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="435" y="381" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="444" y="381" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="414" y="404" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="424" y="404" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="435" y="404" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="444" y="404" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="415" y="427" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="424" y="427" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="444" y="427" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="415" y="449" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="415" y="472" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="424" y="472" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="444" y="472" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="425" y="495" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="434" y="495" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="444" y="495" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="414" y="518" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="424" y="518" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="435" y="518" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="414" y="541" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="434" y="541" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="444" y="541" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="424" y="564" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="434" y="564" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="444" y="564" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="414" y="586" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="424" y="586" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="434" y="587" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="444" y="587" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="414" y="609" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="424" y="609" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="434" y="609" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="444" y="609" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="414" y="632" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="424" y="632" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="444" y="632" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="415" y="655" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="425" y="655" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="435" y="655" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="444" y="655" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="415" y="678" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="425" y="678" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="434" y="678" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="444" y="678" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="425" y="700" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="434" y="700" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="444" y="700" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="414" y="723" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="435" y="723" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="444" y="723" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="415" y="746" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="424" y="746" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="434" y="746" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="444" y="746" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="414" y="769" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="424" y="769" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="435" y="769" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="444" y="769" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="415" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="425" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="434" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<line x1="430" y1="350" x2="430" y2="308" stroke="#6878a0" stroke-width="1.2" />
<circle cx="430" cy="308" r="2.5" fill="#50a0dc" opacity="0.85" class="beacon beacon-2" />
<circle cx="430" cy="308" r="8" fill="#50a0dc" opacity="0.1" filter="url(#neon-glow)" />
<line x1="424" y1="329" x2="436" y2="329" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 6 -->
            <g data-anim="building">
<rect x="460" y="520" width="30" height="280" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="478" y="520" width="12" height="280" fill="#1e2850" opacity="0.3" />
<line x1="460" y1="520" x2="490" y2="520" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="460" y1="520" x2="460" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="490" y1="520" x2="490" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="460" y1="520" x2="490" y2="520" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="460" y1="551" x2="490" y2="551" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="460" y1="582" x2="490" y2="582" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="460" y1="613" x2="490" y2="613" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="460" y1="644" x2="490" y2="644" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="460" y1="676" x2="490" y2="676" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="460" y1="707" x2="490" y2="707" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="460" y1="738" x2="490" y2="738" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="460" y1="769" x2="490" y2="769" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="464" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="484" y="528" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="464" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="484" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="465" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="484" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="464" y="600" width="2.5" height="2.5" fill="#80d0ff" opacity="0.5" />
<rect x="484" y="600" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="465" y="624" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="465" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="484" y="648" width="2.5" height="2.5" fill="#80d0ff" opacity="0.4" />
<rect x="464" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="484" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="484" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="464" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="484" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="464" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="484" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="464" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="484" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="464" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="484" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
            </g>
            <!-- Building 6 rooftop antenna -->
            <g v-once data-anim="building">
              <line x1="475" y1="520" x2="475" y2="508" stroke="#6878a0" stroke-width="0.8" opacity="0.5"/>
              <circle cx="475" cy="508" r="1.2" fill="#d4a853" opacity="0.7" class="beacon-blink"/>
            </g>
            <!-- Building 7 -->
            <g data-anim="building">
<rect x="500" y="480" width="22" height="320" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="513" y="480" width="9" height="320" fill="#1e2850" opacity="0.3" />
<line x1="500" y1="480" x2="522" y2="480" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
<line x1="500" y1="480" x2="500" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="522" y1="480" x2="522" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="500" y1="480" x2="522" y2="480" stroke="#50a0dc" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="500" y1="512" x2="522" y2="512" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="500" y1="544" x2="522" y2="544" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="500" y1="576" x2="522" y2="576" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="500" y1="608" x2="522" y2="608" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="500" y1="640" x2="522" y2="640" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="500" y1="672" x2="522" y2="672" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="500" y1="704" x2="522" y2="704" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="500" y1="736" x2="522" y2="736" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="500" y1="768" x2="522" y2="768" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="504" y="488" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="516" y="488" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="505" y="512" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="516" y="512" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="505" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="516" y="535" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="504" y="559" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="516" y="558" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="505" y="582" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="516" y="582" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="504" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="516" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="504" y="628" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="516" y="628" width="2.5" height="2.5" fill="#80d0ff" opacity="0.7" />
<rect x="504" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="516" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="505" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="516" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="505" y="698" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="516" y="699" width="2.5" height="2.5" fill="#80d0ff" opacity="0.6" />
<rect x="504" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="516" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="505" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="516" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="504" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="504" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="516" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<line x1="511" y1="480" x2="511" y2="415" stroke="#6878a0" stroke-width="1.2" />
<circle cx="511" cy="415" r="2.5" fill="#50a0dc" opacity="0.85" class="beacon beacon-1" />
<circle cx="511" cy="415" r="8" fill="#50a0dc" opacity="0.1" filter="url(#neon-glow)" />
<line x1="505" y1="448" x2="517" y2="448" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 8 -->
            <g data-anim="building">
<rect x="790" y="400" width="35" height="400" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="811" y="400" width="14" height="400" fill="#1e2850" opacity="0.3" />
<line x1="790" y1="400" x2="825" y2="400" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="790" y1="400" x2="790" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="825" y1="400" x2="825" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="790" y1="400" x2="825" y2="400" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="790" y1="431" x2="825" y2="431" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="462" x2="825" y2="462" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="492" x2="825" y2="492" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="523" x2="825" y2="523" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="554" x2="825" y2="554" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="585" x2="825" y2="585" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="615" x2="825" y2="615" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="646" x2="825" y2="646" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="677" x2="825" y2="677" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="708" x2="825" y2="708" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="738" x2="825" y2="738" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="790" y1="769" x2="825" y2="769" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="795" y="408" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="807" y="408" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="819" y="408" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="794" y="432" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="806" y="432" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="819" y="432" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="795" y="456" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="807" y="456" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="819" y="456" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="794" y="480" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="807" y="480" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="819" y="480" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="794" y="504" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="807" y="504" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="819" y="504" width="2.5" height="2.5" fill="#80d0ff" opacity="0.5" />
<rect x="794" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="806" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="819" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="795" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="819" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="795" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="806" y="576" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="819" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="794" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="806" y="600" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="794" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="819" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="794" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="807" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="819" y="648" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="795" y="672" width="2.5" height="2.5" fill="#80d0ff" opacity="0.7" />
<rect x="807" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="819" y="672" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="794" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="807" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="795" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="807" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="819" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="794" y="744" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="807" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="819" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="795" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="806" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="794" y="792" width="2.5" height="2.5" fill="#80d0ff" opacity="0.2" />
<rect x="807" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="819" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<line x1="808" y1="400" x2="808" y2="336" stroke="#6878a0" stroke-width="1.2" />
<circle cx="808" cy="336" r="2.5" fill="#d4a853" opacity="0.85" class="beacon beacon-2" />
<circle cx="808" cy="336" r="8" fill="#d4a853" opacity="0.1" filter="url(#neon-glow)" />
<line x1="802" y1="368" x2="814" y2="368" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 8 satellite dish -->
            <g v-once data-anim="building">
              <path d="M 796,400 Q 800,394 804,400" fill="none" stroke="#6878a0" stroke-width="1" opacity="0.5"/>
              <line x1="800" y1="400" x2="800" y2="392" stroke="#6878a0" stroke-width="0.8" opacity="0.4"/>
            </g>
            <!-- Building 9 -->
            <g data-anim="building">
<rect x="835" y="450" width="28" height="350" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="852" y="450" width="11" height="350" fill="#1e2850" opacity="0.3" />
<line x1="835" y1="450" x2="863" y2="450" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
<line x1="835" y1="450" x2="835" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="863" y1="450" x2="863" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="835" y1="450" x2="863" y2="450" stroke="#50a0dc" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="835" y1="482" x2="863" y2="482" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="514" x2="863" y2="514" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="545" x2="863" y2="545" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="577" x2="863" y2="577" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="609" x2="863" y2="609" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="641" x2="863" y2="641" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="673" x2="863" y2="673" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="705" x2="863" y2="705" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="736" x2="863" y2="736" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="835" y1="768" x2="863" y2="768" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="840" y="458" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="857" y="458" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="840" y="482" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="840" y="506" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="857" y="506" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="840" y="529" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="857" y="530" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="839" y="554" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="857" y="554" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="840" y="577" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="857" y="578" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="840" y="601" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="857" y="601" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="839" y="625" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="857" y="625" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="840" y="649" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="857" y="649" width="2.5" height="2.5" fill="#80d0ff" opacity="0.5" />
<rect x="840" y="673" width="2.5" height="2.5" fill="#80d0ff" opacity="0.7" />
<rect x="857" y="673" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="840" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="857" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="840" y="720" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="857" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="840" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="857" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="839" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="857" y="768" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="840" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="857" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
            </g>
            <!-- Building 9 rooftop antenna -->
            <g v-once data-anim="building">
              <line x1="849" y1="450" x2="849" y2="436" stroke="#6878a0" stroke-width="0.8" opacity="0.5"/>
              <circle cx="849" cy="436" r="1.2" fill="#50a0dc" opacity="0.7" class="beacon-blink-slow"/>
            </g>
            <!-- Building 10 -->
            <g data-anim="building">
<rect x="890" y="520" width="100" height="280" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="950" y="520" width="40" height="280" fill="#1e2850" opacity="0.3" />
<line x1="890" y1="520" x2="990" y2="520" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="890" y1="520" x2="890" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="990" y1="520" x2="990" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="890" y1="520" x2="990" y2="520" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="890" y1="551" x2="990" y2="551" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="890" y1="582" x2="990" y2="582" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="890" y1="613" x2="990" y2="613" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="890" y1="644" x2="990" y2="644" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="890" y1="676" x2="990" y2="676" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="890" y1="707" x2="990" y2="707" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="890" y1="738" x2="990" y2="738" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="890" y1="769" x2="990" y2="769" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<g class="flicker-c">
<rect x="898" y="528" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="907" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="917" y="528" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="926" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="953" y="528" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="962" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="971" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="980" y="528" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
</g>
<rect x="908" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="926" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="935" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="944" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="953" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="962" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="970" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="980" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="898" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="908" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="916" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="926" y="576" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="935" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="944" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="953" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="962" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="971" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="980" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="899" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="908" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="917" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="925" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="934" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="944" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="953" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="962" y="600" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="971" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="980" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="899" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="908" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="916" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="926" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="935" y="624" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="944" y="624" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="953" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="962" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="971" y="624" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="980" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="899" y="648" width="2.5" height="2.5" fill="#80d0ff" opacity="0.2" />
<rect x="908" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="917" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="925" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="935" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="944" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="953" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="961" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="971" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="980" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<g class="flicker-c">
<rect x="899" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="907" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="916" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="926" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="934" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="943" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="962" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="971" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="980" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
</g>
<rect x="899" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="907" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="917" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="926" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="934" y="696" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="944" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="953" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="962" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="971" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="980" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="899" y="720" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="907" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="916" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="926" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="935" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="944" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="953" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="962" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="971" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<g class="flicker-d">
<rect x="898" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="907" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="917" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="925" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="935" y="744" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="944" y="744" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="953" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="962" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="971" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="980" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
</g>
<rect x="899" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="908" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="917" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="926" y="768" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="935" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="944" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="953" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="961" y="768" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="970" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="980" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="899" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="907" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="917" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="926" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="953" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="962" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="980" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<!-- Vertical neon strip on Building 10 -->
<rect x="986" y="540" width="4" height="30" rx="2" fill="#d08030" opacity="0.75" filter="url(#neon-glow)" class="neon-pulse-slow"/>
<rect x="875" y="517" width="130" height="6" fill="none" stroke="#5a6a90" stroke-width="0.6" />
<line x1="875" y1="517" x2="1005" y2="517" stroke="#d4a853" stroke-width="1" opacity="0.35" />
            </g>
            <!-- Building 10 stepped crown + solar panels -->
            <g v-once data-anim="building">
              <rect x="900" y="511" width="80" height="6" fill="#1a2850" stroke="#6878a0" stroke-width="0.5" opacity="0.7"/>
              <rect x="915" y="505" width="50" height="6" fill="#1a2850" stroke="#6878a0" stroke-width="0.5" opacity="0.7"/>
              <rect x="928" y="501" width="24" height="4" fill="#1a2850" stroke="#d4a853" stroke-width="0.5" opacity="0.6"/>
              <rect x="930" y="497" width="4" height="3" fill="#1a3060" stroke="#50a0dc" stroke-width="0.3" opacity="0.5"/>
              <rect x="936" y="497" width="4" height="3" fill="#1a3060" stroke="#50a0dc" stroke-width="0.3" opacity="0.5"/>
              <rect x="942" y="497" width="4" height="3" fill="#1a3060" stroke="#50a0dc" stroke-width="0.3" opacity="0.5"/>
            </g>
            <!-- Building 11 -->
            <g data-anim="building">
<rect x="1020" y="380" width="32" height="420" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="1039" y="380" width="13" height="420" fill="#1e2850" opacity="0.3" />
<line x1="1020" y1="380" x2="1052" y2="380" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
<line x1="1020" y1="380" x2="1020" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="1052" y1="380" x2="1052" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="1020" y1="380" x2="1052" y2="380" stroke="#50a0dc" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="1020" y1="410" x2="1052" y2="410" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="440" x2="1052" y2="440" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="470" x2="1052" y2="470" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="500" x2="1052" y2="500" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="530" x2="1052" y2="530" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="560" x2="1052" y2="560" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="590" x2="1052" y2="590" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="620" x2="1052" y2="620" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="650" x2="1052" y2="650" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="680" x2="1052" y2="680" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="710" x2="1052" y2="710" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="740" x2="1052" y2="740" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1020" y1="770" x2="1052" y2="770" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="1025" y="388" width="2.5" height="2.5" fill="#80d0ff" opacity="0.2" />
<rect x="1035" y="388" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1046" y="388" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="1024" y="412" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1035" y="412" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1024" y="436" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1036" y="436" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1046" y="436" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1024" y="460" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1035" y="459" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1046" y="460" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="1024" y="483" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1035" y="483" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1046" y="483" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="1025" y="507" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1035" y="507" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="1046" y="507" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1025" y="531" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1036" y="531" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1025" y="555" width="2.5" height="2.5" fill="#80d0ff" opacity="0.6" />
<rect x="1036" y="554" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1046" y="554" width="2.5" height="2.5" fill="#80d0ff" opacity="0.4" />
<rect x="1035" y="578" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1046" y="578" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="1025" y="602" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="1036" y="602" width="2.5" height="2.5" fill="#80d0ff" opacity="0.15" />
<rect x="1046" y="602" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="1024" y="625" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1035" y="625" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1046" y="626" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1024" y="649" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1036" y="649" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1046" y="649" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1025" y="673" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1046" y="673" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="1035" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1024" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1036" y="721" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="1046" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1025" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1035" y="744" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="1046" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1025" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1035" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1046" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1025" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1046" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<line x1="1036" y1="380" x2="1036" y2="317" stroke="#6878a0" stroke-width="1.2" />
<circle cx="1036" cy="317" r="2.5" fill="#50a0dc" opacity="0.85" class="beacon beacon-0" />
<circle cx="1036" cy="317" r="8" fill="#50a0dc" opacity="0.1" filter="url(#neon-glow)" />
<line x1="1030" y1="348" x2="1042" y2="348" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 12 -->
            <g data-anim="building">
<rect x="1060" y="430" width="26" height="370" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="1076" y="430" width="10" height="370" fill="#1e2850" opacity="0.3" />
<line x1="1060" y1="430" x2="1086" y2="430" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="1060" y1="430" x2="1060" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="1086" y1="430" x2="1086" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="1060" y1="430" x2="1086" y2="430" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="1060" y1="461" x2="1086" y2="461" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="492" x2="1086" y2="492" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="522" x2="1086" y2="522" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="553" x2="1086" y2="553" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="584" x2="1086" y2="584" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="615" x2="1086" y2="615" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="646" x2="1086" y2="646" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="677" x2="1086" y2="677" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="708" x2="1086" y2="708" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="738" x2="1086" y2="738" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1060" y1="769" x2="1086" y2="769" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="1065" y="438" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1080" y="462" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1064" y="485" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1064" y="509" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1080" y="509" width="2.5" height="2.5" fill="#80d0ff" opacity="0.15" />
<rect x="1065" y="532" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1080" y="533" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1065" y="556" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1080" y="556" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1065" y="580" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1080" y="579" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1064" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1080" y="603" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1064" y="627" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1080" y="627" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1065" y="650" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1064" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1080" y="674" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1065" y="698" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1080" y="697" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1065" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1080" y="721" width="2.5" height="2.5" fill="#80d0ff" opacity="0.2" />
<rect x="1064" y="745" width="2.5" height="2.5" fill="#80d0ff" opacity="0.6" />
<rect x="1080" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1064" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1080" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1064" y="792" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="1080" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<line x1="1073" y1="430" x2="1073" y2="389" stroke="#6878a0" stroke-width="1.2" />
<circle cx="1073" cy="389" r="2.5" fill="#d4a853" opacity="0.85" class="beacon beacon-1" />
<circle cx="1073" cy="389" r="8" fill="#d4a853" opacity="0.1" filter="url(#neon-glow)" />
<line x1="1067" y1="409" x2="1079" y2="409" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 13 -->
            <g data-anim="building">
<rect x="1120" y="480" width="100" height="320" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="1180" y="480" width="40" height="320" fill="#1e2850" opacity="0.3" />
<line x1="1120" y1="480" x2="1220" y2="480" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
<line x1="1120" y1="480" x2="1120" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="1220" y1="480" x2="1220" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="1120" y1="480" x2="1220" y2="480" stroke="#50a0dc" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="1120" y1="512" x2="1220" y2="512" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1120" y1="544" x2="1220" y2="544" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1120" y1="576" x2="1220" y2="576" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1120" y1="608" x2="1220" y2="608" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1120" y1="640" x2="1220" y2="640" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1120" y1="672" x2="1220" y2="672" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1120" y1="704" x2="1220" y2="704" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1120" y1="736" x2="1220" y2="736" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1120" y1="768" x2="1220" y2="768" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<g class="flicker-a">
<rect x="1128" y="488" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1147" y="488" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1156" y="488" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1165" y="488" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1183" y="488" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1191" y="488" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1201" y="488" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
</g>
<rect x="1138" y="511" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1147" y="511" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1155" y="511" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="1174" y="511" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1192" y="512" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1201" y="512" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1210" y="512" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="1129" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1138" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1147" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1156" y="535" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="1165" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1174" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1182" y="535" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="1192" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1201" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1210" y="535" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1129" y="558" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1138" y="558" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1147" y="558" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1155" y="558" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1165" y="558" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1183" y="558" width="2.5" height="2.5" fill="#80d0ff" opacity="0.4" />
<rect x="1192" y="558" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1201" y="558" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1129" y="582" width="2.5" height="2.5" fill="#80d0ff" opacity="0.15" />
<rect x="1138" y="582" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1165" y="582" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="1182" y="582" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="1192" y="582" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1201" y="582" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1210" y="582" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1129" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1137" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1147" y="605" width="2.5" height="2.5" fill="#80d0ff" opacity="0.15" />
<rect x="1156" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1165" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1174" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1183" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1192" y="605" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1201" y="605" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="1146" y="628" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1155" y="629" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1165" y="628" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1174" y="629" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="1192" y="628" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1201" y="628" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1129" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1138" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1147" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1156" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1174" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1192" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1201" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1210" y="652" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1128" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1137" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1147" y="675" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="1155" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1165" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1174" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1182" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1192" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1201" y="675" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="1210" y="675" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1128" y="698" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="1138" y="699" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="1156" y="698" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1173" y="698" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="1183" y="698" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="1210" y="698" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1128" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1137" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1146" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1155" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1164" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1174" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1183" y="722" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="1192" y="722" width="2.5" height="2.5" fill="#80d0ff" opacity="0.4" />
<rect x="1201" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1210" y="721" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1137" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1146" y="745" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="1156" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1165" y="745" width="2.5" height="2.5" fill="#80d0ff" opacity="0.3" />
<rect x="1173" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1182" y="745" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="1201" y="745" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1128" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1137" y="769" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1146" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1155" y="768" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="1165" y="768" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="1174" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1183" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1210" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1128" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1138" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1146" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1156" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1165" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1173" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1183" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1192" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1201" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1210" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1105" y="477" width="130" height="6" fill="none" stroke="#5a6a90" stroke-width="0.6" />
<line x1="1105" y1="477" x2="1235" y2="477" stroke="#50a0dc" stroke-width="1" opacity="0.35" />
            </g>
            <!-- Building 14 -->
            <g data-anim="building">
<rect x="1260" y="400" width="30" height="400" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="1278" y="400" width="12" height="400" fill="#1e2850" opacity="0.3" />
<line x1="1260" y1="400" x2="1290" y2="400" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="1260" y1="400" x2="1260" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="1290" y1="400" x2="1290" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="1260" y1="400" x2="1290" y2="400" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="1260" y1="431" x2="1290" y2="431" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="462" x2="1290" y2="462" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="492" x2="1290" y2="492" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="523" x2="1290" y2="523" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="554" x2="1290" y2="554" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="585" x2="1290" y2="585" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="615" x2="1290" y2="615" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="646" x2="1290" y2="646" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="677" x2="1290" y2="677" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="708" x2="1290" y2="708" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="738" x2="1290" y2="738" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1260" y1="769" x2="1290" y2="769" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="1264" y="408" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1284" y="408" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1264" y="432" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1284" y="432" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1284" y="456" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="1265" y="480" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1284" y="480" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="1264" y="504" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1284" y="504" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1265" y="528" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="1284" y="528" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="1265" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1284" y="552" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1265" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1284" y="576" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1265" y="600" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1284" y="600" width="2.5" height="2.5" fill="#80d0ff" opacity="0.2" />
<rect x="1264" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1284" y="624" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1265" y="648" width="2.5" height="2.5" fill="#50a0dc" opacity="0.55" />
<rect x="1284" y="648" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1265" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1284" y="672" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="1264" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1284" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1264" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1284" y="720" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="1265" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1284" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1284" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1264" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1284" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<line x1="1275" y1="400" x2="1275" y2="346" stroke="#6878a0" stroke-width="1.2" />
<circle cx="1275" cy="346" r="2.5" fill="#d4a853" opacity="0.85" class="beacon beacon-1" />
<circle cx="1275" cy="346" r="8" fill="#d4a853" opacity="0.1" filter="url(#neon-glow)" />
<line x1="1269" y1="373" x2="1281" y2="373" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 15 -->
            <g data-anim="building">
<rect x="1300" y="450" width="24" height="350" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="1314" y="450" width="10" height="350" fill="#1e2850" opacity="0.3" />
<line x1="1300" y1="450" x2="1324" y2="450" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
<line x1="1300" y1="450" x2="1300" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="1324" y1="450" x2="1324" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="1300" y1="450" x2="1324" y2="450" stroke="#50a0dc" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="1300" y1="482" x2="1324" y2="482" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="514" x2="1324" y2="514" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="545" x2="1324" y2="545" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="577" x2="1324" y2="577" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="609" x2="1324" y2="609" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="641" x2="1324" y2="641" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="673" x2="1324" y2="673" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="705" x2="1324" y2="705" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="736" x2="1324" y2="736" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1300" y1="768" x2="1324" y2="768" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="1305" y="458" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1318" y="458" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1305" y="482" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1318" y="482" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1304" y="506" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1318" y="506" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1305" y="530" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1305" y="554" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1304" y="577" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="1318" y="577" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1304" y="601" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1318" y="601" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1304" y="625" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1318" y="625" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1304" y="649" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1318" y="649" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1305" y="672" width="2.5" height="2.5" fill="#80d0ff" opacity="0.65" />
<rect x="1318" y="672" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1304" y="696" width="2.5" height="2.5" fill="#50a0dc" opacity="0.15" />
<rect x="1318" y="696" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1304" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1318" y="720" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="1304" y="744" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="1318" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1318" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1305" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1318" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
            </g>
            <!-- Building 16 -->
            <g data-anim="building">
<rect x="1350" y="420" width="28" height="380" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="1367" y="420" width="11" height="380" fill="#1e2850" opacity="0.3" />
<line x1="1350" y1="420" x2="1378" y2="420" stroke="#d4a853" stroke-width="1.5" opacity="0.4" />
<line x1="1350" y1="420" x2="1350" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="1378" y1="420" x2="1378" y2="800" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
<line x1="1350" y1="420" x2="1378" y2="420" stroke="#d4a853" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="1350" y1="452" x2="1378" y2="452" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="483" x2="1378" y2="483" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="515" x2="1378" y2="515" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="547" x2="1378" y2="547" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="578" x2="1378" y2="578" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="610" x2="1378" y2="610" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="642" x2="1378" y2="642" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="673" x2="1378" y2="673" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="705" x2="1378" y2="705" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="737" x2="1378" y2="737" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1350" y1="768" x2="1378" y2="768" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="1355" y="428" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="1372" y="428" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1354" y="452" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1372" y="453" width="2.5" height="2.5" fill="#80d0ff" opacity="0.5" />
<rect x="1355" y="477" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1372" y="477" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="1372" y="501" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1354" y="525" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1372" y="525" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1372" y="549" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1355" y="574" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1372" y="598" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1354" y="622" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1372" y="622" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1354" y="646" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1372" y="646" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1354" y="671" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="1372" y="670" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1355" y="695" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1372" y="695" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1372" y="719" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="1355" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1372" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1354" y="768" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="1355" y="792" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="1372" y="792" width="2.5" height="2.5" fill="#80d0ff" opacity="0.15" />
<line x1="1364" y1="420" x2="1364" y2="373" stroke="#6878a0" stroke-width="1.2" />
<circle cx="1364" cy="373" r="2.5" fill="#d4a853" opacity="0.85" class="beacon beacon-1" />
<circle cx="1364" cy="373" r="8" fill="#d4a853" opacity="0.1" filter="url(#neon-glow)" />
<line x1="1358" y1="396" x2="1370" y2="396" stroke="#6878a0" stroke-width="0.5" />
            </g>
            <!-- Building 17 -->
            <g data-anim="building">
<rect x="1400" y="470" width="40" height="330" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
<rect x="1424" y="470" width="16" height="330" fill="#1e2850" opacity="0.3" />
<line x1="1400" y1="470" x2="1440" y2="470" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
<line x1="1400" y1="470" x2="1400" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="1440" y1="470" x2="1440" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.2" />
<line x1="1400" y1="470" x2="1440" y2="470" stroke="#50a0dc" stroke-width="4" opacity="0.08" filter="url(#neon-glow)" />
<line x1="1400" y1="500" x2="1440" y2="500" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="530" x2="1440" y2="530" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="560" x2="1440" y2="560" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="590" x2="1440" y2="590" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="620" x2="1440" y2="620" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="650" x2="1440" y2="650" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="680" x2="1440" y2="680" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="710" x2="1440" y2="710" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="740" x2="1440" y2="740" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<line x1="1400" y1="770" x2="1440" y2="770" stroke="#4a5a80" stroke-width="0.4" opacity="0.35" />
<rect x="1405" y="478" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1414" y="478" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1424" y="478" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1434" y="478" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1404" y="502" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1415" y="502" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1424" y="503" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1434" y="502" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1404" y="526" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1414" y="526" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1424" y="526" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1434" y="527" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1405" y="551" width="2.5" height="2.5" fill="#80d0ff" opacity="0.8" />
<rect x="1414" y="550" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1425" y="551" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1434" y="550" width="2.5" height="2.5" fill="#50a0dc" opacity="0.6" />
<rect x="1405" y="575" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1414" y="575" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1424" y="575" width="2.5" height="2.5" fill="#80d0ff" opacity="0.55" />
<rect x="1434" y="575" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1405" y="599" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1414" y="599" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1425" y="599" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1404" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1414" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1424" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1434" y="623" width="2.5" height="2.5" fill="#50a0dc" opacity="0.8" />
<rect x="1404" y="647" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="1415" y="647" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="1424" y="647" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1434" y="647" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1405" y="671" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1414" y="671" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1424" y="671" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="1434" y="671" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1404" y="695" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="1414" y="695" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1424" y="695" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1434" y="695" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1404" y="719" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1415" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="1424" y="720" width="2.5" height="2.5" fill="#50a0dc" opacity="0.5" />
<rect x="1434" y="720" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1404" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="1414" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1425" y="744" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1434" y="743" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="1405" y="768" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="1415" y="768" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1424" y="767" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="1405" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="1414" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="1424" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="1434" y="792" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
            </g>
            <!-- Atmospheric haze layer 2 -->
            <g data-anim="building">
              <rect x="0" y="560" width="1440" height="25" fill="url(#haze-h)" opacity="0.35" />
            </g>
            <!-- === CENTRAL MEGA-TOWER (THE STAR OF THE SCENE) === -->
            <g data-anim="building">
              <!-- Main shaft -->
              <rect x="600" y="180" width="120" height="620" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="1.2" />
              <!-- Lit right face -->
              <rect x="670" y="180" width="50" height="620" fill="#1e2850" opacity="0.3" />
              <!-- Upper tier -->
              <rect x="620" y="120" width="80" height="60" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="1" />
              <!-- Crown (wider overhang) -->
              <rect x="590" y="175" width="140" height="8" fill="none" stroke="#5a6a90" stroke-width="0.8" />

              <!-- SPIRE -->
              <line x1="660" y1="120" x2="660" y2="50" stroke="#6878a0" stroke-width="1.5" />
              <line x1="653" y1="85" x2="667" y2="85" stroke="#6878a0" stroke-width="0.6" />
              <line x1="655" y1="68" x2="665" y2="68" stroke="#6878a0" stroke-width="0.4" />
              <circle cx="660" cy="46" r="4" fill="#d4a853" opacity="0.9" class="beacon beacon-2" />
              <!-- MASSIVE glow at spire top -->
              <circle cx="660" cy="46" r="20" fill="#d4a853" opacity="0.12" filter="url(#city-glow)" />
              <circle cx="660" cy="46" r="40" fill="#d4a853" opacity="0.04" filter="url(#city-glow)" />

              <!-- NEON EDGES (bright, visible) -->
              <line x1="600" y1="180" x2="600" y2="800" stroke="#d4a853" stroke-width="1.5" opacity="0.35" class="neon-pulse-slow"/>
              <line x1="720" y1="180" x2="720" y2="800" stroke="#d4a853" stroke-width="1.5" opacity="0.35" class="neon-pulse-slow"/>
              <!-- Glow on edges -->
              <line x1="600" y1="180" x2="600" y2="800" stroke="#d4a853" stroke-width="6" opacity="0.06" filter="url(#neon-glow)" />
              <line x1="720" y1="180" x2="720" y2="800" stroke="#d4a853" stroke-width="6" opacity="0.06" filter="url(#neon-glow)" />
              <!-- Upper tier neon -->
              <line x1="620" y1="120" x2="700" y2="120" stroke="#50a0dc" stroke-width="1.5" opacity="0.4" />
              <line x1="620" y1="120" x2="620" y2="180" stroke="#50a0dc" stroke-width="1" opacity="0.25" />
              <line x1="700" y1="120" x2="700" y2="180" stroke="#50a0dc" stroke-width="1" opacity="0.25" />
              <!-- Crown neon -->
              <line x1="590" y1="175" x2="730" y2="175" stroke="#d4a853" stroke-width="2" opacity="0.5" class="neon-pulse-slow"/>
              <line x1="590" y1="175" x2="730" y2="175" stroke="#d4a853" stroke-width="8" opacity="0.08" filter="url(#neon-glow)" />
              <line x1="600" y1="180" x2="720" y2="180" stroke="#d4a853" stroke-width="1.5" opacity="0.45" />

              <!-- Horizontal accent lines -->
              <line x1="600" y1="350" x2="720" y2="350" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
              <line x1="600" y1="500" x2="720" y2="500" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />
              <line x1="600" y1="650" x2="720" y2="650" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" />

              <!-- Floor lines -->
              <line x1="600" y1="210" x2="720" y2="210" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="235" x2="720" y2="235" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="260" x2="720" y2="260" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="285" x2="720" y2="285" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="310" x2="720" y2="310" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="335" x2="720" y2="335" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="360" x2="720" y2="360" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="385" x2="720" y2="385" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="410" x2="720" y2="410" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="435" x2="720" y2="435" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="460" x2="720" y2="460" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="485" x2="720" y2="485" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="510" x2="720" y2="510" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="535" x2="720" y2="535" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="560" x2="720" y2="560" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="585" x2="720" y2="585" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="610" x2="720" y2="610" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="635" x2="720" y2="635" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="660" x2="720" y2="660" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="685" x2="720" y2="685" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="710" x2="720" y2="710" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="735" x2="720" y2="735" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="760" x2="720" y2="760" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="600" y1="785" x2="720" y2="785" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <!-- Neon signs on mega-tower -->
              <rect x="635" y="240" width="30" height="3" rx="1" fill="#50a0dc" opacity="0.7" filter="url(#neon-glow)" class="neon-pulse-fast"/>
              <rect x="635" y="250" width="20" height="3" rx="1" fill="#50a0dc" opacity="0.6" filter="url(#neon-glow)" class="neon-pulse-fast"/>
              <!-- DENSE window grid -->
              <g class="flicker-d">
                <rect x="608" y="195" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="619" y="195" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="630" y="195" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="641" y="195" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="652" y="195" width="3" height="3" fill="#50a0dc" opacity="0.55" />
                <rect x="663" y="195" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="674" y="195" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="685" y="195" width="3" height="3" fill="#50a0dc" opacity="0.55" />
                <rect x="696" y="195" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="608" y="219" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="619" y="219" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="630" y="219" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="641" y="219" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="652" y="219" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="674" y="219" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="685" y="219" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="696" y="219" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="707" y="219" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="619" y="243" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="652" y="243" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="663" y="243" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="674" y="243" width="3" height="3" fill="#50a0dc" opacity="0.2" />
                <rect x="685" y="243" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="696" y="243" width="3" height="3" fill="#80d0ff" opacity="0.5" />
                <rect x="707" y="243" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="619" y="267" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="630" y="267" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="641" y="267" width="3" height="3" fill="#50a0dc" opacity="0.2" />
                <rect x="652" y="267" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="663" y="267" width="3" height="3" fill="#50a0dc" opacity="0.2" />
                <rect x="674" y="267" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="685" y="267" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="696" y="267" width="3" height="3" fill="#50a0dc" opacity="0.65" />
                <rect x="707" y="267" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="608" y="291" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="619" y="291" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="630" y="291" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="641" y="291" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="652" y="291" width="3" height="3" fill="#50a0dc" opacity="0.2" />
                <rect x="663" y="291" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="674" y="291" width="3" height="3" fill="#50a0dc" opacity="0.65" />
                <rect x="685" y="291" width="3" height="3" fill="#80d0ff" opacity="0.55" />
                <rect x="696" y="291" width="3" height="3" fill="#50a0dc" opacity="0.2" />
                <rect x="707" y="291" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="608" y="315" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="630" y="315" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="641" y="315" width="3" height="3" fill="#50a0dc" opacity="0.65" />
                <rect x="652" y="315" width="3" height="3" fill="#80d0ff" opacity="0.3" />
                <rect x="663" y="315" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="674" y="315" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="685" y="315" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="707" y="315" width="3" height="3" fill="#50a0dc" opacity="0.5" />
                <rect x="608" y="339" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="619" y="339" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="630" y="339" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="641" y="339" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="652" y="339" width="3" height="3" fill="#80d0ff" opacity="0.55" />
                <rect x="663" y="339" width="3" height="3" fill="#80d0ff" opacity="0.4" />
                <rect x="674" y="339" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="685" y="339" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="707" y="339" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="619" y="363" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="641" y="363" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="652" y="363" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="663" y="363" width="3" height="3" fill="#50a0dc" opacity="0.55" />
                <rect x="674" y="363" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="685" y="363" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="696" y="363" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="707" y="363" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="608" y="387" width="3" height="3" fill="#80d0ff" opacity="0.55" />
                <rect x="619" y="387" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="630" y="387" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="641" y="387" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="652" y="387" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="663" y="387" width="3" height="3" fill="#80d0ff" opacity="0.6" />
                <rect x="674" y="387" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="696" y="387" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="707" y="387" width="3" height="3" fill="#80d0ff" opacity="0.5" />
                <rect x="619" y="411" width="3" height="3" fill="#50a0dc" opacity="0.2" />
                <rect x="630" y="411" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="641" y="411" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="652" y="411" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="663" y="411" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="674" y="411" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="685" y="411" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="696" y="411" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="608" y="435" width="3" height="3" fill="#80d0ff" opacity="0.4" />
                <rect x="619" y="435" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="630" y="435" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="652" y="435" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="663" y="435" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="674" y="435" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="685" y="435" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="696" y="435" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="707" y="435" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="608" y="459" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="619" y="459" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="630" y="459" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="641" y="459" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="652" y="459" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="663" y="459" width="3" height="3" fill="#50a0dc" opacity="0.4" />
                <rect x="674" y="459" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="685" y="459" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="696" y="459" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="707" y="459" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="608" y="483" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="630" y="483" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="641" y="483" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="652" y="483" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="663" y="483" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="674" y="483" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="685" y="483" width="3" height="3" fill="#50a0dc" opacity="0.4" />
                <rect x="696" y="483" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="707" y="483" width="3" height="3" fill="#50a0dc" opacity="0.6" />
                <rect x="608" y="507" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="619" y="507" width="3" height="3" fill="#50a0dc" opacity="0.3" />
                <rect x="630" y="507" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="641" y="507" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="652" y="507" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="674" y="507" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="685" y="507" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="696" y="507" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="707" y="507" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="608" y="531" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="619" y="531" width="3" height="3" fill="#50a0dc" opacity="0.6" />
                <rect x="630" y="531" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="641" y="531" width="3" height="3" fill="#80d0ff" opacity="0.4" />
                <rect x="663" y="531" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="674" y="531" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="685" y="531" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="696" y="531" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="707" y="531" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="608" y="555" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="619" y="555" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="630" y="555" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="652" y="555" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="663" y="555" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="674" y="555" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="685" y="555" width="3" height="3" fill="#80d0ff" opacity="0.65" />
                <rect x="696" y="555" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="707" y="555" width="3" height="3" fill="#80d0ff" opacity="0.5" />
                <rect x="608" y="579" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="619" y="579" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="630" y="579" width="3" height="3" fill="#50a0dc" opacity="0.55" />
                <rect x="641" y="579" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="652" y="579" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="663" y="579" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="674" y="579" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="685" y="579" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="696" y="579" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="707" y="579" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="608" y="603" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="619" y="603" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="630" y="603" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="641" y="603" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="652" y="603" width="3" height="3" fill="#50a0dc" opacity="0.65" />
                <rect x="674" y="603" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="685" y="603" width="3" height="3" fill="#80d0ff" opacity="0.3" />
                <rect x="696" y="603" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="707" y="603" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="608" y="627" width="3" height="3" fill="#50a0dc" opacity="0.55" />
                <rect x="630" y="627" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="641" y="627" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="652" y="627" width="3" height="3" fill="#50a0dc" opacity="0.7" />
                <rect x="663" y="627" width="3" height="3" fill="#80d0ff" opacity="0.65" />
                <rect x="674" y="627" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="696" y="627" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="707" y="627" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="608" y="651" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="619" y="651" width="3" height="3" fill="#50a0dc" opacity="0.4" />
                <rect x="630" y="651" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="641" y="651" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="652" y="651" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="663" y="651" width="3" height="3" fill="#50a0dc" opacity="0.55" />
                <rect x="674" y="651" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="685" y="651" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="696" y="651" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="707" y="651" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="608" y="675" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="619" y="675" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="641" y="675" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="652" y="675" width="3" height="3" fill="#50a0dc" opacity="0.5" />
                <rect x="663" y="675" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="674" y="675" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="685" y="675" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="696" y="675" width="3" height="3" fill="#80d0ff" opacity="0.3" />
                <rect x="707" y="675" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="608" y="699" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="619" y="699" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="630" y="699" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="641" y="699" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="652" y="699" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="663" y="699" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="674" y="699" width="3" height="3" fill="#50a0dc" opacity="0.8" />
                <rect x="696" y="699" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="707" y="699" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="608" y="723" width="3" height="3" fill="#d4a853" opacity="0.4" />
                <rect x="619" y="723" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="630" y="723" width="3" height="3" fill="#d4a853" opacity="0.2" />
                <rect x="641" y="723" width="3" height="3" fill="#d4a853" opacity="0.5" />
                <rect x="652" y="723" width="3" height="3" fill="#80d0ff" opacity="0.3" />
                <rect x="663" y="723" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="674" y="723" width="3" height="3" fill="#d4a853" opacity="0.3" />
                <rect x="685" y="723" width="3" height="3" fill="#d4a853" opacity="0.8" />
                <rect x="696" y="723" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="608" y="747" width="3" height="3" fill="#d4a853" opacity="0.55" />
                <rect x="619" y="747" width="3" height="3" fill="#50a0dc" opacity="0.6" />
                <rect x="630" y="747" width="3" height="3" fill="#50a0dc" opacity="0.2" />
                <rect x="641" y="747" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="652" y="747" width="3" height="3" fill="#50a0dc" opacity="0.5" />
                <rect x="663" y="747" width="3" height="3" fill="#80d0ff" opacity="0.4" />
                <rect x="674" y="747" width="3" height="3" fill="#d4a853" opacity="0.6" />
                <rect x="685" y="747" width="3" height="3" fill="#d4a853" opacity="0.7" />
                <rect x="696" y="747" width="3" height="3" fill="#d4a853" opacity="0.65" />
                <rect x="707" y="747" width="3" height="3" fill="#50a0dc" opacity="0.55" />
              </g>
              <!-- Upper tier windows -->
              <g class="flicker-c">
              <rect x="628" y="128" width="2.5" height="2.5" fill="#50a0dc" opacity="0.57" />
              <rect x="642" y="128" width="2.5" height="2.5" fill="#50a0dc" opacity="0.56" />
              <rect x="656" y="128" width="2.5" height="2.5" fill="#50a0dc" opacity="0.64" />
              <rect x="670" y="128" width="2.5" height="2.5" fill="#50a0dc" opacity="0.43" />
              <rect x="684" y="128" width="2.5" height="2.5" fill="#50a0dc" opacity="0.64" />
              <rect x="628" y="144" width="2.5" height="2.5" fill="#50a0dc" opacity="0.46" />
              <rect x="642" y="144" width="2.5" height="2.5" fill="#50a0dc" opacity="0.35" />
              <rect x="656" y="144" width="2.5" height="2.5" fill="#50a0dc" opacity="0.51" />
              <rect x="670" y="144" width="2.5" height="2.5" fill="#50a0dc" opacity="0.50" />
              <rect x="684" y="144" width="2.5" height="2.5" fill="#50a0dc" opacity="0.51" />
              <rect x="628" y="160" width="2.5" height="2.5" fill="#50a0dc" opacity="0.32" />
              <rect x="642" y="160" width="2.5" height="2.5" fill="#50a0dc" opacity="0.59" />
              <rect x="656" y="160" width="2.5" height="2.5" fill="#50a0dc" opacity="0.32" />
              <rect x="670" y="160" width="2.5" height="2.5" fill="#50a0dc" opacity="0.67" />
              <rect x="684" y="160" width="2.5" height="2.5" fill="#50a0dc" opacity="0.51" />
              </g>

              <!-- Holographic ring -->
              <ellipse cx="660" cy="350" rx="90" ry="18" fill="none" stroke="#50a0dc" stroke-width="0.8" opacity="0.2" stroke-dasharray="6 4" />
              <ellipse cx="660" cy="350" rx="90" ry="18" fill="none" stroke="#50a0dc" stroke-width="3" opacity="0.04" filter="url(#neon-glow)" />

              <!-- Platform extending from tower -->
              <rect x="540" y="500" width="240" height="4" fill="none" stroke="#5a6a90" stroke-width="0.6" />
              <line x1="540" y1="500" x2="780" y2="500" stroke="#d4a853" stroke-width="0.8" opacity="0.25" />
            </g>
            <!-- === SKYWAYS === -->
            <g data-anim="building">
              <line x1="222" y1="520" x2="410" y2="500" stroke="#4a5a80" stroke-width="3" opacity="0.15" />
              <line x1="222" y1="518" x2="410" y2="498" stroke="#50a0dc" stroke-width="0.5" opacity="0.12" />
              <line x1="490" y1="550" x2="600" y2="500" stroke="#4a5a80" stroke-width="3" opacity="0.12" />
              <line x1="490" y1="548" x2="600" y2="498" stroke="#d4a853" stroke-width="0.5" opacity="0.1" />
              <line x1="720" y1="500" x2="835" y2="480" stroke="#4a5a80" stroke-width="3" opacity="0.12" />
              <line x1="720" y1="498" x2="835" y2="478" stroke="#50a0dc" stroke-width="0.5" opacity="0.1" />
              <line x1="990" y1="530" x2="1120" y2="510" stroke="#4a5a80" stroke-width="2.5" opacity="0.1" />
              <line x1="990" y1="528" x2="1120" y2="508" stroke="#d4a853" stroke-width="0.4" opacity="0.08" />
              <!-- Lower transit tubes -->
              <line x1="60" y1="720" x2="400" y2="715" stroke="#4a5a80" stroke-width="4" opacity="0.1" />
              <line x1="60" y1="718" x2="400" y2="713" stroke="#d4a853" stroke-width="0.5" opacity="0.08" />
              <line x1="500" y1="710" x2="850" y2="705" stroke="#4a5a80" stroke-width="4" opacity="0.1" />
              <line x1="500" y1="708" x2="850" y2="703" stroke="#50a0dc" stroke-width="0.5" opacity="0.08" />
              <line x1="950" y1="715" x2="1400" y2="720" stroke="#4a5a80" stroke-width="4" opacity="0.1" />
              <line x1="950" y1="713" x2="1400" y2="718" stroke="#d4a853" stroke-width="0.5" opacity="0.08" />
            </g>
            <!-- === HOLOGRAPHIC DISPLAYS === -->
            <g data-anim="building">
              <!-- Large holo-screen (left) -->
              <rect x="270" y="440" width="60" height="35" fill="#50a0dc" opacity="0.04" stroke="#50a0dc" stroke-width="0.6" rx="1" class="neon-pulse-fast"/>
              <rect x="270" y="440" width="60" height="35" fill="none" stroke="#50a0dc" stroke-width="3" opacity="0.03" filter="url(#holo-glow)" rx="1" />
              <line x1="275" y1="450" x2="325" y2="450" stroke="#50a0dc" stroke-width="0.4" opacity="0.15" />
              <line x1="275" y1="457" x2="315" y2="457" stroke="#50a0dc" stroke-width="0.3" opacity="0.1" />
              <line x1="275" y1="464" x2="320" y2="464" stroke="#50a0dc" stroke-width="0.3" opacity="0.1" />

              <!-- Holo-screen (right) -->
              <rect x="1060" y="420" width="50" height="30" fill="#d4a853" opacity="0.03" stroke="#d4a853" stroke-width="0.5" rx="1" class="neon-pulse-fast"/>
              <rect x="1060" y="420" width="50" height="30" fill="none" stroke="#d4a853" stroke-width="3" opacity="0.03" filter="url(#holo-glow)" rx="1" />
              <line x1="1065" y1="430" x2="1100" y2="430" stroke="#d4a853" stroke-width="0.4" opacity="0.12" />
              <line x1="1065" y1="437" x2="1095" y2="437" stroke="#d4a853" stroke-width="0.3" opacity="0.08" />

              <!-- Floating holographic circle -->
              <circle cx="870" cy="380" r="18" fill="none" stroke="#50a0dc" stroke-width="0.6" opacity="0.15" class="neon-pulse-fast"/>
              <circle cx="870" cy="380" r="18" fill="none" stroke="#50a0dc" stroke-width="3" opacity="0.03" filter="url(#holo-glow)" />
              <circle cx="870" cy="380" r="12" fill="none" stroke="#50a0dc" stroke-width="0.3" opacity="0.1" stroke-dasharray="3 3" />
              <circle cx="870" cy="380" r="5" fill="#50a0dc" opacity="0.06" />
            </g>
            <!-- New holographic advertisement screens -->
            <g data-anim="building">
              <!-- Holo ad screen: gap before mega-tower -->
              <rect x="540" y="395" width="55" height="30" rx="1" fill="#50a0dc" opacity="0.05" stroke="#50a0dc" stroke-width="0.5"/>
              <line x1="540" y1="405" x2="595" y2="405" stroke="#50a0dc" stroke-width="0.3" opacity="0.25" class="hologram-scanline"/>
              <rect x="544" y="399" width="47" height="22" rx="1" fill="none" stroke="#50a0dc" stroke-width="0.3" opacity="0.15"/>
              <!-- Holo ad screen: between mega-tower and Building 8 -->
              <rect x="740" y="355" width="50" height="28" rx="1" fill="#d4a853" opacity="0.04" stroke="#d4a853" stroke-width="0.5"/>
              <line x1="740" y1="365" x2="790" y2="365" stroke="#d4a853" stroke-width="0.3" opacity="0.2" class="hologram-scanline"/>
              <rect x="744" y="359" width="42" height="20" rx="1" fill="none" stroke="#d4a853" stroke-width="0.3" opacity="0.12"/>
            </g>
            <!-- === DOME (right-center) === -->
            <g data-anim="building">
              <rect x="890" y="580" width="120" height="220" fill="url(#bld-fill)" stroke="#5a6a90" stroke-width="0.8" />
              <path d="M890,580 A60,55 0 0,1 1010,580" fill="url(#bld-fill)" stroke="#8090b0" stroke-width="1.8" />
              <!-- Dome ribs -->
              <line x1="950" y1="525" x2="950" y2="580" stroke="#8090b0" stroke-width="0.6" opacity="0.25" />
              <line x1="950" y1="525" x2="910" y2="580" stroke="#8090b0" stroke-width="0.4" opacity="0.18" />
              <line x1="950" y1="525" x2="990" y2="580" stroke="#8090b0" stroke-width="0.4" opacity="0.18" />
              <line x1="950" y1="525" x2="895" y2="580" stroke="#8090b0" stroke-width="0.3" opacity="0.12" />
              <line x1="950" y1="525" x2="1005" y2="580" stroke="#8090b0" stroke-width="0.3" opacity="0.12" />
              <!-- Dome parallels -->
              <line x1="915" y1="548" x2="985" y2="548" stroke="#8090b0" stroke-width="0.3" opacity="0.15" />
              <line x1="905" y1="565" x2="995" y2="565" stroke="#8090b0" stroke-width="0.3" opacity="0.12" />
              <!-- Dome inner glow -->
              <ellipse cx="950" cy="560" rx="35" ry="14" fill="#50a0dc" opacity="0.05" />
              <!-- Top beacon -->
              <circle cx="950" cy="523" r="2.5" fill="#50a0dc" opacity="0.7" class="beacon beacon-1" />
              <circle cx="950" cy="523" r="10" fill="#50a0dc" opacity="0.06" filter="url(#neon-glow)" />
              <!-- Base neon -->
              <line x1="890" y1="580" x2="1010" y2="580" stroke="#d4a853" stroke-width="1.2" opacity="0.3" />
              <!-- Floor lines + windows -->
              <line x1="890" y1="600" x2="1010" y2="600" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="890" y1="630" x2="1010" y2="630" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="890" y1="660" x2="1010" y2="660" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="890" y1="690" x2="1010" y2="690" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="890" y1="720" x2="1010" y2="720" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="890" y1="750" x2="1010" y2="750" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
              <line x1="890" y1="780" x2="1010" y2="780" stroke="#4a5a80" stroke-width="0.4" opacity="0.3" />
<rect x="913" y="590" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="941" y="590" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="955" y="590" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="982" y="590" width="2.5" height="2.5" fill="#80d0ff" opacity="0.4" />
<rect x="996" y="590" width="2.5" height="2.5" fill="#50a0dc" opacity="0.2" />
<rect x="898" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="913" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="926" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="940" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="954" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="968" y="623" width="2.5" height="2.5" fill="#50a0dc" opacity="0.3" />
<rect x="982" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="996" y="623" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="898" y="656" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="912" y="656" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="927" y="656" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="954" y="656" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="968" y="656" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="996" y="656" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="898" y="689" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="927" y="689" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="940" y="689" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="955" y="689" width="2.5" height="2.5" fill="#50a0dc" opacity="0.4" />
<rect x="968" y="689" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="982" y="689" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="996" y="689" width="2.5" height="2.5" fill="#d4a853" opacity="0.7" />
<rect x="899" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.4" />
<rect x="912" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.65" />
<rect x="927" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="940" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="954" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="969" y="722" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="982" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="996" y="722" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="898" y="755" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="926" y="755" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="941" y="755" width="2.5" height="2.5" fill="#d4a853" opacity="0.6" />
<rect x="954" y="755" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
<rect x="982" y="755" width="2.5" height="2.5" fill="#d4a853" opacity="0.5" />
<rect x="996" y="755" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="898" y="788" width="2.5" height="2.5" fill="#d4a853" opacity="0.15" />
<rect x="912" y="788" width="2.5" height="2.5" fill="#50a0dc" opacity="0.65" />
<rect x="926" y="788" width="2.5" height="2.5" fill="#d4a853" opacity="0.55" />
<rect x="940" y="788" width="2.5" height="2.5" fill="#d4a853" opacity="0.2" />
<rect x="954" y="788" width="2.5" height="2.5" fill="#d4a853" opacity="0.3" />
<rect x="968" y="788" width="2.5" height="2.5" fill="#d4a853" opacity="0.8" />
<rect x="996" y="788" width="2.5" height="2.5" fill="#50a0dc" opacity="0.7" />
            </g>
            <!-- === GROUND BASE === -->
            <g data-anim="building">
              <line x1="0" y1="800" x2="1440" y2="800" stroke="#5a6a90" stroke-width="1.2" opacity="0.3" />
              <line x1="0" y1="800" x2="1440" y2="800" stroke="#d4a853" stroke-width="0.8" opacity="0.12" />
              <!-- Ground reflection glow -->
              <rect x="0" y="800" width="1440" height="8" fill="#d4a853" opacity="0.02" />
            </g>

            <!-- === STREET-LEVEL DETAILS === -->
            <!-- Road surface -->
            <g v-once class="street-level">
              <rect x="0" y="782" width="1440" height="18" fill="#0a0e1a" opacity="0.9"/>
              <rect x="0" y="778" width="1440" height="4" fill="#0d1220" opacity="0.7"/>
              <line x1="0" y1="791" x2="1440" y2="791" stroke="#d4a853" stroke-width="0.5" stroke-dasharray="20 15" opacity="0.15"/>
              <line x1="0" y1="782" x2="1440" y2="782" stroke="#1a2545" stroke-width="0.8" opacity="0.5"/>
              <line x1="0" y1="800" x2="1440" y2="800" stroke="#1a2545" stroke-width="0.8" opacity="0.5"/>
              <rect x="0" y="782" width="1440" height="18" fill="url(#road-reflection)" opacity="0.08"/>
            </g>

            <!-- Lampposts -->
            <g v-once class="lampposts">
              <line x1="100" y1="760" x2="100" y2="782" stroke="#6878a0" stroke-width="1.5" opacity="0.6"/>
              <circle cx="100" cy="758" r="3" fill="#d4a853" opacity="0.9" filter="url(#neon-glow)"/>
              <path d="M 88,760 L 112,760 L 108,782 L 92,782 Z" fill="#d4a853" opacity="0.04"/>

              <line x1="340" y1="760" x2="340" y2="782" stroke="#6878a0" stroke-width="1.5" opacity="0.6"/>
              <circle cx="340" cy="758" r="3" fill="#d4a853" opacity="0.9" filter="url(#neon-glow)"/>
              <path d="M 328,760 L 352,760 L 348,782 L 332,782 Z" fill="#d4a853" opacity="0.04"/>

              <line x1="580" y1="760" x2="580" y2="782" stroke="#6878a0" stroke-width="1.5" opacity="0.6"/>
              <circle cx="580" cy="758" r="3" fill="#d4a853" opacity="0.9" filter="url(#neon-glow)"/>
              <path d="M 568,760 L 592,760 L 588,782 L 572,782 Z" fill="#d4a853" opacity="0.04"/>

              <line x1="820" y1="760" x2="820" y2="782" stroke="#6878a0" stroke-width="1.5" opacity="0.6"/>
              <circle cx="820" cy="758" r="3" fill="#d4a853" opacity="0.9" filter="url(#neon-glow)"/>
              <path d="M 808,760 L 832,760 L 828,782 L 812,782 Z" fill="#d4a853" opacity="0.04"/>

              <line x1="1060" y1="760" x2="1060" y2="782" stroke="#6878a0" stroke-width="1.5" opacity="0.6"/>
              <circle cx="1060" cy="758" r="3" fill="#d4a853" opacity="0.9" filter="url(#neon-glow)"/>
              <path d="M 1048,760 L 1072,760 L 1068,782 L 1052,782 Z" fill="#d4a853" opacity="0.04"/>

              <line x1="1300" y1="760" x2="1300" y2="782" stroke="#6878a0" stroke-width="1.5" opacity="0.6"/>
              <circle cx="1300" cy="758" r="3" fill="#d4a853" opacity="0.9" filter="url(#neon-glow)"/>
              <path d="M 1288,760 L 1312,760 L 1308,782 L 1292,782 Z" fill="#d4a853" opacity="0.04"/>
            </g>

            <!-- Ground vehicles -->
            <g class="ground-vehicles">
              <!-- Vehicle 1: moving right -->
              <g transform="translate(250, 775)">
                <rect x="0" y="0" width="15" height="6" rx="1" fill="#1a2545" opacity="0.8"/>
                <circle cx="1" cy="3" r="1.2" fill="#ff4040" opacity="0.7"/>
                <circle cx="14" cy="3" r="1.2" fill="#ffffff" opacity="0.5"/>
              </g>
              <!-- Vehicle 2: moving left -->
              <g transform="translate(650, 776)">
                <rect x="0" y="0" width="15" height="6" rx="1" fill="#1a2545" opacity="0.7"/>
                <circle cx="1" cy="3" r="1.2" fill="#ffffff" opacity="0.6"/>
                <circle cx="14" cy="3" r="1.2" fill="#ff4040" opacity="0.6"/>
              </g>
              <!-- Vehicle 3: parked -->
              <g transform="translate(1050, 775)">
                <rect x="0" y="0" width="15" height="6" rx="1" fill="#0e1528" opacity="0.9"/>
                <circle cx="1" cy="3" r="1" fill="#ff4040" opacity="0.5"/>
                <circle cx="14" cy="3" r="1" fill="#ff4040" opacity="0.5"/>
              </g>
              <!-- Vehicle 4: animated right -->
              <g class="vehicle-right" transform="translate(0, 775)">
                <rect x="0" y="0" width="15" height="6" rx="1" fill="#1a2545" opacity="0.75"/>
                <circle cx="1" cy="3" r="1.2" fill="#ff4040" opacity="0.7"/>
                <circle cx="14" cy="3" r="1.2" fill="#ffffff" opacity="0.5"/>
                <path d="M 15,1 L 28,0 L 28,6 L 15,5 Z" fill="#ffffff" opacity="0.06"/>
              </g>
              <!-- Vehicle 5: animated left -->
              <g class="vehicle-left" transform="translate(0, 777)">
                <rect x="0" y="0" width="15" height="6" rx="1" fill="#1a2545" opacity="0.7"/>
                <circle cx="1" cy="3" r="1.2" fill="#ffffff" opacity="0.6"/>
                <circle cx="14" cy="3" r="1.2" fill="#ff4040" opacity="0.6"/>
              </g>
            </g>
          </g>

          <!-- === FLYING VEHICLES === -->
          <g ref="shipRef" opacity="0" data-anim="ship">
            <!-- Vehicle 1 — fast, long trail -->
            <line x1="120" y1="340" x2="220" y2="337" stroke="#50a0dc" stroke-width="1.2" opacity="0.5" />
            <line x1="120" y1="340" x2="220" y2="337" stroke="#50a0dc" stroke-width="4" opacity="0.06" filter="url(#neon-glow)" />
            <circle cx="220" cy="337" r="2" fill="#50a0dc" opacity="0.7" />
            <!-- Vehicle 2 — opposite direction -->
            <line x1="1350" y1="420" x2="1260" y2="423" stroke="#d4a853" stroke-width="1" opacity="0.45" />
            <line x1="1350" y1="420" x2="1260" y2="423" stroke="#d4a853" stroke-width="4" opacity="0.05" filter="url(#neon-glow)" />
            <circle cx="1260" cy="423" r="1.8" fill="#d4a853" opacity="0.6" />
            <!-- Vehicle 3 — center -->
            <line x1="540" y1="290" x2="590" y2="288" stroke="#50a0dc" stroke-width="0.8" opacity="0.4" />
            <circle cx="590" cy="288" r="1.5" fill="#50a0dc" opacity="0.6" />
            <!-- Vehicle 4 -->
            <line x1="1000" y1="360" x2="1055" y2="358" stroke="#d4a853" stroke-width="0.7" opacity="0.35" />
            <circle cx="1055" cy="358" r="1.2" fill="#d4a853" opacity="0.5" />
            <!-- Vehicle 5 — low altitude -->
            <line x1="380" y1="520" x2="420" y2="518" stroke="#80d0ff" stroke-width="0.6" opacity="0.3" />
            <circle cx="420" cy="518" r="1" fill="#80d0ff" opacity="0.5" />
            <!-- Vehicle 6 — high altitude, fast -->
            <line x1="750" y1="200" x2="830" y2="197" stroke="#50a0dc" stroke-width="0.6" opacity="0.25" />
            <circle cx="830" cy="197" r="1" fill="#50a0dc" opacity="0.4" />
          </g>

          <!-- Atmospheric haze near ground -->
          <rect x="0" y="680" width="1440" height="40" fill="#150a28" opacity="0.25" />

          <!-- Ground fog -->
          <rect x="0" y="740" width="1440" height="160" fill="url(#ground-fog)" />

          <!-- Ground-level neon reflections -->
          <line x1="0" y1="810" x2="1440" y2="810" stroke="#d4a853" stroke-width="0.5" opacity="0.04" />
          <rect x="580" y="802" width="160" height="20" fill="#d4a853" opacity="0.015" filter="url(#city-glow)" />
          <rect x="280" y="802" width="100" height="15" fill="#50a0dc" opacity="0.01" filter="url(#city-glow)" />
          <rect x="1050" y="802" width="120" height="15" fill="#50a0dc" opacity="0.01" filter="url(#city-glow)" />
        </svg>

        <!-- Data readout -->
        <div class="data-readout absolute top-16 left-6 sm:left-10">
          <span class="beacon-dot" /> STATION HUB <span class="mx-1 text-[#d4a853]/15">//</span> ALL SYSTEMS
        </div>

        <!-- Service cards -->
        <div class="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h2 class="text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.3em] text-[#d4a853] font-heading font-semibold retro-glow whitespace-nowrap mb-6 md:mb-10">{{ $t('home.scene3Label') }}</h2>
          <div ref="cardsRef" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl w-full">
            <div v-for="svc in services" :key="svc.icon" class="svc-card" data-anim="card">
              <svg class="w-10 h-10 mb-4 text-[#d4a853]" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon v-if="svc.icon === 'diamond'" points="20,2 38,20 20,38 2,20" />
                <path v-if="svc.icon === 'bolt'" d="M22 2L8 22h10l-4 16 16-22H18l4-14z" />
                <circle v-if="svc.icon === 'orbit'" cx="20" cy="20" r="14" />
                <circle v-if="svc.icon === 'orbit'" cx="20" cy="6" r="3" fill="currentColor" />
                <circle v-if="svc.icon === 'orbit'" cx="32" cy="26" r="3" fill="currentColor" />
                <circle v-if="svc.icon === 'orbit'" cx="8" cy="26" r="3" fill="currentColor" />
                <path v-if="svc.icon === 'code'" d="M14 12L4 20l10 8M26 12l10 8-10 8M18 32l4-24" />
                <rect v-if="svc.icon === 'shield'" x="6" y="4" width="28" height="32" rx="2" />
                <path v-if="svc.icon === 'shield'" d="M20 4v32M6 20h28" />
                <circle v-if="svc.icon === 'shield'" cx="20" cy="20" r="5" />
                <circle v-if="svc.icon === 'connect'" cx="10" cy="10" r="4" />
                <circle v-if="svc.icon === 'connect'" cx="30" cy="10" r="4" />
                <circle v-if="svc.icon === 'connect'" cx="20" cy="30" r="4" />
                <line v-if="svc.icon === 'connect'" x1="13" y1="12" x2="17" y2="27" />
                <line v-if="svc.icon === 'connect'" x1="27" y1="12" x2="23" y2="27" />
                <line v-if="svc.icon === 'connect'" x1="14" y1="10" x2="26" y2="10" />
              </svg>
              <h3 class="text-white font-heading font-semibold text-lg mb-2">{{ svc.title }}</h3>
              <p class="text-gray-400 text-sm leading-relaxed">{{ svc.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== SCENE 4 : L'ASCENSION (Dawn over city skyline) ==================== -->
      <div ref="scene4Ref" class="absolute inset-0" style="opacity:0">

        <!-- Dawn sky gradient — warm amber/magenta sunrise -->
        <div class="absolute inset-0" style="background:
          linear-gradient(180deg,
            transparent 0%,
            rgba(15,10,40,0.3) 25%,
            rgba(80,30,60,0.08) 38%,
            rgba(212,168,83,0.15) 48%,
            rgba(212,120,50,0.2) 54%,
            rgba(212,168,83,0.25) 58%,
            rgba(176,48,96,0.08) 65%,
            rgba(10,15,46,0.5) 75%,
            rgba(5,8,22,0.9) 90%)" />

        <!-- Horizon glow — massive sunrise radial -->
        <div ref="horizonGlow" class="absolute inset-0" style="background:
          radial-gradient(ellipse at 50% 58%, rgba(212,168,83,0.45) 0%, rgba(212,120,50,0.2) 15%, rgba(176,48,96,0.1) 30%, transparent 55%),
          radial-gradient(ellipse at 50% 60%, rgba(255,200,100,0.08) 0%, transparent 30%)" />

        <!-- Main SVG -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="hray" x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stop-color="#d4a853" stop-opacity="0.15" />
              <stop offset="40%" stop-color="#d4a853" stop-opacity="0.04" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="hray-warm" x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stop-color="#d08030" stop-opacity="0.1" />
              <stop offset="50%" stop-color="#d4a853" stop-opacity="0.03" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="terrain-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0c1228" />
              <stop offset="100%" stop-color="#0e0616" />
            </linearGradient>
            <linearGradient id="engine-trail" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="#d4a853" stop-opacity="0" />
              <stop offset="30%" stop-color="#d4a853" stop-opacity="0.15" />
              <stop offset="60%" stop-color="#d08030" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0.08" />
            </linearGradient>
            <linearGradient id="launch-glow" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="#d4a853" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="cloud-h" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#150a28" stop-opacity="0" />
              <stop offset="30%" stop-color="#1a1535" stop-opacity="0.4" />
              <stop offset="50%" stop-color="#1a1535" stop-opacity="0.6" />
              <stop offset="70%" stop-color="#1a1535" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#150a28" stop-opacity="0" />
            </linearGradient>
            <filter id="s4-glow"><feGaussianBlur stdDeviation="5" /></filter>
            <filter id="s4-glow-lg"><feGaussianBlur stdDeviation="12" /></filter>
            <filter id="s4-soft"><feGaussianBlur stdDeviation="3" /></filter>
            <linearGradient id="fog-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1a2545" stop-opacity="0.06"/>
              <stop offset="100%" stop-color="#1a2545" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <!-- Scene 4 container (for camera shake effect) -->
          <g ref="scene4ContainerRef">

          <!-- ===== SUNRISE LIGHT RAYS (brighter, more dramatic) ===== -->
          <g ref="horizonRaysRef" opacity="0.6">
            <!-- Central rays (brightest) -->
            <polygon points="720,530 660,0 700,0" fill="url(#hray)" />
            <polygon points="720,530 740,0 780,0" fill="url(#hray)" />
            <polygon points="720,530 580,0 640,0" fill="url(#hray)" opacity="0.8" />
            <polygon points="720,530 800,0 860,0" fill="url(#hray)" opacity="0.8" />
            <!-- Wide rays -->
            <polygon points="720,530 400,0 500,0" fill="url(#hray-warm)" opacity="0.5" />
            <polygon points="720,530 940,0 1040,0" fill="url(#hray-warm)" opacity="0.5" />
            <!-- Far rays -->
            <polygon points="720,530 140,80 260,80" fill="url(#hray-warm)" opacity="0.25" />
            <polygon points="720,530 1180,80 1300,80" fill="url(#hray-warm)" opacity="0.25" />
            <!-- Extra subtle rays -->
            <polygon points="720,530 0,200 100,200" fill="url(#hray-warm)" opacity="0.12" />
            <polygon points="720,530 1340,200 1440,200" fill="url(#hray-warm)" opacity="0.12" />
          </g>

          <!-- ===== ATMOSPHERIC CLOUD LAYERS ===== -->
          <!-- High thin clouds (wispy) -->
          <rect x="100" y="280" width="500" height="3" fill="url(#cloud-h)" opacity="0.3" rx="1" />
          <rect x="700" y="260" width="400" height="2.5" fill="url(#cloud-h)" opacity="0.25" rx="1" />
          <rect x="300" y="310" width="350" height="2" fill="url(#cloud-h)" opacity="0.2" rx="1" />
          <rect x="850" y="300" width="300" height="2.5" fill="url(#cloud-h)" opacity="0.22" rx="1" />
          <rect x="50" y="340" width="250" height="2" fill="url(#cloud-h)" opacity="0.15" rx="1" />
          <rect x="1100" y="330" width="280" height="2" fill="url(#cloud-h)" opacity="0.18" rx="1" />
          <!-- Mid cloud layer -->
          <rect x="0" y="400" width="600" height="4" fill="url(#cloud-h)" opacity="0.2" rx="2" />
          <rect x="500" y="410" width="500" height="3" fill="url(#cloud-h)" opacity="0.18" rx="1" />
          <rect x="900" y="395" width="540" height="3.5" fill="url(#cloud-h)" opacity="0.22" rx="1" />
          <!-- Lower haze near horizon -->
          <rect x="0" y="470" width="1440" height="8" fill="#1a1535" opacity="0.15" />
          <rect x="0" y="500" width="1440" height="6" fill="#1a1535" opacity="0.12" />

          <!-- ===== CITY SKYLINE SILHOUETTE (distant, on the horizon) ===== -->
          <!-- This connects visually to Scene 3's city -->

          <!-- Far distant city glow (light pollution behind skyline) -->
          <ellipse cx="720" cy="540" rx="500" ry="40" fill="#d4a853" opacity="0.04" filter="url(#s4-glow-lg)" />
          <ellipse cx="720" cy="540" rx="300" ry="25" fill="#d4a853" opacity="0.06" filter="url(#s4-glow)" />
          <g v-once opacity="0.7">
            <rect x="120" y="528" width="8" height="27" fill="#080c1a" />
            <rect x="132" y="522" width="6" height="33" fill="#080c1a" />
            <rect x="133" y="550" width="1.5" height="1" fill="#d4a853" opacity="0.32" />
            <rect x="142" y="530" width="10" height="25" fill="#080c1a" />
            <rect x="158" y="525" width="5" height="30" fill="#080c1a" />
            <rect x="167" y="532" width="8" height="23" fill="#080c1a" />
            <rect x="170" y="534" width="1.5" height="1" fill="#50a0dc" opacity="0.27" />
            <rect x="180" y="518" width="7" height="37" fill="#080c1a" />
            <rect x="192" y="526" width="12" height="29" fill="#080c1a" />
            <rect x="195" y="538" width="1.5" height="1" fill="#50a0dc" opacity="0.25" />
            <rect x="201" y="536" width="1.5" height="1" fill="#d4a853" opacity="0.39" />
            <rect x="210" y="520" width="6" height="35" fill="#080c1a" />
            <rect x="211" y="549" width="1.5" height="1" fill="#d4a853" opacity="0.48" />
            <rect x="220" y="530" width="9" height="25" fill="#080c1a" />
            <rect x="234" y="524" width="5" height="31" fill="#080c1a" />
            <rect x="235" y="551" width="1.5" height="1" fill="#d4a853" opacity="0.50" />
            <rect x="244" y="528" width="7" height="27" fill="#080c1a" />
            <rect x="256" y="515" width="8" height="40" fill="#080c1a" />
            <rect x="268" y="522" width="6" height="33" fill="#080c1a" />
            <rect x="269" y="549" width="1.5" height="1" fill="#d4a853" opacity="0.59" />
            <rect x="270" y="538" width="1.5" height="1" fill="#d4a853" opacity="0.51" />
            <rect x="278" y="530" width="10" height="25" fill="#080c1a" />
            <rect x="281" y="548" width="1.5" height="1" fill="#d4a853" opacity="0.53" />
            <rect x="320" y="520" width="10" height="35" fill="#080c1a" />
            <rect x="335" y="512" width="7" height="43" fill="#080c1a" />
            <rect x="337" y="550" width="1.5" height="1" fill="#50a0dc" opacity="0.36" />
            <rect x="347" y="518" width="12" height="37" fill="#080c1a" />
            <rect x="348" y="522" width="1.5" height="1" fill="#d4a853" opacity="0.40" />
            <rect x="348" y="542" width="1.5" height="1" fill="#50a0dc" opacity="0.25" />
            <rect x="365" y="508" width="6" height="47" fill="#080c1a" />
            <rect x="376" y="515" width="9" height="40" fill="#080c1a" />
            <rect x="390" y="522" width="8" height="33" fill="#080c1a" />
            <rect x="402" y="510" width="5" height="45" fill="#080c1a" />
            <rect x="403" y="521" width="1.5" height="1" fill="#50a0dc" opacity="0.41" />
            <rect x="403" y="543" width="1.5" height="1" fill="#50a0dc" opacity="0.57" />
            <rect x="412" y="520" width="11" height="35" fill="#080c1a" />
            <rect x="428" y="514" width="7" height="41" fill="#080c1a" />
            <rect x="432" y="525" width="1.5" height="1" fill="#d4a853" opacity="0.48" />
            <rect x="470" y="505" width="9" height="50" fill="#080c1a" />
            <rect x="471" y="531" width="1.5" height="1" fill="#50a0dc" opacity="0.24" />
            <rect x="472" y="522" width="1.5" height="1" fill="#50a0dc" opacity="0.28" />
            <rect x="484" y="498" width="7" height="57" fill="#080c1a" />
            <rect x="496" y="508" width="12" height="47" fill="#080c1a" />
            <rect x="497" y="513" width="1.5" height="1" fill="#d4a853" opacity="0.47" />
            <rect x="514" y="495" width="8" height="60" fill="#080c1a" />
            <rect x="528" y="502" width="10" height="53" fill="#080c1a" />
            <rect x="543" y="492" width="7" height="63" fill="#080c1a" />
            <rect x="547" y="526" width="1.5" height="1" fill="#50a0dc" opacity="0.44" />
            <rect x="544" y="524" width="1.5" height="1" fill="#d4a853" opacity="0.37" />
            <rect x="556" y="500" width="9" height="55" fill="#080c1a" />
            <rect x="560" y="514" width="1.5" height="1" fill="#d4a853" opacity="0.44" />
            <rect x="557" y="504" width="1.5" height="1" fill="#d4a853" opacity="0.49" />
            <rect x="590" y="460" width="14" height="95" fill="#080c1a" />
            <rect x="599" y="488" width="1.5" height="1" fill="#d4a853" opacity="0.23" />
            <rect x="610" y="470" width="10" height="85" fill="#080c1a" />
            <rect x="616" y="521" width="1.5" height="1" fill="#50a0dc" opacity="0.38" />
            <rect x="625" y="448" width="18" height="107" fill="#080c1a" />
            <rect x="629" y="533" width="1.5" height="1" fill="#50a0dc" opacity="0.54" />
            <rect x="630" y="461" width="1.5" height="1" fill="#d4a853" opacity="0.33" />
            <rect x="650" y="430" width="12" height="125" fill="#080c1a" />
            <rect x="668" y="410" width="24" height="145" fill="#080c1a" />
            <rect x="698" y="438" width="12" height="117" fill="#080c1a" />
            <rect x="715" y="455" width="16" height="100" fill="#080c1a" />
            <rect x="738" y="468" width="10" height="87" fill="#080c1a" />
            <rect x="754" y="458" width="12" height="97" fill="#080c1a" />
            <rect x="763" y="528" width="1.5" height="1" fill="#50a0dc" opacity="0.59" />
            <rect x="759" y="508" width="1.5" height="1" fill="#d4a853" opacity="0.55" />
            <rect x="780" y="495" width="9" height="60" fill="#080c1a" />
            <rect x="794" y="502" width="7" height="53" fill="#080c1a" />
            <rect x="806" y="492" width="11" height="63" fill="#080c1a" />
            <rect x="822" y="500" width="8" height="55" fill="#080c1a" />
            <rect x="824" y="510" width="1.5" height="1" fill="#50a0dc" opacity="0.57" />
            <rect x="836" y="508" width="10" height="47" fill="#080c1a" />
            <rect x="852" y="498" width="6" height="57" fill="#080c1a" />
            <rect x="855" y="501" width="1.5" height="1" fill="#d4a853" opacity="0.58" />
            <rect x="864" y="506" width="9" height="49" fill="#080c1a" />
            <rect x="867" y="518" width="1.5" height="1" fill="#d4a853" opacity="0.59" />
            <rect x="900" y="512" width="8" height="43" fill="#080c1a" />
            <rect x="901" y="533" width="1.5" height="1" fill="#d4a853" opacity="0.34" />
            <rect x="905" y="514" width="1.5" height="1" fill="#d4a853" opacity="0.38" />
            <rect x="914" y="505" width="10" height="50" fill="#080c1a" />
            <rect x="930" y="515" width="7" height="40" fill="#080c1a" />
            <rect x="934" y="517" width="1.5" height="1" fill="#d4a853" opacity="0.21" />
            <rect x="942" y="508" width="12" height="47" fill="#080c1a" />
            <rect x="960" y="518" width="6" height="37" fill="#080c1a" />
            <rect x="963" y="536" width="1.5" height="1" fill="#d4a853" opacity="0.56" />
            <rect x="961" y="525" width="1.5" height="1" fill="#d4a853" opacity="0.22" />
            <rect x="972" y="510" width="9" height="45" fill="#080c1a" />
            <rect x="986" y="520" width="8" height="35" fill="#080c1a" />
            <rect x="1030" y="522" width="7" height="33" fill="#080c1a" />
            <rect x="1032" y="547" width="1.5" height="1" fill="#50a0dc" opacity="0.28" />
            <rect x="1042" y="516" width="10" height="39" fill="#080c1a" />
            <rect x="1045" y="548" width="1.5" height="1" fill="#d4a853" opacity="0.28" />
            <rect x="1047" y="545" width="1.5" height="1" fill="#d4a853" opacity="0.35" />
            <rect x="1058" y="524" width="6" height="31" fill="#080c1a" />
            <rect x="1070" y="518" width="8" height="37" fill="#080c1a" />
            <rect x="1074" y="526" width="1.5" height="1" fill="#d4a853" opacity="0.51" />
            <rect x="1084" y="526" width="12" height="29" fill="#080c1a" />
            <rect x="1102" y="520" width="5" height="35" fill="#080c1a" />
            <rect x="1112" y="528" width="9" height="27" fill="#080c1a" />
            <rect x="1140" y="525" width="7" height="30" fill="#080c1a" />
            <rect x="1142" y="543" width="1.5" height="1" fill="#d4a853" opacity="0.34" />
            <rect x="1142" y="535" width="1.5" height="1" fill="#50a0dc" opacity="0.52" />
            <rect x="1152" y="518" width="10" height="37" fill="#080c1a" />
            <rect x="1168" y="530" width="8" height="25" fill="#080c1a" />
            <rect x="1171" y="548" width="1.5" height="1" fill="#50a0dc" opacity="0.32" />
            <rect x="1184" y="522" width="6" height="33" fill="#080c1a" />
            <rect x="1186" y="542" width="1.5" height="1" fill="#d4a853" opacity="0.23" />
            <rect x="1200" y="528" width="10" height="27" fill="#080c1a" />
            <rect x="1203" y="548" width="1.5" height="1" fill="#50a0dc" opacity="0.37" />
            <rect x="1218" y="520" width="7" height="35" fill="#080c1a" />
            <rect x="1222" y="550" width="1.5" height="1" fill="#d4a853" opacity="0.47" />
            <rect x="1221" y="537" width="1.5" height="1" fill="#50a0dc" opacity="0.57" />
            <rect x="1232" y="526" width="12" height="29" fill="#080c1a" />
            <rect x="1250" y="530" width="8" height="25" fill="#080c1a" />
            <rect x="1255" y="540" width="1.5" height="1" fill="#d4a853" opacity="0.59" />
            <rect x="1253" y="541" width="1.5" height="1" fill="#50a0dc" opacity="0.40" />
            <rect x="1270" y="524" width="6" height="31" fill="#080c1a" />
            <rect x="1273" y="528" width="1.5" height="1" fill="#50a0dc" opacity="0.33" />
            <rect x="1282" y="528" width="10" height="27" fill="#080c1a" />
            <rect x="1300" y="520" width="8" height="35" fill="#080c1a" />
            <rect x="1316" y="526" width="7" height="29" fill="#080c1a" />
            <rect x="1319" y="539" width="1.5" height="1" fill="#d4a853" opacity="0.25" />
            <!-- Mega tower spire beacon -->
            <line x1="680" y1="410" x2="680" y2="395" stroke="#6878a0" stroke-width="0.8" />
            <circle cx="680" cy="393" r="2" fill="#d4a853" opacity="0.8" class="beacon beacon-2" />
            <circle cx="680" cy="393" r="8" fill="#d4a853" opacity="0.08" filter="url(#s4-glow)" />
            <circle cx="259" cy="513" r="1" fill="#d4a853" opacity="0.5" class="beacon beacon-2" />
            <circle cx="517" cy="493" r="1" fill="#d4a853" opacity="0.5" class="beacon beacon-0" />
            <circle cx="855" cy="496" r="1" fill="#d4a853" opacity="0.5" class="beacon beacon-0" />
            <circle cx="1045" cy="514" r="1" fill="#d4a853" opacity="0.5" class="beacon beacon-0" />
          </g>

          <!-- Horizon glow line -->
          <line x1="0" y1="555" x2="1440" y2="555" stroke="#d4a853" stroke-width="1.5" opacity="0.3" />
          <line x1="0" y1="555" x2="1440" y2="555" stroke="#d4a853" stroke-width="6" opacity="0.06" filter="url(#s4-glow)" />
          <!-- Secondary warm glow -->
          <line x1="200" y1="555" x2="1240" y2="555" stroke="#d08030" stroke-width="10" opacity="0.04" filter="url(#s4-glow-lg)" />

          <!-- Low-lying atmospheric fog layer -->
          <rect x="0" y="540" width="1440" height="20" fill="url(#fog-gradient)" opacity="0.5"/>

          <!-- ===== TERRAIN ===== -->
          <!-- Far terrain (just below horizon) -->
          <path d="M0,570 Q150,558 300,565 Q500,575 720,555 Q940,545 1150,560 Q1320,572 1440,565 L1440,900 L0,900Z" fill="#080c1a" opacity="0.5" />

          <!-- Terrain rocks/texture -->
          <g v-once>
            <circle cx="130" cy="563" r="2" fill="#1a1535" opacity="0.4"/>
            <circle cx="245" cy="562" r="1.5" fill="#0c1225" opacity="0.35"/>
            <circle cx="380" cy="569" r="1.8" fill="#1a1535" opacity="0.38"/>
            <circle cx="510" cy="574" r="2" fill="#0c1225" opacity="0.4"/>
            <circle cx="620" cy="565" r="1.5" fill="#1a1535" opacity="0.35"/>
            <circle cx="750" cy="553" r="1.8" fill="#0c1225" opacity="0.42"/>
            <circle cx="850" cy="549" r="2" fill="#1a1535" opacity="0.38"/>
            <circle cx="960" cy="547" r="1.5" fill="#0c1225" opacity="0.35"/>
            <circle cx="1100" cy="558" r="2" fill="#1a1535" opacity="0.4"/>
            <circle cx="1280" cy="569" r="1.5" fill="#0c1225" opacity="0.35"/>
            <!-- Triangular rock formations at terrain edge -->
            <path d="M155,561 L165,549 L175,561 Z" fill="#1a1535" opacity="0.45"/>
            <path d="M420,570 L432,558 L444,570 Z" fill="#0c1225" opacity="0.4"/>
            <path d="M690,555 L698,543 L706,555 Z" fill="#1a1535" opacity="0.42"/>
            <path d="M1020,550 L1030,538 L1040,550 Z" fill="#0c1225" opacity="0.38"/>
            <!-- Alien vegetation (organic paths) -->
            <path d="M340,566 Q343,558 346,566 Q349,552 352,566" stroke="#1a2545" stroke-width="1.5" fill="none" opacity="0.5"/>
            <path d="M570,568 Q574,558 578,568 Q582,550 586,568" stroke="#1a2545" stroke-width="1.2" fill="none" opacity="0.45"/>
            <path d="M880,548 Q883,540 886,548 Q889,534 892,548" stroke="#1a2545" stroke-width="1.3" fill="none" opacity="0.48"/>
          </g>

          <!-- Landing platform / Spaceport structure (center) -->
          <g v-once opacity="0.35">
            <!-- Main platform -->
            <rect x="550" y="610" width="340" height="6" fill="#0c1225" stroke="#4a5a80" stroke-width="0.6" />
            <line x1="550" y1="610" x2="890" y2="610" stroke="#d4a853" stroke-width="0.8" opacity="0.3" />
            <!-- Platform supports -->
            <line x1="580" y1="616" x2="580" y2="650" stroke="#4a5a80" stroke-width="0.5" />
            <line x1="720" y1="616" x2="720" y2="660" stroke="#4a5a80" stroke-width="0.6" />
            <line x1="860" y1="616" x2="860" y2="650" stroke="#4a5a80" stroke-width="0.5" />
            <!-- Platform edge lights -->
            <circle cx="560" cy="610" r="1.5" fill="#d4a853" opacity="0.5" class="beacon beacon-0" />
            <circle cx="650" cy="610" r="1.2" fill="#50a0dc" opacity="0.4" class="beacon beacon-1" />
            <circle cx="720" cy="610" r="1.5" fill="#d4a853" opacity="0.5" class="beacon beacon-2" />
            <circle cx="790" cy="610" r="1.2" fill="#50a0dc" opacity="0.4" class="beacon beacon-0" />
            <circle cx="880" cy="610" r="1.5" fill="#d4a853" opacity="0.5" class="beacon beacon-1" />
            <!-- Control tower (small, right of platform) -->
            <rect x="900" y="585" width="14" height="25" fill="#0c1225" stroke="#4a5a80" stroke-width="0.4" />
            <rect x="897" y="582" width="20" height="5" fill="none" stroke="#4a5a80" stroke-width="0.3" />
            <circle cx="907" cy="582" r="1" fill="#50a0dc" opacity="0.5" class="beacon beacon-2" />
            <rect x="904" y="592" width="1.5" height="1.5" fill="#d4a853" opacity="0.3" />
            <rect x="904" y="600" width="1.5" height="1.5" fill="#50a0dc" opacity="0.25" />
            <!-- Small outbuildings -->
            <rect x="510" y="600" width="20" height="10" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
            <rect x="515" y="603" width="1" height="1" fill="#d4a853" opacity="0.3" />
            <rect x="940" y="598" width="16" height="12" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
            <rect x="944" y="601" width="1" height="1" fill="#50a0dc" opacity="0.3" />
          </g>

          <!-- Distant structures (left) -->
          <g v-once opacity="0.15">
            <rect x="180" y="572" width="8" height="18" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
            <rect x="195" y="576" width="6" height="14" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
            <circle cx="184" cy="572" r="0.8" fill="#d4a853" opacity="0.4" />
            <rect x="220" y="570" width="10" height="20" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
          </g>
          <!-- Distant structures (right) -->
          <g v-once opacity="0.15">
            <rect x="1150" y="568" width="10" height="22" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
            <rect x="1170" y="574" width="7" height="16" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
            <circle cx="1155" cy="568" r="0.8" fill="#d4a853" opacity="0.4" />
            <rect x="1200" y="572" width="8" height="18" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
            <rect x="1240" y="570" width="12" height="20" fill="#0c1225" stroke="#4a5a80" stroke-width="0.3" />
          </g>

          <!-- Additional distant building outlines -->
          <g v-once opacity="0.12">
            <rect x="55" y="566" width="12" height="19" fill="#150a20"/>
            <rect x="78" y="570" width="8" height="15" fill="#150a20"/>
            <rect x="105" y="563" width="10" height="22" fill="#150a20"/>
            <rect x="1285" y="567" width="10" height="18" fill="#150a20"/>
            <rect x="1330" y="571" width="14" height="14" fill="#150a20"/>
          </g>

          <!-- Spaceport ground detail -->
          <g v-once>
            <!-- Runway dashed markings from launch area -->
            <line x1="150" y1="562" x2="280" y2="562" stroke="#d4a853" stroke-width="1" stroke-dasharray="8,6" opacity="0.25"/>
            <line x1="310" y1="562" x2="440" y2="562" stroke="#d4a853" stroke-width="1" stroke-dasharray="8,6" opacity="0.25"/>
            <!-- Runway edge beacon lights -->
            <circle class="beacon-blink" cx="160" cy="562" r="1.5" fill="#d4a853" opacity="0.6"/>
            <circle class="beacon-blink" cx="190" cy="562" r="1.5" fill="#d4a853" opacity="0.6"/>
            <circle class="beacon-blink" cx="220" cy="562" r="1.5" fill="#d4a853" opacity="0.6"/>
            <circle class="beacon-blink" cx="250" cy="562" r="1.5" fill="#d4a853" opacity="0.6"/>
            <circle class="beacon-blink" cx="330" cy="562" r="1.5" fill="#d4a853" opacity="0.6"/>
            <circle class="beacon-blink" cx="360" cy="562" r="1.5" fill="#d4a853" opacity="0.6"/>
            <circle class="beacon-blink" cx="390" cy="562" r="1.5" fill="#d4a853" opacity="0.6"/>
            <circle class="beacon-blink" cx="420" cy="562" r="1.5" fill="#d4a853" opacity="0.6"/>
            <!-- Fuel storage tanks (left of tower) -->
            <rect x="240" y="558" width="18" height="10" rx="3" fill="#1a2545" stroke="#6878a0" stroke-width="0.5" opacity="0.75"/>
            <rect x="220" y="560" width="14" height="8" rx="2" fill="#1a2545" stroke="#6878a0" stroke-width="0.5" opacity="0.7"/>
            <!-- Supply vehicle near tower base -->
            <rect x="310" y="560" width="20" height="7" rx="1" fill="#2a3555" stroke="#6878a0" stroke-width="0.5" opacity="0.7"/>
            <circle cx="314" cy="567" r="2" fill="#6878a0" opacity="0.6"/>
            <circle cx="326" cy="567" r="2" fill="#6878a0" opacity="0.6"/>
          </g>

          <!-- Mid terrain -->
          <path d="M0,630 Q200,615 400,625 Q600,635 720,610 Q850,595 1050,610 Q1250,625 1440,615 L1440,900 L0,900Z" fill="#060a18" opacity="0.6" />

          <!-- === DUST CLOUDS (expand on launch, platform level) === -->
          <g ref="dustCloudsRef" class="dust-clouds">
            <ellipse cx="200" cy="562" rx="15" ry="6" fill="#8090a0" opacity="0"/>
            <ellipse cx="280" cy="565" rx="12" ry="5" fill="#605040" opacity="0"/>
            <ellipse cx="350" cy="560" rx="18" ry="7" fill="#8090a0" opacity="0"/>
            <ellipse cx="420" cy="563" rx="14" ry="6" fill="#605040" opacity="0"/>
            <ellipse cx="160" cy="568" rx="10" ry="4" fill="#8090a0" opacity="0"/>
            <ellipse cx="480" cy="566" rx="16" ry="6" fill="#605040" opacity="0"/>
          </g>

          <!-- ===== LAUNCH TOWER / GANTRY ===== -->
          <g ref="gantryRef" class="launch-gantry">
            <!-- Main tower shaft -->
            <rect x="290" y="480" width="12" height="80" fill="#1a2545" stroke="#6878a0" stroke-width="0.8" opacity="0.9"/>
            <!-- Tower lattice cross-braces -->
            <line x1="290" y1="490" x2="302" y2="505" stroke="#6878a0" stroke-width="0.7" opacity="0.6"/>
            <line x1="302" y1="490" x2="290" y2="505" stroke="#6878a0" stroke-width="0.7" opacity="0.6"/>
            <line x1="290" y1="510" x2="302" y2="525" stroke="#6878a0" stroke-width="0.7" opacity="0.6"/>
            <line x1="302" y1="510" x2="290" y2="525" stroke="#6878a0" stroke-width="0.7" opacity="0.6"/>
            <line x1="290" y1="530" x2="302" y2="545" stroke="#6878a0" stroke-width="0.7" opacity="0.6"/>
            <line x1="302" y1="530" x2="290" y2="545" stroke="#6878a0" stroke-width="0.7" opacity="0.6"/>
            <!-- Tower top platform -->
            <rect x="284" y="478" width="24" height="4" fill="#1a2545" stroke="#6878a0" stroke-width="0.6" opacity="0.9"/>
            <!-- Service crane arm (horizontal, pointing toward spacecraft) -->
            <line x1="302" y1="482" x2="330" y2="482" stroke="#6878a0" stroke-width="1.2" opacity="0.7"/>
            <!-- Tower base (wider) -->
            <rect x="287" y="558" width="18" height="6" fill="#1a2545" stroke="#6878a0" stroke-width="0.6" opacity="0.9"/>
            <!-- Red warning beacon at top -->
            <circle cx="296" cy="476" r="2.5" fill="#ff3030" opacity="0.9" class="beacon-blink"/>
            <circle cx="296" cy="476" r="5" fill="#ff3030" opacity="0.15" class="beacon-blink"/>
            <!-- Fuel lines from tower base to platform -->
            <path d="M 302,558 Q 320,558 330,554" fill="none" stroke="#d4a853" stroke-width="0.8" opacity="0.18"/>
            <path d="M 302,562 Q 322,562 332,558" fill="none" stroke="#d4a853" stroke-width="0.8" opacity="0.15"/>
          </g>

          <!-- Primary umbilical arm -->
          <g ref="umbilicalArmRef" style="transform-origin: 302px 510px">
            <line x1="302" y1="510" x2="335" y2="510" stroke="#d4a853" stroke-width="1.5" opacity="0.6"/>
            <rect x="333" y="507" width="4" height="6" rx="1" fill="#d4a853" opacity="0.5"/>
          </g>

          <!-- Secondary umbilical arm (lower) -->
          <g ref="secondaryArmRef" style="transform-origin: 302px 530px">
            <line x1="302" y1="530" x2="332" y2="530" stroke="#6878a0" stroke-width="1.2" opacity="0.5"/>
            <rect x="330" y="527" width="3" height="6" rx="1" fill="#6878a0" opacity="0.4"/>
          </g>

          <!-- === SMOKE COLUMNS (rising from blast area) === -->
          <g ref="smokeColumnsRef" class="smoke-columns">
            <ellipse cx="230" cy="540" rx="8" ry="40" fill="#1a1535" opacity="0"/>
            <ellipse cx="290" cy="535" rx="10" ry="50" fill="#2a2040" opacity="0"/>
            <ellipse cx="360" cy="538" rx="9" ry="45" fill="#1a1535" opacity="0"/>
            <ellipse cx="410" cy="542" rx="7" ry="35" fill="#2a2040" opacity="0"/>
          </g>

          <!-- === ENGINE IGNITION FLASH (brief bright flash at takeoff point) === -->
          <g ref="ignitionFlashRef" opacity="0">
            <ellipse cx="340" cy="560" rx="200" ry="120" fill="#d4a853" opacity="0.15" filter="url(#s4-glow-lg)" />
            <ellipse cx="340" cy="560" rx="100" ry="60" fill="#ffd080" opacity="0.25" filter="url(#s4-glow-lg)" />
            <ellipse cx="340" cy="560" rx="40" ry="25" fill="#fffef0" opacity="0.4" filter="url(#s4-glow)" />
          </g>

          <!-- === HEAT SHIMMER (above exhaust — opacity/scaleX only, CSS+GSAP) === -->
          <rect class="heat-shimmer" x="290" y="490" width="20" height="60" fill="none" stroke="rgba(212,168,83,0.03)" opacity="0"/>
          <rect class="heat-shimmer" x="305" y="495" width="15" height="50" fill="none" stroke="rgba(212,168,83,0.02)" opacity="0"/>
          <rect class="heat-shimmer" x="320" y="488" width="12" height="55" fill="none" stroke="rgba(212,168,83,0.02)" opacity="0"/>

          <!-- === LAUNCH BLAST (ground level at launchpad, does NOT move) === -->
          <g ref="launchBlastRef" opacity="0">
            <!-- Shockwave rings centered on pad -->
            <ellipse cx="380" cy="625" rx="200" ry="22" fill="none" stroke="#d4a853" stroke-width="1.5" opacity="0.15" class="blast-ring blast-ring-1" />
            <ellipse cx="380" cy="625" rx="130" ry="15" fill="none" stroke="#d08030" stroke-width="1" opacity="0.25" class="blast-ring blast-ring-2" />
            <ellipse cx="380" cy="625" rx="70" ry="9" fill="none" stroke="#d4a853" stroke-width="0.7" opacity="0.35" class="blast-ring blast-ring-3" />
            <!-- Ground illumination -->
            <ellipse cx="380" cy="625" rx="180" ry="20" fill="#d4a853" opacity="0.1" filter="url(#s4-glow-lg)" />
            <ellipse cx="380" cy="625" rx="90" ry="12" fill="#d08030" opacity="0.18" filter="url(#s4-glow)" />
            <ellipse cx="380" cy="625" rx="35" ry="6" fill="#ffd080" opacity="0.3" />
            <!-- Smoke/steam billowing out -->
            <rect x="330" y="582" width="16" height="48" fill="#2a2040" opacity="0.18" rx="8" filter="url(#s4-glow)" />
            <rect x="414" y="580" width="14" height="50" fill="#2a2040" opacity="0.15" rx="7" filter="url(#s4-glow)" />
            <rect x="300" y="590" width="12" height="38" fill="#1a1530" opacity="0.1" rx="6" filter="url(#s4-glow)" />
            <rect x="448" y="588" width="12" height="40" fill="#1a1530" opacity="0.1" rx="6" filter="url(#s4-glow)" />
            <!-- Sparks flying from pad -->
            <circle cx="350" cy="612" r="1.5" fill="#d4a853" opacity="0.7" class="spark spark-1" />
            <circle cx="420" cy="610" r="1.3" fill="#d08030" opacity="0.6" class="spark spark-2" />
            <circle cx="320" cy="618" r="1.1" fill="#ffd080" opacity="0.5" class="spark spark-3" />
            <circle cx="450" cy="615" r="1.4" fill="#d4a853" opacity="0.5" class="spark spark-4" />
            <circle cx="370" cy="605" r="1" fill="#ffd080" opacity="0.6" class="spark spark-5" />
            <circle cx="400" cy="603" r="1.2" fill="#d08030" opacity="0.5" class="spark spark-6" />
          </g>

          <!-- === CONTRAIL / WAKE (stays on screen as ship flies away) === -->
          <g ref="contrailRef" opacity="0">
            <!-- Long diagonal contrail from launch point toward upper-right -->
            <!-- This is in scene (world) coordinates, not ship-local -->
            <line x1="280" y1="600" x2="900" y2="300" stroke="#d4a853" stroke-width="3" opacity="0.06" filter="url(#s4-glow-lg)" />
            <line x1="290" y1="595" x2="880" y2="310" stroke="#d08030" stroke-width="2" opacity="0.08" filter="url(#s4-glow)" />
            <line x1="300" y1="590" x2="850" y2="320" stroke="#ffd080" stroke-width="1" opacity="0.1" />
            <!-- Contrail dissipating wisps -->
            <ellipse cx="450" cy="520" rx="60" ry="8" transform="rotate(-28,450,520)" fill="#d4a853" opacity="0.04" filter="url(#s4-glow-lg)" />
            <ellipse cx="600" cy="440" rx="50" ry="6" transform="rotate(-28,600,440)" fill="#d4a853" opacity="0.03" filter="url(#s4-glow-lg)" />
            <ellipse cx="750" cy="365" rx="40" ry="5" transform="rotate(-28,750,365)" fill="#d08030" opacity="0.03" filter="url(#s4-glow-lg)" />
          </g>

          <!-- === SPACECRAFT (Berkey/Mead style — sleek, angular, horizontal) === -->
          <!-- Positioned left, angled toward upper-right (~-25°) -->
          <!-- GSAP moves entire group diagonally: +x, -y -->
          <g ref="saucerRef" opacity="0">
            <g class="spacecraft-float">
            <g transform="translate(340,560) rotate(-25)">

              <!-- ~~~ ENGINE EXHAUST (in separate ref for scale animation) ~~~ -->
              <g ref="exhaustRef" opacity="0">
                <!-- Wide outer glow trail -->
                <ellipse cx="-200" cy="0" rx="120" ry="32" fill="#d08030" opacity="0.08" filter="url(#s4-glow-lg)" />
                <!-- Outer trail (wide, fiery) -->
                <path d="M-95,0 Q-180,-18 -360,-10 Q-180,18 -95,0Z" fill="#d08030" opacity="0.1" filter="url(#s4-glow-lg)" />
                <!-- Main exhaust stream (bright orange) -->
                <path d="M-95,-5 Q-170,-16 -320,-9 Q-170,16 -95,5Z" fill="#d4a853" opacity="0.22" />
                <!-- Hot inner trail (yellow) -->
                <path d="M-95,-3 Q-145,-10 -250,-6 Q-145,10 -95,3Z" fill="#ffd080" opacity="0.35" />
                <!-- White-hot core stream -->
                <path d="M-95,-2 Q-125,-5 -190,-3 Q-125,5 -95,2Z" fill="#fff0c0" opacity="0.5" />
                <!-- Brightest near nozzle -->
                <path d="M-95,0 Q-108,-2 -140,-1 Q-108,2 -95,0Z" fill="#fffef0" opacity="0.6" />
                <!-- Turbulence wisps (flicker edges) -->
                <path d="M-150,-12 Q-200,-22 -300,-16" fill="none" stroke="#d4a853" stroke-width="1.5" opacity="0.12" />
                <path d="M-150,12 Q-200,22 -300,16" fill="none" stroke="#d4a853" stroke-width="1.5" opacity="0.12" />
                <path d="M-200,-8 Q-260,-15 -340,-10" fill="none" stroke="#d08030" stroke-width="1" opacity="0.06" />
                <path d="M-200,8 Q-260,15 -340,10" fill="none" stroke="#d08030" stroke-width="1" opacity="0.06" />
                <!-- Exhaust sparks -->
                <circle cx="-200" cy="-10" r="2" fill="#ffd080" opacity="0.25" class="spark spark-1" />
                <circle cx="-260" cy="6" r="2.5" fill="#d4a853" opacity="0.18" class="spark spark-2" />
                <circle cx="-320" cy="-4" r="3" fill="#d08030" opacity="0.12" class="spark spark-3" />
                <circle cx="-180" cy="12" r="1.8" fill="#ffd080" opacity="0.2" class="spark spark-4" />
                <!-- Engine nozzle glow (intensifies with thrust) -->
                <circle cx="-96" cy="-10" r="14" fill="#d4a853" opacity="0.15" filter="url(#s4-glow)" />
                <circle cx="-96" cy="10" r="14" fill="#d4a853" opacity="0.15" filter="url(#s4-glow)" />
                <circle cx="-96" cy="0" r="20" fill="#d08030" opacity="0.06" filter="url(#s4-glow-lg)" />
              </g>

              <!-- ~~~ MAIN HULL (angular, elongated ~220px long) ~~~ -->
              <!-- Primary fuselage — sleek angular shape -->
              <path d="M110,0 L95,-10 L50,-14 L-60,-16 L-90,-12 L-90,12 L-60,16 L50,14 L95,10Z"
                    fill="#1a2545" stroke="#6878a0" stroke-width="1.2" />
              <!-- Upper hull highlight -->
              <path d="M105,-3 L95,-9 L50,-13 L-55,-15 L-60,-14 L50,-10 L95,-6Z"
                    fill="#2a3868" opacity="0.5" />
              <!-- Lower hull shadow -->
              <path d="M95,8 L50,12 L-55,14 L-88,11 L-88,12 L-55,15 L50,13 L95,9Z"
                    fill="#0e1528" opacity="0.4" />
              <!-- Mid-body ridge -->
              <line x1="90" y1="-8" x2="-85" y2="-12" stroke="#8898b8" stroke-width="0.6" opacity="0.3" />

              <!-- Hull panel lines -->
              <line x1="70" y1="-12" x2="70" y2="12" stroke="#6878a0" stroke-width="0.5" opacity="0.3" />
              <line x1="30" y1="-14" x2="30" y2="14" stroke="#6878a0" stroke-width="0.5" opacity="0.3" />
              <line x1="-15" y1="-15" x2="-15" y2="15" stroke="#6878a0" stroke-width="0.4" opacity="0.25" />
              <line x1="-55" y1="-16" x2="-55" y2="16" stroke="#6878a0" stroke-width="0.4" opacity="0.25" />
              <line x1="90" y1="0" x2="-85" y2="0" stroke="#6878a0" stroke-width="0.3" opacity="0.15" />

              <!-- ~~~ COCKPIT / NOSE ~~~ -->
              <path d="M110,0 L95,-10 L95,-5 L108,0 L95,5 L95,10Z"
                    fill="#1e3050" stroke="#6878a0" stroke-width="0.7" />
              <path d="M107,0 L96,-7 L96,-3 L105,0Z" fill="#50a0dc" opacity="0.4" />
              <path d="M104,0 L97,-4 L97,-1 L102,0Z" fill="#80d0ff" opacity="0.2" />
              <path d="M107,0 L96,7 L96,3 L105,0Z" fill="#3080b0" opacity="0.25" />
              <circle cx="110" cy="0" r="1.8" fill="#d4a853" opacity="0.8" />

              <!-- ~~~ SWEPT-BACK DELTA WINGS ~~~ -->
              <!-- Starboard wing -->
              <path d="M35,-14 L-10,-16 L-75,-58 L-65,-52 L5,-16Z"
                    fill="#1a2545" stroke="#6878a0" stroke-width="0.9" />
              <path d="M30,-15 L-5,-17 L-65,-52 L-58,-48 L10,-17Z"
                    fill="#243060" opacity="0.35" />
              <line x1="-10" y1="-16" x2="-73" y2="-57" stroke="#d4a853" stroke-width="0.7" opacity="0.25" />
              <line x1="15" y1="-15" x2="-40" y2="-36" stroke="#6878a0" stroke-width="0.3" opacity="0.2" />
              <!-- Port wing -->
              <path d="M35,14 L-10,16 L-75,58 L-65,52 L5,16Z"
                    fill="#1a2545" stroke="#6878a0" stroke-width="0.9" />
              <path d="M30,15 L-5,17 L-65,52 L-58,48 L10,17Z"
                    fill="#0e1528" opacity="0.35" />
              <line x1="-10" y1="16" x2="-73" y2="57" stroke="#d08030" stroke-width="0.7" opacity="0.25" />
              <line x1="15" y1="15" x2="-40" y2="36" stroke="#6878a0" stroke-width="0.3" opacity="0.2" />
              <!-- Canard fins -->
              <path d="M75,-10 L60,-11 L48,-26 L54,-20 L70,-11Z"
                    fill="#1a2545" stroke="#6878a0" stroke-width="0.5" />
              <path d="M75,10 L60,11 L48,26 L54,20 L70,11Z"
                    fill="#1a2545" stroke="#6878a0" stroke-width="0.5" />

              <!-- ~~~ ENGINE NACELLES ~~~ -->
              <rect x="-96" y="-14" width="16" height="9" rx="2" fill="#1e2840" stroke="#6878a0" stroke-width="0.7" />
              <rect x="-98" y="-13" width="5" height="7" rx="1" fill="#d4a853" opacity="0.7" />
              <rect x="-96" y="5" width="16" height="9" rx="2" fill="#1e2840" stroke="#6878a0" stroke-width="0.7" />
              <rect x="-98" y="6" width="5" height="7" rx="1" fill="#d4a853" opacity="0.7" />

              <!-- ~~~ HULL DETAILS ~~~ -->
              <rect x="35" y="-12" width="5" height="4" rx="0.5" fill="#d4a853" opacity="0.25" />
              <rect x="35" y="8" width="5" height="4" rx="0.5" fill="#d08030" opacity="0.2" />
              <line x1="60" y1="-12" x2="64" y2="-20" stroke="#6878a0" stroke-width="0.5" opacity="0.4" />
              <circle cx="64" cy="-20" r="1.2" fill="#50a0dc" opacity="0.4" />
              <path d="M-30,16 L-35,24 L-45,22 L-40,16Z" fill="#1a2545" stroke="#6878a0" stroke-width="0.4" opacity="0.6" />

              <!-- ~~~ RUNNING LIGHTS ~~~ -->
              <circle cx="110" cy="0" r="2.5" fill="#d4a853" opacity="0.9" class="beacon beacon-2" />
              <circle cx="110" cy="0" r="9" fill="#d4a853" opacity="0.08" filter="url(#s4-glow)" />
              <circle cx="-73" cy="-57" r="2" fill="#d4a853" opacity="0.8" class="beacon beacon-0" />
              <circle cx="-73" cy="-57" r="7" fill="#d4a853" opacity="0.06" filter="url(#s4-glow)" />
              <circle cx="-73" cy="57" r="2" fill="#d08030" opacity="0.8" class="beacon beacon-1" />
              <circle cx="-73" cy="57" r="7" fill="#d08030" opacity="0.06" filter="url(#s4-glow)" />

              <!-- Ambient glow -->
              <ellipse cx="0" cy="0" rx="90" ry="35" fill="#6878a0" opacity="0.04" filter="url(#s4-glow-lg)" />
            </g>
            </g> <!-- /spacecraft-float -->
          </g>

          <!-- Foreground terrain -->
          <path d="M0,660 Q180,648 350,655 Q550,665 720,640 Q900,620 1100,635 Q1300,650 1440,642 L1440,900 L0,900Z" fill="#0e0616" />

          <!-- Terrain texture (alien vegetation) -->
          <g v-once opacity="0.08">
            <path d="M160,655 Q163,635 166,655" fill="none" stroke="#406050" stroke-width="0.5" />
            <path d="M172,653 Q175,638 178,653" fill="none" stroke="#406050" stroke-width="0.4" />
            <path d="M350,658 Q353,640 356,658" fill="none" stroke="#406050" stroke-width="0.5" />
            <path d="M1150,640 Q1153,622 1156,640" fill="none" stroke="#406050" stroke-width="0.5" />
            <path d="M1165,638 Q1168,618 1171,638" fill="none" stroke="#406050" stroke-width="0.4" />
            <path d="M500,660 Q502,645 504,660" fill="none" stroke="#406050" stroke-width="0.4" />
            <path d="M950,630 Q952,615 954,630" fill="none" stroke="#406050" stroke-width="0.4" />
          </g>

          <!-- Foreground rocks / debris -->
          <g v-once opacity="0.1">
            <ellipse cx="80" cy="670" rx="12" ry="5" fill="#0c1225" stroke="#3a4a60" stroke-width="0.3" transform="rotate(-8,80,670)" />
            <ellipse cx="1380" cy="660" rx="15" ry="6" fill="#0c1225" stroke="#3a4a60" stroke-width="0.3" transform="rotate(5,1380,660)" />
            <ellipse cx="300" cy="662" rx="8" ry="3" fill="#0c1225" stroke="#3a4a60" stroke-width="0.2" />
            <ellipse cx="1100" cy="640" rx="10" ry="4" fill="#0c1225" stroke="#3a4a60" stroke-width="0.2" transform="rotate(-12,1100,640)" />
          </g>

          <!-- Ground-level subtle path lights (leading to launch pad) -->
          <g v-once opacity="0.15">
            <circle cx="420" cy="640" r="1" fill="#d4a853" />
            <circle cx="460" cy="635" r="1" fill="#d4a853" opacity="0.8" />
            <circle cx="500" cy="628" r="1" fill="#d4a853" opacity="0.6" />
            <circle cx="540" cy="622" r="1.2" fill="#d4a853" opacity="0.5" />
            <circle cx="580" cy="618" r="1.2" fill="#d4a853" opacity="0.4" />
            <circle cx="620" cy="615" r="1" fill="#d4a853" opacity="0.3" />
            <!-- Right side -->
            <circle cx="1020" cy="630" r="1" fill="#d4a853" />
            <circle cx="980" cy="626" r="1" fill="#d4a853" opacity="0.8" />
            <circle cx="940" cy="620" r="1" fill="#d4a853" opacity="0.6" />
            <circle cx="900" cy="616" r="1.2" fill="#d4a853" opacity="0.5" />
            <circle cx="860" cy="614" r="1.2" fill="#d4a853" opacity="0.4" />
            <circle cx="820" cy="612" r="1" fill="#d4a853" opacity="0.3" />
          </g>
          </g> <!-- /scene4ContainerRef -->
        </svg>

        <!-- Data readout -->
        <div class="data-readout absolute top-16 right-6 sm:right-10 text-right">
          <span class="beacon-dot" /> TRAJECTORY SET <span class="mx-1 text-[#d4a853]/15">//</span> LAUNCH READY
        </div>

        <!-- Countdown overlay -->
        <div ref="countdownRef" class="countdown-overlay absolute bottom-20 left-8 sm:left-12 pointer-events-none z-40 font-mono text-4xl font-bold text-[#d4a853] retro-glow">5</div>

        <!-- Text + CTA -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-50" style="margin-top: -14%">
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 retro-title">{{ $t('home.scene4Title') }}</h2>
          <p class="text-gray-300 text-sm sm:text-base max-w-lg mb-10 font-light" v-html="$t('home.scene4Subtitle')"></p>
          <NuxtLinkLocale to="/rendez-vous" class="cta-btn">
            {{ $t('home.ctaButton') }}
          </NuxtLinkLocale>
        </div>
        <!-- Footer -->
        <div class="absolute bottom-6 left-0 right-0 text-center">
          <p class="text-[0.6rem] text-gray-600 tracking-wider">
            &copy; {{ new Date().getFullYear() }} {{ client.name }} &mdash; {{ contact.email }}
          </p>
        </div>
      </div>

      <!-- ==================== POST-PROCESSING OVERLAYS ==================== -->

      <!-- Film grain (SVG feTurbulence) -->
      <svg v-once class="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] mix-blend-overlay" aria-hidden="true">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>

      <!-- CRT Scanlines -->
      <div class="absolute inset-0 pointer-events-none scanlines" aria-hidden="true" />
      <!-- Vignette -->
      <div class="absolute inset-0 pointer-events-none vignette" aria-hidden="true" />

      <!-- Scan bar -->
      <div class="scan-bar pointer-events-none" aria-hidden="true" />

      <!-- Viewport frame corners -->
      <div v-once class="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        <div class="absolute top-8 left-8 w-10 h-10 border-t border-l border-[#d4a853]/[0.12]" />
        <div class="absolute top-8 right-8 w-10 h-10 border-t border-r border-[#d4a853]/[0.12]" />
        <div class="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-[#d4a853]/[0.12]" />
        <div class="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-[#d4a853]/[0.12]" />
        <div class="absolute top-8 left-[72px] right-[72px] h-px bg-gradient-to-r from-[#d4a853]/[0.06] via-transparent to-[#d4a853]/[0.06]" />
        <div class="absolute bottom-8 left-[72px] right-[72px] h-px bg-gradient-to-r from-[#d4a853]/[0.06] via-transparent to-[#d4a853]/[0.06]" />
      </div>

      </template>

      <!-- Status indicators -->
      <div class="absolute bottom-10 left-6 sm:left-10 flex items-center gap-1.5 pointer-events-none z-10" aria-hidden="true">
        <span class="indicator-dot indicator-0" />
        <span class="indicator-dot indicator-1" />
        <span class="indicator-dot indicator-2" />
      </div>

    </div>
    <!-- END FIXED VIEWPORT -->
    </ClientOnly>

    <!-- ====== SCROLL DRIVER ====== -->
    <ClientOnly>
      <template #fallback>
        <div style="height: 600vh" />
      </template>
      <div ref="driverRef" style="height: 600vh" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { NuxtLinkLocale } from '#components'
import { useParallaxData } from '~/composables/useParallaxData'
import { useScrollAnimations } from '~/composables/useScrollAnimations'
import { useSceneTransitions } from '~/composables/useSceneTransitions'
import { useLaunchSequence } from '~/composables/useLaunchSequence'

// === CLIENT CONFIG ===
const { client, contact } = useClientConfig()
const { locale } = useI18n()

// === TEMPLATE REFS ===
const viewportRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const starsRef = ref<SVGElement | null>(null)
const dustRef = ref<SVGElement | null>(null)
const warmBgRef = ref<HTMLElement | null>(null)
const raysRef = ref<SVGGElement | null>(null)
const scene1Ref = ref<HTMLElement | null>(null)
const scene2Ref = ref<HTMLElement | null>(null)
const scene3Ref = ref<HTMLElement | null>(null)
const scene4Ref = ref<HTMLElement | null>(null)
const constSvg = ref<SVGElement | null>(null)
const buildingsGroup = ref<SVGGElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const scrollIndRef = ref<HTMLElement | null>(null)
const horizonGlow = ref<HTMLElement | null>(null)
const horizonRaysRef = ref<SVGGElement | null>(null)
const shipRef = ref<SVGGElement | null>(null)
const saucerRef = ref<SVGGElement | null>(null)
const exhaustRef = ref<SVGGElement | null>(null)
const ignitionFlashRef = ref<SVGGElement | null>(null)
const contrailRef = ref<SVGGElement | null>(null)
const launchBlastRef = ref<SVGGElement | null>(null)
const gantryRef = ref<SVGGElement | null>(null)
const umbilicalArmRef = ref<SVGGElement | null>(null)
const secondaryArmRef = ref<SVGGElement | null>(null)
const countdownRef = ref<HTMLElement | null>(null)
const dustCloudsRef = ref<SVGGElement | null>(null)
const smokeColumnsRef = ref<SVGGElement | null>(null)
const scene4ContainerRef = ref<SVGGElement | null>(null)
const saturnGroupRef = ref<SVGGElement | null>(null)
const ringDustRef = ref<SVGGElement | null>(null)
const planetGridRef = ref<SVGElement | null>(null)
const driverRef = ref<HTMLElement | null>(null)

// === COMPOSABLES ===
const { hasAnimations } = useFeatures()

const {
  stars, brightStars, dustParticles, ringDustParticles,
  asteroids, constNodes, constEdges, tendrils, orbitalParticles,
  gridH, gridV, services, COS_TILT, SIN_TILT,
} = useParallaxData()

// === LIFECYCLE ===
let gsapCtx: { revert: () => void } | null = null
const scenesReady = ref(false)

onMounted(async () => {
  if (!hasAnimations.value) return
  const gsapModule = await useGsap()
  if (!gsapModule) return
  const { gsap } = gsapModule

  await nextTick()

  // PHASE 1: Background animations — Scene 1 is already in DOM
  gsapCtx = gsap.context(() => {
    useScrollAnimations({
      gsap, driverRef, progressRef, starsRef, dustRef, saturnGroupRef,
      warmBgRef, scrollIndRef, raysRef, ringDustRef, planetGridRef,
      ringDustParticles, COS_TILT, SIN_TILT,
    })
  })

  // PHASE 2: Defer scene mount + scene animations until browser is idle
  // Safari fallback: requestIdleCallback is not available in Safari
  const scheduleDeferred = (typeof window !== 'undefined' && 'requestIdleCallback' in window)
    ? (cb: () => void) => window.requestIdleCallback(cb)
    : (cb: () => void) => setTimeout(cb, 1)

  scheduleDeferred(async () => {
    scenesReady.value = true
    await nextTick() // Wait for Vue to render scenes 2-4

    const sceneCtx = gsap.context(() => {
      useSceneTransitions({
        gsap, driverRef, scene1Ref, scene2Ref, scene3Ref, scene4Ref,
        constSvg, buildingsGroup, shipRef, cardsRef, horizonGlow, horizonRaysRef,
      })

      useLaunchSequence({
        gsap, driverRef, ignitionFlashRef, launchBlastRef, saucerRef, exhaustRef, contrailRef, umbilicalArmRef, secondaryArmRef, countdownRef, dustCloudsRef, smokeColumnsRef, scene4ContainerRef,
      })
    })

    // Combine cleanup — both contexts cleaned up on unmount
    const bgRevert = gsapCtx?.revert.bind(gsapCtx)
    gsapCtx = {
      revert() {
        sceneCtx?.revert()
        bgRevert?.()
      },
    }
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped>
@import '@/assets/css/parallax-animations.css';
/* ===== SATURN RING ANIMATIONS ===== */

/* Ring band dash flow (creates spinning dust illusion) */
@keyframes ring-dash-flow-1 {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -300; }
}
@keyframes ring-dash-flow-2 {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -220; }
}
@keyframes ring-dash-flow-3 {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -150; }
}
@keyframes ring-dash-flow-4 {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -120; }
}
.ring-flow-1 { animation: ring-dash-flow-1 80s linear infinite; }
.ring-flow-2 { animation: ring-dash-flow-2 65s linear infinite; }
.ring-flow-3 { animation: ring-dash-flow-3 50s linear infinite; }
.ring-flow-4 { animation: ring-dash-flow-4 40s linear infinite; }

/* Dust particle shimmer (opacity pulse) */
@keyframes dust-shimmer {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}
@keyframes dust-shimmer-2 {
  0%, 100% { opacity: 0.15; }
  40% { opacity: 0.35; }
  70% { opacity: 0.1; }
}
.ring-dust-shimmer { animation: dust-shimmer 4s ease-in-out infinite; }
.ring-dust-shimmer-2 { animation: dust-shimmer-2 6s ease-in-out infinite; }


/* ===== POST-PROCESSING ===== */

.scanlines {
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 4px);
}
.vignette {
  background: radial-gradient(ellipse at center, transparent 25%, rgba(5, 8, 22, 0.4) 55%, rgba(5, 5, 15, 0.7) 100%);
}

/* Sweeping scan bar */
.scan-bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 5%, rgba(212, 168, 83, 0.04) 25%, rgba(212, 168, 83, 0.1) 50%, rgba(212, 168, 83, 0.04) 75%, transparent 95%);
  animation: scan-sweep 10s linear infinite;
  z-index: 8;
}
@keyframes scan-sweep {
  0% { top: -2px; }
  100% { top: 100%; }
}

/* ===== RETRO TYPOGRAPHY ===== */

.retro-title {
  text-shadow:
    -1.5px 0 rgba(255, 60, 60, 0.1),
    1.5px 0 rgba(60, 120, 255, 0.1),
    0 0 80px rgba(212, 168, 83, 0.12);
}
.retro-glow {
  text-shadow: 0 0 20px rgba(212, 168, 83, 0.4), 0 0 60px rgba(212, 168, 83, 0.12);
}

/* ===== DATA READOUT ===== */

.data-readout {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(212, 168, 83, 0.2);
  z-index: 5;
}
.beacon-dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d4a853;
  vertical-align: middle;
  margin-right: 4px;
  animation: beacon-pulse 2s ease-in-out infinite;
}

/* Status indicators */
.indicator-dot {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d4a853;
}
.indicator-0 { animation: beacon-pulse 2s ease-in-out infinite; }
.indicator-1 { animation: beacon-pulse 2.5s ease-in-out infinite 0.4s; }
.indicator-2 { animation: beacon-pulse 3s ease-in-out infinite 0.8s; }

/* ===== SERVICE CARDS ===== */

.svc-card {
  background: rgba(5, 8, 22, 0.85);
  border: 1px solid rgba(212, 168, 83, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 2px;
  padding: 1.75rem;
  position: relative;
}
.svc-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.2), transparent);
}

/* ===== LAUNCH EFFECTS ===== */

/* Blast shockwave rings */
@keyframes blast-expand-1 {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.3); opacity: 0.05; }
}
@keyframes blast-expand-2 {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.2); opacity: 0.08; }
}
@keyframes blast-expand-3 {
  0%, 100% { transform: scale(1); opacity: 0.25; }
  50% { transform: scale(1.15); opacity: 0.1; }
}
.blast-ring-1 { animation: blast-expand-1 2s ease-in-out infinite; transform-origin: center; }
.blast-ring-2 { animation: blast-expand-2 1.8s ease-in-out infinite 0.3s; transform-origin: center; }
.blast-ring-3 { animation: blast-expand-3 1.5s ease-in-out infinite 0.6s; transform-origin: center; }

/* Spacecraft floating/bobbing animation */
@keyframes spacecraft-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.spacecraft-float {
  animation: spacecraft-float 3s ease-in-out infinite;
  transform-origin: center center;
}

/* Sparks flying outward */
@keyframes spark-fly-1 { 0%,100% { transform: translate(0,0); opacity: 0.6; } 50% { transform: translate(-15px, -8px); opacity: 0; } }
@keyframes spark-fly-2 { 0%,100% { transform: translate(0,0); opacity: 0.5; } 50% { transform: translate(12px, -10px); opacity: 0; } }
@keyframes spark-fly-3 { 0%,100% { transform: translate(0,0); opacity: 0.4; } 50% { transform: translate(-20px, -5px); opacity: 0; } }
@keyframes spark-fly-4 { 0%,100% { transform: translate(0,0); opacity: 0.5; } 50% { transform: translate(18px, -6px); opacity: 0; } }
@keyframes spark-fly-5 { 0%,100% { transform: translate(0,0); opacity: 0.45; } 50% { transform: translate(-8px, -14px); opacity: 0; } }
@keyframes spark-fly-6 { 0%,100% { transform: translate(0,0); opacity: 0.4; } 50% { transform: translate(10px, -12px); opacity: 0; } }
.spark-1 { animation: spark-fly-1 1.2s ease-out infinite; }
.spark-2 { animation: spark-fly-2 1.4s ease-out infinite 0.2s; }
.spark-3 { animation: spark-fly-3 1.1s ease-out infinite 0.4s; }
.spark-4 { animation: spark-fly-4 1.3s ease-out infinite 0.1s; }
.spark-5 { animation: spark-fly-5 1.0s ease-out infinite 0.5s; }
.spark-6 { animation: spark-fly-6 1.5s ease-out infinite 0.3s; }

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
  color: #0e0616;
  transition: all 0.3s ease;
  position: relative;
}
.cta-btn::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1px solid rgba(212, 168, 83, 0.25);
  border-radius: 3px;
  pointer-events: none;
}
.cta-btn:hover {
  box-shadow: 0 0 40px rgba(212, 168, 83, 0.4), 0 0 80px rgba(212, 168, 83, 0.15);
  transform: translateY(-2px);
}

/* ===== ANIMATIONS ===== */

/* Twinkle */
@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
.tw-0 { animation: twinkle 3s ease-in-out infinite; }
.tw-1 { animation: twinkle 4.5s ease-in-out infinite 0.7s; }
.tw-2 { animation: twinkle 2.8s ease-in-out infinite 1.4s; }

/* Shooting stars */
@keyframes shoot {
  0% { transform: translate(0, 0) rotate(-35deg) scaleX(0); opacity: 0; }
  5% { opacity: 1; transform: translate(0, 0) rotate(-35deg) scaleX(1); }
  15% { transform: translate(-300px, 180px) rotate(-35deg) scaleX(1); opacity: 0; }
  100% { opacity: 0; }
}
.shooting-star {
  position: absolute;
  top: 12%;
  right: 18%;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ffffff80, #ffffff);
  border-radius: 1px;
  animation: shoot 8s ease-out infinite;
  opacity: 0;
}
.shooting-star-2 {
  top: 28%;
  right: 40%;
  width: 50px;
  animation: shoot 12s ease-out infinite 5s;
}
.shooting-star-3 {
  top: 55%;
  right: 25%;
  width: 60px;
  animation: shoot 15s ease-out infinite 9s;
}

/* Floating dust */
@keyframes dust-d0 {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(8px, -12px); }
  50% { transform: translate(-5px, -6px); }
  75% { transform: translate(3px, 8px); }
}
@keyframes dust-d1 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(-10px, 8px); }
  66% { transform: translate(6px, -10px); }
}
@keyframes dust-d2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(12px, 5px); }
}
@keyframes dust-d3 {
  0%, 100% { transform: translate(0, 0); }
  40% { transform: translate(-7px, -15px); }
  80% { transform: translate(5px, 10px); }
}
.dust-drift-0 { animation: dust-d0 15s ease-in-out infinite; }
.dust-drift-1 { animation: dust-d1 18s ease-in-out infinite 2s; }
.dust-drift-2 { animation: dust-d2 12s ease-in-out infinite 4s; }
.dust-drift-3 { animation: dust-d3 20s ease-in-out infinite 1s; }

/* Orbital particles */
@keyframes orbit-0 {
  0% { transform: rotate(0deg) translateX(12px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
}
@keyframes orbit-1 {
  0% { transform: rotate(120deg) translateX(15px) rotate(-120deg); }
  100% { transform: rotate(480deg) translateX(15px) rotate(-480deg); }
}
@keyframes orbit-2 {
  0% { transform: rotate(240deg) translateX(10px) rotate(-240deg); }
  100% { transform: rotate(600deg) translateX(10px) rotate(-600deg); }
}
.orbit-p-0 { animation: orbit-0 8s linear infinite; }
.orbit-p-1 { animation: orbit-1 10s linear infinite; }
.orbit-p-2 { animation: orbit-2 12s linear infinite; }

/* Beacon lights */
@keyframes beacon-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.12; }
}
.beacon-0 { animation: beacon-pulse 2s ease-in-out infinite; }
.beacon-1 { animation: beacon-pulse 2.5s ease-in-out infinite 0.5s; }
.beacon-2 { animation: beacon-pulse 3s ease-in-out infinite 1s; }
</style>
