
## [2026-02-25] F1 Visual QA — Critical Finding

### Sub-page sections not rendering (BLOCKER)
- **All 8 sub-pages** (4 FR + 4 EN) load with HTTP 200 but show empty white content area
- PageRenderer receives `undefined` for `page.sections`
- Root cause likely: Nuxt Content v3 `queryCollection().path().first()` does not expose complex nested frontmatter (arrays of objects with nested objects) on the page object
- The `sections` field in content.config.ts schema defines `sections` as optional array, but the actual data from content files may not be properly parsed/exposed
- Homepage works because it builds sections in `index.vue` script, not from Nuxt Content

### Glassmorphism gold borders not visible
- `glass-card` class should add `border: 1px solid rgba(212,168,83,0.1)` but gold borders are not prominently visible even on the working homepage
