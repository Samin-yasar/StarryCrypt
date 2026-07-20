# StarryCrypt Project Structure

Complete guide to the project's file organization and architecture.

## Directory Tree

```
StarryCrypt/
├── docs/                           # 📚 Documentation (you are here)
│   ├── ARCHITECTURE.md            # System design and crypto flow
│   ├── DEVELOPMENT.md             # Development setup and workflows
│   ├── API.md                     # Cryptographic API reference
│   ├── TESTING.md                 # Testing strategy and examples
│   ├── DEPLOYMENT.md              # Production deployment guide
│   ├── TROUBLESHOOTING.md         # Common issues and solutions
│   ├── SECURITY_IMPLEMENTATION.md # Cryptographic details
│   └── PROJECT_STRUCTURE.md       # This file
│
├── src/                            # 📝 Source code
│   ├── components/                # React components
│   │   ├── ui/                   # Shadcn UI components (auto-generated)
│   │   │   ├── button.tsx        # Button component
│   │   │   ├── input.tsx         # Input component
│   │   │   ├── dialog.tsx        # Modal dialog
│   │   │   ├── form.tsx          # Form wrapper
│   │   │   ├── toaster.tsx       # Toast notifications
│   │   │   └── ...               # Other UI components
│   │   └── [Custom components]   # Application-specific components
│   │
│   ├── pages/                     # Page components
│   │   ├── Index.tsx              # Main application page
│   │   └── NotFound.tsx           # 404 page
│   │
│   ├── lib/                       # Utility functions and libraries
│   │   ├── crypto.ts              # ⭐ Encryption/decryption functions
│   │   ├── utils.ts               # Shared utilities
│   │   └── constants.ts           # Constants and config
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useCrypto.ts           # Crypto operations hook
│   │   └── useTheme.ts            # Theme management hook
│   │
│   ├── App.tsx                    # Root app component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
│
├── public/                         # 📦 Static assets
│   ├── favicon.ico                # Browser tab icon
│   ├── manifest.json              # PWA manifest
│   └── robots.txt                 # SEO robots directive
│
├── tests/                         # ✅ Test files
│   ├── crypto.test.ts             # Cryptography tests
│   ├── components/                # Component tests
│   └── [test files]              # Other test files
│
├── .github/                       # GitHub configuration
│   ├── ISSUE_TEMPLATE/           # Issue templates
│   │   ├── bug_report.md         # Bug report template
│   │   ├── feature_request.md    # Feature request template
│   │   └── config.yml            # Template routing
│   │
│   └── pull_request_template.md  # PR template
│
├── .editorconfig                 # Editor consistency config
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment variables template
│
├── README.md                     # 📖 Project overview
├── CONTRIBUTING.md               # Contribution guidelines
├── CODE_OF_CONDUCT.md            # Community standards
├── SECURITY.md                   # Security policy
├── LICENSE                       # MIT License
├── CHANGELOG.md                  # Version history
│
├── package.json                  # Project metadata and dependencies
├── package-lock.json             # Locked dependency versions
│
├── vite.config.ts                # Vite build configuration
├── vitest.config.ts              # Vitest test configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
│
└── dist/                         # 📦 Build output (generated)
    ├── index.html               # Compiled HTML
    ├── assets/                  # Compiled JS/CSS
    └── manifest.json            # PWA manifest
```

## Key Files Explained

### Core Application Files

#### `src/App.tsx`
**Purpose**: Root component and router configuration

**Responsibilities**:
- Sets up React Query provider
- Configures React Router
- Manages theme/tooltip providers
- Defines application routes

```typescript
// Structure:
QueryClientProvider
  └─ TooltipProvider
      └─ BrowserRouter
          └─ Routes
              ├─ Route "/" → Index page
              └─ Route "*" → NotFound page
```

#### `src/main.tsx`
**Purpose**: Application entry point

**Responsibilities**:
- Mounts React app to DOM
- Imports global styles
- Initializes third-party libraries

```typescript
// Minimal setup:
ReactDOM.createRoot(document.getElementById('app')!)
  .render(<App />)
```

#### `src/lib/crypto.ts`
**Purpose**: Core cryptography module ⭐

