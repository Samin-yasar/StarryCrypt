// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import {
  encryptText,
  decryptText,
  computePasswordFingerprint,
  normalizePassword,
  getIterationCount,
  SLOW_DECRYPT_THRESHOLD,
  FORMAT_VERSION,
  SALT_SIZE,
  IV_SIZE,
  GCM_TAG_SIZE,
  HEADER_SIZE,
  MIN_ITERATIONS,
  MAX_ITERATIONS,
} from "@/lib/crypto";

const PASSWORD = "correct horse battery staple";
const FAILURE = "Decryption failed";

const toBytes = (b64: string) => new Uint8Array(Buffer.from(b64, "base64"));
const toB64 = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64");

function tamper(b64: string, index: number, mask = 0x01): string {
  const bytes = toBytes(b64);
  bytes[index] ^= mask;
  return toB64(bytes);
}

describe("encryptText / decryptText", () => {
  it("round-trips plain text", async () => {
    const ct = await encryptText("hello, stars", PASSWORD, MIN_ITERATIONS);
    expect(await decryptText(ct, PASSWORD)).toBe("hello, stars");
  });

  it("round-trips empty, unicode, emoji and multi-line text", async () => {
    for (const text of ["", "日本語のテキスト", "naïve café ✨🔐", "line1\nline2\r\n\ttabbed"]) {
      const ct = await encryptText(text, PASSWORD, MIN_ITERATIONS);
      expect(await decryptText(ct, PASSWORD)).toBe(text);
    }
  });

  it("round-trips large payloads (exercises chunked base64 encoding)", async () => {
    const text = "x".repeat(200_000);
    const ct = await encryptText(text, PASSWORD, MIN_ITERATIONS);
    expect(await decryptText(ct, PASSWORD)).toBe(text);
  });

  it("produces a fresh salt and IV for every encryption", async () => {
    const a = toBytes(await encryptText("same", PASSWORD, MIN_ITERATIONS));
    const b = toBytes(await encryptText("same", PASSWORD, MIN_ITERATIONS));
    expect(a.slice(5, HEADER_SIZE)).not.toEqual(b.slice(5, HEADER_SIZE));
    expect(a.slice(HEADER_SIZE, HEADER_SIZE + IV_SIZE)).not.toEqual(b.slice(HEADER_SIZE, HEADER_SIZE + IV_SIZE));
    expect(a).not.toEqual(b);
  });

  it("writes the documented binary layout", async () => {
    const plaintext = "layout";
    const bytes = toBytes(await encryptText(plaintext, PASSWORD, 500000));
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    expect(view.getUint8(0)).toBe(FORMAT_VERSION);
    expect(view.getUint32(1, false)).toBe(500000);
    expect(bytes.length).toBe(HEADER_SIZE + IV_SIZE + plaintext.length + GCM_TAG_SIZE);
    expect(SALT_SIZE).toBe(32);
  });

  it("clamps requested iterations up to the minimum", async () => {
    for (const requested of [0, 1, NaN, -5]) {
      const bytes = toBytes(await encryptText("x", PASSWORD, requested));
      expect(new DataView(bytes.buffer).getUint32(1, false)).toBe(MIN_ITERATIONS);
    }
  });

  it("rejects a wrong password with a generic error", async () => {
    const ct = await encryptText("secret", PASSWORD, MIN_ITERATIONS);
    await expect(decryptText(ct, "wrong password")).rejects.toThrow(FAILURE);
  });

  it("treats the password as case- and whitespace-sensitive", async () => {
    const ct = await encryptText("secret", PASSWORD, MIN_ITERATIONS);
    await expect(decryptText(ct, PASSWORD.toUpperCase())).rejects.toThrow(FAILURE);
    await expect(decryptText(ct, PASSWORD + " ")).rejects.toThrow(FAILURE);
  });
});

describe("tamper detection", () => {
  it("rejects a modified byte in every region of the payload", async () => {
    const ct = await encryptText("authentic message", PASSWORD, MIN_ITERATIONS);
    const len = toBytes(ct).length;
    const regions: Record<string, number> = {
      "version byte": 0,
      "iteration count": 3,
      salt: 5 + 10,
      iv: HEADER_SIZE + 3,
      "ciphertext body": HEADER_SIZE + IV_SIZE + 2,
      "auth tag": len - 1,
    };
    for (const [name, index] of Object.entries(regions)) {
      await expect(decryptText(tamper(ct, index), PASSWORD), name).rejects.toThrow(FAILURE);
    }
  });

  it("authenticates the header: a valid-range iteration change still fails", async () => {
    const bytes = toBytes(await encryptText("authentic", PASSWORD, MIN_ITERATIONS));
    new DataView(bytes.buffer).setUint32(1, MIN_ITERATIONS + 1, false);
    await expect(decryptText(toB64(bytes), PASSWORD)).rejects.toThrow(FAILURE);
  });

  it("rejects truncated and extended ciphertexts", async () => {
    const bytes = toBytes(await encryptText("authentic", PASSWORD, MIN_ITERATIONS));
    await expect(decryptText(toB64(bytes.slice(0, bytes.length - 1)), PASSWORD)).rejects.toThrow(FAILURE);
    const extended = new Uint8Array(bytes.length + 1);
    extended.set(bytes);
    await expect(decryptText(toB64(extended), PASSWORD)).rejects.toThrow(FAILURE);
  });
});

