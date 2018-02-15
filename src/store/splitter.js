export default {
    strict: true,
    namespaced: true,
    state: {
        leftopen: false,
        rightopen: false,
    },
    mutations: {
        toggleLeft(state, shouldOpen) {
            if (typeof shouldOpen === 'boolean') {
                state.leftopen = shouldOpen;
            } else {
                state.leftopen = !state.open;
            }
        },
        toggleRight(state, shouldOpen) {
            if (typeof shouldOpen === 'boolean') {
                state.rightopen = shouldOpen;
            } else {
                state.rightopen = !state.open;
            }
        },
    }
}