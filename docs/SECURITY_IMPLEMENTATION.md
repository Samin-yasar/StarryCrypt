# StarryCrypt Security Implementation Details

Deep dive into the cryptographic implementation, security properties, and design decisions.

## Executive Summary

StarryCrypt implements industry-standard cryptographic algorithms following NIST and OWASP recommendations:

- **Encryption**: AES-256-GCM (authenticated encryption)
- **Key Derivation**: PBKDF2-SHA512 (password-based key derivation)
- **Randomness**: OS entropy via `crypto.getRandomValues()`
- **Architecture**: Zero-knowledge (all operations client-side)

## Cryptographic Components

### 1. AES-256-GCM Encryption

#### Algorithm Selection

**Why AES-GCM?**
- **Industry standard**: Recommended by NIST SP 800-38D
- **Authenticated**: Built-in integrity verification
- **Performance**: Optimized in modern processors (AES-NI)
- **Well-tested**: Extensively analyzed by cryptography community
- **Web support**: Available in Web Crypto API

#### Implementation Details

```
Algorithm: AES (Advanced Encryption Standard)
Mode: GCM (Galois/Counter Mode)
Key Size: 256 bits (32 bytes)
Block Size: 128 bits
IV Size: 96 bits (12 bytes, recommended for GCM)
```

#### Security Properties

**Confidentiality**: 
- Encrypts plaintext with 256-bit key
- Infeasible to decrypt without key (2^256 combinations)
- Different IV each encryption = different ciphertext

**Integrity & Authenticity**:
- GCM generates 128-bit authentication tag
- Tag verifies ciphertext hasn't been modified
- Prevents "ciphertext manipulation attacks"
- Additional Authenticated Data (AAD) protects header

**Nonce Uniqueness**:
- Each encryption uses fresh random IV
- Critical for GCM security
- Random IV generated with `crypto.getRandomValues()`
- Never reuses IV with same key

#### Implementation in Code

```typescript
const encrypted = await crypto.subtle.encrypt(
  {
    name: "AES-GCM",
    iv,                          // 12 random bytes
    additionalData: header,      // Authenticate header
  },
  key,                           // 256-bit key
  data                           // Plaintext to encrypt
);
// Output: Ciphertext + authentication tag (appended)
```

### 2. PBKDF2-SHA512 Key Derivation

#### Algorithm Selection

**Why PBKDF2?**
- **Memory-hard alternatives considered**: Argon2, scrypt
- **Choice rationale**: 
  - PBKDF2 widely supported
  - Web Crypto API support
  - Simple, auditable implementation
  - Iteration count configurable
- **Note**: Argon2 recommended for new systems, but not in Web Crypto API yet

#### Configuration

```
Algorithm: PBKDF2 (Password-Based Key Derivation Function 2)
Hash Function: SHA-512 (512-bit output)
Iterations: Configurable (400,000 - 10,000,000)
Default: 400,000 (balance of security and performance)
Salt: 32 bytes (256 bits) random
Output: 256-bit key
```

#### Security Analysis

**Against Brute-Force Attacks**:
```
Key space: 2^256 (256-bit key)
Work factor: 400,000 iterations per try
Modern GPU: ~1 billion hashes/second
Time for exhaustive search: 2^256 / (1B * 400k) ≈ 10^57 years

Stronger configuration (1M iterations):
Time for exhaustive search: 2^256 / (1B * 1M) ≈ 10^56 years
```

**Against Dictionary/Rainbow Tables**:
- Unique salt prevents pre-computed tables
- New salt per encryption
- Shared salt per password makes attacks harder

**Iteration Count Strategy**:
```
Lower iterations (400k):
- Pros: Fast (1-2 seconds), mobile-friendly
- Cons: Less resistant to GPU attacks
- Use: Standard encryption

Higher iterations (1M-2M):
- Pros: More resistant to GPU attacks (3-5 seconds)
- Cons: Slower, may affect UX
- Use: High-security scenarios

Maximum iterations (10M):
- Pros: Maximum security (15-30 seconds)
- Cons: Significant delay, not practical for most uses
- Use: One-time important documents
```

#### Implementation in Code

```typescript
async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> {
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Derive encryption key
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,                    // Random salt
      iterations,              // Number of iterations
      hash: "SHA-512"         // Hash function
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },  // Output key spec
    false,                     // Non-exportable
    ["encrypt", "decrypt"]     // Allowed operations
  );
}
```

### 3. Randomness Generation