**Exports**:
- `encryptText()` - Main encryption function
- `decryptText()` - Main decryption function
- `computeHmacSha512()` - HMAC generation
- `computeSha256Fingerprint()` - Hash fingerprinting

**Size**: ~130 lines of well-commented code
**Dependencies**: Web Crypto API only (built-in)

### Configuration Files

#### `vite.config.ts`
**Purpose**: Build tool configuration

**Key settings**:
- Vue/React plugin configuration
- Build optimization options
- Development server settings
- PWA plugin configuration

#### `tsconfig.json`
**Purpose**: TypeScript compiler options

**Key settings**:
- Strict mode enabled
- Module resolution paths (@/...)
- Target ES2020+ for modern JS
- React JSX support

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS customization

**Customizations**:
- Color palette
- Typography scales
- Spacing values
- Custom components

#### `.eslintrc.json`
**Purpose**: Code quality rules

**Coverage**:
- TypeScript strict checking
- React hooks rules
- Import ordering
- Code style consistency

### Documentation Files

#### `docs/ARCHITECTURE.md`
- System design overview
- Cryptographic flow diagrams
- Component interactions
- Security model explanation

#### `docs/DEVELOPMENT.md`
- Local setup instructions
- Project structure explanation
- Development workflows
- Debugging techniques

#### `docs/API.md`
- Cryptography function documentation
- Usage examples
- Parameter specifications
- Security notes

#### `docs/TESTING.md`
- Test strategy and framework
- Writing tests
- Coverage goals
- CI/CD integration

#### `docs/DEPLOYMENT.md`
- Production build process
- Deployment platform guides
- Performance optimization
- Monitoring and analytics

#### `docs/TROUBLESHOOTING.md`
- Common issues and solutions
- Debug techniques
- Error explanations
- Getting help resources

#### `docs/SECURITY_IMPLEMENTATION.md`
- Deep cryptographic analysis
- Implementation details
- Threat model analysis
- Security audit checklist

### GitHub Configuration Files

#### `.github/ISSUE_TEMPLATE/`
**Files**:
- `bug_report.md` - Bug report template
- `feature_request.md` - Feature request template
- `config.yml` - Template routing and defaults

**Purpose**: Guide users to provide good issue information

#### `.github/pull_request_template.md`
**Purpose**: Guide PR authors with checklist

**Contents**:
- What changed?
- Why changed?
- Testing information
- Review checklist

### Environment & Build Files

#### `.env.example`
**Purpose**: Template for environment variables

**Contents**:
```
VITE_APP_TITLE=StarryCrypt
VITE_API_URL=...
```

Use as reference for `.env.local`

#### `.editorconfig`
**Purpose**: Cross-editor consistency

**Settings**:
- 2-space indentation
- LF line endings
- UTF-8 charset
- Trailing newlines

#### `.gitignore`
**Purpose**: Exclude files from version control

**Excluded**:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.env.local` - Local config
- `.vscode/` - Editor settings
- IDE files and OS cruft

## Component Organization

### UI Components (`src/components/ui/`)

Generated from shadcn/ui, includes:
- `button.tsx` - Reusable button
- `input.tsx` - Form input
- `dialog.tsx` - Modal dialogs
- `form.tsx` - Form wrapper
- `toaster.tsx` - Toast notifications
- `tabs.tsx` - Tabbed interface
- `label.tsx` - Form labels
- And 20+ more...

**Purpose**: Consistent, accessible UI primitives

### Page Components (`src/pages/`)

#### `Index.tsx`
**Purpose**: Main application page

**Features**:
- Encryption/decryption forms
- QR code generation
- Share functionality
- Language selection

**Organization**:
- Component logic in one file
- Can be split into smaller components as it grows
- Uses custom hooks for state management

#### `NotFound.tsx`
**Purpose**: 404 error page

**Features**:
- User-friendly 404 message
- Link back to home page

## Data Flow

### Encryption Flow
```
User Input (Text + Password)
    ↓
Form Component (src/pages/Index.tsx)
    ↓
Crypto Library (src/lib/crypto.ts)
    ↓
Web Crypto API (built-in)
    ↓
Encrypted Result → State → UI Display
```

### Decryption Flow
```
Encrypted Data + Password (URL or form)
    ↓
Form Component (src/pages/Index.tsx)
    ↓
