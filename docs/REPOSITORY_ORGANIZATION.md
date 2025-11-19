# Repository Organization

This document describes the organizational structure and best practices applied to the MechanicsOfMotherhood repository.

## Recent Changes (November 2025)

The repository has been reorganized to follow modern Vite and React best practices:

### Structure Changes

1. **Moved `public/` directory to root level**
   - **Before:** `src/public/`
   - **After:** `public/` (root level)
   - **Reason:** Vite convention - static assets should be in root-level `public/` directory

2. **Moved `index.html` to root level**
   - **Before:** `src/index.html`
   - **After:** `index.html` (root level)
   - **Reason:** Standard Vite project structure - entry HTML file at root

3. **Updated Vite configuration**
   - Removed custom `root: 'src'` configuration
   - Updated build output paths from `../dist` to `dist`
   - Updated script reference in `index.html` from `/main.jsx` to `/src/main.jsx`

### New Files Added

1. **`.editorconfig`**
   - Ensures consistent coding styles across different editors and IDEs
   - Defines indentation, line endings, and file formatting rules
   - Automatically used by most modern editors (VS Code, IntelliJ, etc.)

2. **Enhanced `.gitignore`**
   - Added comprehensive patterns for:
     - Test outputs (Playwright reports, coverage)
     - Environment files (`.env*`)
     - OS-specific files (Thumbs.db, Desktop.ini)
     - Temporary files and caches
     - Additional editor/IDE directories

## Current Directory Structure

```
MechanicsOfMotherhood/
├── .editorconfig              # Editor configuration
├── .gitignore                 # Git ignore patterns
├── .husky/                    # Git hooks (pre-commit)
├── .npmrc                     # npm configuration
├── docs/                      # Project documentation
│   ├── ADVANCED_FEATURES.md
│   ├── CONTRIBUTING.md
│   ├── QUALITY_BASELINE.md
│   ├── REPOSITORY_ORGANIZATION.md
│   ├── SEO_IMPLEMENTATION.md
│   └── SLUG_ROUTING.md
├── e2e/                       # End-to-end tests (Playwright)
│   └── homepage.spec.js
├── public/                    # Static assets (served as-is)
│   ├── robots.txt
│   ├── sitemap.xml
│   └── vite.svg
├── scripts/                   # Build and utility scripts
│   └── generateSitemap.js
├── src/                       # Source code
│   ├── api/                  # API clients and services
│   ├── components/           # React components
│   ├── config/               # App configuration
│   ├── data/                 # Static data files
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── routes/               # Routing configuration
│   ├── store/                # State management
│   ├── test/                 # Test utilities
│   ├── utils/                # Helper functions
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── playwright.config.js      # E2E test configuration
├── README.md                 # Project readme
├── vite.config.js            # Vite bundler configuration
└── vitest.config.js          # Unit test configuration
```

## Best Practices Applied

### 1. Standard Vite Project Structure
- Follows official Vite conventions
- Entry HTML at root level
- Static assets in root-level `public/`
- Source code in `src/`
- Configuration files at root

### 2. Clear Separation of Concerns
- **`src/api/`** - External API communication
- **`src/components/`** - Reusable UI components
- **`src/pages/`** - Top-level page components
- **`src/hooks/`** - Custom React hooks
- **`src/store/`** - State management
- **`src/utils/`** - Pure utility functions

### 3. Comprehensive Documentation
- **`docs/`** directory for all documentation
- Each feature has dedicated documentation
- Contributing guidelines available
- Quality baseline documented

### 4. Testing Organization
- **`e2e/`** - End-to-end tests separate from unit tests
- **`src/test/`** - Test utilities and setup
- **`.test.jsx`** files colocated with components

### 5. Configuration Management
- All config files at root level
- Clear naming conventions
- Well-documented configuration options

### 6. Editor/IDE Support
- **`.editorconfig`** for consistent formatting
- **`.vscode/`** for VS Code settings (gitignored with exceptions)
- ESLint for code quality

### 7. Git Best Practices
- Comprehensive `.gitignore`
- Git hooks via Husky
- Pre-commit linting and testing

## Migration Notes

If you have a local development environment set up before these changes:

1. **Pull the latest changes:**
   ```bash
   git pull origin main
   ```

2. **Clear any cached builds:**
   ```bash
   rm -rf dist node_modules/.vite
   ```

3. **Reinstall dependencies (if needed):**
   ```bash
   npm install
   ```

4. **Verify the setup:**
   ```bash
   npm run build
   npm run test:run
   npm run lint
   ```

## Benefits of This Structure

1. **Standards Compliance** - Follows Vite and React community conventions
2. **Better IDE Support** - Standard structure recognized by tools
3. **Easier Onboarding** - Familiar structure for new developers
4. **Improved Build Performance** - Optimized for Vite's expectations
5. **Clearer Organization** - Logical separation of concerns
6. **Enhanced Maintainability** - Consistent patterns throughout

## References

- [Vite Project Structure](https://vitejs.dev/guide/#index-html-and-project-root)
- [React Project Structure Best Practices](https://react.dev/learn/thinking-in-react)
- [EditorConfig Documentation](https://editorconfig.org/)
