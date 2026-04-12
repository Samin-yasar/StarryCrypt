import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { InputCard } from '@/components/InputCard';
import { OutputCard } from '@/components/OutputCard';
import { SecurityPanel } from '@/components/SecurityPanel';
import { useTheme } from '@/hooks/useTheme';
import { Lang, getTranslations } from '@/lib/i18n';
import { encryptText, decryptText, computeHmacSha512, computeSha256Fingerprint } from '@/lib/crypto';

export default function Index() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [language, setLanguage] = useState<Lang>(() => {
    const stored = localStorage.getItem('language') as Lang;
    return stored || 'en';
  });
  const t = getTranslations(language);

  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [iterations, setIterations] = useState(400000);
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [starId, setStarId] = useState('');
  const [hmacEnabled, setHmacEnabled] = useState(true);
  const [autoClearEnabled, setAutoClearEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (password) {
      computeSha256Fingerprint(password).then(setStarId);
    } else {
      setStarId('');
    }
  }, [password]);

  const handleEncrypt = useCallback(async () => {
    if (!text.trim() || !password) {
      toast.error(t.errorEmpty);
      return;
    }
    try {
      setIsProcessing(true);
      let result = await encryptText(text, password, iterations);
      if (hmacEnabled) {
        const hmac = await computeHmacSha512(result, password);
        result = `${result}|${hmac}`;
      }
      setOutput(result);
      toast.success(t.successEncrypt);
    } catch {
      toast.error(t.errorGeneric);
    } finally {
      setIsProcessing(false);
    }
  }, [text, password, iterations, hmacEnabled, t]);

  const handleDecrypt = useCallback(async () => {
    let input = text.trim();
    if (!input || !password) {
      toast.error(t.errorEmpty);
      return;
    }
    try {
      setIsProcessing(true);
      if (hmacEnabled || input.includes('|')) {
        const [data, providedHmac] = input.split('|');
        if (providedHmac) {
          const computedHmac = await computeHmacSha512(data, password);
          if (computedHmac !== providedHmac) {
            toast.error(t.errorHmac);
            return;
          }
          input = data;
        }
      }
      const result = await decryptText(input, password);
      setOutput(result);
      toast.success(t.successDecrypt);
    } catch {
      toast.error(t.errorGeneric);
    } finally {
      setIsProcessing(false);
    }
  }, [text, password, hmacEnabled, t]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t.successCopy);
      if (autoClearEnabled) {
        setTimeout(async () => {
          await navigator.clipboard.writeText('');
          toast.info(t.clipboardCleared);
        }, 30000);
      }
    } catch {
      toast.error('Clipboard blocked.');
    }
  }, [output, autoClearEnabled, t]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypt.enc.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleShare = useCallback(async () => {
    if (!output) return;
    const url = `${window.location.origin}${window.location.pathname}?text=${encodeURIComponent(output)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.successCopy);
    } catch {
      toast.error('Failed to copy link.');
    }
  }, [output, t]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
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
            StarryCrypt
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light">
            Enterprise-grade text encryption for the modern web.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          <InputCard
            text={text}
            onTextChange={setText}
            password={password}
            onPasswordChange={setPassword}
            iterations={iterations}
            onIterationsChange={setIterations}
            onEncrypt={handleEncrypt}
            onDecrypt={handleDecrypt}
            isProcessing={isProcessing}
            t={t}
          />

          <OutputCard
            output={output}
            isProcessing={isProcessing}
            starId={starId}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onShare={handleShare}
            t={t}
          />

          <SecurityPanel
            hmacEnabled={hmacEnabled}
            onHmacChange={setHmacEnabled}
            autoClearEnabled={autoClearEnabled}
            onAutoClearChange={setAutoClearEnabled}
          />
        </div>
      </main>
    </div>
  );
}
