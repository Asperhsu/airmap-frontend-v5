<template>
    <div>
        <v-ons-list-title>{{ lang('setting.map.title') }}</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-header>{{ lang('setting.mapType.title') }}</v-ons-list-header>
            <v-ons-list-item v-for="name in supportTypes" :key="name" tappable>
                <label class="center" :for="'maptyperadio-' + name">
                    {{ lang(`setting.mapType.${name}`) }}
                </label>
                <label class="right">
                    <v-ons-radio
                        :input-id="'maptyperadio-' + name"
                        :value="name"
                        v-model="mapType"
                    >
                    </v-ons-radio>
                </label>
            </v-ons-list-item>

            <v-ons-list-header>{{ lang('setting.other') }}</v-ons-list-header>
            <v-ons-list-item tappable>
                <label class="center" for="startupUseMyLocation">
                    {{ lang('setting.mapStartupUseMyLocation.title') }}
                </label>
                <div class="right">
                    <v-ons-switch input-id="startupUseMyLocation" v-model="startupUseMyLocation" />
                </div>
            </v-ons-list-item>
            <PublishWatermaskSetting />

            <GeolocationSetting />
        </v-ons-list>
    </div>
</template>

<script>
    import GeolocationSetting from '@/components/setting/GeolocationSetting';
    import PublishWatermaskSetting from '@/components/setting/PublishWatermaskSetting';

    export default {
        components: {GeolocationSetting, PublishWatermaskSetting},

        data () {
            return {
                supportTypes: ['town', 'site'],
            };
        },

        computed: {
            mapType: {
                get () {
                    return this.$store.state.app.mapType;
                },
                set (type) {
                    this.$store.commit('app/setMapType', type);
                }
            },
            startupUseMyLocation: {
                get () {
                    return this.$store.state.map.startupUseMyLocation;
                },
                set (flag) {
                    this.$store.commit('map/setStartupUseMyLocation', flag);
                }
            },
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>