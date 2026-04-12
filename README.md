# StarryCrypt

StarryCrypt is a client-side React application for text encryption and decryption using Web Crypto APIs.

## Security model

- Encryption: AES-GCM-256
- Key derivation: PBKDF2-SHA-512
- Random salt and IV per encryption
- Optional HMAC integrity tag
- All cryptographic operations run in-browser

## Features

- Encrypt/decrypt arbitrary Unicode text
- Copy, download, and encrypted-URL sharing
- URL encrypted-input import with automatic query cleanup
- Explicit clear controls for plaintext, password, and output
- Multi-language UI

## Development

Repository path:

`/home/runner/work/starrycrypt/starrycrypt`

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Run lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

## Open-source compliance files

- License: `LICENSE`
- Security policy: `SECURITY.md`
- Contributing guide: `CONTRIBUTING.md`
- Code of conduct: `CODE_OF_CONDUCT.md`
