<template>
    <v-ons-page>
        <BackToolbar>地圖選單</BackToolbar>

        <v-ons-list-title>站點過濾</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-header>群組</v-ons-list-header>
            <v-ons-list-item v-for="(count, name) in groups" :key="name" tappable>
                <label class="left">
                    <v-ons-checkbox
                        :input-id="'groupcheckbox-' + name"
                        :value="name"
                        v-model="activeGroups"
                    >
                    </v-ons-checkbox>
                </label>
                <label class="center" :for="'groupcheckbox-' + name">
                    {{ name }}
                </label>
                <label class="right">
                    <div class="badge">{{ count }}</div>
                </label>
            </v-ons-list-item>

            <v-ons-list-header>量測指標</v-ons-list-header>
            <v-ons-list-item v-for="(indicator, index) in indicators" :key="index" tappable>
                <label class="left">
                    <v-ons-radio
                        :input-id="'indicatorradio-' + indicator"
                        :value="indicator"
                        v-model="indicatorType"
                    >
                    </v-ons-radio>
                </label>
                <label class="center" :for="'indicatorradio-' + indicator">
                    {{ indicator }}
                </label>
            </v-ons-list-item>

            <v-ons-list-header>圖示</v-ons-list-header>
            <v-ons-list-item v-for="(stat, index) in analysisTypes" :key="stat.name" tappable>
                <label class="left">
                    <v-ons-checkbox
                        :input-id="'statcheckbox-' + index"
                        :value="stat.name"
                        v-model="activeAnalysisTypes"
                    >
                    </v-ons-checkbox>
                </label>
                <label class="center" :for="'statcheckbox-' + index">
                    {{ stat.text }}
                </label>
                <label class="right">
                    <img :src="getIcon(stat.method, stat.count)" />
                </label>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-list-title>風力線</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-item tappable>
                <div class="left">
                    <v-ons-switch input-id="enableWindySwitch" v-model="enableWindy" />
                </div>
                <div class="center">啟動</div>
            </v-ons-list-item>

            <v-ons-list-header>線條亮度</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-range v-model="windyLineOpacity" style="width: 100%;"></v-ons-range>
                </div>
                <div class="right">{{ windyLineOpacity }}</div>
            </v-ons-list-item>

            <v-ons-list-header>移動速度</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-range v-model="windyMovingSpeed" style="width: 100%;"></v-ons-range>
                </div>
                <div class="right">{{ windyMovingSpeed }}</div>
            </v-ons-list-item>

            <v-ons-list-header>資料資訊</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">資料時間</div>
                <div class="right">xxxx-xx-xx xx:xx:xx</div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <p>風力線十分消耗資源，容易造成瀏覽器當機，請斟酌使用。</p>
                    <p>風力資料於 UTC+8 (5, 11, 17, 23 半整點更新資料)</p>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-list-title>
            <v-ons-icon icon="fa-heart"></v-ons-icon>
            特別致謝
            <v-ons-icon icon="fa-heart"></v-ons-icon>
        </v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-item>
                <div class="left">
                    <img src="https://i.imgur.com/z11DvN7.png" width="100px" />
                </div>
                <div class="center" style="text-align:center;">
                    本站硬體由 ProbeCube 團隊熱心支援<br/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
    </v-ons-page>
</template>

<script>
    import BackToolbar from '@/components/BackToolbar'
    import * as MarkerIcon from '@/services/map/markerIconService'

    export default {
        components: {BackToolbar},

        data() {
            return {
                enableWindy: false,
                windyLineOpacity: 50,
                windyMovingSpeed: 50,
            };
        },

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

            indicators () { return this.$store.state.site.indicators; },
            indicatorType: {
                get: function () {
                    return this.$store.state.site.indicatorType;
                },
                set: function (type) {
                    this.$store.commit('site/setIndicatorType', type);
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
        },

        methods: {
            getIcon(method, cnt) {
                return MarkerIcon[method]('#999', cnt);
            }
        },
    };
</script>

<style lang="scss" scoped>
    .list-title { font-size: 1.2em; padding: .5em 0; text-align: center; }
    .badge {
        width: 2em;
        height: 2em;
        box-sizing: initial;

        border: 2px solid #0076FF;
        text-align: center;
        border-radius: 50%;

        line-height: 2em;
        box-sizing: content-box;
    }
</style>
