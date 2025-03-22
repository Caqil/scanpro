// src/lib/i18n.ts
import enTranslations from './i18n/locales/en';
import idTranslations from './i18n/locales/id';

// Available languages
const translations = {
    en: enTranslations,
    id: idTranslations,
};

// Function to get nested translation
export function getTranslation(lang: string, path: string): string {
    const langTranslations = translations[lang as keyof typeof translations] || translations.en;

    const keys = path.split('.');
    let result = keys.reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, langTranslations as any);

    if (result !== null && typeof result === 'object') {
        console.warn(`Translation key "${path}" returned an object instead of a string.`);
        return path;
    }

    return result !== undefined ? result : path;
}