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

// Function to get nested properties using dot notation
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let result = keys.reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);

  // Important check: if result is an object, return the path instead to avoid React errors
  if (result !== null && typeof result === 'object') {
    console.warn(`Translation key "${path}" returned an object instead of a string. Check your usage.`);
    return path; // Return the key path as fallback
  }

  // If the result is undefined, return the key as fallback
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

  // Function to change the language
  setLanguage: (language: Language) => {
    set({ language });
  }
}));