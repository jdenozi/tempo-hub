# Bundle Analysis Report — Tempo Hub

**Date:** 2026-02-24
**Build tool:** Nuxt 3.21.1 (Vite 7.3.1, Nitro 2.13.1)
**Build command:** `npm run build`
**Build status:** ✅ SUCCESS (27s total: 24s client + 3.5s server)

---

## Total Bundle Size

| Section | Size | Notes |
|---------|------|-------|
| **Total .output/** | **50 MB** | Full production output |
| Client JS (.output/public/_nuxt/*.js) | 16.17 MB | 414 JS files |
| Client CSS (.output/public/_nuxt/*.css) | 9.5 KB | 3 CSS files |
| Client WASM (.output/public/_nuxt/*.wasm) | 1.64 MB | 2 SQLite WASM files (837 KB each) |
| Server chunks (.output/server/chunks/) | 3.9 MB | SSR rendering + API handlers |
| Prerendered content | ~1 MB | 6 SQL dump routes |
| Manifest + other | ~27 MB | Client manifest (143 KB), source maps, etc. |

---

## Top 10 Largest Client Chunks

| # | File | Raw Size | Gzip Size | Contents |
|---|------|----------|-----------|----------|
| 1 | `DS2_qkas.js` | **3,245.70 KB** | 847.70 KB | Main app entry (Vue runtime, Nuxt, routing, components, emoji data) |
| 2 | `BRMquDBY.js` | **779.85 KB** | 196.03 KB | Shiki grammar: Emacs Lisp |
| 3 | `DPSQOshb.js` | **626.06 KB** | 44.80 KB | Shiki grammar: C++ |
| 4 | `CG6Dc4jp.js` | **622.34 KB** | 230.29 KB | SQLite WASM (base64-encoded binary) |
| 5 | `DJ2fobdd.js` | **622.33 KB** | 230.29 KB | SQLite WASM (base64-encoded binary variant) |
| 6 | `3BfZ2don.js` | **580.67 KB** | 182.61 KB | Nuxt Content / Markdown processing |
| 7 | `CqLciHwG.js` | **271.42 KB** | 99.02 KB | Vue/Nuxt shared runtime module |
| 8 | `1xJNnwe2.js` | **262.39 KB** | 77.13 KB | Shiki grammar: Wolfram |
| 9 | `dxgEKfLk.js` | **256.74 KB** | 28.02 KB | App routing/dynamic imports |
| 10 | `CTRRvLM_.js` | **232.77 KB** | 50.52 KB | Shiki grammar: additional language |

---

## Dependency Breakdown by Category

### 1. Shiki Syntax Highlighter — 12.59 MB (77.8% of client JS)

**This is by far the largest dependency.** Shiki includes 312 language grammars bundled as JSON in JS chunks. Notable grammar files:

| Grammar | Size |
|---------|------|
| Emacs Lisp | 764 KB |
| C++ | 612 KB |
| Wolfram | 260 KB |
| Vue Vine | 188 KB |
| Angular TypeScript | 180 KB |
| TypeScript (×2 variants) | 180 KB each |
| JSX (×2 variants) | 176 KB each |
| JavaScript (×2 variants) | 172 KB each |
| TSX (×2 variants) | 172 KB each |

**Impact:** These grammars are loaded for `@nuxt/content` ProsePre code block highlighting. Most are never used (site only has blog posts with HTML/JSON/JS examples).

### 2. SQLite (Nuxt Content v3) — 3.02 MB (18.7% of client JS)

| File | Size | Purpose |
|------|------|---------|
| `sqlite3.DBpDb1lf.wasm` | 837 KB | SQLite WASM binary |
| `sqlite3-DBpDb1lf.wasm` | 837 KB | SQLite WASM binary (duplicate) |
| `CG6Dc4jp.js` | 622 KB | SQLite WASM as base64 JS (fallback) |
| `DJ2fobdd.js` | 622 KB | SQLite WASM as base64 JS (variant) |
| `sqlite3-worker1-bundler-friendly-*.js` | 193 KB | SQLite Web Worker |
| `sqlite3-opfs-async-proxy-*.js` | 9 KB | OPFS async proxy |

**Impact:** Nuxt Content v3 uses SQLite WASM for client-side content querying. The WASM binary is included in 3 forms (raw .wasm × 2 + base64 in JS × 2).

### 3. Main App Bundle — 3.25 MB

The main entry chunk (`DS2_qkas.js`) contains:
- Vue 3 runtime
- Nuxt framework code
- All component registrations
- Emoji dataset (for content rendering)
- Route definitions and dynamic imports

### 4. Markdown/Content Processing — ~580 KB

The `3BfZ2don.js` chunk handles Nuxt Content markdown parsing, HTML rendering, and prose components.

---

## Three.js Status

### ✅ CONFIRMED: Three.js is NOT in the bundle

**Verification method:**
1. Searched all 414 client JS files for `THREE.` namespace → **0 matches**
2. Searched for Three.js class names (`WebGLRenderer`, `PerspectiveCamera`, `Scene()`, `MeshStandardMaterial`, `BoxGeometry`, `SphereGeometry`, `BufferGeometry`, `OrbitControls`) → **0 matches**
3. Found `"three"` string in 24 files — all are **emoji metadata** (e.g., `"three_hearts"`, `keycap "three"`, `clock "three"`) from the emoji dataset, NOT Three.js imports
4. Found `PointLight` in 7 files — all are **SVG filter element names** (`fePointLight`), NOT Three.js lights
5. Searched server chunks → Only references in `useFeatures` composable (feature flag string `"threejs"`)

**Conclusion:** `features.threejs = false` in `app.config.ts` correctly prevents Three.js from being included in the production bundle. The lazy-loading mechanism in `useGsap`/Three.js composables works as intended.

---

## Build Warnings

| Warning | Severity | Action Needed |
|---------|----------|---------------|
| Chunks > 500 KB after minification | ⚠️ Medium | Shiki grammars + SQLite cause this; see recommendations |
| Zod toJSONSchema errors (×2) | ℹ️ Low | Pre-existing `@nuxt/content` issue, non-blocking |
| Duplicated import "rand" | ℹ️ Low | Shared utility between composable and utils (harmless) |
| Dynamic/static import conflict for useFeatures | ℹ️ Low | Mixed import style, doesn't affect output |

---

## Recommendations

### High Priority

1. **Reduce Shiki grammar bundle (saves ~10 MB)**
   - Currently bundles 312 language grammars; site only uses ~5 (HTML, CSS, JS, JSON, TypeScript)
   - Configure Shiki to only include needed languages:
     ```ts
     // nuxt.config.ts
     content: {
       highlight: {
         langs: ['html', 'css', 'javascript', 'typescript', 'json', 'vue', 'bash']
       }
     }
     ```
   - Expected savings: **~10 MB raw / ~5 MB gzip** from client bundle

2. **Investigate SQLite WASM duplication (saves ~1.5 MB)**
   - SQLite binary appears in 4 forms (2 × .wasm + 2 × base64 JS)
   - Check if `@nuxt/content` config can eliminate duplicate variants
   - Consider `content.experimental.clientDB: false` if client-side querying isn't needed

### Medium Priority

3. **Code-split the main entry chunk**
   - `DS2_qkas.js` at 3.25 MB is oversized
   - Emoji dataset should be lazy-loaded only when needed
   - Consider `build.rollupOptions.output.manualChunks` for Vue/Nuxt separation

4. **Evaluate Nuxt Content v3 overhead**
   - SQLite + Shiki together = 15.6 MB (96.5% of client JS)
   - For a site with only 11 content files, this overhead is significant
   - Consider downgrading to Nuxt Content v2 or using a simpler content solution

### Low Priority

5. **Remove unused emoji dataset**
   - Full emoji dataset adds significant weight to the main chunk
   - Only needed if content uses emoji shortcodes

---

## Summary

| Metric | Value |
|--------|-------|
| Total output size | 50 MB |
| Client JS (raw) | 16.17 MB |
| Client JS (gzip est.) | ~4-5 MB |
| Largest dependency | Shiki grammars (12.59 MB / 77.8%) |
| Second largest | SQLite WASM (3.02 MB / 18.7%) |
| Three.js in bundle? | ❌ NO (correctly excluded) |
| Chunk count | 414 JS + 3 CSS + 2 WASM |
| Build time | 27 seconds |
