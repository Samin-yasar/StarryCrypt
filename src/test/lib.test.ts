// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { canRenderQr, defaultQrMode, qrValue, QR_MAX_BYTES } from "@/lib/qr";
import { buildShareUrl, extractSharedPayload } from "@/lib/share";
import { isBlankPassword, isShortPassword } from "@/lib/password";
import { scheduleClipboardClear, cancelClipboardClear } from "@/lib/clipboard";

describe("canRenderQr", () => {
  it("accepts ASCII up to the byte capacity and rejects beyond it", () => {
    expect(canRenderQr("a".repeat(QR_MAX_BYTES))).toBe(true);
    expect(canRenderQr("a".repeat(QR_MAX_BYTES + 1))).toBe(false);
  });

  it("counts bytes, not characters, for non-Latin text", () => {
    expect(canRenderQr("ক".repeat(700))).toBe(true); // 2,100 bytes
    expect(canRenderQr("ক".repeat(900))).toBe(false); // 2,700 bytes, only 900 characters
  });

  it("rejects empty values", () => {
    expect(canRenderQr("")).toBe(false);
  });
});

describe("QR modes", () => {
  const where = { origin: "https://starry.example", pathname: "/" };

  it("text mode encodes the raw ciphertext", () => {
    expect(qrValue("text", "AB+/=", where)).toBe("AB+/=");
  });

  it("link mode encodes a fragment share URL, not a query string", () => {
    const value = qrValue("link", "AB+/=", where);
    expect(value).toBe("https://starry.example/#encrypted=AB%2B%2F%3D");
    expect(value).not.toContain("?");
  });

  it("link mode is larger than text mode for the same ciphertext", () => {
    const ct = "+/=".repeat(300);
    expect(new TextEncoder().encode(qrValue("link", ct, where)).length).toBeGreaterThan(ct.length * 2);
  });

  it("defaults to a link only on HTTPS origins", () => {
    expect(defaultQrMode("https:")).toBe("link");
    expect(defaultQrMode("http:")).toBe("text");
    expect(defaultQrMode("file:")).toBe("text");
  });
});

describe("share links", () => {
  const payload = "AQAAA+/=abc|def";

  it("puts the payload in the fragment, never the query string", () => {
    const url = buildShareUrl("https://example.com", "/", payload);
    expect(url.startsWith("https://example.com/#encrypted=")).toBe(true);
    expect(url).not.toContain("?");
  });

  it("round-trips base64 characters through the fragment", () => {
    const url = new URL(buildShareUrl("https://example.com", "/", payload));
    const result = extractSharedPayload(url.search, url.hash);
    expect(result.payload).toBe(payload);
    expect(result.hash).toBe("");
    expect(result.search).toBe("");
  });

  it("still reads legacy ?encrypted= links and strips them", () => {
    const search = `?encrypted=${encodeURIComponent(payload)}&keep=1`;
    const result = extractSharedPayload(search, "");
    expect(result.payload).toBe(payload);
    expect(result.search).toBe("?keep=1");
  });

  it("preserves unrelated fragment parameters", () => {
    const result = extractSharedPayload("", `#encrypted=${encodeURIComponent(payload)}&x=1`);
    expect(result.payload).toBe(payload);
    expect(result.hash).toBe("#x=1");
  });

  it("returns null and leaves the URL alone when there is no payload", () => {
    const result = extractSharedPayload("?a=1", "#section");
    expect(result).toEqual({ payload: null, search: "?a=1", hash: "#section" });
  });
});

describe("password helpers", () => {
  it("detects blank passwords", () => {
    expect(isBlankPassword("")).toBe(true);
    expect(isBlankPassword("   \t")).toBe(true);
    expect(isBlankPassword(" a ")).toBe(false);
  });

  it("flags non-empty passwords under 12 characters (counted as characters)", () => {
    expect(isShortPassword("")).toBe(false);
    expect(isShortPassword("short")).toBe(true);
    expect(isShortPassword("a".repeat(12))).toBe(false);
    expect(isShortPassword("😀".repeat(11))).toBe(true);
    expect(isShortPassword("😀".repeat(12))).toBe(false);
  });
});

describe("scheduleClipboardClear", () => {
  afterEach(() => {
    cancelClipboardClear();
    vi.useRealTimers();
  });

  function fakeClipboard(current: string | null) {
    return {
      writeText: vi.fn(async () => {}),
      readText: current === null ? undefined : vi.fn(async () => current),
    };
  }

  it("clears the clipboard after the delay when read access is unavailable", async () => {
    vi.useFakeTimers();
    const clipboard = fakeClipboard("anything");
    const onDone = vi.fn();
    scheduleClipboardClear("secret", 30000, onDone, { clipboard, canRead: async () => false });
    await vi.advanceTimersByTimeAsync(29999);
    expect(clipboard.writeText).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(clipboard.writeText).toHaveBeenCalledWith("");
    expect(onDone).toHaveBeenCalledWith("cleared");
  });

  it("does not wipe something else the user copied in the meantime", async () => {
    vi.useFakeTimers();
    const clipboard = fakeClipboard("something newer");
    const onDone = vi.fn();
    scheduleClipboardClear("secret", 1000, onDone, { clipboard, canRead: async () => true });
    await vi.advanceTimersByTimeAsync(1000);
    expect(clipboard.writeText).not.toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledWith("skipped");
  });

  it("clears when the clipboard still holds the copied value", async () => {
    vi.useFakeTimers();
    const clipboard = fakeClipboard("secret");
    const onDone = vi.fn();
    scheduleClipboardClear("secret", 1000, onDone, { clipboard, canRead: async () => true });
    await vi.advanceTimersByTimeAsync(1000);
    expect(clipboard.writeText).toHaveBeenCalledWith("");
    expect(onDone).toHaveBeenCalledWith("cleared");
  });

  it("reports failure instead of claiming success when the write is rejected", async () => {
    vi.useFakeTimers();
    const clipboard = { writeText: vi.fn(async () => { throw new Error("not focused"); }) };
    const onDone = vi.fn();
    scheduleClipboardClear("secret", 1000, onDone, { clipboard, canRead: async () => false });
    await vi.advanceTimersByTimeAsync(1000);
    expect(onDone).toHaveBeenCalledWith("failed");
  });

  it("keeps only one pending timer: a new copy replaces the old one", async () => {
    vi.useFakeTimers();
    const clipboard = fakeClipboard(null);
    const first = vi.fn();
    const second = vi.fn();
    scheduleClipboardClear("one", 1000, first, { clipboard, canRead: async () => false });
    await vi.advanceTimersByTimeAsync(500);
    scheduleClipboardClear("two", 1000, second, { clipboard, canRead: async () => false });
    await vi.advanceTimersByTimeAsync(2000);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("cleared");
    expect(clipboard.writeText).toHaveBeenCalledTimes(1);
  });
});
