# Windows Setup Instructions

If you encounter build errors on Windows, follow these steps:

## Fix npm install and build issues

### Step 1: Clean existing installation
```powershell
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### Step 2: Clear npm cache (optional but recommended)
```powershell
npm cache clean --force
```

### Step 3: Install dependencies with legacy peer deps
```powershell
npm install --legacy-peer-deps
```

### Step 4: Verify installation
```powershell
npm run build
```

## Why is --legacy-peer-deps needed?

This project uses React 19.2, but some dependencies like `react-helmet-async` haven't updated their peer dependencies yet. The `--legacy-peer-deps` flag tells npm to use the legacy peer dependency resolution algorithm, which is more permissive.

## Alternative: Add to .npmrc

To make this automatic, create a `.npmrc` file in the project root:

```
legacy-peer-deps=true
```

Then you can use regular `npm install` without the flag.

## Verify Package Installation

After installation, verify that react-helmet-async is installed:

```powershell
npm list react-helmet-async
```

You should see:
```
mechanicsofmotherhood@0.0.0
└── react-helmet-async@2.0.5
```

## Common Issues

### Issue: "Cannot find module 'react-helmet-async'"
**Solution:** Make sure you ran `npm install --legacy-peer-deps`

### Issue: Build fails with Rollup resolution error
**Solution:** Delete node_modules, package-lock.json, and reinstall

### Issue: Peer dependency conflicts
**Solution:** Use `--legacy-peer-deps` flag or add it to .npmrc

## Full Clean Reinstall (Nuclear Option)

If all else fails:

```powershell
# Stop any running dev servers first
# Then run:
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
npm run build
```

## Development Commands

After successful installation:

```powershell
# Start development server
npm run dev

# Run linter
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```
