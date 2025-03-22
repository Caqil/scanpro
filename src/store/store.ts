'use client'

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LanguageState } from '@/src/types/store';
import en from '@/src/lib/i18n/locales/en'
import id from '@/src/lib/i18n/locales/id'

const translations = { en, id }
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: string) => set({ language: lang }),
      t: (key: string) => {
        const keys = key.split('.')
        let current = translations[get().language as keyof typeof translations]
        for (const k of keys) {
          if (current[k as keyof typeof current]) {
            current = current[k as keyof typeof current]
          }
        }
        return current as string
      }
    }),
    {
      name: 'language-storage'
    }
  )
);

// Optional: Combined store type
export type RootStore = {
  language: LanguageState;
};
