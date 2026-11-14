# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- `vercel.json` with CSP (frame-ancestors none), HSTS, nosniff, no-referrer, X-Frame-Options and Permissions-Policy
- Error boundary around the QR code and the whole app
- Hint for short passwords; whitespace-only passwords rejected for encryption
- Confirmation before decrypting messages that need more than 2,000,000 iterations
- Accessible names for icon buttons, linked form labels, and `<html lang>` that follows the selected language
- UI and helper tests (QR limits, share links, clipboard clearing, error boundary)
- Comprehensive documentation suite (8 guides)
- GitHub issue and PR templates
- EditorConfig for cross-editor consistency
- Enhanced package.json with FOSS metadata
- Contribution guidelines with branch naming conventions
- Development setup and troubleshooting guides

### Changed
- Upgraded to the latest majors: React 19, React Router 7, Vite 8, Vitest 5, jsdom 31, ESLint 10 (with typescript-eslint 8 and eslint-plugin-react-hooks 7), Tailwind CSS 4 (CSS-first config; `tailwind.config.ts` removed), Sonner 2, lucide-react 1, tailwind-merge 3, `@vitejs/plugin-react-swc` 4 and vite-plugin-pwa 2. TypeScript is held at 6.0 because typescript-eslint does not yet support 7. Node 22.22+ or 24.15+ is now required.
- State derived from props now follows the React 19 hook rules: the StarID and the QR panel are tied to the exact password/output they were computed for instead of being reset in effects.
- Share links pasted into an already-open tab (a fragment-only change) are now imported via a `hashchange` listener.
- lucide-react 1 removed brand icons, so the GitHub mark is inlined in the navbar.
- Share links now use the URL fragment (`#encrypted=...`) instead of the query string; old links still work
- Labels corrected: "Entropy Scale" is now "Key Stretching", the 1,000,000 option is "Strongest" (was "Maximum"), "Memory Wipe" is "Auto-clear clipboard", and the unsupported "Enterprise-grade" claim was removed (all six languages)
- Passwords are now normalized to Unicode NFKC before key derivation (data encrypted with a raw non-normalized password still decrypts via fallback)
- StarID is now a 16-bit PBKDF2-derived, domain-separated fingerprint (was 48 bits of unsalted SHA-256) and is computed after a 500 ms pause in typing
- Crypto test suite replaces the placeholder test; docs corrected (GCM-SIV mention, brute-force estimates, API reference)
- README updated with badges and better structure
- CONTRIBUTING.md significantly expanded with workflows
- .gitignore enhanced for modern development

### Fixed
- QR code crash for output over 2,331 bytes (the old 2,953-character limit was wrong for level M and ignored multi-byte text), including when the output changed while the QR was open
- QR code could be generated from decrypted plaintext; it is now encrypted output only
- Stale StarID could look like a match while typing; it now clears immediately and sits beside the password field with an explanation
- Clipboard auto-clear no longer overwrites newer clipboard content when it can tell, reports failure honestly, and keeps a single timer
- Ctrl/Cmd+Enter no longer starts a second encryption while one is running
- Downloaded decrypted text is named `decrypted.txt` instead of `encrypt.enc.txt`

### Deprecated
- (Add deprecations here)

### Removed
- 40 unused dependencies (Radix primitives, recharts, react-hook-form, zod, react-query, date-fns, and others), the unused shadcn/ui components and a duplicate toast system, plus the leftover `lovable-tagger` and dead Google Fonts caching rules. `npm audit` for production dependencies dropped from 11 findings to 2 (react-router 6; the advisories concern SSR and `<Link>`/`useNavigate`, which this app does not use, and the fix is a major upgrade)
- Optional HMAC integrity layer and its UI toggle (AES-GCM already authenticates everything; the HMAC let attackers test password guesses cheaply). Legacy `|hmac` suffixes are still accepted and ignored on decryption
- `computeHmacSha512()` and `computeSha256Fingerprint()` (replaced by `computePasswordFingerprint()`)

### Security
- Removed the HMAC-based password-guess shortcut and the weak 48-bit SHA-256 password fingerprint
- Fixed cross-platform decryption failures for non-ASCII passwords (NFC/NFD mismatch)

## [1.0.0] - 2024-01-XX

### Added
- Core encryption functionality with AES-256-GCM
- PBKDF2-SHA512 key derivation
- Zero-knowledge architecture (all operations client-side)
- Web-based UI with React and TypeScript
- Encryption and decryption forms
- QR code generation for sharing
- Internationalization (i18n) support
- Dark mode support
- PWA capabilities with offline support
- Responsive design for mobile and desktop
- Comprehensive test suite
- ESLint and TypeScript strict mode
- Security policy and code of conduct

### Features
- Secure text encryption with custom passwords
- Decryption of encrypted messages
- QR code generation and display
- Copy-to-clipboard functionality
- URL sharing with encrypted content
- Theme toggle (light/dark mode)
- Language selection for UI
- Configurable key derivation iterations

### Security
- No plaintext or passwords sent to servers
- All cryptographic operations performed locally
- Authentication via GCM tags
- Cryptographically secure randomness
- Configurable security parameters

---

## Guidelines for Adding Entries

### Types of Changes

Use these labels for changes:

- **Added**: New features or functionality
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be-removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security-related fixes or improvements

### Formatting

```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Existing feature modification

### Fixed
- Bug fix description

### Security
- Security fix description
```

### Versioning

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Breaking changes
- **MINOR** version (1.X.0): New features (backward compatible)
- **PATCH** version (1.0.X): Bug fixes (backward compatible)

Examples:
- `1.0.0` → `2.0.0`: Breaking change (major bump)
- `1.0.0` → `1.1.0`: New feature (minor bump)
- `1.0.0` → `1.0.1`: Bug fix (patch bump)

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Create release commit: `git commit -m "chore: release v1.0.1"`
4. Create git tag: `git tag v1.0.1`
5. Push: `git push origin main --tags`
6. GitHub automatically creates release

### Writing Good Changelog Entries

✅ **Good**:
- "Add password strength indicator to encryption form"
- "Fix GCM tag verification edge case with empty plaintext"
- "Improve key derivation performance with caching"

❌ **Bad**:
- "Update stuff"
- "Fix bug"
- "Various improvements"

### Security Entries

For security fixes, provide context without exposing details:

```markdown
### Security
- Fix potential timing attack in key comparison (CVE-2024-XXXX)
- Upgrade `crypto-lib` to address vulnerability
```

### External Links

Link to related issues and PRs:

```markdown
### Added
- New encryption mode ([#123](https://github.com/Samin-yasar/StarryCrypt/issues/123))

### Fixed
- Decryption failure with special characters ([#456](https://github.com/Samin-yasar/StarryCrypt/pull/456))
```

## Viewing Changes

- **Current release**: See latest entries under `## [Unreleased]`
- **Specific version**: Find `## [X.Y.Z] - YYYY-MM-DD`
- **All releases**: Visit [GitHub Releases](https://github.com/Samin-yasar/StarryCrypt/releases)

## Contributing to Changelog

1. Add changes to `## [Unreleased]` section
2. Categorize under appropriate type
3. Keep entries concise and user-focused
4. Link to related issues/PRs when relevant

## Release Timeline

- **Patch releases** (1.0.X): As needed for bug fixes
- **Minor releases** (1.X.0): Monthly or as features ready
- **Major releases** (X.0.0): Planned, significant changes

---

For more details on project development, see [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/](docs/).
