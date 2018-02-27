<template>
    <v-ons-page>
        <BackToolbar>{{ lang('setting.siteTitle') }}</BackToolbar>

        <SiteFilterSetting />

        <IndicatorSetting />
        <IndicatorBarSetting />

        <WindLayerSetting />
    </v-ons-page>
</template>

<script>
    import BackToolbar from '@/components/BackToolbar'
    import SiteFilterSetting from '@/components/setting/SiteFilterSetting'
    import IndicatorBarSetting from '@/components/setting/IndicatorBarSetting'
    import IndicatorSetting from '@/components/setting/IndicatorSetting'
    import WindLayerSetting from '@/components/setting/WindLayerSetting'

    export default {
        components: {
            BackToolbar, SiteFilterSetting,
            IndicatorBarSetting, IndicatorSetting, WindLayerSetting
        },

        computed: {
            showIndicator: {
                get () { return this.$store.state.map.showIndicator; },
                set (flag) { this.$store.commit('map/setShowIndicator', flag); }
            },
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>