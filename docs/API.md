# StarryCrypt API Reference

Comprehensive documentation for all cryptographic functions in StarryCrypt.

## Overview

All cryptographic functions are located in `src/lib/crypto.ts`. These functions use the Web Crypto API to perform encryption and decryption entirely in the browser.

## Table of Contents

- [encryptText()](#encrypttext)
- [decryptText()](#decrypttext)
- [normalizePassword()](#normalizepassword)
- [computePasswordFingerprint()](#computepasswordfingerprint)
- [Constants](#constants)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Security Notes](#security-notes)

## encryptText()

Encrypts plaintext using a password with PBKDF2-SHA512 key derivation and AES-256-GCM encryption.

### Signature

```typescript
async function encryptText(
  text: string,
  password: string,
  iterations: number
): Promise<string>
```

### Parameters

| Parameter | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `text` | string | The plaintext to encrypt | Any string, empty string allowed |
| `password` | string | Password for key derivation (normalized to NFKC) | Any string, non-empty recommended |
| `iterations` | number | PBKDF2 iterations for key derivation | 400,000 - 10,000,000 (clamped automatically) |

### Returns

**Type:** `Promise<string>`

A Base64-encoded string containing:
1. Protocol header (37 bytes)
2. Initialization vector (12 bytes)
3. AES-GCM ciphertext with authentication tag

### Throws

- Throws if Web Crypto API is unavailable
- Throws if text encoding fails (rare)

### Example

```typescript
import { encryptText } from '@/lib/crypto';

async function encrypt() {
  const plaintext = 'Secret message';
  const password = 'my-secure-password';
  const iterations = 600000; // Higher = more secure but slower

  try {
    const ciphertext = await encryptText(plaintext, password, iterations);
    console.log('Encrypted:', ciphertext);
    // Output: "AQAAAAk5VvI..."
  } catch (error) {
    console.error('Encryption failed:', error);
  }
}
```

### Security Notes

- Iteration count is auto-clamped to valid range
- New random salt and IV generated each time
- Same plaintext + password produces different ciphertext (due to random salt/IV)
- Encryption is deterministic only in terms of algorithm, not output
- Use higher iteration counts (1,000,000+) for sensitive data

### Performance

- ~1-5 seconds depending on iteration count
- Higher iterations = slower but more secure against brute-force
- 400,000 iterations: ~1-2 seconds on modern hardware
- 1,000,000 iterations: ~3-4 seconds on modern hardware

## decryptText()

Decrypts a ciphertext encrypted with `encryptText()` using a password.

### Signature

```typescript
async function decryptText(
  encryptedBase64: string,
  password: string
): Promise<string>
```

### Parameters

| Parameter | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `encryptedBase64` | string | Base64-encoded ciphertext from `encryptText()` | Must be valid Base64. A legacy `\|<hmac>` suffix from older versions is ignored |
| `password` | string | Password used during encryption | Must match after NFKC normalization (raw form also tried for legacy data) |

### Returns

**Type:** `Promise<string>`

The decrypted plaintext. Throws an error if:
- Ciphertext is invalid or corrupted
- Password is incorrect
- Ciphertext format is unrecognized

### Throws

- Throws `Error` with message "Decryption failed" for any failure
- Generic error message for security (no details about failure type)

### Example

```typescript
import { decryptText } from '@/lib/crypto';

async function decrypt() {
  const ciphertext = 'AQAAAAk5VvI...'; // From encryptText()
  const password = 'my-secure-password'; // Must match

  try {
    const plaintext = await decryptText(ciphertext, password);
    console.log('Decrypted:', plaintext);
    // Output: "Secret message"
  } catch (error) {
    console.error('Decryption failed:', error.message);
    // "Decryption failed" - intentionally generic
  }
}
```

### Error Handling

All decryption failures return a generic "Decryption failed" error:
- Wrong password
- Corrupted ciphertext
- Invalid format version
- Invalid iteration count
- Authentication tag verification failure

This prevents information leakage that could aid attackers.

### Performance

- ~1-5 seconds (same as encryption)
- Time depends on iteration count stored in ciphertext
- Slower for ciphertexts encrypted with higher iteration counts

## normalizePassword()

Normalizes a password to Unicode NFKC before it is used for key derivation.

### Signature

```typescript
function normalizePassword(password: string): string
```

### Details

`encryptText()` and `decryptText()` call this automatically. It guarantees that the same visible password produces the same key bytes whether it was typed with composed characters (`é`, U+00E9) or decomposed ones (`e` + U+0301), and folds compatibility forms such as full-width letters (`ＡＢＣ` becomes `ABC`).

Backward compatibility: data encrypted before normalization was introduced used the raw password bytes. `decryptText()` therefore tries the normalized password first and, only if that fails and the raw password differs, tries the raw form. ASCII passwords are unaffected.

## computePasswordFingerprint()

Produces the short "StarID" shown beside the password so a user can confirm they typed the same password twice.

### Signature

```typescript
async function computePasswordFingerprint(password: string): Promise<string>
```

### Returns

An uppercase hexadecimal string of exactly 4 characters (16 bits), for example `"A7F3"`.

### How it is derived

- PBKDF2-SHA512, 210,000 iterations, over the NFKC-normalized password
- A fixed, domain-separated salt (`StarryCrypt/password-fingerprint/v1`), never the encryption salt, so the value is unrelated to the encryption key
- Output truncated to 16 bits

### Security Notes

- It is a typo check, not a secret and not a key. It must not be used for authentication or integrity.
- It is deliberately short and slow: 16 bits narrows a guess very little, and each guess still costs a full PBKDF2 run. Do not share screenshots of the StarID if the password is weak.
- The UI debounces the computation (500 ms after the last keystroke) so it does not run on every keypress.
- There is no separate HMAC or integrity API. Integrity and authenticity of ciphertexts come from AES-GCM with the header as additional authenticated data.

## Constants

### Format Version

```typescript
const FORMAT_VERSION = 1;
```

The protocol format version. Allows future compatibility with different formats.

### Size Constants

```typescript
const SALT_SIZE = 32;        // Bytes (256 bits)
const HEADER_SIZE = 37;      // Format(1) + Iterations(4) + Salt(32)
const IV_SIZE = 12;          // Bytes (96 bits)
const GCM_TAG_SIZE = 16;     // Bytes (128 bits)
```

### Iteration Bounds

```typescript
const MIN_ITERATIONS = 400000;      // Minimum PBKDF2 iterations
const MAX_ITERATIONS = 10000000;    // Maximum PBKDF2 iterations
```

These are enforced to ensure:
- Minimum security (prevent too-fast derivation)
- Maximum performance (prevent excessive CPU use)

## Error Handling

### Consistent Error Messages

All cryptographic errors return generic messages to prevent information leakage:

```typescript
// Instead of specific errors like:
// - "Password is incorrect"
// - "Ciphertext corrupted at byte 45"
// - "Authentication tag verification failed"

// All errors return:
throw new Error("Decryption failed");
```

### Handling Errors in Applications

```typescript
try {
  const plaintext = await decryptText(ciphertext, password);
} catch (error) {
  // Don't expose error details to users
  // Instead, show generic message:
  console.log('Unable to decrypt. Check password and try again.');
  
  // Log full error for debugging (server-side only):
  console.error('Debug info:', error);
}
```

## Examples

### Complete Encryption/Decryption Cycle

```typescript
import { encryptText, decryptText } from '@/lib/crypto';

async function example() {
  const plaintext = 'Sensitive information';
  const password = 'user-password-123';
  const iterations = 800000;

  // Encrypt
  console.log('Encrypting...');
  const ciphertext = await encryptText(plaintext, password, iterations);
  console.log('Ciphertext:', ciphertext);

  // Decrypt
  console.log('Decrypting...');
  const decrypted = await decryptText(ciphertext, password);
  console.log('Decrypted:', decrypted);

  // Verify
  console.log('Match:', plaintext === decrypted); // true
}
```

### Integration with React Component

```typescript
import { useState } from 'react';
import { encryptText, decryptText } from '@/lib/crypto';

export function CryptoDemo() {
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEncrypt = async () => {
    setLoading(true);
    try {
      const result = await encryptText(plaintext, password, 600000);
      setCiphertext(result);
    } catch (error) {
      console.error('Encryption failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    setLoading(true);
    try {
      const result = await decryptText(ciphertext, password);
      setPlaintext(result);
    } catch (error) {
      console.error('Decryption failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <textarea
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        placeholder="Text to encrypt"
      />
      <button onClick={handleEncrypt} disabled={loading}>
        Encrypt
      </button>
      <button onClick={handleDecrypt} disabled={loading}>
        Decrypt
      </button>
      {ciphertext && <pre>{ciphertext}</pre>}
    </div>
  );
}
```

### Showing a StarID

```typescript
import { computePasswordFingerprint } from '@/lib/crypto';

const starId = await computePasswordFingerprint('correct horse battery staple');
console.log(starId); // 4 hex characters, e.g. "A7F3"
```

## Security Notes

### Password Considerations

- **Strength**: Stronger passwords are more secure against brute-force
- **Length**: Aim for 12+ characters
- **Entropy**: Use mix of uppercase, lowercase, numbers, symbols
- **Uniqueness**: Use unique passwords for different purposes

### Iteration Count Selection

| Scenario | Recommended Iterations | Notes |
|----------|----------------------|-------|
| Web application | 400,000 - 800,000 | Default, good performance |
| High security | 1,000,000 - 2,000,000 | More resistant to GPU attacks |
| Maximum security | 5,000,000 - 10,000,000 | Slow but very secure |
| Legacy hardware | 400,000 | Minimum, backward compatible |

### When to Use Each Function

| Function | Purpose | When to Use |
|----------|---------|------------|
| `encryptText()` | Encrypt data with password | Primary use case |
| `decryptText()` | Decrypt data with password | Primary use case |
| `computePasswordFingerprint()` | Short typo-check ID for a password | UI display only |
| `normalizePassword()` | NFKC-normalize a password | Called internally; exposed for tests |

### Cryptographic Assurances

- **Confidentiality**: AES-256-GCM ensures encrypted data cannot be read
- **Integrity**: GCM authentication ensures data hasn't been modified
- **Authenticity**: Additional data (header: version, iterations, salt) is authenticated by GCM
- **Uniqueness**: Random salt and IV ensure same plaintext gives different ciphertext

## Browser Compatibility

All functions require Web Crypto API support:

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 37+ | Full support |
| Firefox | 34+ | Full support |
| Safari | 11+ | Full support |
| Edge | 79+ | Full support |
| Opera | 24+ | Full support |

Features require **HTTPS or localhost** (Web Crypto API security requirement).

## Troubleshooting

### "Decryption failed" error

**Causes:**
- Incorrect password
- Corrupted ciphertext
- Browser doesn't support Web Crypto API
- Invalid Base64 encoding

**Solution:**
- Verify password is correct
- Ensure ciphertext wasn't modified
- Check browser compatibility
- Re-copy ciphertext carefully

### Slow encryption/decryption

**Causes:**
- High iteration count
- Slow device

**Solution:**
- Lower iteration count for faster performance
- Use 400,000 for standard use
- Pre-encrypt important data when time isn't critical

### Web Crypto API not found

**Causes:**
- Non-HTTPS connection (outside localhost)
- Older browser
- Browser privacy settings

**Solution:**
- Use HTTPS connection
- Upgrade to modern browser
- Check privacy settings allow Web Crypto API
