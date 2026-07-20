# StarryCrypt

[![License: MIT](https://img.shields.io/badge/License-GNU_GPL_v3-blue)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Samin-yasar/StarryCrypt?style=social)](https://github.com/Samin-yasar/StarryCrypt)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Samin-yasar/StarryCrypt/ci.yml?branch=main)](https://github.com/Samin-yasar/StarryCrypt/actions)

> **Secure, client-side text encryption and decryption powered by the Web Crypto API.**

StarryCrypt is a modern, zero-knowledge web application that provides robust text encryption and decryption entirely within the browser. Designed with privacy as the highest priority, no plaintext or passwords ever leave your device.

Perfect for securely sharing sensitive messages, storing encrypted notes, or learning about modern web cryptography.

**🔒 Zero-Knowledge · 🚀 Fast · 📱 Responsive · 🌍 i18n Support · 🔐 Industry-Standard Crypto**

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Security Model](#security-model)
- [Getting Started](#getting-started)
- [Development](#development)
- [Contributing](#contributing)
- [Security Policy](#security-policy)
- [Documentation](#documentation)
- [License](#license)

## Features

- **Robust Security**: Utilizes industry-standard cryptographic algorithms (AES-GCM-256, PBKDF2-SHA-512).
- **Zero-Knowledge Architecture**: All cryptographic operations are executed locally in your browser. No server communication is involved in the encryption/decryption process.
- **Seamless Sharing**: Share encrypted messages via QR codes, direct URL sharing, or file downloads.
- **Internationalization (i18n)**: Built-in multi-language UI support for global accessibility.
- **Modern UI/UX**: A beautiful, responsive interface built with React, Tailwind CSS, and shadcn/ui.
- **Auto-cleanup**: Intelligent URL input handling with automatic query parameter sanitization to prevent accidental data leaks.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & shadcn/ui
- **Cryptography**: Native Web Crypto API
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod
- **Icons & Components**: Lucide React, Radix UI, Recharts

## Security Model

StarryCrypt implements a strict security model to ensure your data remains confidential and tamper-proof:

- **Encryption Algorithm**: AES-GCM-256 (Advanced Encryption Standard in Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with SHA-512 (Password-Based Key Derivation Function 2)
- **Salting & IVs**: A cryptographically secure random salt and Initialization Vector (IV) are generated for every single encryption operation.
- **Integrity Checking**: Optional HMAC tags are used to verify the authenticity and integrity of the ciphertext before decryption.

## Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm installed on your local machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Samin-yasar/StarryCrypt.git
   cd StarryCrypt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Testing & Linting

Maintain code quality and ensure cryptographic functions work as expected:

- **Run Unit Tests**: `npm run test`
- **Watch Mode**: `npm run test:watch`
- **Lint Code**: `npm run lint`

## Development

For detailed development setup, architecture overview, and contribution guidelines, see our [Development Guide](docs/DEVELOPMENT.md).

### Quick Start
```bash
git clone https://github.com/Samin-yasar/StarryCrypt.git
cd StarryCrypt
npm install
npm run dev
```

## Contributing

We welcome contributions! Please read our:
- [Contributing Guide](CONTRIBUTING.md) - Workflow and conventions
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community standards
- [Development Guide](docs/DEVELOPMENT.md) - Setup and architecture

For a list of good first issues to tackle, see our [GitHub Issues](https://github.com/Samin-yasar/StarryCrypt/issues).

## Security Policy

Please refer to [SECURITY.md](SECURITY.md) for detailed information on our security practices and how to report vulnerabilities.

## Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - System design and crypto flows
- [API Reference](docs/API.md) - Cryptographic function documentation
- [Testing Guide](docs/TESTING.md) - Test strategy and coverage
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## License

Distributed under the GNU GPL-3.0 License. See [LICENSE](LICENSE) for more information.

## Support

If you find this project useful, please consider:
- Starring the repository ⭐
- Reporting bugs or suggesting features
- Contributing code or documentation
- Sharing with others who might benefit
