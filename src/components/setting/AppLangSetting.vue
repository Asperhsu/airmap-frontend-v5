<template>
    <div>
        <v-ons-list-title>{{ lang('setting.displaylang') }}</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-item v-for="(text, name) in supportLangs" :key="name" tappable>
                <label class="center" :for="'applangradio-' + name">
                    {{ text }}
                </label>
                <label class="right">
                    <v-ons-radio
                        :input-id="'applangradio-' + name"
                        :value="name"
                        v-model="language"
                    >
                    </v-ons-radio>
                </label>
            </v-ons-list-item>
        </v-ons-list>
    </div>
</template>

<script>
    import {getSupportLangs, getLang, setLang} from '@/services/i18n';

    export default {
        computed: {
            language: {
                get () {
                    return getLang();
                },
                set (lang) {
                    setLang(lang);
                }
            },
            supportLangs () {
                return getSupportLangs();
            }
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>