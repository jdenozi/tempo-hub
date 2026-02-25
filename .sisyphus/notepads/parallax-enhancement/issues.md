# Parallax Enhancement — Issues & Gotchas

## Known Issues
- ParallaxHome.vue is 3,241 lines — agents may time out reading the full file
  → Solution: Read in chunks (offset/limit), focus on specific line ranges per task
- No gsap.context() currently — memory leak risk on SPA navigation
  → Fix in Task 1 (performance hardening)
- Vue reactivity overhead: 2,200+ SVG nodes diffed on every re-render
  → Fix in Task 1 with v-once + markRaw()

## File Structure Notes
- Scene 1: lines ~141-269
- Scene 2: lines ~272-329
- Scene 3: lines ~332-2331 (HUGE — 2000 lines for city)
- Scene 4: lines ~2334-2838
- SVG defs (gradients, filters): lines ~2840-3241
- Script section: after template, uses composables

## Playwright Notes
- Config: playwright.config.ts — webServer: node .output/server/index.mjs
- Tests: tests/parallax-home.spec.ts — 4 scroll positions
- Baselines: tests/screenshots/baseline/scene-1.png through scene-4.png
- Must build first: npm run build, then start server