Crypto Library (src/lib/crypto.ts)
    ↓
Web Crypto API (built-in)
    ↓
Decrypted Result → State → UI Display
```

## State Management

**Library**: React Query (TanStack Query)

**Purpose**: Cache and synchronize async data

**Key hooks**:
- `useQuery()` - Fetch and cache data
- `useMutation()` - Async operations

**Usage**: Manage encryption/decryption state

## Styling Strategy

**Framework**: Tailwind CSS v3

**Organization**:
- `src/index.css` - Global utilities
- Tailwind v3 syntax (@apply, etc.)
- Responsive design (mobile-first)
- Dark mode support (via next-themes)

**Component styling**: Inline Tailwind classes

## Build Output

### Production Build (`npm run build`)

```
dist/
├── index.html              # Single HTML file
├── assets/
│   ├── index-ABC123.js    # Main bundle (minified)
│   ├── vendor-DEF456.js   # Dependencies (minified)
│   ├── index-GHI789.css   # Styles (minified)
│   └── fonts.woff2        # Web fonts
└── manifest.json          # PWA manifest
```

**Typical sizes** (gzipped):
- Main JS: 60-80 KB
- Vendor JS: 120-180 KB
- CSS: 10-20 KB
- **Total**: ~200-280 KB

## Development Workflow

```
1. Clone repo
   ↓
2. npm install
   ↓
3. npm run dev
   ↓
4. Edit src/ files
   ↓
5. HMR updates preview
   ↓
6. npm run test (verify changes)
   ↓
7. npm run lint (check quality)
   ↓
8. git add/commit/push
```

## Testing Structure

```
tests/
├── crypto.test.ts          # Crypto function tests
├── components/
│   └── [component].test.ts # Component tests
└── integration/
    └── [feature].test.ts   # Integration tests
```

**Test framework**: Vitest (Jest-compatible)

**File naming**: `*.test.ts` or `*.test.tsx`

## Growth Strategy

### Phase 1 (Current)
- Single page app (Index.tsx)
- Monolithic component

### Phase 2 (Future)
- Split Index.tsx into smaller components
- Add more pages if features grow
- Extract more reusable components

### Phase 3 (Potential)
- Backend API support (encryption as service)
- User accounts and cloud storage
- Sharing links with expiration
- More cryptographic algorithms

## Adding New Features

### New Component
1. Create `src/components/NewComponent.tsx`
2. Import in `src/pages/Index.tsx`
3. Use in JSX

### New Page
1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Link from navigation

### New Hook
1. Create `src/hooks/useNewHook.ts`
2. Export hook function
3. Use in components

### New Utility
1. Create function in `src/lib/utils.ts`
2. Export function
3. Import where needed

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase.tsx | `Button.tsx` |
| Pages | PascalCase.tsx | `HomePage.tsx` |
| Hooks | use + PascalCase.ts | `useCrypto.ts` |
| Utilities | camelCase.ts | `formatDate.ts` |
| Tests | *.test.ts(x) | `crypto.test.ts` |
| Types/Interfaces | PascalCase.ts | `User.ts` |
| Constants | UPPER_CASE | `TIMEOUT = 5000` |

## Import Path Aliases

Configured in `tsconfig.json`:

```typescript
// Instead of:
import { crypto } from '../../../lib/crypto'

// Use:
import { crypto } from '@/lib/crypto'
```

**Aliases defined**:
- `@/*` → `src/*` (project root)

## Dependency Graph

```
index.html
  └─ main.tsx
      └─ App.tsx
          ├─ pages/Index.tsx
          │   ├─ components/ui/*
          │   ├─ lib/crypto.ts
          │   └─ lib/utils.ts
          │
          └─ pages/NotFound.tsx
              └─ components/ui/button.tsx

External Libraries:
├─ React 18
├─ React Router
├─ React Query (TanStack)
├─ Tailwind CSS
├─ Radix UI
├─ Lucide Icons
└─ Web Crypto API (built-in)
```

## Next Steps

1. **Understand**: Read [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Develop**: Follow [DEVELOPMENT.md](DEVELOPMENT.md)
3. **Test**: Review [TESTING.md](TESTING.md)
4. **Learn Crypto**: Study [API.md](API.md)
5. **Contribute**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
