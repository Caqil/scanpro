// src/store/store.ts
import { create } from 'zustand';
import en from '../lib/i18n/locales/en';
import id from '../lib/i18n/locales/id';

// Available languages
const languages = {
  en,
  id
};

// Type for language identifiers
type Language = keyof typeof languages;

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

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',

  // Translation function
  t: (key: string): string => {
    const { language } = get();
    const translations = languages[language];
    return getNestedTranslation(translations, key);
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
        const pathWithoutLang = path.replace(/^\/(en|id)/, '') || '/';

        // Navigate to new language path
        window.location.href = `/${language}${pathWithoutLang}`;
      }
    }
  }
}));