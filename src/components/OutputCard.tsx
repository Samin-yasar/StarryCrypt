import { useState } from 'react';
import { Copy, Download, Link, Loader2, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Translations } from '@/translations';
import { toast } from 'sonner';

interface OutputCardProps {
  output: string;
  isProcessing: boolean;
  starId: string;
  onClearOutput: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onShare: () => void;
  t: Translations;
}

const QR_MAX_LENGTH = 2953;

export function OutputCard({ output, isProcessing, starId, onClearOutput, onCopy, onDownload, onShare, t }: OutputCardProps) {
  const [showQr, setShowQr] = useState(false);

  const handleQr = () => {
    if (!output) return;
    if (output.length > QR_MAX_LENGTH) {
      toast.warning(t.qrTooLong);
      return;
    }
    setShowQr(true);
  };

  return (
    <section className="glass-card p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">
          {t.secureOutput}
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={onClearOutput}
            disabled={!output}
            className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
          >
            {t.clearOutput}
          </button>
          {isProcessing && (
            <Loader2 className="w-5 h-5 text-primary animate-spin-slow" />
          )}
          {starId && (
            <span className="text-xs sm:text-sm font-mono font-bold text-brand-badge-text bg-brand-badge-bg px-2.5 py-1 rounded-lg">
              ID: {starId}
            </span>
          )}
        </div>
      </div>

      <textarea
        readOnly
        value={output}
        className="input-field h-36 sm:h-48 md:h-56 font-mono text-sm sm:text-base leading-relaxed resize-none"
        style={{ background: 'hsl(var(--surface-subtle))' }}
        placeholder={t.resultPlaceholder}
      />

      {showQr && output && (
        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white border border-border">
          <QRCodeSVG value={output} size={220} level="M" />
          <button
            onClick={() => setShowQr(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
            {t.closeQr}
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 sm:gap-4 pt-2">
        <button
          onClick={onCopy}
          disabled={!output}
          className="bg-secondary text-secondary-foreground font-semibold py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-2xl hover:opacity-80 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 border border-border text-sm sm:text-base"
          type="button"
        >
          <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t.copy}</span>
        </button>
        <button
          onClick={onDownload}
          disabled={!output}
          className="bg-secondary text-secondary-foreground font-semibold py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-2xl hover:opacity-80 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 border border-border text-sm sm:text-base"
          type="button"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t.save}</span>
        </button>
        <button
          onClick={onShare}
          disabled={!output}
          className="bg-secondary text-secondary-foreground font-semibold py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-2xl hover:opacity-80 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 border border-border text-sm sm:text-base"
          type="button"
        >
          <Link className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t.shareEncrypted}</span>
        </button>
        <button
          onClick={handleQr}
          disabled={!output}
          className="bg-secondary text-secondary-foreground font-semibold py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-2xl hover:opacity-80 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 border border-border text-sm sm:text-base"
          type="button"
          title={t.qrTooltip}
        >
          <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t.qrCode}</span>
        </button>
      </div>
    </section>
  );
}
