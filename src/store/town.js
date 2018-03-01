export default {
    strict: true,
    namespaced: true,
    state: {
        data: null,
        dataFetchedAt: null,
    },
    getters: {
        findTown: state => (country, town) => {
            return state.data.data.find(item => {
                return item.country === country && item.town === town;
            }) || null;
        },
        getPublished: state => {
            return state.data && state.data.published * 1000;
        },
    },
    mutations: {
        setData(state, data) {
            if (data) {
                state.data = data;
                state.dataFetchedAt = (new Date()).getTime();
            }
        },
    }
}