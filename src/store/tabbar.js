export default {
    strict: true,
    namespaced: true,
    state: {
        index: 0
    },
    mutations: {
        set(state, index) {
            state.index = index;
        }
    }
}