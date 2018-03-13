import moment from 'moment';
import "moment/locale/zh-tw";
import store from '@/store';
import translations from '@/assets/langs';
import {getObjectValue} from '@/services/helpers';

const supportLangs = {
    tw: 'Traditional Chinese',
    en: 'English',
};

export const isLangExist = (lang) => {
    return supportLangs.hasOwnProperty(lang);
}

export const getLang = () => {
    return store.state.app.lang;
}

export const getSupportLangs = () => {
    return supportLangs;
}

export const setLang = (lang) => {
    if (!isLangExist(lang)) { return false; }

    moment.locale(lang == 'tw' ? 'zh-tw' : 'en');

    return true;
}

export const lang = (index) => {
    let currentLang = getLang();

    if (translations.hasOwnProperty(currentLang)) {
        return getObjectValue(translations[currentLang], index) || '!!'+index+'!!';
    }

    return '!!'+index+'!!';
}

export const detectLang = () => {
    var userLang = navigator.language || navigator.userLanguage;
    return isLangExist(userLang) ? userLang : 'tw';
}