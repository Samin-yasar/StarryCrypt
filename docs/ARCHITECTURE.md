# StarryCrypt Architecture Guide

## Overview

StarryCrypt is a zero-knowledge web application that performs all encryption and decryption entirely within the browser. This document explains the system design, cryptographic architecture, and data flow.

## System Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────┐
│              StarryCrypt Application                │
├─────────────────────────────────────────────────────┤
│                  React Frontend                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  UI Components                               │   │
│  │  ├─ Encryption Form                          │   │
│  │  ├─ Decryption Form                          │   │
│  │  ├─ QR Code Display                          │   │
│  │  └─ Results Display                          │   │
│  └──────────────────────────────────────────────┘   │
│                         │                            │
│  ┌──────────────────────────────────────────────┐   │
│  │  State Management (React Query)              │   │
│  │  └─ Manage ciphertext, decrypted text        │   │
│  └──────────────────────────────────────────────┘   │
│                         │                            │
│  ┌──────────────────────────────────────────────┐   │
│  │  Crypto Library (src/lib/crypto.ts)          │   │
│  │  └─ Encryption & Decryption Logic            │   │
│  └──────────────────────────────────────────────┘   │
│                         │                            │
│  ┌──────────────────────────────────────────────┐   │
│  │  Web Crypto API                              │   │
│  │  └─ Native browser cryptography              │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Key Principle: Zero-Knowledge

**No data ever leaves your browser.** The application:
- Performs all encryption/decryption locally
- Never sends plaintext to any server
- Never stores passwords or keys
- Generates all cryptographic randomness locally

## Cryptographic Architecture

### Encryption Process Flow

```
User Input (Plaintext + Password)
        │
        ▼
[1] Generate Cryptographic Randomness
    ├─ Random Salt (32 bytes)
    └─ Random IV (12 bytes)
        │
        ▼
[2] Key Derivation (PBKDF2-SHA512)
    ├─ Input: Password + Salt + Iterations
    └─ Output: 256-bit Encryption Key
        │
        ▼
[3] Create Protocol Header
    ├─ Format Version (1 byte)
    ├─ Iteration Count (4 bytes)
    └─ Salt (32 bytes)
    ├─ Total: 37 bytes
        │
        ▼
[4] AES-GCM Encryption
    ├─ Algorithm: AES-256-GCM
    ├─ Additional Authenticated Data (AAD): Header
    └─ Output: Ciphertext + Authentication Tag
        │
        ▼
[5] Construct Output
    ├─ Header (37 bytes)
    ├─ IV (12 bytes)
    └─ Ciphertext (variable length)
        │
        ▼
[6] Base64 Encode
    └─ Final output ready for sharing
```

### Decryption Process Flow

```
User Input (Base64 Ciphertext + Password)
        │
        ▼
[1] Base64 Decode
    └─ Convert from text to binary
        │
        ▼
[2] Parse Protocol Header
    ├─ Validate Format Version
    ├─ Extract Iteration Count
    ├─ Extract Salt (32 bytes)
    └─ Extract IV (12 bytes)
        │
        ▼
[3] Validate Format
    ├─ Check version compatibility
    ├─ Validate iteration count range
    │  (400,000 - 10,000,000)
    └─ Check ciphertext length
        │
        ▼
[4] Key Derivation (PBKDF2-SHA512)
    ├─ Input: Password + Extracted Salt + Iterations
    └─ Output: 256-bit Decryption Key
        │
        ▼
[5] AES-GCM Decryption
    ├─ Algorithm: AES-256-GCM
    ├─ Additional Authenticated Data (AAD): Header
    └─ Verify authentication tag
        │
        ▼
[6] Output Plaintext or Error
    └─ If authentication fails: "Decryption failed"
```

## Core Components

### Cryptography Library (`src/lib/crypto.ts`)

The heart of StarryCrypt. Contains four main functions:

#### 1. `encryptText(text, password, iterations)`
- **Purpose**: Encrypt plaintext with a password
- **Parameters**:
  - `text`: The plaintext to encrypt
  - `password`: User's password for key derivation
  - `iterations`: PBKDF2 iterations (clamped to 400k-10m)
- **Returns**: Base64-encoded encrypted data
- **Security**: Uses cryptographically secure random generation

#### 2. `decryptText(encryptedBase64, password)`
- **Purpose**: Decrypt ciphertext with a password
- **Parameters**:
  - `encryptedBase64`: The Base64-encoded ciphertext
  - `password`: User's password for key derivation
- **Returns**: Decrypted plaintext
- **Error Handling**: Generic "Decryption failed" message for all failures

#### 3. `computeHmacSha512(data, key)`
- **Purpose**: Generate HMAC-SHA512 for integrity verification
- **Use Case**: Optional feature for additional data integrity checking
- **Returns**: Hexadecimal hash string

