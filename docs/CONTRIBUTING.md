# Contributing Guidelines

Thank you for contributing to the Mechanics of Motherhood React application! This guide will help you maintain our quality standards.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MechanicsOfMotherhood
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up git hooks**
   ```bash
   npm run prepare
   ```

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Write Code
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Add JSDoc comments for complex functions

### 3. Write Tests
- Write unit tests for new components
- Maintain 70%+ code coverage
- Test user interactions
- Test edge cases and error states

Example:
```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import YourComponent from './YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })
})
```

### 4. Run Quality Checks
```bash
# Lint your code
npm run lint:fix

# Run tests
npm run test

# Check coverage
npm run test:coverage

# Build to verify
npm run build
```

### 5. Commit Your Changes
Pre-commit hooks will automatically:
- Fix linting errors
- Run related tests

```bash
git add .
git commit -m "feat: add new feature description"
```

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

## Code Quality Standards

### ESLint Rules
- No unused variables
- No console.log (use console.error/warn if needed)
- No debugger statements
- Prefer const over let
- No var declarations
- Follow accessibility guidelines

### Component Structure
```javascript
import React from 'react';
import PropTypes from 'prop-types'; // Optional but recommended

/**
 * Component description
 * @param {Object} props - Component props
 */
const MyComponent = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState(null);

  // Event handlers
  const handleClick = () => {
    // Implementation
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Accessibility
- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Add alt text to images

### File Organization
```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.jsx
│   │   ├── ComponentName.test.jsx
│   │   └── index.js (optional)
```

## Testing Guidelines

### What to Test
✅ Component rendering
✅ User interactions (clicks, form inputs)
✅ Conditional rendering
✅ Props handling
✅ Error states
✅ Loading states

### What NOT to Test
❌ Third-party library internals
❌ CSS styling details
❌ Implementation details

### Test Structure
```javascript
describe('ComponentName', () => {
  describe('rendering', () => {
    it('renders with default props', () => {})
    it('renders with custom props', () => {})
  })

  describe('interactions', () => {
    it('handles click events', () => {})
    it('handles form submission', () => {})
  })

  describe('edge cases', () => {
    it('handles empty data', () => {})
    it('handles errors', () => {})
  })
})
```

## Git Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add recipe search functionality
fix: resolve navigation menu overflow issue
docs: update API integration guide
test: add tests for RecipeCard component
```

## Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update CHANGELOG

2. **Self Review**
   - Review your own code first
   - Check for console.logs
   - Verify tests pass
   - Check bundle size impact

3. **PR Description**
   ```markdown
   ## What
   Brief description of changes

   ## Why
   Reason for changes

   ## How
   Technical approach

   ## Testing
   How to test the changes

   ## Screenshots (if UI changes)
   ```

4. **CI Checks**
   - All tests must pass
   - Linting must pass
   - Build must succeed
   - Coverage must meet targets

## Quality Commands

```bash
# Run full quality check
npm run quality:check

# Run full audit
npm run quality:audit

# Check dependencies
npm run deps:check

# Analyze bundle
npm run bundle:analyze

# Fix linting issues
npm run lint:fix
```

## Troubleshooting

### Pre-commit Hook Fails
```bash
# Fix linting errors
npm run lint:fix

# Run tests manually
npm run test:run
```

### Tests Fail
```bash
# Run in watch mode for debugging
npm run test

# Use test UI
npm run test:ui
```

### Build Fails
```bash
# Check for TypeScript errors
npm run build

# Check for missing dependencies
npm install
```

## Getting Help

- Check existing issues
- Review documentation
- Ask in pull request comments
- Contact maintainers

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow best practices

Thank you for contributing! 🎉
