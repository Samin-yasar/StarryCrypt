const FORMAT_VERSION = 1;
const SALT_SIZE = 32;
const MIN_ITERATIONS = 400000;
const MAX_ITERATIONS = 10000000;
const HEADER_SIZE = 1 + 4 + SALT_SIZE; // 37 bytes
const IV_SIZE = 12;
const GCM_TAG_SIZE = 16;

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
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
  const key = await deriveKey(password, salt, iterations);

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

  let binary = '';
  for (let i = 0; i < result.length; i++) {
    binary += String.fromCharCode(result[i]);
  }
  return btoa(binary);
}

export async function decryptText(encryptedBase64: string, password: string): Promise<string> {
  let encryptedData: Uint8Array;
  try {
    encryptedData = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  } catch {
    throw new Error("Decryption failed");
  }

  if (encryptedData.length < HEADER_SIZE + IV_SIZE + GCM_TAG_SIZE) {
    throw new Error("Decryption failed");
  }

  try {
    const view = new DataView(encryptedData.buffer, encryptedData.byteOffset, encryptedData.byteLength);
    const iterations = view.getUint32(1, false);

    if (iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) {
      throw new Error("Decryption failed");
    }

    const header = encryptedData.slice(0, HEADER_SIZE);
    const salt = encryptedData.slice(5, HEADER_SIZE);
    const iv = encryptedData.slice(HEADER_SIZE, HEADER_SIZE + IV_SIZE);
    const ciphertext = encryptedData.slice(HEADER_SIZE + IV_SIZE);

    const key = await deriveKey(password, salt, iterations);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, additionalData: header },
      key,
      ciphertext
    );

    if (view.getUint8(0) !== FORMAT_VERSION) {
      throw new Error("Decryption failed");
    }

    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error("Decryption failed");
  }
}

export async function computeHmacSha512(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", encoder.encode(key),
    { name: "HMAC", hash: "SHA-512" },
    false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function computeSha256Fingerprint(data: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('').slice(0, 12).toUpperCase();
}