#### 4. `computeSha256Fingerprint(data)`
- **Purpose**: Generate a short SHA-256 fingerprint for display
- **Use Case**: Show abbreviated hash for verification
- **Returns**: First 12 characters of SHA-256 hash in uppercase

### React Components

#### Index Page (`src/pages/Index.tsx`)
- Main application interface
- Form handling for encryption/decryption
- URL parameter parsing for shared encrypted data
- Display of results and sharing options

#### Support Components (`src/components/`)
- UI controls and dialogs
- QR code generation and display
- Copy-to-clipboard functionality
- Theme toggle and language switching

### State Management

Uses **React Query** for:
- Caching decrypted text during session
- Managing form state across navigation
- Handling async crypto operations

## Security Considerations

### Key Derivation Security

**PBKDF2-SHA512 Configuration:**
- **Algorithm**: PBKDF2 (Password-Based Key Derivation Function 2)
- **Hash Function**: SHA-512 (512-bit output)
- **Iterations**: User-configurable (400k - 10 million)
  - Default: 400,000 (fast, secure for modern hardware)
  - Higher iterations = slower but more resistant to brute force
- **Output**: 256-bit key for AES encryption

**Why these parameters?**
- SHA-512 provides excellent hash strength and security margin
- High iteration counts resist dictionary and brute-force attacks
- Configurable iterations allow security/performance trade-off

### Encryption Security

**AES-GCM-256 Implementation:**
- **Algorithm**: Advanced Encryption Standard
- **Mode**: Galois/Counter Mode (authenticated encryption)
- **Key Size**: 256 bits (highest security level)
- **IV Size**: 12 bytes (96 bits, optimal for GCM)
- **Authentication**: Built-in GCM authentication tag (16 bytes)

**Why AES-GCM?**
- Provides both confidentiality AND authenticity
- Prevents tampering and decryption of modified ciphertext
- Industry standard recommended by NIST
- Constant-time implementation in Web Crypto API

### Randomness

All randomness is generated using `crypto.getRandomValues()`:
- Uses the operating system's entropy pool
- Cryptographically secure
- Non-deterministic across calls
- Different salt and IV for each encryption

### Error Handling

Generic "Decryption failed" errors prevent:
- Information leakage about which part of decryption failed
- Attacks that exploit detailed error messages
- Timing attacks on authentication verification

## Data Flow Security

### Encryption Data Flow

```
User Input
    │
    ├─ Plaintext + Password enter browser
    │
    └─ All processing happens CLIENT-SIDE
       ├─ Key derivation (local)
       ├─ Encryption (local)
       ├─ No network requests
       └─ No server involvement
            │
            ▼
        Result: Base64 ciphertext
        (Can be safely shared, stored, or URL-encoded)
```

### Decryption Data Flow

```
Encrypted Data + Password
    │
    ├─ User provides via form or URL
    │
    └─ All processing happens CLIENT-SIDE
       ├─ No network requests
       ├─ Key derivation (local)
       ├─ Decryption (local)
       ├─ Authentication verification (local)
       └─ No server involvement
            │
            ▼
        Result: Plaintext (displayed in browser)
```

## Protocol Specification

### Format Version 1

**Ciphertext Structure (Binary):**

```
Bytes 0-36:   Header (37 bytes total)
  └─ Byte 0:      Format Version (1 byte) = 0x01
  └─ Bytes 1-4:   Iteration Count (4 bytes, big-endian)
  └─ Bytes 5-36:  Salt (32 bytes)

Bytes 37-48:  Initialization Vector (12 bytes)

Bytes 49+:    Ciphertext + GCM Tag
  └─ Ciphertext:  Encrypted plaintext
  └─ GCM Tag:     Authentication tag (16 bytes at end)
```

**Encoded Format:** Base64 encoding of the entire binary structure

**Advantages:**
- Compact binary format
- Self-describing (version + iteration count)
- GCM provides authenticated encryption
- Salting prevents rainbow table attacks

## Future Extensibility

The protocol design allows for:
- Additional format versions
- Different algorithms (with version indicators)
- Metadata storage in header extension
- Streaming encryption of large files

## Performance Characteristics

- **Encryption Time**: ~1-5 seconds (depends on iteration count)
- **Decryption Time**: ~1-5 seconds (same as encryption)
- **Key Derivation**: ~400ms-2s (PBKDF2 with 400k iterations)
- **Plaintext Size**: Browser memory limited (typically 50MB+)

## Browser Compatibility

- Modern browsers with Web Crypto API support
- All major browsers: Chrome 37+, Firefox 34+, Safari 11+, Edge 79+
- Fallback detection for older browsers
