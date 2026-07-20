# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Comprehensive documentation suite (8 guides)
- GitHub issue and PR templates
- EditorConfig for cross-editor consistency
- Enhanced package.json with FOSS metadata
- Contribution guidelines with branch naming conventions
- Development setup and troubleshooting guides

### Changed
- README updated with badges and better structure
- CONTRIBUTING.md significantly expanded with workflows
- .gitignore enhanced for modern development

### Fixed
- (Add fixes here)

### Deprecated
- (Add deprecations here)

### Removed
- (Add removals here)

### Security
- (Add security fixes here)

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
