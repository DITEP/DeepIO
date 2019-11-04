import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // load translation using xhr -> see /public/locales
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: '../public/locales/{{lng}}/{{ns}}.json'
    },
    fallbackLng: 'en-US',
    debug: true,
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
