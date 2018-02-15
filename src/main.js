// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'font-awesome/css/font-awesome.css'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

import Vue from 'vue'
import $ons from 'vue-onsenui/esm'
import * as VOns from './vue-onsen-components'
import store from './store'
import router from './router'
import { lang } from './services/i18n'
import axios from 'axios';
import AppNavigator from './apps/AppNavigator.vue';
import AppTabbar from './apps/AppTabbar.vue';
// $ons.disableAutoStyling();

Vue.config.productionTip = false

// onsen ui
Vue.use($ons)
Object.values(VOns).forEach(comp => Vue.component(comp.name, comp))

// helpers
Vue.prototype.lang = lang;

// configs
axios.defaults.baseURL = process.env.BASE_URL;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<AppNavigator/>',
    components: {AppNavigator}
})
