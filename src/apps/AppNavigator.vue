<template>
    <v-ons-navigator swipeable swipe-target-width="50px"
        :page-stack="pageStack"
        :pop-page="storePop"
    ></v-ons-navigator>
</template>

<script>
    import SettingStorage from '@/services/settingStorage';
    import { init as langInit } from '@/services/i18n'
    import AppTabbar from './AppTabbar.vue';

    export default {
        beforeCreate() {
            this.$store.commit('navigator/push', AppTabbar);
        },

        created () {
            langInit();
            // SettingStorage.registerWatcher([
            //     {commit: 'site/setIndicatorType', stateKey: 'site.indicatorType'},
            // ]);
        },

        data() {
            return {
                //
            }
        },

        computed: {
            pageStack() {
                return this.$store.state.navigator.stack;
            },
            options() {
                return this.$store.state.navigator.options;
            }
        },

        methods: {
            storePop() {
                this.$store.commit('navigator/pop');
            },
        }
    };
</script>