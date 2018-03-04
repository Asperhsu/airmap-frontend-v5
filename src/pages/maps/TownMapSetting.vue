<template>
    <v-ons-page>
        <BackToolbar>鄉鎮地圖設定</BackToolbar>

        <IndicatorSetting onlypm25 />
        <IndicatorBarSetting />

        <WindLayerSetting />
    </v-ons-page>
</template>

<script>
    import BackToolbar from '@/components/toolbars/BackToolbar'
    import IndicatorBarSetting from '@/components/setting/IndicatorBarSetting'
    import IndicatorSetting from '@/components/setting/IndicatorSetting'
    import WindLayerSetting from '@/components/setting/WindLayerSetting'

    export default {
        components: {
            BackToolbar, IndicatorBarSetting, IndicatorSetting, WindLayerSetting
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>