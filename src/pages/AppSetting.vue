<template>
    <v-ons-page>
        <BasicToolbar>{{ lang('setting.title') }}</BasicToolbar>

        <AppLangSetting />

        <MapSelectSetting />

        <IndicatorSetting />

        <SpecialThanks />

    </v-ons-page>
</template>

<script>
    import BasicToolbar from '@/components/BasicToolbar'
    import AppLangSetting from '@/components/setting/AppLangSetting'
    import MapSelectSetting from '@/components/setting/MapSelectSetting'
    import IndicatorSetting from '@/components/setting/IndicatorSetting'
    import SpecialThanks from '@/components/setting/SpecialThanks'

    export default {
        components: {
            BasicToolbar, MapSelectSetting, AppLangSetting,
            IndicatorSetting, SpecialThanks
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>