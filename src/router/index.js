import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';

import AppTabbar from '@/apps/AppTabbar.vue';
import Map from '@/pages/Map'
import List from '@/pages/List'
import FavoriteList from '@/pages/FavoriteList'
import Resource from '@/pages/Resource'
import AppSetting from '@/pages/AppSetting'

Vue.use(VueRouter)

const router = new VueRouter({
    base: __dirname,
    routes: [
        {
            path: '/map',
            name: 'map',
            component: Map,
        },
        {
            path: '/list',
            name: 'list',
            component: List
        },
        {
            path: '/favorite-list',
            name: 'favorite-list',
            component: FavoriteList
        },
        {
            path: '/resource',
            name: 'resource',
            component: Resource
        },
        {
            path: '/setting',
            name: 'setting',
            component: AppSetting
        },
        { path: '/*', redirect: '/map' }
    ]
});

export default router;