<template>
    <div>
        <v-ons-list-title>{{ lang('map.setting.windLayer.title') }}</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-item tappable>
                <label class="center" for="enableWindySwitch">
                    {{ lang('map.setting.windLayer.enable') }}
                </label>
                <div class="right">
                    <v-ons-switch input-id="enableWindySwitch" v-model="enable" />
                </div>
            </v-ons-list-item>

            <v-ons-list-header>{{ lang('map.setting.windLayer.fillOpacity') }}</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-range v-model="fillOpacity" style="width: 100%;" min="1" max="10" step="1"></v-ons-range>
                </div>
                <div class="right">{{ fillOpacity }}</div>
            </v-ons-list-item>

            <v-ons-list-header>{{ lang('map.setting.windLayer.moveSpeed') }}</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-range v-model="moveSpeed" style="width: 100%;" min="1" max="10" step="1"></v-ons-range>
                </div>
                <div class="right">{{ moveSpeed }}x</div>
            </v-ons-list-item>

            <v-ons-list-header>{{ lang('map.setting.windLayer.information') }}</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">{{ lang('map.setting.windLayer.publishTime') }}</div>
                <div class="right">
                    <span v-show="publishedAt">{{ publishedAt }}</span>
                    <span v-show="!publishedAt" class="help-text">{{ lang('map.setting.windLayer.waitForReturnMap') }}</span>
                </div>
            </v-ons-list-item>

            <v-ons-list-header>{{ lang('map.setting.windLayer.notice') }}</v-ons-list-header>
            <v-ons-list-item>
                <div class="center">
                    {{ lang('map.setting.windLayer.noticeText') }}
                </div>
            </v-ons-list-item>
        </v-ons-list>
    </div>
</template>

<script>
    export default {
        computed: {
            enable: {
                get: function () {
                    return this.$store.state.windLayer.enable;
                },
                set: function (flag) {
                    this.$store.commit('windLayer/setEnable', flag);
                }
            },
            fillOpacity: {
                get: function () {
                    return this.$store.state.windLayer.fillOpacity * 10;    // range: 0 ~ 1
                },
                set: function (value) {
                    this.$store.commit('windLayer/setFillOpacity', value/10);
                }
            },
            moveSpeed: {
                get: function () {
                    let speed = this.$store.state.windLayer.moveSpeed;
                    if (speed === 1) { return 1; }
                    return '1/' + speed;
                },
                set: function (value) {
                    this.$store.commit('windLayer/setMoveSpeed', value);
                }
            },
            publishedAt () {
                return this.$store.state.windLayer.publishedAt;
            },
        }
    }
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>

<style scoped>
    .help-text { font-size: .8em; color: gray; }
</style>
