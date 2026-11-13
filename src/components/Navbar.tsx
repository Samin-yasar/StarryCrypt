import { Sun, Moon } from 'lucide-react';
import { Lang, LANGUAGES } from '@/lib/i18n';

// lucide-react 1.x dropped brand icons, so the GitHub mark is inlined.
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  language: Lang;
  onLanguageChange: (lang: Lang) => void;
}

export function Navbar({ isDark, onToggleTheme, language, onLanguageChange }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border backdrop-blur-xl sticky top-0 z-50 bg-background/80">
      <div className="flex items-center gap-3">
        <img
          src="/starrycrypt_logo_nav.png"
          alt="StarryCrypt Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-lg object-cover"
        />
        <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">StarryCrypt</span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer active:scale-90"
          aria-label="Toggle theme"
          type="button"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Lang)}
          className="bg-transparent border-none font-medium text-muted-foreground text-sm sm:text-base cursor-pointer hover:text-primary transition-colors outline-hidden"
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value} className="bg-card text-card-foreground">
              {l.label}
            </option>
          ))}
        </select>

        <a
          href="https://github.com/Samin-yasar/StarryCrypt"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-200"
          title="GitHub Repository"
        >
          <GithubMark className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
}
