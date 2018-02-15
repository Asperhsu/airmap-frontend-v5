<template>
    <v-ons-navigator swipeable swipe-target-width="50px"
        :page-stack="pageStack"
        :pop-page="storePop"
        :options="options"
    ></v-ons-navigator>
</template>

<script>
    import AppTabbar from './AppTabbar.vue';
    import SiteMapSetting from '@/pages/SiteMapSetting';

    export default {
        beforeCreate() {
            this.$store.commit('navigator/push', AppTabbar);
            // this.$store.commit('navigator/push', SiteMapSetting);
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