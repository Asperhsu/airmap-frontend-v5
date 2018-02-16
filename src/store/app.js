export default {
    strict: true,
    namespaced: true,

    state: {
        lang: 'tw',
    },

    mutations: {
        setLang(state, lang) {
            state.lang = lang;
        },
    }
};