import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJson from './lang/en';
import krJson from './lang/kr';
import jpJson from './lang/jp';

// the translations
const resources = {
    en: enJson,
    kr: krJson,
    jp: jpJson,
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
