<template>
    <v-ons-page>
        <BasicToolbar>個人化設定</BasicToolbar>

        <AppLangSetting />

        <IndicatorSetting />

        <SpecialThanks />

    </v-ons-page>
</template>

<script>
    import BasicToolbar from '@/components/BasicToolbar'
    import AppLangSetting from '@/components/setting/AppLangSetting'
    import IndicatorSetting from '@/components/setting/IndicatorSetting'
    import SpecialThanks from '@/components/setting/SpecialThanks'

    export default {
        components: {
            BasicToolbar, AppLangSetting, IndicatorSetting, SpecialThanks
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>