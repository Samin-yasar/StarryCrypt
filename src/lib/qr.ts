import { buildShareUrl } from "@/lib/share";

export const QR_ERROR_LEVEL = "M" as const;

// Version 40, error-correction level M, byte mode. qrcode.react throws above this.
export const QR_MAX_BYTES = 2331;

export type QrMode = "text" | "link";

export function canRenderQr(value: string): boolean {
  if (!value) return false;
  return new TextEncoder().encode(value).length <= QR_MAX_BYTES;
}

/**
 * "text" encodes the raw ciphertext and works anywhere, with no site involved.
 * "link" encodes a share URL so scanning opens the app with the message filled in.
 */
export function qrValue(mode: QrMode, output: string, location: { origin: string; pathname: string }): string {
  return mode === "link" ? buildShareUrl(location.origin, location.pathname, output) : output;
}

/** A link only makes sense on a real HTTPS deployment; local and plain-HTTP origins default to text. */
export function defaultQrMode(protocol: string): QrMode {
  return protocol === "https:" ? "link" : "text";
}
