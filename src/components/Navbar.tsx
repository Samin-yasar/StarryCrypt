import { Sun, Moon, Sparkles, Github } from 'lucide-react';
import { Lang, LANGUAGES } from '@/lib/i18n';

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
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" strokeWidth={2.5} />
        </div>
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
          className="bg-transparent border-none font-medium text-muted-foreground text-sm sm:text-base cursor-pointer hover:text-primary transition-colors outline-none"
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
          <Github className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
}
