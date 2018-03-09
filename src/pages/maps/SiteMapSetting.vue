<template>
    <v-ons-page>
        <BackToolbar>{{ lang('setting.siteTitle') }}</BackToolbar>

        <v-ons-list-title>{{ lang('setting.map.title') }}</v-ons-list-title>
        <v-ons-list modifier="inset">
            <PublishWatermaskSetting />
        </v-ons-list>

        <SiteFilterSetting />

        <IndicatorSetting />
        <IndicatorBarSetting />

        <WindLayerSetting />
    </v-ons-page>
</template>

<script>
    import BackToolbar from '@/components/toolbars/BackToolbar'
    import PublishWatermaskSetting from '@/components/setting/PublishWatermaskSetting';
    import SiteFilterSetting from '@/components/setting/SiteFilterSetting'
    import IndicatorBarSetting from '@/components/setting/IndicatorBarSetting'
    import IndicatorSetting from '@/components/setting/IndicatorSetting'
    import WindLayerSetting from '@/components/setting/WindLayerSetting'

    export default {
        name: 'site-map-setting',
        components: {
            BackToolbar, PublishWatermaskSetting, SiteFilterSetting,
            IndicatorBarSetting, IndicatorSetting, WindLayerSetting
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>