# 🌌 StarryCrypt

> **Secure, client-side text encryption and decryption powered by the Web Crypto API.**

StarryCrypt is a modern, zero-knowledge web application that provides robust text encryption and decryption entirely within the browser. Designed with privacy as the highest priority, no plaintext or passwords ever leave your device. 

Perfect for securely sharing sensitive messages, storing encrypted notes, or learning about modern web cryptography.

## ✨ Features

- **🔐 Robust Security**: Utilizes industry-standard cryptographic algorithms (AES-GCM-256, PBKDF2-SHA-512).
- **🛡️ Zero-Knowledge Architecture**: All cryptographic operations are executed locally in your browser. No server communication is involved in the encryption/decryption process.
- **🔗 Seamless Sharing**: Share encrypted messages via QR codes, direct URL sharing, or file downloads.
- **🌐 Internationalization (i18n)**: Built-in multi-language UI support for global accessibility.
- **✨ Modern UI/UX**: A beautiful, responsive interface built with React, Tailwind CSS, and shadcn/ui.
- **🧹 Auto-cleanup**: Intelligent URL input handling with automatic query parameter sanitization to prevent accidental data leaks.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & shadcn/ui
- **Cryptography**: Native Web Crypto API
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod
- **Icons & Components**: Lucide React, Radix UI, Recharts

## 🔒 Security Model

StarryCrypt implements a strict security model to ensure your data remains confidential and tamper-proof:

- **Encryption Algorithm**: AES-GCM-256 (Advanced Encryption Standard in Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with SHA-512 (Password-Based Key Derivation Function 2)
- **Salting & IVs**: A cryptographically secure random salt and Initialization Vector (IV) are generated for every single encryption operation.
- **Integrity Checking**: Optional HMAC tags are used to verify the authenticity and integrity of the ciphertext before decryption.

## 🚀 Getting Started

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

## 🧪 Testing & Linting

Maintain code quality and ensure cryptographic functions work as expected:

- **Run Unit Tests**: `npm run test`
- **Watch Mode**: `npm run test:watch`
- **Lint Code**: `npm run lint`

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a Pull Request.

## 🛡️ Security Policy

Please refer to [SECURITY.md](SECURITY.md) for detailed information on our security practices and how to report vulnerabilities.

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
