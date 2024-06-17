import { locales_de } from '../resources/locales_de';
import { locales_en } from '../resources/locales_en';
import { localStorageKeys } from '../resources/resource_properties';

export const locales = () => {
  switch (window.localStorage.getItem(localStorageKeys.selectedLanguage)) {
    case 'de_DE':
      return locales_de;
    case 'en_US':
      return locales_en;
    default:
      return locales_en;
  }
};
