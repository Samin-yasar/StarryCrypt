export type { Translations } from './types';
export type { Lang } from './types';

import en from './en';
import fr from './fr';
import es from './es';
import ja from './ja';
import ko from './ko';
import bn from './bn';
import { Lang, Translations } from './types';

const translations: Record<Lang, Translations> = { en, fr, es, ja, ko, bn };

export function getTranslations(lang: Lang): Translations {
  return translations[lang] || translations.en;
}

export const LANGUAGES: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'bn', label: 'বাংলা' },
];
