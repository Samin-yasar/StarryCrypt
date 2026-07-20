# Contributing to StarryCrypt

First off, thank you for your interest in contributing to StarryCrypt! Open-source projects thrive on community contributions, and we appreciate your time and effort.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contribution Types](#contribution-types)
- [Pull Request Process](#pull-request-process)
- [Commit Conventions](#commit-conventions)
- [Code Review](#code-review)

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards and expectations.

## How to Contribute

There are many ways to contribute to StarryCrypt:

### Bug Reports
- Report security vulnerabilities via [SECURITY.md](SECURITY.md) (please do NOT open public issues for security bugs)
- Report other bugs via [GitHub Issues](https://github.com/Samin-yasar/StarryCrypt/issues/new/choose)
- Check existing issues before reporting duplicates

### Feature Requests
- Propose new features via [GitHub Issues](https://github.com/Samin-yasar/StarryCrypt/issues/new/choose)
- Include use cases and benefits
- Be open to discussion and refinement

### Code Contributions
- Bug fixes, performance improvements, or feature implementations
- See [Good First Issues](https://github.com/Samin-yasar/StarryCrypt/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

### Documentation & Translations
- Improve existing documentation
- Add new guides or examples
- Translate the UI or documentation

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic familiarity with React and TypeScript

### Setup

1. **Fork the repository** to your own GitHub account
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/StarryCrypt.git
   cd StarryCrypt
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Samin-yasar/StarryCrypt.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

### Branch Naming Conventions

Use descriptive branch names following this pattern:
- `feature/description` - New features or enhancements
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Test additions or improvements
- `refactor/description` - Code refactoring
- `chore/description` - Maintenance tasks (dependencies, scripts, etc.)

Example: `feature/add-password-strength-meter`, `fix/crypto-edge-case`

### Daily Development

1. **Create and checkout a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** - Keep commits atomic and well-organized

3. **Run development server**: `npm run dev`

4. **Verify your work**:
   - Run tests: `npm run test`
   - Check linting: `npm run lint`
   - Build the project: `npm run build`

5. **Commit with clear messages** (see [Commit Conventions](#commit-conventions))

### Keeping Your Fork Updated

Before submitting a PR, sync your branch with upstream:
```bash
git fetch upstream
git rebase upstream/main
```

## Contribution Types

### Security-Critical Contributions
Because this is a cryptography tool:
- **Preserve Security Properties**: Never weaken encryption algorithms or security flows
- **Avoid Unsafe Patterns**: No `dangerouslySetInnerHTML`, `eval()`, or arbitrary script execution
- **Test Thoroughly**: Security-related changes require comprehensive tests
- **Update Docs**: Document any security implications or implementation details

### Code Quality
- Follow the existing code style (ESLint will help)
- Add JSDoc comments for complex logic
- Ensure functions have clear purposes and responsibilities
- Write tests for new functionality

### Documentation
- Update README.md if behavior changes
- Add comments explaining "why", not just "what"
- Keep docs in sync with code changes
- Update relevant guides in the `docs/` directory

## Pull Request Process

### Before Submitting

1. **Sync with upstream** (see above)
2. **Run full test suite**: `npm run test`
3. **Check linting**: `npm run lint`
4. **Build successfully**: `npm run build`
5. **Write clear commit messages**

### Submitting the PR

1. **Push to your fork**:
   ```bash
   git push origin your-branch-name
   ```

2. **Open a Pull Request** with:
   - Clear title describing what changed
   - Description of changes and motivation
   - Related issue numbers (e.g., "Fixes #123")
   - Screenshots for UI changes

3. **PR Template** (will be auto-filled):
   - What changed?
   - Why did this need to change?
   - How were changes tested?
   - Any breaking changes?

4. **Respond to feedback** promptly and professionally

## Commit Conventions

Use clear, descriptive commit messages following this format:

```
<type>: <short description>

<detailed explanation (optional)>

Fixes #<issue-number> (if applicable)
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (no logic changes)
- `refactor:` - Code refactoring
- `test:` - Test additions/modifications
- `chore:` - Build, dependencies, or tooling

**Examples:**
```
feat: add password strength meter to encryption form
fix: resolve IV generation edge case in GCM mode
docs: add architecture guide for crypto implementation
test: increase coverage for key derivation functions
```

## Code Review

### What to Expect

1. Maintainers will review your PR within a reasonable timeframe
2. You may receive suggestions for improvements
3. Reviews focus on security, performance, maintainability, and testing
4. All feedback is constructive and aimed at improving the project

### Review Criteria

- Code quality and clarity
- Security implications
- Test coverage
- Documentation completeness
- Performance impact
- Consistency with project standards

### Tips for Faster Merges

- Make focused PRs that do one thing well
- Include tests for new functionality
- Add documentation for user-facing changes
- Keep commits organized and well-messaged
- Respond to review feedback promptly

## Questions?

- Check [Discussions](https://github.com/Samin-yasar/StarryCrypt/discussions)
- Read the [Development Guide](docs/DEVELOPMENT.md)
- Ask in the PR or issue thread

Thank you for making StarryCrypt better! We appreciate your time and effort.
