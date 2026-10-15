export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

export const COMMON_LANGUAGES: LanguageOption[] = [
  { code: 'fr', label: 'Français (FR)', flag: '🇫🇷' },
  { code: 'en', label: 'English (EN)', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский (RU)', flag: '🇷🇺' },
  { code: 'es', label: 'Español (ES)', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch (DE)', flag: '🇩🇪' },
  { code: 'pt', label: 'Português (PT)', flag: '🇵🇹' },
  { code: 'ar', label: 'العربية (AR)', flag: '🇸🇦' },
  { code: 'zh', label: '中文 (ZH)', flag: '🇨🇳' },
  { code: 'sw', label: 'Kiswahili (SW)', flag: '🇹🇿' },
  { code: 'ln', label: 'Lingála (LN)', flag: '🇨🇩' },
  { code: 'ee', label: 'Eʋegbe (EE)', flag: '🇹🇬' },
  { code: 'wo', label: 'Wolof (WO)', flag: '🇸🇳' },
  { code: 'ha', label: 'Hausa (HA)', flag: '🇳🇬' },
  { code: 'yo', label: 'Yorùbá (YO)', flag: '🇳🇬' },
  { code: 'bm', label: 'Bambara (BM)', flag: '🇲🇱' },
  { code: 'it', label: 'Italiano (IT)', flag: '🇮🇹' },
  { code: 'nl', label: 'Nederlands (NL)', flag: '🇳🇱' },
  { code: 'tr', label: 'Türkçe (TR)', flag: '🇹🇷' },
];

export function getLanguageDisplay(code: string): LanguageOption {
  const normalized = (code || '').trim().toLowerCase();
  const found = COMMON_LANGUAGES.find(l => l.code.toLowerCase() === normalized);
  if (found) return found;
  return {
    code: normalized,
    label: normalized.toUpperCase(),
    flag: '🌐'
  };
}