#### Entropy Source

```typescript
// All random values generated with:
const randomBytes = crypto.getRandomValues(new Uint8Array(32));
```

#### Security Properties

**`crypto.getRandomValues()`**:
- Uses OS entropy pool (most secure available)
- Cryptographically secure (suitable for crypto use)
- Non-deterministic (different every call)
- ~100% entropy (not pseudo-random)

**Sources by OS**:
- **Linux/Unix**: `/dev/urandom`
- **Windows**: `CryptGenRandom()`
- **macOS**: `SecRandomCopyBytes()`
- **Browser**: Hardware RNG (if available) or OS entropy

#### Random Values Generated

```
Per encryption:
├─ Salt: 32 bytes (256 bits) - Random
└─ IV: 12 bytes (96 bits) - Random

Total: 44 bytes of entropy per operation
```

#### Entropy Quality

Minimum entropy per encryption:
- Salt: 256 bits
- IV: 96 bits
- **Total**: 352 bits of entropy

This provides:
- Unique salt prevents rainbow tables
- Unique IV ensures GCM security
- Sufficient entropy for cryptographic operations

### 4. Protocol Structure

#### Format Version 1 Specification

```
Binary Format (37+ bytes):

Byte 0:      Format Version
             └─ Value: 0x01 (format version 1)
             └─ Future formats can use version 2, 3, etc.

Bytes 1-4:   Iteration Count (32-bit unsigned, big-endian)
             └─ Range: 400,000 - 10,000,000
             └─ Validated on decryption

Bytes 5-36:  Salt (32 bytes / 256 bits)
             └─ Random, unique per encryption
             └─ Used in key derivation

Bytes 37-48: IV (12 bytes / 96 bits)
             └─ Random, unique per encryption
             └─ Used in AES-GCM

Bytes 49+:   Ciphertext + Authentication Tag
             └─ AES-GCM encrypted plaintext
             └─ Tag appended by GCM (16 bytes)
             └─ AAD: Header (first 37 bytes)
```

#### Encoding

**Base64 Encoding**: Binary format converted to Base64 for text representation

```
Benefits:
- URL-safe representation
- Copy/paste friendly
- Web-native encoding
- No special characters

Size: ~4/3 of binary size
Example: 100 bytes → ~133 characters
```

## Security Analysis

### Threat Model

**Adversary Capabilities**:
- ✓ Can observe ciphertexts
- ✓ Can attempt decryption (offline attacks)
- ✓ Can modify ciphertexts
- ✗ Cannot access encryption keys
- ✗ Cannot intercept passwords (all local)
- ✗ Cannot break cryptographic primitives

### Attack Vectors & Mitigations

#### 1. Brute-Force Password Attack

**Attack**: Try all possible passwords

**Mitigations**:
- High iteration count (400k default, configurable)
- Salt prevents batched attacks
- Each encryption takes ~1 second

**Resistance**:
```
Weak password (8 chars):
- 95^8 ≈ 6.6 × 10^15 possibilities
- At 1/second: ~209,000 years (acceptable)

Strong password (12 chars):
- 95^12 ≈ 4.8 × 10^23 possibilities
- At 1/second: Beyond heat death of universe
```

**Recommendation**: Use 12+ character passwords with mixed case, numbers, symbols

#### 2. Ciphertext Manipulation

**Attack**: Modify ciphertext to decrypt to different plaintext

**Mitigation**: GCM authentication tag

```
How it works:
1. Attacker modifies ciphertext
2. Decryption attempts to verify tag
3. Modified ciphertext fails tag verification
4. Decryption rejected with "Decryption failed"

Result: Manipulation detected and prevented
```

#### 3. Plaintext Leak via Error Messages

**Attack**: Use error messages to gain information about decryption failure

**Mitigation**: Generic error messages

```typescript
// Instead of:
if (iterations invalid) throw "Invalid iterations"
if (salt missing) throw "Corrupted salt"
if (auth tag fails) throw "Authentication failed"

// All failures return:
throw new Error("Decryption failed");
```

This prevents attackers from learning:
- Whether password is close but wrong
- Where corruption occurred
- What type of failure happened

#### 4. Replay Attack

**Attack**: Reuse captured ciphertext

**Consequence**: Same plaintext decrypts again

**Status**: Not a threat for this use case
- No state/authentication needed
- Multiple encryptions of same plaintext acceptable
- No authentication of sender

**Use case**: If authentication needed, sign ciphertext separately

