import { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { Translations } from '@/translations';

interface InputCardProps {
  text: string;
  onTextChange: (text: string) => void;
  onClearText: () => void;
  password: string;
  onPasswordChange: (pw: string) => void;
  onClearPassword: () => void;
  iterations: number;
  onIterationsChange: (n: number) => void;
  onEncrypt: () => void;
  onDecrypt: () => void;
  isProcessing: boolean;
  t: Translations;
}

export function InputCard({
  text, onTextChange, onClearText, password, onPasswordChange, onClearPassword,
  iterations, onIterationsChange, onEncrypt, onDecrypt,
  isProcessing, t
}: InputCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const charCount = text.length;

  return (
    <section className="glass-card p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">
          {t.sourceText}
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearText}
            disabled={!text}
            className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
          >
            {t.clearText}
          </button>
          <span className="text-xs sm:text-sm font-medium text-brand-badge-text bg-brand-badge-bg px-2.5 py-1 rounded-lg">
            {charCount.toLocaleString()} {t.characters}
          </span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="input-field h-48 sm:h-64 md:h-72 resize-none font-medium leading-relaxed"
        placeholder={t.enterTextPlaceholder}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
        <div className="space-y-2.5">
          <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">
            {t.password}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="input-field pr-14"
                placeholder={t.encryptionKey}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2 cursor-pointer"
                type="button"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={onClearPassword}
              disabled={!password}
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              type="button"
            >
              {t.clearPassword}
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">
            {t.iterations}
          </label>
          <select
            value={iterations}
            onChange={(e) => onIterationsChange(Number(e.target.value))}
            className="input-field appearance-none cursor-pointer"
          >
            <option value={400000}>{t.iterationsRecommended}</option>
            <option value={600000}>{t.iterations600k}</option>
            <option value={1000000}>{t.iterationsMax}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 pt-4 sm:pt-6">
        <button
          onClick={onEncrypt}
          disabled={isProcessing}
          className="flex-1 bg-primary text-primary-foreground font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl hover:opacity-90 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 text-base sm:text-lg shadow-lg"
          type="button"
        >
          <Lock className="w-5 h-5" strokeWidth={2.5} />
          {t.encrypt}
        </button>
        <button
          onClick={onDecrypt}
          disabled={isProcessing}
          className="flex-1 bg-secondary text-secondary-foreground font-semibold py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl hover:opacity-80 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 border border-border text-base sm:text-lg"
          type="button"
        >
          <Unlock className="w-5 h-5" strokeWidth={2.5} />
          {t.decrypt}
        </button>
      </div>
    </section>
  );
}
