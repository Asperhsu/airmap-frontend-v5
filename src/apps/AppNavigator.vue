<template>
    <v-ons-navigator swipeable swipe-target-width="50px"
        :page-stack="pageStack"
        :pop-page="storePop"
    ></v-ons-navigator>
</template>

<script>
    import SettingStorage from '@/services/settingStorage';
    import { init as langInit } from '@/services/i18n'
    import AppTabbar from '@/apps/AppTabbar.vue';

    export default {
        beforeCreate() {
            this.$store.commit('navigator/push', AppTabbar);
        },

        created () {
            langInit();
            SettingStorage.registerWatcher([
                {commit: 'app/setLang', stateKey: 'app.lang'},
                {commit: 'app/setMapType', stateKey: 'app.mapType'},
                {commit: 'app/setMeasureType', stateKey: 'app.measureType'},
                {commit: 'app/setPM25IndicatorType', stateKey: 'app.pm25IndicatorType'},

                {commit: 'map/setCenter', stateKey: 'map.center'},
                {commit: 'map/setZoom', stateKey: 'map.zoom'},
                {commit: 'map/setShowIndicator', stateKey: 'map.showIndicator'},
                {commit: 'map/setStartupUseMyLocation', stateKey: 'map.startupUseMyLocation'},

                {commit: 'site/setActiveAnalysisTypes', stateKey: 'site.activeAnalysisTypes'},
                {commit: 'site/setFavorites', stateKey: 'site.favorites'},
                {commit: 'site/setOnlyShowFavorite', stateKey: 'site.onlyShowFavorite'},
            ]);
        },

        computed: {
            pageStack() { return this.$store.state.navigator.stack; },
            options() { return this.$store.state.navigator.options; }
        },

        methods: {
            storePop() {
                this.$store.commit('navigator/pop');
            },
        }
    };
</script>