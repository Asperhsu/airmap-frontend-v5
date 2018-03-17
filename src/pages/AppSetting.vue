<template>
    <v-ons-page>
        <BasicToolbar>{{ lang('app.setting.title') }}</BasicToolbar>

        <AppLangSetting />

        <MapSetting />

        <IndicatorSetting />

        <div class="reset-conf">
            <v-ons-list-title>
                {{ lang('app.setting.reset.title') }}
            </v-ons-list-title>
            <v-ons-list modifier="inset">
                <v-ons-list-item>
                    <div class="center">
                        <v-ons-button modifier="large" style="margin: 6px 0" @click="resetSetting">
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                            {{ lang('app.setting.reset.clearAll') }}
                        </v-ons-button>

                        <div>
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                            {{ lang('app.setting.reset.info') }}
                        </div>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
        </div>

    </v-ons-page>
</template>

<script>
    import BasicToolbar from '@/components/toolbars/BasicToolbar'
    import AppLangSetting from '@/components/setting/AppLangSetting'
    import MapSetting from '@/components/setting/MapSetting'
    import IndicatorSetting from '@/components/setting/IndicatorSetting'

    import SettingStorage from '@/services/settingStorage';
    import {resetState} from '@/services/store';

    export default {
        components: {
            BasicToolbar, MapSetting, AppLangSetting,
            IndicatorSetting
        },

        methods: {
            resetSetting () {
                resetState();
                SettingStorage.clear();
                this.$ons.notification.toast(lang('app.setting.reset.success'), {timeout: 2000})
            }
        }
    };
</script>

<style lang="scss" src="@/assets/styles/list.scss" scoped></style>