export default {
    strict: true,
    namespaced: true,
    state: {
        center: { lat: 23.839775, lng: 121.062213 },
        zoom: 7,
        markers: [],
        showIndicator: true,
    },
    mutations: {
        setCenter(state, center) {
            state.center = center;
        },
        setZoom(state, zoom) {
            state.zoom = zoom;
        },
        setMarkers(state, markers) {
            state.markers = [].concat(markers);
        },
        setShowIndicator(state, flag) {
            state.showIndicator = flag;
        }
    }
};