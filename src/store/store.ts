// src/store/language-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, SUPPORTED_LANGUAGES } from '../lib/i18n/config';

// Type for language identifiers
export type Language = keyof typeof translations;

// Function to get nested translation
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let result = keys.reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);

  if (result !== null && typeof result === 'object') {
    console.warn(`Translation key "${path}" returned an object instead of a string.`);
    return path;
  }

  return result !== undefined ? result : path;
};

interface LanguageState {
  language: Language;
  t: (key: string) => string;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',

      // Translation function
      t: (key: string): string => {
        const { language } = get();
        // Get translations or fallback to English if language doesn't exist
        const translationSet = translations[language] || translations.en;
        return getNestedTranslation(translationSet, key);
      },

      // Function to change language and redirect to language URL
      setLanguage: (language: Language) => {
        // Only update state if it's different
        if (get().language !== language) {
          set({ language });

          // Only run in browser environment
          if (typeof window !== 'undefined') {
            // Extract current path without language prefix
            const path = window.location.pathname;
            // Regular expression to match any of the supported languages at the beginning of the path
            const langRegex = new RegExp(`^/(${SUPPORTED_LANGUAGES.join('|')})`);
            const pathWithoutLang = path.replace(langRegex, '') || '/';

            // Navigate to new language path
            window.location.href = `/${language}${pathWithoutLang}`;
          }
        }
      }
    }),
    {
      name: 'language-storage', // Unique name for localStorage
      partialize: (state) => ({ language: state.language }), // Only persist language
    }
  )
);