#### 5. Side-Channel Attacks

**Timing attacks**: Measure decryption time to gain info

**Mitigation**:
- Web Crypto API implementation timing-resistant
- All error messages generic (no early exit)
- Iteration count in ciphertext (known to attacker)

**Key extraction**:
- Keys never exportable
- Derived keys deleted after use
- Cannot extract from WebCrypto objects

#### 6. Rainbow Table Attack

**Attack**: Pre-compute hashes for common passwords

**Mitigation**: Random salt

```
Rainbow tables require:
- Fixed salt
- Attacker knows salt before computing

StarryCrypt:
- Unique salt per encryption
- Salt unpredictable (random)
- Renders pre-computed tables useless
```

#### 7. Weak PRNG

**Risk**: Weak randomness weakens all security

**Mitigation**: `crypto.getRandomValues()` uses OS entropy

**Verification**:
```javascript
// In browser console:
const rand1 = crypto.getRandomValues(new Uint8Array(32));
const rand2 = crypto.getRandomValues(new Uint8Array(32));

// Should be completely different:
console.log(rand1 === rand2); // false

// Check entropy
console.log(crypto.getRandomValues); // Should exist
```

### Cryptographic Strength

| Security Property | Implementation | Strength |
|-------------------|-----------------|----------|
| Encryption | AES-256-GCM | 256 bits |
| Authentication | GCM-SIV | 128 bits |
| Key Derivation | PBKDF2-SHA512 | 256 bits |
| Salt | Random 256-bit | 256 bits |
| IV/Nonce | Random 96-bit | 96 bits |

**Effective strength**: Minimum = 96 bits (GCM nonce)

For practical purposes: Equivalent to 2^96 work factor per unique IV

## Implementation Best Practices

### What We Do Right

✓ Use authenticated encryption (AES-GCM)
✓ Use cryptographically secure randomness
✓ Generate unique salt per encryption
✓ Generate unique IV per encryption
✓ Include metadata in authentication
✓ Use generic error messages
✓ Key derivation with appropriate iterations
✓ No key material in logs/storage

### Common Mistakes We Avoid

✗ ECB mode (deterministic encryption)
✗ Weak randomness (Math.random())
✗ Reused IV with same key
✗ No authentication (CBC without HMAC)
✗ Detailed error messages (info leakage)
✗ Low iteration counts (< 100k)
✗ Hard-coded keys or salts
✗ Key material in client storage

## Future Improvements

### Potential Enhancements

1. **Argon2 Support** (when Web Crypto API adds it)
   - Memory-hard key derivation
   - Better resistance to GPU attacks

2. **Streaming Encryption** (for large files)
   - Current: Load entire file in memory
   - Future: Encrypt in chunks

3. **Digital Signatures** (for authentication)
   - Current: No sender authentication
   - Future: Sign with public keys

4. **Hardware Security Keys** (WebAuthn)
   - Current: Passwords only
   - Future: FIDO2/security key support

5. **Key Exchange** (ECDH)
   - Current: Shared password-derived key
   - Future: Elliptic curve key exchange

## Security Audit Checklist

For code reviewers evaluating security:

- [ ] All crypto operations use Web Crypto API
- [ ] No hard-coded secrets or test keys in production
- [ ] Salt and IV are cryptographically random
- [ ] Iteration count validated in safe range
- [ ] GCM authentication tag verified
- [ ] Error messages are generic (no info leakage)
- [ ] No keys in logs or local storage
- [ ] No `eval()` or `Function()` constructor
- [ ] No `dangerouslySetInnerHTML`
- [ ] All dependencies audited (`npm audit`)
- [ ] No timing-dependent logic in crypto
- [ ] Keys marked non-exportable in WebCrypto
- [ ] HTTPS enforced (or dev on localhost)

## References

**Standards & Guidelines**:
- [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) - GCM Mode
- [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) - PBKDF2
- [OWASP Crypto Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

**Implementation Details**:
- [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/)
- [MDN - Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

**Cryptanalysis**:
- [AES Analysis](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
- [GCM Mode Analysis](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [PBKDF2 Analysis](https://en.wikipedia.org/wiki/PBKDF2)

## Responsible Disclosure

If you discover a security issue:

1. **Do NOT** open a public GitHub issue
2. **Read** [SECURITY.md](../SECURITY.md) for disclosure process
3. **Email** security contact with details
4. **Include**: Steps to reproduce, impact assessment
5. **Allow**: Time for patch before public disclosure

