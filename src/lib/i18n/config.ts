// src/lib/i18n/config.ts
import enTranslations from './locales/en';
import idTranslations from './locales/id';
import esTranslations from './locales/es';
// import frTranslations from './locales/fr';

// Define all available translations
export const translations = {
    en: enTranslations,
    id: idTranslations,
    es: esTranslations,
    // fr: frTranslations,
};

// Define supported languages for the application
export const SUPPORTED_LANGUAGES = Object.keys(translations);

// Helper function to get translation
export function getTranslation(lang: string, key: string): string {
    // Get the translation set for the specified language, fallback to English
    const translationSet = translations[lang as keyof typeof translations] || translations.en;

    // Navigate nested objects using dot notation
    const keys = key.split('.');
    let result = keys.reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, translationSet as any);

    if (result !== null && typeof result === 'object') {
        console.warn(`Translation key "${key}" returned an object instead of a string.`);
        return key;
    }

    return result !== undefined ? result : key;
}

// Language metadata for UI display
export const languageMetadata = {
    en: {
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
    },
    id: {
        name: 'Indonesian',
        nativeName: 'Bahasa Indonesia',
        flag: '🇮🇩',
    },
    es: {
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
    },
};