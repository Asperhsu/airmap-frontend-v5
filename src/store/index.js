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
    let state = JSON.parse(JSON.stringify(initialStateCopy));
    state.navigator = store.state.navigator;
    store.replaceState(state);
  }