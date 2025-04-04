import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "dashboard": "Dashboard",
            "inquiry": "Inquiry",
            "order": "Order",
            "statistics": "Statistics",
            "mail": "Mail",
            "profile": "Profile"
        }

    },
    de: {
        translation: {
            "dashboard": "Dashboard",
            "inquiry": "Preisabfrage",
            "order": "Bestellung",
            "statistics": "Statistiks",
            "mail": "Benachrichtigung",
            "profile": "Profile"
        }
    },
    ru: {
        translation: {
            "dashboard": "приборная панель"
        }
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'de',
        debug: true
    });

export default i18n;