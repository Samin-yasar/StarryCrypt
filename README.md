# StarryCrypt

StarryCrypt is a secure, web-based tool for encrypting and decrypting text using AES encryption with PBKDF2 key derivation. It supports HMAC-SHA256 for integrity checks, QR code generation for sharing, and multilingual interfaces. Designed for ease of use, it allows users to share encrypted messages via URL links, copy results to the clipboard, and import/export text files.

## Features

- **Encryption/Decryption**: Encrypt and decrypt text using AES with customizable PBKDF2 iterations (default: 100,000).
- **HMAC-SHA256 Integrity**: Optional integrity verification to detect tampering.
- **Shareable Links**: Generate URLs to share encrypted text, with optional password and note inclusion.
- **QR Code Support**: Create QR codes for easy sharing of encrypted messages.
- **Multilingual**: Supports English, French, Spanish, Bengali, Japanese, Korean, Chinese, Turkish, Russian, and Arabic.
- **File Import/Export**: Import `.txt` or `.enc.txt` files and download encrypted output.
- **Auto-Clear Options**: Configurable auto-clear for output, clipboard, and inactivity timeouts.
- **Password Fingerprint**: Displays a SHA-256-based "Star ID" for password verification.
- **Dark/Light Themes**: Toggle between dark and light modes.
- **Keyboard Shortcuts**: Ctrl+Enter (Encrypt), Ctrl+Shift+Enter (Decrypt), Ctrl+S (Share), Ctrl+Q (QR Code).

## Installation

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- A local web server (e.g., VS Code Live Server, `python -m http.server`) or hosting platform (e.g., GitHub Pages).

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Samin-yasar/StarryCrypt.git
   cd StarryCrypt
