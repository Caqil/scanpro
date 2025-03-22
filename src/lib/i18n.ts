// src/store/store.ts
import { create } from 'zustand';
import en from '../lib/i18n/locales/en';
import id from '../lib/i18n/locales/id';
import es from '../lib/i18n/locales/es';
// import fr from '../lib/i18n/locales/fr';

// Available languages
const languages = {
    en,
    id,
    es,
    // fr,
};

// Define supported languages
export const SUPPORTED_LANGUAGES = Object.keys(languages);

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
        // Default to English if the requested language doesn't exist
        const translations = languages[language] || languages.en;
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
                // Regular expression to match any of the supported languages at the beginning of the path
                const langRegex = new RegExp(`^/(${SUPPORTED_LANGUAGES.join('|')})`);
                const pathWithoutLang = path.replace(langRegex, '') || '/';

                // Navigate to new language path
                window.location.href = `/${language}${pathWithoutLang}`;
            }
        }
    }
}));