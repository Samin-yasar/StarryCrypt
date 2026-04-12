import { useState } from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { Translations } from '@/translations';

interface SecurityPanelProps {
  hmacEnabled: boolean;
  onHmacChange: (v: boolean) => void;
  autoClearEnabled: boolean;
  onAutoClearChange: (v: boolean) => void;
  t: Translations;
}

export function SecurityPanel({ hmacEnabled, onHmacChange, autoClearEnabled, onAutoClearChange, t }: SecurityPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="glass-card p-5 sm:p-8 md:p-10 mb-12 sm:mb-20">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full cursor-pointer rounded-xl p-2 hover:bg-secondary transition-colors text-left"
        type="button"
      >
        <span className="text-sm sm:text-base font-bold text-primary uppercase tracking-widest flex items-center gap-2.5">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
          {t.securitySentinel}
        </span>
        <ChevronDown
          className={`w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 border-t border-border mt-4 sm:mt-6">
          <div className="space-y-4 sm:space-y-6">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm sm:text-base font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {t.hmacIntegrity}
              </span>
              <input
                type="checkbox"
                checked={hmacEnabled}
                onChange={(e) => onHmacChange(e.target.checked)}
                className="accent-primary w-5 h-5 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm sm:text-base font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {t.memoryWipe}
              </span>
              <input
                type="checkbox"
                checked={autoClearEnabled}
                onChange={(e) => onAutoClearChange(e.target.checked)}
                className="accent-primary w-5 h-5 cursor-pointer"
              />
            </label>
          </div>
          <div className="flex items-center bg-brand-badge-bg p-4 sm:p-5 rounded-2xl border border-primary/10">
            <p className="text-xs sm:text-sm text-brand-badge-text leading-relaxed font-medium">
              {t.securityDescription}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
