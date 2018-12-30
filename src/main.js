// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@/assets/styles/app.scss'

import Vue from 'vue'
import axios from 'axios';
import VueAnalytics from 'vue-analytics'

import $ons from 'vue-onsenui/esm'
import * as VOns from './vue-onsen-components'

import store from './store'
import router from './router'
import { lang } from './services/i18n'

import AppNavigator from './apps/AppNavigator.vue';
import AppTabbar from './apps/AppTabbar.vue';
// $ons.disableAutoStyling();

Vue.config.productionTip = false

// onsen ui
Vue.use($ons)
Object.values(VOns).forEach(comp => Vue.component(comp.name, comp))


// ga
if (process.env.GA_ID) {
    Vue.use(VueAnalytics, {
        id: process.env.GA_ID,
        router,
        autoTracking: {
            pageviewTemplate (route) {
                return {
                    page: 'v5' + route.path,
                    title: document.title,
                    location: window.location.href
                }
            }
        },
        debug: {
            sendHitTask: process.env.NODE_ENV === 'production'
        }
    });
}

// helpers
window.lang = Vue.prototype.lang = lang;

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
