import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationFi from './locales/fi/translation.json';

const resources = {
  fi: {
    translation: translationFi,
  },
};

export function initLocales() {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'fi',
    fallbackLng: 'fi',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });
}
