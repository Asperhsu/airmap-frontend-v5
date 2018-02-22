export default {
    strict: true,
    namespaced: true,
    state: {
        enable: false,
        fillOpacity: 0.6,
        moveSpeed: 1,
    },
    mutations: {
        setEnable(state, flag) {
            state.enable = !!flag;
        },
        setFillOpacity(state, opacity) {
            state.fillOpacity = parseFloat(opacity);
        },
        setMoveSpeed(state, speed) {
            state.moveSpeed = parseInt(speed, 10);
        },
    }
};
