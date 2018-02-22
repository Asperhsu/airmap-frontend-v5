<template>
    <v-ons-page>
        <BackToolbar>地圖選單</BackToolbar>

        <v-ons-list-title>站點過濾</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-header>群組</v-ons-list-header>
            <v-ons-list-item v-for="(count, name) in groups" :key="name" tappable>
                <label class="center" :for="'groupcheckbox-' + name">
                    <div class="badge">{{ count }}</div> {{ name }}
                </label>
                <label class="right">
                    <v-ons-checkbox
                        :input-id="'groupcheckbox-' + name"
                        :value="name"
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
                        v-model="activeAnalysisTypes"
                    ></v-ons-checkbox>
                </label>
            </v-ons-list-item>
        </v-ons-list>

        <IndicatorSetting />

        <v-ons-list-title>風力線</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-item tappable>
                <div class="left">
                    <i class="fa fa-power-off" aria-hidden="true"></i>
                </div>
                <div class="center">啟動</div>
                <div class="right">
                    <v-ons-switch input-id="enableWindySwitch" v-model="windLayerEnable" />
                </div>
            </v-ons-list-item>

            <v-ons-list-header>線條亮度</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-range v-model="windFillOpacity" style="width: 100%;" min="1" max="10" step="1"></v-ons-range>
                </div>
                <div class="right">{{ windFillOpacity }}</div>
            </v-ons-list-item>

            <v-ons-list-header>移動速度</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-range v-model="windMoveSpeed" style="width: 100%;" min="1" max="10" step="1"></v-ons-range>
                </div>
                <div class="right">{{ windMoveSpeed }}x</div>
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
    import IndicatorSetting from '@/components/IndicatorSetting'
    import * as MarkerIcon from '@/services/map/markerIconService'

    export default {
        components: {BackToolbar, IndicatorSetting},

        data() {
            return {
                //
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

            analysisTypes () { return this.$store.state.site.analysisTypes; },
            activeAnalysisTypes: {
                get: function () {
                    return this.$store.state.site.activeAnalysisTypes;
                },
                set: function (types) {
                    this.$store.commit('site/setActiveAnalysisTypes', types);
                }
            },

            windLayerEnable: {
                get: function () {
                    return this.$store.state.windLayer.enable;
                },
                set: function (flag) {
                    this.$store.commit('windLayer/setEnable', flag);
                }
            },
            windFillOpacity: {
                get: function () {
                    return this.$store.state.windLayer.fillOpacity * 10;    // range: 0 ~ 1
                },
                set: function (value) {
                    this.$store.commit('windLayer/setFillOpacity', value/10);
                }
            },
            windMoveSpeed: {
                get: function () {
                    let speed = this.$store.state.windLayer.moveSpeed;
                    if (speed === 1) { return 1; }
                    return '1/' + speed;
                },
                set: function (value) {
                    this.$store.commit('windLayer/setMoveSpeed', value);
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

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>