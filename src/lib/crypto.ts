export const FORMAT_VERSION = 1;
export const SALT_SIZE = 32;
export const MIN_ITERATIONS = 400000;
export const MAX_ITERATIONS = 10000000;
export const HEADER_SIZE = 1 + 4 + SALT_SIZE; // 37 bytes
export const IV_SIZE = 12;
export const GCM_TAG_SIZE = 16;
const BYTE_TO_BINARY_CHUNK = 0x8000;

const FINGERPRINT_ITERATIONS = 210000;
const FINGERPRINT_SALT = new TextEncoder().encode("StarryCrypt/password-fingerprint/v1");

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += BYTE_TO_BINARY_CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + BYTE_TO_BINARY_CHUNK));
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Passwords are normalized to NFKC so the same visible password produces the
 * same key bytes regardless of platform or keyboard input method.
 */
export function normalizePassword(password: string): string {
  return password.normalize("NFKC");
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-512" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(text: string, password: string, iterations: number): Promise<string> {
  iterations = Math.min(Math.max(iterations || MIN_ITERATIONS, MIN_ITERATIONS), MAX_ITERATIONS);

  const data = new TextEncoder().encode(text);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
  const key = await deriveKey(normalizePassword(password), salt, iterations);

  const header = new Uint8Array(HEADER_SIZE);
  const view = new DataView(header.buffer);
  view.setUint8(0, FORMAT_VERSION);
  view.setUint32(1, iterations, false);
  header.set(salt, 5);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: header },
    key,
    data
  );

  const result = new Uint8Array(HEADER_SIZE + IV_SIZE + encrypted.byteLength);
  result.set(header, 0);
  result.set(iv, HEADER_SIZE);
  result.set(new Uint8Array(encrypted), HEADER_SIZE + IV_SIZE);

  return bytesToBase64(result);
}

/** Decryption cost above which the UI asks for confirmation (the format allows up to MAX_ITERATIONS). */
export const SLOW_DECRYPT_THRESHOLD = 2000000;

/** Reads the iteration count from a ciphertext header without any key derivation. Returns null if it is not a valid payload. */
export function getIterationCount(encryptedBase64: string): number | null {
  try {
    const [encoded] = encryptedBase64.trim().split('|');
    const bytes = base64ToBytes(encoded);
    if (bytes.length < HEADER_SIZE + IV_SIZE + GCM_TAG_SIZE) return null;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (view.getUint8(0) !== FORMAT_VERSION) return null;
    const iterations = view.getUint32(1, false);
    return iterations >= MIN_ITERATIONS && iterations <= MAX_ITERATIONS ? iterations : null;
  } catch {
    return null;
  }
}

export async function decryptText(encryptedBase64: string, password: string): Promise<string> {
  // Output from earlier versions carried a "|<hmac>" suffix. Base64 never contains "|",
  // so the suffix is dropped; GCM authenticates the payload on its own.
  const [encoded] = encryptedBase64.trim().split('|');

  let encryptedData: Uint8Array;
  try {
    encryptedData = base64ToBytes(encoded);
  } catch {
    throw new Error("Decryption failed");
  }

  if (encryptedData.length < HEADER_SIZE + IV_SIZE + GCM_TAG_SIZE) {
    throw new Error("Decryption failed");
  }

  const view = new DataView(encryptedData.buffer, encryptedData.byteOffset, encryptedData.byteLength);

  // Validate format version and iteration range before any expensive operation
  if (view.getUint8(0) !== FORMAT_VERSION) {
    throw new Error("Decryption failed");
  }
  const iterations = view.getUint32(1, false);
  if (iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) {
    throw new Error("Decryption failed");
  }

  const header = encryptedData.slice(0, HEADER_SIZE);
  const salt = encryptedData.slice(5, HEADER_SIZE);
  const iv = encryptedData.slice(HEADER_SIZE, HEADER_SIZE + IV_SIZE);
  const ciphertext = encryptedData.slice(HEADER_SIZE + IV_SIZE);

  // Data encrypted before normalization was introduced used the raw password bytes.
  // The raw form is only tried as a fallback, and only when it differs.
  const normalized = normalizePassword(password);
  const candidates = normalized === password ? [normalized] : [normalized, password];

  for (const candidate of candidates) {
    try {
      const key = await deriveKey(candidate, salt, iterations);
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv, additionalData: header },
        key,
        ciphertext
      );
      return new TextDecoder("utf-8", { fatal: true }).decode(decrypted);
    } catch {
      // try next candidate
    }
  }
  throw new Error("Decryption failed");
}

/**
 * Short, slow, domain-separated fingerprint used only to let a user confirm they
 * typed the same password twice. It is derived with PBKDF2 under a fixed label
 * (never with the encryption salt) and truncated to 16 bits, so it reveals very
 * little and costs an attacker a full key-stretching run per guess.
 */
export async function computePasswordFingerprint(password: string): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(normalizePassword(password)),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: FINGERPRINT_SALT, iterations: FINGERPRINT_ITERATIONS, hash: "SHA-512" },
    keyMaterial,
    32
  );
  return Array.from(new Uint8Array(bits).slice(0, 2))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}
