<template>
    <div>
        <v-ons-list-title>{{ lang('map.setting.measureType') }}</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-header>PM2.5</v-ons-list-header>
            <v-ons-list-item v-for="(name) in pm25Types" :key="name" tappable>
                <label class="center" :for="'indicatorradio-' + name">
                    {{ name }}
                </label>
                <label class="right">
                    <v-ons-radio
                        :input-id="'indicatorradio-' + name"
                        :value="name"
                        v-model="indicatorType"
                    >
                    </v-ons-radio>
                </label>
            </v-ons-list-item>

            <template v-if="!onlypm25">
                <v-ons-list-header>{{ lang('map.setting.other') }}</v-ons-list-header>
                <v-ons-list-item v-for="(name) in otherTypes" :key="name" tappable>
                    <label class="center" :for="'indicatorradio-' + name">
                        {{ name }}
                    </label>
                    <label class="right">
                        <v-ons-radio
                            :input-id="'indicatorradio-' + name"
                            :value="name"
                            v-model="indicatorType"
                        >
                        </v-ons-radio>
                    </label>
                </v-ons-list-item>
            </template>
        </v-ons-list>
    </div>
</template>

<script>
    export default {
        props: {
            onlypm25: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            indicatorTypes () { return this.$store.state.app.indicatorTypes; },
            pm25Types () { return this.indicatorTypes['PM25']; },
            otherTypes () {
                return Object.keys(this.indicatorTypes).filter(type => {
                    return type !== 'PM25';
                });
            },

            indicatorType: {
                get: function () {
                    return this.$store.getters['app/getIndicatorType'];
                },
                set: function (type) {
                    if (this.pm25Types.indexOf(type) > -1) {
                        let pm25Type = type;
                        type = "PM25";
                        this.$store.commit('app/setPM25IndicatorType', pm25Type);
                    }

                    this.$store.commit('app/setMeasureType', type);
                }
            },
        },
    }
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>