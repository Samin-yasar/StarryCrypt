export type ClipboardClearResult = "cleared" | "skipped" | "failed";

interface ClipboardLike {
  writeText(text: string): Promise<void>;
  readText?(): Promise<string>;
}

interface ClipboardClearOptions {
  clipboard?: ClipboardLike;
  canRead?: () => Promise<boolean>;
}

let timer: ReturnType<typeof setTimeout> | null = null;

async function defaultCanRead(): Promise<boolean> {
  try {
    const status = await navigator.permissions.query({ name: "clipboard-read" as PermissionName });
    return status.state === "granted";
  } catch {
    return false;
  }
}

export function cancelClipboardClear(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

/**
 * Clears the clipboard after `delayMs`, but only one pending clear exists at a time
 * (a new copy replaces the old timer). When read access is already granted, the
 * clipboard is left alone if it no longer holds what we copied, so a later copy
 * from elsewhere is never wiped. Reading is never requested, to avoid a permission prompt.
 */
export function scheduleClipboardClear(
  copied: string,
  delayMs: number,
  onDone: (result: ClipboardClearResult) => void,
  options: ClipboardClearOptions = {}
): void {
  cancelClipboardClear();
  timer = setTimeout(async () => {
    timer = null;
    const clipboard = options.clipboard ?? navigator.clipboard;
    const canRead = options.canRead ?? defaultCanRead;
    try {
      if (clipboard.readText && (await canRead())) {
        const current = await clipboard.readText();
        if (current !== copied) {
          onDone("skipped");
          return;
        }
      }
      await clipboard.writeText("");
      onDone("cleared");
    } catch {
      onDone("failed");
    }
  }, delayMs);
}
