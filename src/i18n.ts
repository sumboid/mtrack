import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import hyTranslation from './locales/hy/translation.json';
import kaTranslation from './locales/ka/translation.json';
import deTranslation from './locales/de/translation.json';
import ruTranslation from './locales/ru/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  hy: {
    translation: hyTranslation,
  },
  ka: {
    translation: kaTranslation,
  },
  de: {
    translation: deTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
