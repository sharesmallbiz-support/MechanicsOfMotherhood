# Advanced Features Implementation Guide

**Date:** 2025-11-17
**Version:** 1.0.0

This document provides implementation guides for advanced features including integration testing, PWA capabilities, error tracking, performance monitoring, visual regression testing, and TypeScript migration.

---

## Table of Contents

1. [Integration Testing with Playwright](#integration-testing)
2. [Bundle Size Budgets](#bundle-size-budgets)
3. [Error Tracking with Sentry](#error-tracking)
4. [Performance Monitoring](#performance-monitoring)
5. [PWA Capabilities](#pwa-capabilities)
6. [Visual Regression Testing](#visual-regression)
7. [TypeScript Migration Plan](#typescript-migration)

---

## Integration Testing with Playwright {#integration-testing}

### Status: ✅ Configured

### Overview
Playwright provides end-to-end testing across multiple browsers with visual regression capabilities.

### Configuration
- **Config File:** `playwright.config.js`
- **Test Directory:** `e2e/`
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

### Running Tests
```bash
# Run all E2E tests
npm run e2e

# Run with UI mode
npm run e2e:ui

# Run in headed mode (visible browser)
npm run e2e:headed

# Debug mode
npm run e2e:debug

# View report
npm run e2e:report
```

### Sample Test
See `e2e/homepage.spec.js` for a complete example.

### Writing Tests
```javascript
import { test, expect } from '@playwright/test'

test('should navigate and interact', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Recipes')
  await expect(page).toHaveURL(/recipes/)
})
```

### Best Practices
- Test critical user flows
- Use data-testid for stable selectors
- Test across multiple viewports
- Enable screenshots and videos on failure
- Use Page Object Model for complex tests

---

## Bundle Size Budgets {#bundle-size-budgets}

### Status: ✅ Configured

### Overview
Bundle size budgets help prevent performance regression by warning when bundles exceed size limits.

### Configuration (`vite.config.js`)
```javascript
build: {
  chunkSizeWarningLimit: 500, // 500 KB warning
  target: 'es2020', // Modern browsers
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: mode === 'production',
      drop_debugger: true,
    },
  },
}
```

### Current Bundle Sizes
| Chunk | Size (gzipped) | Budget | Status |
|-------|----------------|--------|--------|
| react-vendor | 15.68 KB | < 50 KB | ✅ |
| query-vendor | 10.09 KB | < 30 KB | ✅ |
| ui-vendor | 14.99 KB | < 30 KB | ✅ |
| main app | 70.97 KB | < 150 KB | ✅ |
| **Total** | **~115 KB** | **< 200 KB** | ✅ |

### Monitoring
```bash
# Analyze bundle
npm run bundle:analyze

# Check warnings during build
npm run build
```

### Optimization Strategies
1. **Code Splitting** - Separate vendor chunks
2. **Dynamic Imports** - Lazy load routes/components
3. **Tree Shaking** - Remove unused code
4. **Compression** - Gzip/Brotli compression
5. **Image Optimization** - WebP format, lazy loading

---

## Error Tracking with Sentry {#error-tracking}

### Status: 📝 Ready to Configure

### Package Installed
```bash
npm install @sentry/react
```

### Implementation Steps

#### 1. Get Sentry DSN
1. Create account at https://sentry.io
2. Create new project (React)
3. Copy your DSN

#### 2. Configure Sentry (`src/utils/sentry.js`)
```javascript
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),
        new Sentry.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      // Environment
      environment: import.meta.env.MODE,
    })
  }
}
```

#### 3. Initialize in App (`src/main.jsx`)
```javascript
import { initSentry } from './utils/sentry'

// Initialize Sentry before React
initSentry()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

#### 4. Add Environment Variable (`.env.production`)
```
VITE_SENTRY_DSN=your-sentry-dsn-here
```

#### 5. Error Boundary
```javascript
import * as Sentry from '@sentry/react'

const FallbackComponent = ({ error }) => (
  <div>
    <h1>Something went wrong</h1>
    <button onClick={() => window.location.reload()}>
      Reload
    </button>
  </div>
)

// Wrap your app
<Sentry.ErrorBoundary fallback={FallbackComponent}>
  <App />
</Sentry.ErrorBoundary>
```

### Features
- Automatic error capture
- Performance monitoring
- Session replay
- Release tracking
- User feedback
- Source maps upload

---

## Performance Monitoring {#performance-monitoring}

### Status: 📝 Ready to Implement

### Tools

#### 1. Web Vitals
```bash
npm install web-vitals
```

```javascript
// src/utils/reportWebVitals.js
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry)
    onFID(onPerfEntry)
    onFCP(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
  }
}

// Usage in main.jsx
reportWebVitals(console.log) // or send to analytics
```

#### 2. React Query DevTools
Already configured in React Query setup.

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

#### 3. Performance API
```javascript
// Custom performance marks
performance.mark('feature-start')
// ... code ...
performance.mark('feature-end')
performance.measure('feature', 'feature-start', 'feature-end')

const measure = performance.getEntriesByName('feature')[0]
console.log(`Feature took ${measure.duration}ms`)
```

### Monitoring Checklist
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to First Byte (TTFB) < 600ms
- [ ] First Contentful Paint (FCP) < 1.8s

---

## PWA Capabilities {#pwa-capabilities}

### Status: 📝 Ready to Configure

### Package Installed
```bash
npm install -D vite-plugin-pwa
```

### Implementation Steps

#### 1. Configure PWA Plugin (`vite.config.js`)
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Mechanics of Motherhood',
        short_name: 'MOM Recipes',
        description: 'Recipe and CMS web application',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/webspark\.markhazleton\.com\/api\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
```

#### 2. Create Icons
Generate PWA icons in sizes:
- 192x192 (pwa-192x192.png)
- 512x512 (pwa-512x512.png)
- favicon.ico
- apple-touch-icon.png

#### 3. Add to index.html
```html
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#2563eb">
```

### Features
- Offline support
- Install to home screen
- Push notifications (future)
- Background sync
- App-like experience

---

## Visual Regression Testing {#visual-regression}

### Status: 📝 Ready to Configure

### Options

#### Option 1: Playwright Visual Testing
```javascript
// In Playwright tests
test('visual regression', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png')
})
```

Run with:
```bash
npm run e2e -- --update-snapshots  # Update baselines
npm run e2e                          # Compare to baselines
```

#### Option 2: Percy (SaaS)
```bash
npm install --save-dev @percy/cli @percy/playwright
```

```javascript
import percySnapshot from '@percy/playwright'

test('percy snapshot', async ({ page }) => {
  await page.goto('/')
  await percySnapshot(page, 'Homepage')
})
```

#### Option 3: Chromatic (Storybook)
For component-level visual testing:
1. Set up Storybook
2. Install Chromatic
3. Run visual tests in CI/CD

### Best Practices
- Test critical pages only
- Use consistent viewport sizes
- Wait for animations to complete
- Ignore dynamic content (dates, user data)
- Review changes carefully before approving

---

## TypeScript Migration Plan {#typescript-migration}

### Status: 📝 Migration Plan

### Benefits
- Type safety
- Better IDE support
- Refactoring confidence
- Documentation as code
- Catch bugs early

### Migration Strategy (Gradual)

#### Phase 1: Setup (Week 1)
1. Install TypeScript
```bash
npm install -D typescript @types/react @types/react-dom
```

2. Create `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

3. Rename `vite.config.js` → `vite.config.ts`

#### Phase 2: Convert Utilities (Week 2)
Start with:
- `src/api/*.js` → `*.ts`
- `src/utils/*.js` → `*.ts`
- `src/hooks/*.js` → `*.tsx`

#### Phase 3: Convert Components (Weeks 3-4)
- Start with leaf components (Button, Card, etc.)
- Move to composite components
- Finally convert pages

#### Phase 4: Enable Strict Mode (Week 5)
- Turn on `strict: true`
- Fix all type errors
- Add missing types

#### Phase 5: Cleanup (Week 6)
- Remove JSDoc comments (replaced by types)
- Update documentation
- Enable pre-commit type checking

### Example Migration

**Before (JS):**
```javascript
const Button = ({ children, onClick, variant = 'primary' }) => {
  return <button onClick={onClick}>{children}</button>
}
```

**After (TS):**
```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary'
}) => {
  return <button onClick={onClick}>{children}</button>
}
```

### Gradual Migration Tips
- Use `// @ts-check` in JS files for gradual typing
- Allow `.js` and `.ts` to coexist
- Convert file by file
- Don't rush - quality over speed
- Update tests alongside components

---

## Implementation Priority

### Immediate (This Sprint)
1. ✅ Integration Testing - Configured
2. ✅ Bundle Size Budgets - Configured
3. 📝 Error Tracking - Ready to configure (need DSN)

### Next Sprint
4. 📝 Performance Monitoring - Install web-vitals
5. 📝 PWA Capabilities - Update vite.config.js
6. 📝 Visual Regression - Add to Playwright

### Future (Next Quarter)
7. 📝 TypeScript Migration - Follow 6-week plan

---

## Monitoring Dashboard

| Feature | Status | Next Action |
|---------|--------|-------------|
| E2E Testing | ✅ Ready | Write more tests |
| Bundle Budgets | ✅ Active | Monitor on each build |
| Error Tracking | 📝 Setup | Add Sentry DSN |
| Performance | 📝 Pending | Install web-vitals |
| PWA | 📝 Pending | Update vite config |
| Visual Regression | 📝 Pending | Update Playwright tests |
| TypeScript | 📝 Planned | Start Phase 1 |

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Sentry React Guide](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Web Vitals](https://web.dev/vitals/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [TypeScript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Percy Documentation](https://docs.percy.io/)

---

**Last Updated:** 2025-11-17
**Maintained By:** Development Team
