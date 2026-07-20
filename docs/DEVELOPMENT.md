# StarryCrypt Development Guide

A comprehensive guide for setting up your development environment and understanding the project structure.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Development Commands](#development-commands)
- [Debugging](#debugging)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: For version control
- **Code Editor**: VS Code recommended (ESLint extension helpful)
- **Browser**: Modern browser with Web Crypto API support

### Verify Prerequisites

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## Environment Setup

### 1. Clone the Repository

```bash
# Using HTTPS (recommended for first-time setup)
git clone https://github.com/Samin-yasar/StarryCrypt.git
cd StarryCrypt

# Or using SSH (if SSH key is configured)
git clone git@github.com:Samin-yasar/StarryCrypt.git
cd StarryCrypt
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- React and React DOM
- Vite (build tool)
- Tailwind CSS and shadcn/ui
- Testing libraries
- Linting tools

### 3. Start Development Server

```bash
npm run dev
```

Server starts at `http://localhost:5173/` (or next available port)

The page will automatically reload when you make changes.

### 4. Environment Variables

Create a `.env.local` file for local overrides (this file is gitignored):

```bash
# .env.local
VITE_APP_TITLE=StarryCrypt Dev
```

Available environment variables:
- `VITE_APP_TITLE`: Application title (optional)
- Other Vite-specific variables as needed

## Project Structure

```
StarryCrypt/
├── .github/                      # GitHub configuration
│   ├── ISSUE_TEMPLATE/          # Issue templates
│   └── pull_request_template.md # PR template
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md          # System design
│   ├── DEVELOPMENT.md           # This file
│   ├── API.md                   # Crypto API reference
│   ├── TESTING.md               # Test strategy
│   ├── DEPLOYMENT.md            # Production deployment
│   ├── TROUBLESHOOTING.md       # Common issues
│   ├── SECURITY_IMPLEMENTATION.md
│   └── PROJECT_STRUCTURE.md     # File organization
│
├── src/                          # Source code
│   ├── components/              # React components
│   │   ├── ui/                 # Shadcn UI components
│   │   └── *.tsx               # Custom components
│   │
│   ├── pages/                   # Page components
│   │   ├── Index.tsx           # Main page
│   │   └── NotFound.tsx        # 404 page
│   │
│   ├── lib/                     # Utility functions
│   │   ├── crypto.ts           # Encryption/decryption
│   │   └── *.ts                # Other utilities
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── App.tsx                  # App root component
│   ├── main.tsx                 # Entry point
│   └── index.css               # Global styles
│
├── public/                       # Static assets
│   ├── favicon.ico
│   └── manifest.json            # PWA manifest
│
├── tests/                        # Test files
│   ├── crypto.test.ts          # Crypto function tests
│   └── *.test.ts               # Component tests
│
├── .editorconfig                # Editor configuration
├── .eslintrc.json              # Linting rules
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment template
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── vitest.config.ts            # Vitest configuration
├── package.json                # Dependencies and scripts
├── README.md                   # Project overview
├── CONTRIBUTING.md             # Contribution guidelines
├── CODE_OF_CONDUCT.md          # Community standards
├── SECURITY.md                 # Security policy
└── LICENSE                     # MIT License
```

### Key Directories

#### `src/lib/crypto.ts`
The core cryptography module containing:
- `encryptText()` - Main encryption function
- `decryptText()` - Main decryption function
- `computeHmacSha512()` - HMAC verification
- `computeSha256Fingerprint()` - Hash generation

#### `src/components/`
Reusable React components built with:
- Radix UI primitives
- Tailwind CSS styling
- TypeScript for type safety

#### `src/pages/`
Full-page components using React Router:
- `Index.tsx` - Main application
- `NotFound.tsx` - 404 page

#### `docs/`
Comprehensive documentation:
- Architecture and design
- API reference
- Deployment guide
- Security implementation details

## Development Commands

### Essential Commands

```bash
# Start development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build development version (unoptimized)
npm run build:dev
```

### Useful npm Scripts

```bash
# Run all checks (build + lint + test)
npm run build && npm run lint && npm run test

# Run specific test file
npm test -- crypto.test.ts

# Run tests matching a pattern
npm test -- --grep "encryptText"
```

## Debugging

### Browser DevTools

1. Open your browser's developer console (F12 or Cmd+Option+I)
2. Check the Console tab for errors or debug logs
3. Use the Elements tab to inspect component structure
4. Use the Network tab to verify no data leaves your browser

### React DevTools

Install the React DevTools browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

This allows you to:
- Inspect component hierarchy
- View props and state
- Track re-renders

### VS Code Debugging

Add this to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Console Logging

Add debug logs in your code:

```typescript
// In crypto.ts
async function encryptText(text: string, password: string, iterations: number) {
  console.log('[v0] Starting encryption with iterations:', iterations);
  // ... encryption logic
}
```

Remove debug logs before committing:
```bash
git diff | grep "console.log"
```

### Common Debug Scenarios

**Encryption not working:**
- Check browser console for errors
- Verify Web Crypto API is available: `window.crypto.subtle` exists
- Ensure password is not empty
- Check iteration count is within valid range (400k-10m)

**Decryption failing:**
- Verify ciphertext is valid Base64
- Check password matches the one used for encryption
- Ensure browser supports Web Crypto API
- Look at Network tab to confirm no server requests

**Styling issues:**
- Verify Tailwind CSS is loaded: Check <style> tags in HTML
- Use browser DevTools to inspect computed styles
- Clear cache and rebuild: `npm run build`

## Testing

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test -- --coverage

# Run specific test file
npm run test -- crypto.test.ts

# Run tests matching pattern
npm run test -- --grep "encryptText"
```

### Test Structure

Tests use Vitest (similar to Jest) and are located in `tests/` directory:

```typescript
// tests/crypto.test.ts
import { describe, it, expect } from 'vitest';
import { encryptText, decryptText } from '../src/lib/crypto';

describe('Encryption', () => {
  it('should encrypt text correctly', async () => {
    const plaintext = 'Hello, World!';
    const password = 'secure-password';
    
    const ciphertext = await encryptText(plaintext, password, 400000);
    
    expect(ciphertext).toBeDefined();
    expect(typeof ciphertext).toBe('string');
  });
});
```

### Writing New Tests

1. Create `tests/my-feature.test.ts`
2. Import testing utilities from `vitest`
3. Import functions to test from `src/`
4. Write test cases with `describe()` and `it()`
5. Use `expect()` for assertions

**Best Practices:**
- Test both success and error cases
- Use descriptive test names
- Keep tests focused and independent
- Mock external dependencies if needed

## Code Quality

### Linting

```bash
npm run lint
```

ESLint checks for:
- TypeScript type errors
- React best practices
- Code style violations
- Potential bugs

**Fixing lint errors:**
```bash
npm run lint -- --fix
```

### TypeScript

The project uses TypeScript for type safety:

```bash
# Type-check without building
npx tsc --noEmit
```

### Code Style

Project uses:
- **Prettier**: Automatic code formatting
- **ESLint**: Code quality rules
- **EditorConfig**: Cross-editor consistency

Your editor should auto-format on save if configured properly.

**Manual formatting:**
```bash
npx prettier --write src/
```

## Common Tasks

### Adding a New Component

1. Create `src/components/MyComponent.tsx`:
```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

2. Use in another component:
```typescript
import { MyComponent } from '@/components/MyComponent';

export function Page() {
  return <MyComponent title="Hello" />;
}
```

### Adding Shadcn UI Component

```bash
# Install a component
npx shadcn-ui@latest add button

# Component is now available to use
```

### Adding a New Page

1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`:
```typescript
import MyPage from './pages/MyPage';

// In Routes:
<Route path="/my-page" element={<MyPage />} />
```

### Modifying Crypto Functions

1. Edit `src/lib/crypto.ts`
2. Update corresponding tests in `tests/crypto.test.ts`
3. Add comments explaining security implications
4. Run: `npm run test && npm run lint`

### Updating Documentation

1. Edit relevant `.md` file in `docs/`
2. Keep documentation in sync with code changes
3. Use clear, concise language
4. Include code examples where helpful

## Troubleshooting

### "Port 5173 is already in use"

```bash
# Find process using port
lsof -i :5173

# Kill process (macOS/Linux)
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3000
```

### Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci (exact dependencies)
npm ci
```

### Vite cache issues

```bash
# Clear Vite cache
rm -rf dist .vite

# Rebuild
npm run build
```

### Tests failing after changes

```bash
# Clear test cache
npm run test -- --clearCache

# Run tests again
npm run test
```

### TypeScript errors

```bash
# Type-check the project
npx tsc --noEmit

# Check specific file
npx tsc src/lib/crypto.ts --noEmit
```

### Web Crypto API not available

- Ensure HTTPS or localhost (required for Web Crypto API)
- Use modern browser (Chrome 37+, Firefox 34+, Safari 11+)
- Check browser privacy settings aren't blocking crypto

### Build fails

```bash
# Check Vite config
cat vite.config.ts

# Try full rebuild
npm run build -- --force

# Check for missing dependencies
npm audit
```

## Getting Help

1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Search [GitHub Issues](https://github.com/Samin-yasar/StarryCrypt/issues)
3. Review [Architecture Guide](ARCHITECTURE.md)
4. Ask in [Discussions](https://github.com/Samin-yasar/StarryCrypt/discussions)
5. Read [API Documentation](API.md)

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand system design
- Check [API.md](API.md) for crypto function details
- Review [TESTING.md](TESTING.md) for testing strategy
- Look at existing code to understand patterns
