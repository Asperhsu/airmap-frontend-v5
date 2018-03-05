import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import app from './app'
import navigator from './navigator'
// import splitter from './splitter'
// import tabbar from './tabbar'
import map from './map'
import site from './site'
import town from './town'
import windLayer from './windLayer'

let store = new Vuex.Store({
    modules: {
        app,
        navigator,
        // splitter,
        // tabbar,
        map,
        site,
        town,
        windLayer,
    }
});
export default store;


let initialStateCopy = JSON.parse(JSON.stringify(store.state));
export function getInitialState () {
    return initialStateCopy;
}

export function resetState () {
    let initState = JSON.parse(JSON.stringify(initialStateCopy));
    let currentState = $.extend({}, store.state);

    // state to be reset
    currentState.app = initState.app;
    currentState.map.center = initState.map.center;
    currentState.map.zoom = initState.map.zoom;
    currentState.map.showIndicator = initState.map.showIndicator;
    currentState.site.favorites = initState.site.favorites;
    currentState.site.onlyShowFavorite = initState.site.onlyShowFavorite;
    currentState.windLayer = initState.windLayer;

    store.replaceState(currentState);
  }