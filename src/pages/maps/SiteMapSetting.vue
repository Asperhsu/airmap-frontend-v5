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
    import BackToolbar from '@/components/toolbars/BackToolbar'
    import SiteFilterSetting from '@/components/setting/SiteFilterSetting'
    import IndicatorBarSetting from '@/components/setting/IndicatorBarSetting'
    import IndicatorSetting from '@/components/setting/IndicatorSetting'
    import WindLayerSetting from '@/components/setting/WindLayerSetting'

    export default {
        name: 'site-map-setting',
        components: {
            BackToolbar, SiteFilterSetting,
            IndicatorBarSetting, IndicatorSetting, WindLayerSetting
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>