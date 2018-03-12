<template>
    <div>
        <v-ons-list-header>{{ lang('setting.geolocation.title') }}</v-ons-list-header>
        <v-ons-list-item v-for="method in supportMethods" :key="method.name" tappable :class="isDisabled(method) && 'disabled'">
            <label class="center" :for="'appgeolocationradio-' + method.name">
                {{ lang(method.lang) }}
            </label>
            <label class="right">
                <v-ons-radio
                    :input-id="'appgeolocationradio-' + method.name"
                    :value="method.name"
                    v-model="geolocationMethod"
                    :disabled="isDisabled(method)"
                >
                </v-ons-radio>
            </label>
        </v-ons-list-item>
    </div>
</template>

<script>
    import {getSupportLangs, getLang, setLang} from '@/services/i18n';

    export default {
        data () {
            return {
                supportMethods: [
                    {name: 'google', lang:'setting.geolocation.google.title' },
                    {name: 'geo', lang:'setting.geolocation.geo.title' },
                ],
            };
        },

        computed: {
            geolocationMethod: {
                get () {
                    return this.$store.state.app.geolocationMethod;
                },
                set (method) {
                    this.$store.commit('app/setGeolocationMethod', method);
                }
            },
        },

        methods: {
            isDisabled (method) {
                if (method.name === 'geo') {
                    return !navigator.geolocation;
                }

                return false;
            },
        }
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>
<style lang="scss" scoped>
    .disabled {
        color: gray;
    }
</style>