describe("malformed input", () => {
  it("rejects garbage, empty and too-short input", async () => {
    for (const input of ["", "not base64 !!!", "AAAA", toB64(new Uint8Array(HEADER_SIZE + IV_SIZE + GCM_TAG_SIZE - 1))]) {
      await expect(decryptText(input, PASSWORD)).rejects.toThrow(FAILURE);
    }
  });

  it("rejects an unknown format version before doing key derivation", async () => {
    const bytes = new Uint8Array(HEADER_SIZE + IV_SIZE + GCM_TAG_SIZE + 4);
    bytes[0] = FORMAT_VERSION + 1;
    new DataView(bytes.buffer).setUint32(1, MIN_ITERATIONS, false);
    await expect(decryptText(toB64(bytes), PASSWORD)).rejects.toThrow(FAILURE);
  });

  it("rejects out-of-range iteration counts quickly (no DoS via header)", async () => {
    for (const iterations of [0, 1, MIN_ITERATIONS - 1, MAX_ITERATIONS + 1, 0xffffffff]) {
      const bytes = new Uint8Array(HEADER_SIZE + IV_SIZE + GCM_TAG_SIZE + 4);
      bytes[0] = FORMAT_VERSION;
      new DataView(bytes.buffer).setUint32(1, iterations, false);
      const start = performance.now();
      await expect(decryptText(toB64(bytes), PASSWORD)).rejects.toThrow(FAILURE);
      expect(performance.now() - start).toBeLessThan(250);
    }
  });
});

describe("getIterationCount", () => {
  it("reads the iteration count from a valid payload without key derivation", async () => {
    const ct = await encryptText("x", PASSWORD, 500000);
    const start = performance.now();
    expect(getIterationCount(ct)).toBe(500000);
    expect(getIterationCount(`${ct}|legacyhmac`)).toBe(500000);
    expect(performance.now() - start).toBeLessThan(50);
  });

  it("returns null for anything that is not a valid payload", () => {
    const bytes = new Uint8Array(HEADER_SIZE + IV_SIZE + GCM_TAG_SIZE + 4);
    bytes[0] = FORMAT_VERSION;
    new DataView(bytes.buffer).setUint32(1, MAX_ITERATIONS + 1, false);
    for (const input of ["", "garbage!!", "AAAA", toB64(bytes)]) {
      expect(getIterationCount(input)).toBeNull();
    }
  });

  it("exposes a slow-decrypt threshold above the largest UI option", () => {
    expect(SLOW_DECRYPT_THRESHOLD).toBeGreaterThan(1000000);
    expect(SLOW_DECRYPT_THRESHOLD).toBeLessThan(MAX_ITERATIONS);
  });
});

describe("password normalization", () => {
  const NFC = "caf\u00e9\u00c5";
  const NFD = "cafe\u0301A\u030a";

  it("normalizes to NFKC", () => {
    expect(NFC).not.toBe(NFD);
    expect(normalizePassword(NFD)).toBe(normalizePassword(NFC));
    expect(normalizePassword("\uff21\uff22\uff23")).toBe("ABC");
  });

  it("decrypts across composed and decomposed forms of the same password", async () => {
    const ct = await encryptText("unicode", NFC, MIN_ITERATIONS);
    expect(await decryptText(ct, NFD)).toBe("unicode");
    expect(await decryptText(ct, NFC)).toBe("unicode");
  });

  it("still decrypts legacy data made with the raw, un-normalized password", async () => {
    const legacyPassword = NFD;
    const salt = randomBytes(SALT_SIZE);
    const iv = randomBytes(IV_SIZE);
    const header = Buffer.alloc(HEADER_SIZE);
    header.writeUInt8(FORMAT_VERSION, 0);
    header.writeUInt32BE(MIN_ITERATIONS, 1);
    salt.copy(header, 5);
    const key = pbkdf2Sync(Buffer.from(legacyPassword, "utf8"), salt, MIN_ITERATIONS, 32, "sha512");
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    cipher.setAAD(header);
    const body = Buffer.concat([cipher.update("legacy", "utf8"), cipher.final(), cipher.getAuthTag()]);
    const blob = toB64(Buffer.concat([header, iv, body]));

    expect(await decryptText(blob, legacyPassword)).toBe("legacy");
    await expect(decryptText(blob, "something else")).rejects.toThrow(FAILURE);
  });

  it("ignores a legacy '|hmac' suffix, relying on GCM for authenticity", async () => {
    const ct = await encryptText("with suffix", PASSWORD, MIN_ITERATIONS);
    expect(await decryptText(`${ct}|${"ab".repeat(64)}`, PASSWORD)).toBe("with suffix");
    await expect(decryptText(`${tamper(ct, HEADER_SIZE + IV_SIZE + 1)}|${"ab".repeat(64)}`, PASSWORD)).rejects.toThrow(FAILURE);
  });
});

