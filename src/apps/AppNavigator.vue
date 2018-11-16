<template>
    <v-ons-navigator swipeable swipe-target-width="50px"
        :page-stack="pageStack"
        :pop-page="storePop"
    ></v-ons-navigator>
</template>

<script>
    import {registerSettingWatcher, emitSettingCommit} from '@/services/store';
    import AppTabbar from '@/apps/AppTabbar.vue';
    import Warning from '@/pages/Warning.vue';

    export default {
        beforeCreate() {

        },

        created () {
            registerSettingWatcher();
            emitSettingCommit();
            this.checkShowWarning();
        },

        computed: {
            pageStack() { return this.$store.state.navigator.stack; },
            options() { return this.$store.state.navigator.options; },
            lastShowWarning() { return this.$store.state.app.lastShowWarning; },
        },

        methods: {
            storePop() {
                this.$store.commit('navigator/pop');
            },
            checkShowWarning () {
                if (!this.lastShowWarning) {
                    this.$store.commit('navigator/push', Warning);
                    return;
                }

                let expireTime = (new Date).getTime() - (2 * 3600 * 1000); // 2 hours
                if (this.lastShowWarning <= expireTime) {
                    this.$store.commit('app/setLastShowWarning', null);
                    this.$store.commit('navigator/push', Warning);
                    return;
                }

                this.$store.commit('navigator/push', AppTabbar);
            }
        }
    };
</script>