import { createI18n } from 'vue-i18n';
import it from './locales/it.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'it',
  messages: { it },
  datetimeFormats: {
    it: {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
    },
  },
});