describe("interoperability with an independent implementation (node:crypto)", () => {
  it("decrypts our output using PBKDF2-SHA512 + AES-256-GCM with the header as AAD", async () => {
    const ct = toBytes(await encryptText("interop out", PASSWORD, MIN_ITERATIONS));
    const header = Buffer.from(ct.slice(0, HEADER_SIZE));
    const salt = header.subarray(5);
    const iv = Buffer.from(ct.slice(HEADER_SIZE, HEADER_SIZE + IV_SIZE));
    const body = Buffer.from(ct.slice(HEADER_SIZE + IV_SIZE));

    const key = pbkdf2Sync(Buffer.from(PASSWORD, "utf8"), salt, MIN_ITERATIONS, 32, "sha512");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAAD(header);
    decipher.setAuthTag(body.subarray(body.length - GCM_TAG_SIZE));
    const plain = Buffer.concat([decipher.update(body.subarray(0, body.length - GCM_TAG_SIZE)), decipher.final()]);
    expect(plain.toString("utf8")).toBe("interop out");
  });

  it("decrypts a blob produced by node:crypto from the published format", async () => {
    const salt = randomBytes(SALT_SIZE);
    const iv = randomBytes(IV_SIZE);
    const header = Buffer.alloc(HEADER_SIZE);
    header.writeUInt8(FORMAT_VERSION, 0);
    header.writeUInt32BE(MIN_ITERATIONS, 1);
    salt.copy(header, 5);
    const key = pbkdf2Sync(Buffer.from(PASSWORD, "utf8"), salt, MIN_ITERATIONS, 32, "sha512");
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    cipher.setAAD(header);
    const body = Buffer.concat([cipher.update("interop in", "utf8"), cipher.final(), cipher.getAuthTag()]);

    expect(await decryptText(toB64(Buffer.concat([header, iv, body])), PASSWORD)).toBe("interop in");
  });
});

describe("computePasswordFingerprint (StarID)", () => {
  it("returns 4 uppercase hex characters", async () => {
    expect(await computePasswordFingerprint(PASSWORD)).toMatch(/^[0-9A-F]{4}$/);
  });

  it("is deterministic and normalization-stable", async () => {
    expect(await computePasswordFingerprint(PASSWORD)).toBe(await computePasswordFingerprint(PASSWORD));
    expect(await computePasswordFingerprint("caf\u00e9")).toBe(await computePasswordFingerprint("cafe\u0301"));
  });

  it("separates different passwords (checked over a small sample)", async () => {
    const ids = await Promise.all(["alpha-1", "alpha-2", "alpha-3", "beta-1", "gamma-1"].map(computePasswordFingerprint));
    expect(new Set(ids).size).toBeGreaterThan(3);
  });

  it("is domain-separated from the encryption key derivation", async () => {
    const bytes = toBytes(await encryptText("x", PASSWORD, MIN_ITERATIONS));
    const salt = Buffer.from(bytes.slice(5, HEADER_SIZE));
    const encKeyPrefix = pbkdf2Sync(Buffer.from(PASSWORD, "utf8"), salt, MIN_ITERATIONS, 2, "sha512")
      .toString("hex")
      .toUpperCase();
    const id = await computePasswordFingerprint(PASSWORD);
    const fixedSaltEquivalent = pbkdf2Sync(
      Buffer.from(PASSWORD, "utf8"),
      Buffer.from("StarryCrypt/password-fingerprint/v1"),
      210000,
      2,
      "sha512"
    )
      .toString("hex")
      .toUpperCase();
    expect(id).toBe(fixedSaltEquivalent);
    expect(id).not.toBe(encKeyPrefix);
  });
});
