export const QR_ERROR_LEVEL = "M" as const;

// Version 40, error-correction level M, byte mode. qrcode.react throws above this.
export const QR_MAX_BYTES = 2331;

export function canRenderQr(value: string): boolean {
  if (!value) return false;
  return new TextEncoder().encode(value).length <= QR_MAX_BYTES;
}
