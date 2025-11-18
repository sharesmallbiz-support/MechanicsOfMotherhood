# Quality Baseline & Audit Playbook

**Project:** Mechanics of Motherhood React Application  
**Baseline Date:** 2025-11-17  
**Version:** 1.0.0

This document replaces the previous baseline and process reports with a single reference that captures the current quality posture and the steps required to keep it healthy.

---

## 1. Baseline Snapshot

| Metric | Target | Current | Notes |
| --- | --- | --- | --- |
| ESLint Errors | 0 | 0 | Flat config with React, Hooks, A11y rules |
| ESLint Warnings | <5 | 0 | Console statements allowed only for warn/error |
| Test Pass Rate | 100% | 100% | Vitest + RTL suite green (6 tests) |
| Coverage | ≥70% | TBD | Coverage tooling configured, enforce via CI gate when threshold met |
| Build Status | Success | ✅ | Vite build in ~3.2s |
| Bundle Size (gzipped) | <200 kB | ~115 kB | Manual chunks for vendor splits |
| Security Vulns | 0 | 0 | `npm audit` clean |
| Accessibility | WCAG 2.1 A | ✅ | jsx-a11y enforced |

### Build & Bundle Insights
- **Chunks:** `react-vendor`, `query-vendor`, `ui-vendor`, `index`.
- **CSS:** 16.31 kB (3.72 kB gzipped).
- **JS (gzipped):** ~115 kB across four chunks.
- **Optimizations:** Code splitting, minification, tree shaking, source maps in dev.

### Dependency Health
- Production deps: React 19.2, React Router 7.9, React Query 5.90, Zustand 5.0, Axios 1.13, DOMPurify 3.3.
- Dev tooling: ESLint 9 flat config, Vitest 4, RTL, Playwright, Tailwind 4, Husky, lint-staged, npm-check-updates.
- Tailwind 4.x is a major bump—review release notes before updating utility classes.

### Security & Accessibility
- DOMPurify sanitizes CMS/Markdown HTML.
- ESLint rules forbid risky patterns (no `eval`, no uncontrolled `dangerouslySetInnerHTML`).
- Components follow keyboard/ARIA patterns validated by jsx-a11y.

---

## 2. Audit Workflow

The automated quality gate mirrors the manual process described below. Each step must succeed before merging into `main`.

1. **Code Quality** – `npm run lint`
   - Flat ESLint config with React, Hooks, jsx-a11y, and Refresh plugins.
   - Blocks unused vars, disallows `var`, enforces hook rules.
2. **Unit Tests** – `npm run test:run`
   - Vitest + React Testing Library + jsdom.
   - Coverage reporting via `@vitest/coverage-v8` (text, HTML, LCOV).
3. **Build Verification** – `npm run build`
   - Ensures Vite compiles, CSS is extracted, and bundling stays within budget.
4. **Bundle Analysis (optional/weekly)** – `npm run bundle:analyze`
   - rollup-plugin-visualizer generates `dist/stats.html`.
5. **Dependency Hygiene** – `npm run deps:check`
   - `npm-check-updates` surfaces outdated packages; run `deps:update` to upgrade.
6. **Security Scan** – `npm audit` during CI dependency job.
7. **Sitemap Generation** – `npm run generate-sitemap` prior to deployment so SEO assets stay current.

> **CI Mirror:** `.github/workflows/quality-check.yml` runs lint → test (with coverage) → build across Node 18 & 20, plus a dependency/security matrix job.

---

## 3. Scripts & Tooling Reference

| Area | Command | Notes |
| --- | --- | --- |
| Dev Server | `npm run dev` | HMR via Vite |
| Production Build | `npm run build` | Outputs to `dist/` |
| Preview Build | `npm run preview` | Serves `dist/` locally |
| Lint | `npm run lint` / `lint:fix` | Enforced via pre-commit |
| Tests | `npm run test` / `test:run` / `test:ui` | UI runner available |
| Coverage | `npm run test:coverage` | Generates text + HTML report |
| Quality Gate | `npm run quality:check` | Lint → tests → build |
| Full Audit | `npm run quality:audit` | Adds dependency check |
| Bundle Visualizer | `npm run bundle:analyze` | Opens stats in browser |
| E2E | `npm run e2e` | Playwright tests |
| Sitemap | `npm run generate-sitemap` | Calls `scripts/generateSitemap.js` |

Pre-commit automation (Husky + lint-staged) auto-fixes lint issues and runs related tests before every commit.

---

## 4. Maintenance Cadence

- **Weekly:**
  - Run `npm run deps:check` and `npm audit`.
  - Review bundle report to watch for regressions.
- **Monthly:**
  - Raise coverage targets if thresholds are consistently exceeded.
  - Revisit ESLint rules for new React releases.
  - Audit accessibility with manual keyboard-only pass.
- **Quarterly:**
  - Evaluate major dependency upgrades (React, Tailwind, React Router).
  - Review SEO assets (sitemap, schema markup) for freshness.
  - Consider tooling improvements (Lighthouse CI, visual regression tests).

Next scheduled comprehensive audit: **2025-12-17**.

---

## 5. Developer Checklist

### Before Commit
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run test:run` green; add tests for new logic.
- [ ] No stray `console.log` (warn/error allowed when intentional).
- [ ] Accessibility patterns respected.
- [ ] Documentation (README/docs) updated when behavior or scripts change.

### Before Merge
- [ ] CI quality workflow successful.
- [ ] Coverage meets agreed threshold (≥70%).
- [ ] Bundle size within 200 kB gzipped budget.
- [ ] `npm audit` clean or waivers documented.
- [ ] Sitemap regenerated if routes/content changed.

---

## 6. Appendix

### Sample Outputs
```
ESLint: 0 errors, 0 warnings
Vitest: 6 passed (4.28s)
Build: 3.19s (manual chunks: react-vendor, query-vendor, ui-vendor, index)
Security: npm audit (0 vulnerabilities)
```

### Contact
- **Owners:** Mechanics of Motherhood core maintainers
- **Quality Shepherd:** whoever runs `quality:audit` each sprint

Keeping this playbook current ensures every contributor understands the definition of "done" for quality.
