import { Copy, Download, Link, Loader2 } from 'lucide-react';
import { Translations } from '@/lib/i18n';

interface OutputCardProps {
  output: string;
  isProcessing: boolean;
  starId: string;
  onCopy: () => void;
  onDownload: () => void;
  onShare: () => void;
  t: Translations;
}

export function OutputCard({ output, isProcessing, starId, onCopy, onDownload, onShare, t }: OutputCardProps) {
  return (
    <section className="glass-card p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">
          {t.secureOutput}
        </label>
        <div className="flex items-center gap-3">
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
        placeholder="Result will appear here..."
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
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
          <span className="hidden sm:inline">URL</span>
        </button>
      </div>
    </section>
  );
}
