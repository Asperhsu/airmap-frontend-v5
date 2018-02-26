<template>
    <div>
        <v-ons-list-title>站點過濾</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-header>我的最愛</v-ons-list-header>
            <v-ons-list-item tappable>
                <div class="center"></div>
                <label class="center" for="onlyShowFavoriteSwitch">
                    只顯示我的最愛
                </label>
                <div class="right">
                    <v-ons-switch input-id="onlyShowFavoriteSwitch" v-model="onlyShowFavoriteSwitch" />
                </div>
            </v-ons-list-item>

            <v-ons-list-header>群組</v-ons-list-header>
            <v-ons-list-item v-for="(count, name) in groups" :key="name" tappable>
                <label class="center" :for="'groupcheckbox-' + name">
                    {{ name }} <div class="badge">{{ count }}</div>
                </label>
                <label class="right">
                    <v-ons-checkbox
                        :input-id="'groupcheckbox-' + name"
                        :value="name"
                        :disabled="onlyShowFavoriteSwitch"
                        v-model="activeGroups"
                    >
                    </v-ons-checkbox>
                </label>
            </v-ons-list-item>

            <v-ons-list-header>圖示</v-ons-list-header>
            <v-ons-list-item v-for="(stat, index) in analysisTypes" :key="stat.name" tappable>
                <label class="left">
                    <img :src="getIcon(stat.method, stat.count)" />
                </label>
                <label class="center" :for="'statcheckbox-' + index">
                    {{ stat.text }}
                </label>
                <label class="right">
                    <v-ons-checkbox
                        :input-id="'statcheckbox-' + index"
                        :value="stat.name"
                        :disabled="onlyShowFavoriteSwitch"
                        v-model="activeAnalysisTypes"
                    ></v-ons-checkbox>
                </label>
            </v-ons-list-item>
        </v-ons-list>
    </div>
</template>

<script>
    import * as MarkerIcon from '@/services/map/markerIconService'

    export default {
        computed: {
            groups () { return this.$store.state.site.groups; },
            activeGroups: {
                get: function () {
                    return this.$store.state.site.activeGroups;
                },
                set: function (groups) {
                    this.$store.commit('site/setActiveGroups', groups);
                }
            },

            analysisTypes () { return this.$store.state.site.analysisTypes; },
            activeAnalysisTypes: {
                get: function () {
                    return this.$store.state.site.activeAnalysisTypes;
                },
                set: function (types) {
                    this.$store.commit('site/setActiveAnalysisTypes', types);
                }
            },

            onlyShowFavoriteSwitch: {
                get: function () {
                    return this.$store.state.site.onlyShowFavoriteSwitch;
                },
                set: function (value) {
                    this.$store.commit('site/setOnlyShowFavoriteSwitch', value);
                }
            }
        },

        methods: {
            getIcon(method, cnt) {
                return MarkerIcon[method]('#999', cnt);
            }
        },
    }
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>