<template>
    <div>
        <v-ons-list-header>{{ lang('map.setting.geolocation.title') }}</v-ons-list-header>
        <v-ons-list-item v-for="method in supportMethods" :key="method" tappable :class="isDisabled(method) && 'disabled'">
            <label class="center" :for="'appgeolocationradio-' + method">
                <div class="title">{{ lang(`map.setting.geolocation.${method}.title`) }}</div>
                <div class="text"><small>{{ lang(`map.setting.geolocation.${method}.info`) }}</small></div>
            </label>
            <label class="right">
                <v-ons-radio
                    :input-id="'appgeolocationradio-' + method"
                    :value="method"
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
                supportMethods: ['google', 'geo'],
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
                if (method === 'geo') {
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
    .text {
        margin-top: .5em;
        color: gray;
    }
</style>
