# Mechanics of Motherhood - Recipe & CMS Web Application

A modern React web application for browsing recipes and displaying dynamic CMS content, powered by the WebSpark API.

## Features

- Browse and search recipes
- Filter recipes by category
- View detailed recipe information
- Dynamic CMS pages
- Responsive design with Tailwind CSS
- Server state management with React Query
- Client-side routing with React Router

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Global client state
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **DOMPurify** - HTML sanitization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API client and functions
├── components/       # React components
│   ├── common/      # Reusable components
│   ├── layout/      # Layout components
│   ├── recipes/     # Recipe-related components
│   └── cms/         # CMS components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── routes/          # Routing configuration
├── store/           # State management
└── utils/           # Utility functions
```

## API Configuration

The application connects to the WebSpark API at:
`https://webspark.markhazleton.com/api`

Website ID is configured in the Zustand store (default: 2 - Mechanics of Motherhood)

### Markdown Support

Recipe content (description, ingredients, and instructions) is rendered as Markdown with:
- GitHub Flavored Markdown (GFM) support
- Tables, lists, code blocks
- Styled headings and formatting
- Automatic link handling
- Plain text preview in recipe cards

## Quality Assurance

### Code Quality
- **ESLint:** 0 errors, 0 warnings ✅
- **React Best Practices:** Enforced
- **Accessibility:** WCAG 2.1 Level A compliant
- **Security:** 0 vulnerabilities

### Testing
```bash
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Generate coverage report
npm run test:ui           # Open test UI
```

Current Status: 6/6 tests passing ✅

### Quality Audit
```bash
npm run quality:check     # Run lint + tests + build
npm run quality:audit     # Full audit including deps
npm run lint              # Check code quality
npm run lint:fix          # Auto-fix linting issues
```

### Bundle Analysis
```bash
npm run bundle:analyze    # Analyze bundle size
```

Current bundle size: ~115 KB (gzipped)

### Pre-commit Hooks
Automatic checks before each commit:
- ESLint auto-fix
- Run related tests

### Documentation
- See [QUALITY_AUDIT.md](./QUALITY_AUDIT.md) for quality process
- See [BASELINE_AUDIT_REPORT.md](./BASELINE_AUDIT_REPORT.md) for baseline metrics
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines

## Development Workflow

1. Create a feature branch
2. Write code following best practices
3. Write tests for new features
4. Run quality checks: `npm run quality:check`
5. Commit (pre-commit hooks will run automatically)
6. Push and create pull request

## CI/CD

GitHub Actions workflow runs on every push:
- Linting (ESLint)
- Testing (Vitest)
- Build verification
- Security audit
- Dependency checks

## License

All rights reserved.
