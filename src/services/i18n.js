const Cookies = require("js.cookie");

const supportLangs = ['en', 'tw'];

const translations = {
    recruit: {
        en: "Station Recruit",
        tw: "自造募集",
    }
};

export const isLangExist = (lang) => {
    return supportLangs.indexOf(userLang) > -1;
}

export const getLang = () => {
    return currentLang;
}

export const setLang = (lang) => {
    if (!isLangExist(lang)) { return false; }

    userLang = lang;
    Cookies.set('language', lang);

    return true;
}

export const lang = (index) => {
    const lang = getLang();

    if (translations[index] && translations[index][lang]) {
        return translations[index][lang];
    }

    return '!!'+index+'!!';
}

var userLang = Cookies.get('language') || navigator.language || navigator.userLanguage;
var currentLang = isLangExist(userLang) ? userLang : 'tw';