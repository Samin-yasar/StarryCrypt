export const RECOMMENDED_PASSWORD_LENGTH = 12;

export function isBlankPassword(password: string): boolean {
  return password.trim() === "";
}

/** True for a non-empty password shorter than the recommended length (counted in characters, not bytes). */
export function isShortPassword(password: string): boolean {
  if (password === "") return false;
  return Array.from(password.normalize("NFKC")).length < RECOMMENDED_PASSWORD_LENGTH;
}
