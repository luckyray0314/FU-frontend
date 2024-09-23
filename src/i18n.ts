import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { i18n_API_KEY, i18n_HOST } from './core/constants/base.const';

const loadPath = `${i18n_HOST}/{{lng}}/{{ns}}.json?api_key=${i18n_API_KEY}`;

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'sv',
    ns: ['default'],
    defaultNS: 'default',
    supportedLngs: ['sv', 'en'],
    backend: {
      loadPath: loadPath,
    },
    react: {
      useSuspense: true,
    },
  });
