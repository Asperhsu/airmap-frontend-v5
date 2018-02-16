import moment from 'moment';
import "moment/locale/zh-tw";
import store from '@/store';

const supportLangs = ['en', 'tw'];

const translations = {
    recruit: {
        en: "Station Recruit",
        tw: "自造募集",
    }
};

export const isLangExist = (lang) => {
    return supportLangs.indexOf(lang) > -1;
}

export const getLang = () => {
    return store.state.app.lang;
}

export const setLang = (lang) => {
    if (!isLangExist(lang)) { return false; }

    moment.locale(lang == 'tw' ? 'zh-tw' : 'en');

    store.commit('app/setLang', lang);
    return true;
}

export const lang = (index) => {
    const lang = getLang();

    if (translations[index] && translations[index][lang]) {
        return translations[index][lang];
    }

    return '!!'+index+'!!';
}

export const init = () => {
    var userLang = navigator.language || navigator.userLanguage;
    var lang = isLangExist(userLang) ? userLang : 'tw';
    setLang(lang);
}