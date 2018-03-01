<template>
    <div>
        <v-ons-list-title>{{ lang('setting.mapSelect.title') }}</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-item v-for="name in supportTypes" :key="name" tappable>
                <label class="center" :for="'maptyperadio-' + name">
                    {{ lang(`setting.mapSelect.type.${name}`) }}
                </label>
                <label class="right">
                    <v-ons-radio
                        :input-id="'maptyperadio-' + name"
                        :value="name"
                        v-model="mapType"
                    >
                    </v-ons-radio>
                </label>
            </v-ons-list-item>
        </v-ons-list>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                supportTypes: ['town', 'site'],
            };
        },

        computed: {
            mapType: {
                get () {
                    return this.$store.state.app.mapType;
                },
                set (type) {
                    this.$store.commit('map/setMapType', type);
                }
            },
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>