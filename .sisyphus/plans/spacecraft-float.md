# Spacecraft Floating Animation

## TL;DR

> **Quick Summary**: Add a subtle CSS bobbing animation to the spacecraft in Scene 4 so it looks alive/flying — similar to the blast-ring pulsation underneath.
> 
> **Deliverables**:
> - Gentle ±4px vertical float on the rocket via CSS `@keyframes`
> 
> **Estimated Effort**: Quick (5 min)
> **Parallel Execution**: NO — single task
> **Critical Path**: One edit to ParallaxHome.vue

---

## Context

### Original Request
User wants the rocket in Scene 4 to have a subtle floating/bobbing animation, similar to the pulsating blast-ring ellipses below it, to give the impression it's flying.

### Technical Analysis
- The spacecraft is `<g ref="saucerRef">` at line ~2981 in `ParallaxHome.vue`
- GSAP controls `saucerRef` transforms (x, y, opacity) via ScrollTrigger
- **CONFLICT RISK**: Adding CSS transforms on `saucerRef` directly would fight GSAP
- **Solution**: Insert an inner `<g class="spacecraft-float">` wrapper between `saucerRef` and the existing transform group — CSS animates the inner wrapper, GSAP animates the outer ref
- Existing pattern: `blast-ring-1/2/3` at lines 3430-3432 use `@keyframes blast-expand-*`

---

## Work Objectives

### Core Objective
Make the spacecraft visually alive with a gentle floating motion while preserving all existing GSAP scroll animations.

### Must Have
- CSS `@keyframes spacecraft-float` with gentle vertical bob (±4px, 3s cycle)
- Inner `<g class="spacecraft-float">` wrapper to isolate from GSAP
- No conflict with existing GSAP ScrollTrigger animations

### Must NOT Have (Guardrails)
- ❌ CSS animation on `saucerRef` itself (GSAP conflict!)
- ❌ Changes to `useLaunchSequence.ts` or GSAP animations
- ❌ `feDisplacementMap` or animated filters
- ❌ New npm dependencies

---

## Verification Strategy

### Test Decision
- **Automated tests**: None needed (pure visual CSS)
- **QA**: Build verification only

---

## Execution Strategy

### Single Task — No Parallelism Needed

```
Wave 1:
└── Task 1: Add spacecraft float animation [quick]

No Final Verification Wave needed (trivial change).
```

---

## TODOs

- [ ] 1. Add spacecraft floating CSS animation

  **What to do**:
  1. In `components/ParallaxHome.vue` template, at line ~2982, wrap the existing transform group:
     - Current:
       ```html
       <g ref="saucerRef" opacity="0">
         <g transform="translate(340,560) rotate(-25)">
       ```
     - Change to:
       ```html
       <g ref="saucerRef" opacity="0">
         <g class="spacecraft-float">
           <g transform="translate(340,560) rotate(-25)">
       ```
  2. At line ~3086-3087 (closing tags of saucerRef), add the extra closing `</g>` for the float wrapper:
     - Current:
       ```html
             </g>
           </g>
       ```
     - Change to:
       ```html
             </g>
           </g> <!-- /spacecraft-float -->
         </g>
       ```
  3. In the `<style>` section, after the `.blast-ring-3` rule (line ~3432), add:
     ```css
     /* Spacecraft floating/bobbing animation */
     @keyframes spacecraft-float {
       0%, 100% { transform: translateY(0); }
       50% { transform: translateY(-4px); }
     }
     .spacecraft-float {
       animation: spacecraft-float 3s ease-in-out infinite;
       transform-origin: center center;
     }
     ```

  **Must NOT do**:
  - Do NOT put the animation class on `saucerRef` (GSAP controls that element's transforms)
  - Do NOT modify `useLaunchSequence.ts`
  - Do NOT change scroll trigger ranges
  - Do NOT touch other scenes

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file, 3-line CSS addition
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (only 1 task)
  - **Blocks**: Nothing
  - **Blocked By**: Nothing

  **References**:
  - `components/ParallaxHome.vue:2981-2982` — saucerRef + transform group (insert wrapper here)
  - `components/ParallaxHome.vue:3086-3087` — closing tags (add extra `</g>` here)
  - `components/ParallaxHome.vue:3430-3432` — blast-ring CSS animations (pattern to follow, insert after)
  - `composables/useLaunchSequence.ts:71-88` — GSAP animations on saucerRef (DO NOT MODIFY)

  **Acceptance Criteria**:
  - [ ] `npm run build` → exit 0
  - [ ] `npx vitest run` → 31 pass
  - [ ] `grep -c 'spacecraft-float' components/ParallaxHome.vue` → ≥ 2

  **QA Scenarios:**
  ```
  Scenario: Spacecraft has floating animation
    Tool: Bash
    Steps:
      1. grep 'spacecraft-float' components/ParallaxHome.vue
      2. Verify class appears in template AND in style section
    Expected Result: Class used on <g> wrapper + @keyframes defined
    Evidence: .sisyphus/evidence/spacecraft-float-grep.txt
  ```

  **Commit**: YES
  - Message: `feat(hub): add floating animation to spacecraft in Scene 4`
  - Files: `components/ParallaxHome.vue`
  - Pre-commit: `npm run build`

---

## Commit Strategy

| Wave | Commit Message | Pre-commit |
|------|---------------|------------|
| 1 | `feat(hub): add floating animation to spacecraft in Scene 4` | `npm run build` |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: exit 0
npx vitest run --reporter=verbose  # Expected: 31 pass
grep -c 'spacecraft-float' components/ParallaxHome.vue  # Expected: ≥ 2
```

### Final Checklist
- [ ] Spacecraft has gentle floating CSS animation
- [ ] No GSAP conflict (animation on inner wrapper, not saucerRef)
- [ ] Build passes
- [ ] Tests pass
