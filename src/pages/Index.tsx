import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { InputCard } from '@/components/InputCard';
import { OutputCard } from '@/components/OutputCard';
import { SecurityPanel } from '@/components/SecurityPanel';
import { useTheme } from '@/hooks/useTheme';
import { LANGUAGES, Lang, getTranslations } from '@/translations';
import {
  encryptText,
  decryptText,
  computePasswordFingerprint,
  getIterationCount,
  SLOW_DECRYPT_THRESHOLD,
} from '@/lib/crypto';
import { buildShareUrl, extractSharedPayload } from '@/lib/share';
import { scheduleClipboardClear, cancelClipboardClear } from '@/lib/clipboard';
import { isBlankPassword } from '@/lib/password';

const CLIPBOARD_CLEAR_DELAY_MS = 30000;

export default function Index() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [language, setLanguage] = useState<Lang>(() => {
    const stored = localStorage.getItem('language');
    return LANGUAGES.some((l) => l.value === stored) ? (stored as Lang) : 'en';
  });
  const t = getTranslations(language);

  const [sharedLink] = useState(() => extractSharedPayload(window.location.search, window.location.hash));
  const [text, setText] = useState(sharedLink.payload ?? '');
  const [password, setPassword] = useState('');
  const [iterations, setIterations] = useState(400000);
  const [output, setOutput] = useState('');
  const [outputKind, setOutputKind] = useState<'encrypted' | 'decrypted' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fingerprint, setFingerprint] = useState<{ password: string; id: string } | null>(null);
  // A StarID only counts for the exact password it was computed from, so a stale ID is never shown while typing.
  const starId = fingerprint && fingerprint.password === password ? fingerprint.id : '';
  const importedShare = useRef(false);
  const [autoClearEnabled, setAutoClearEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!sharedLink.payload || importedShare.current) return;
    importedShare.current = true;
    toast.success(t.importedEncryptedInput);
    window.history.replaceState({}, '', `${window.location.pathname}${sharedLink.search}${sharedLink.hash}`);
  }, [sharedLink, t.importedEncryptedInput]);

  useEffect(() => {
    // Pasting a share link into the address bar of an already-open tab only changes the fragment,
    // which does not reload the page.
    const onHashChange = () => {
      const { payload, search, hash } = extractSharedPayload(window.location.search, window.location.hash);
      if (!payload) return;
      setText(payload);
      toast.success(t.importedEncryptedInput);
      window.history.replaceState({}, '', `${window.location.pathname}${search}${hash}`);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [t.importedEncryptedInput]);

  useEffect(() => {
    if (!password) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      computePasswordFingerprint(password)
        .then((id) => {
          if (!cancelled) setFingerprint({ password, id });
        })
        .catch(() => {
          if (!cancelled) setFingerprint(null);
        });
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [password]);

  const handleEncrypt = useCallback(async () => {
    if (isProcessing) return;
    if (!text.trim() || isBlankPassword(password)) {
      toast.error(t.errorEmpty);
      return;
    }
    try {
      setIsProcessing(true);
      const result = await encryptText(text, password, iterations);
      setOutput(result);
      setOutputKind('encrypted');
      toast.success(t.successEncrypt);
    } catch {
      toast.error(t.errorGeneric);
    } finally {
      setIsProcessing(false);
    }
  }, [text, password, iterations, isProcessing, t]);

  const handleDecrypt = useCallback(async () => {
    if (isProcessing) return;
    const input = text.trim();
    if (!input || !password) {
      toast.error(t.errorEmpty);
      return;
    }

    const requiredIterations = getIterationCount(input);
    if (
      requiredIterations !== null &&
      requiredIterations > SLOW_DECRYPT_THRESHOLD &&
      !window.confirm(t.slowDecryptConfirm.replace('{count}', requiredIterations.toLocaleString()))
    ) {
      return;
    }

    try {
      setIsProcessing(true);
      const result = await decryptText(input, password);
      setOutput(result);
      setOutputKind('decrypted');
      toast.success(t.successDecrypt);
    } catch {
      toast.error(t.errorGeneric);
    } finally {
      setIsProcessing(false);
    }
  }, [text, password, isProcessing, t]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.successCopy);
      if (autoClearEnabled) {
        scheduleClipboardClear(output, CLIPBOARD_CLEAR_DELAY_MS, (result) => {
          if (result === 'cleared') toast.info(t.clipboardCleared);
          if (result === 'failed') toast.warning(t.clipboardClearFailed);
        });
      } else {
        cancelClipboardClear();
      }
    } catch {
      toast.error(t.clipboardBlocked);
    }
  }, [output, autoClearEnabled, t]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputKind === 'decrypted' ? 'decrypted.txt' : 'encrypted.enc.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output, outputKind]);

  const handleShare = useCallback(async () => {
    if (!output) return;
    if (outputKind !== 'encrypted') {
      toast.error(t.shareOnlyEncrypted);
      return;
    }
    const url = buildShareUrl(window.location.origin, window.location.pathname, output);
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.successCopy);
    } catch {
      toast.error(t.failedCopyLink);
    }
  }, [output, outputKind, t]);

  const handleClearText = useCallback(() => {
    setText('');
  }, []);

  const handleClearPassword = useCallback(() => {
    setPassword('');
  }, []);

  const handleClearOutput = useCallback(() => {
    setOutput('');
    setOutputKind(null);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleEncrypt();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleEncrypt]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <header className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight text-foreground">
            {t.heroTitle}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light">
            {t.heroSubtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          <InputCard
            text={text}
            onTextChange={setText}
            onClearText={handleClearText}
            password={password}
            onPasswordChange={setPassword}
            onClearPassword={handleClearPassword}
            iterations={iterations}
            onIterationsChange={setIterations}
            starId={starId}
            onEncrypt={handleEncrypt}
            onDecrypt={handleDecrypt}
            isProcessing={isProcessing}
            t={t}
          />

          <OutputCard
            output={output}
            outputKind={outputKind}
            isProcessing={isProcessing}
            onClearOutput={handleClearOutput}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onShare={handleShare}
            t={t}
          />

          <SecurityPanel
            autoClearEnabled={autoClearEnabled}
            onAutoClearChange={setAutoClearEnabled}
            t={t}
          />
        </div>
      </main>
    </div>
  );
}
