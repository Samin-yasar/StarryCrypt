# 🤝 Contributing to StarryCrypt

First off, thank you for your interest in contributing to StarryCrypt! Open-source projects thrive on community contributions, and we appreciate your time and effort.

## 🚀 Getting Started

1. **Fork the repository** to your own GitHub account.
2. **Clone the project** to your local machine.
3. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

## 🛠️ Development Workflow

- **Run the dev server**: `npm run dev`
- **Make focused changes**: Keep your pull requests scoped to a single feature or bug fix.
- **Verify changes**:
  - Run the test suite: `npm run test`
  - Build the project: `npm run build`
  - Check for linting errors: `npm run lint` (note: existing baseline lint issues may be unrelated to your changes).

## 🛡️ Contribution Guidelines

Because this is a security-focused tool, please adhere to the following when writing code:
- **Security First**: Preserve the security properties of all cryptographic flows.
- **Safe Rendering**: Avoid introducing unsafe rendering techniques (e.g., `dangerouslySetInnerHTML`) or any arbitrary script execution paths.
- **Documentation**: Add or update documentation (like the `README.md`) when the application's behavior changes.

## 📬 Submitting a Pull Request

1. Push your changes to your fork.
2. Open a Pull Request against the original repository.
3. Provide a clear summary of your changes in the PR description.

We will review your PR as soon as possible. Thank you for making StarryCrypt better!
