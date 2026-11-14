const PARAM = "encrypted";

/**
 * Share links carry the ciphertext in the URL fragment. Fragments are never sent
 * to a server, so they stay out of access logs, analytics and Referer headers,
 * and are not subject to server URL-length limits.
 */
export function buildShareUrl(origin: string, pathname: string, payload: string): string {
  return `${origin}${pathname}#${PARAM}=${encodeURIComponent(payload)}`;
}

export interface SharedPayload {
  payload: string | null;
  search: string;
  hash: string;
}

/**
 * Reads a shared ciphertext from the fragment, falling back to the legacy
 * `?encrypted=` query form, and returns the URL parts with it removed.
 */
export function extractSharedPayload(search: string, hash: string): SharedPayload {
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(search);

  const fromHash = hashParams.get(PARAM);
  const fromSearch = searchParams.get(PARAM);
  const payload = fromHash || fromSearch || null;

  let nextHash = hash;
  if (hashParams.has(PARAM)) {
    hashParams.delete(PARAM);
    const rest = hashParams.toString();
    nextHash = rest ? `#${rest}` : "";
  }

  let nextSearch = search;
  if (searchParams.has(PARAM)) {
    searchParams.delete(PARAM);
    const rest = searchParams.toString();
    nextSearch = rest ? `?${rest}` : "";
  }

  return { payload, search: nextSearch, hash: nextHash };
}
