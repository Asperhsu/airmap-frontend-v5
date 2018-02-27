<template>
    <div>
        <v-ons-list-title>{{ lang('setting.measureType') }}</v-ons-list-title>
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

            <v-ons-list-header>{{ lang('setting.other') }}</v-ons-list-header>
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
        </v-ons-list>
    </div>
</template>

<script>
    export default {
        computed: {
            indicatorTypes () { return this.$store.state.site.indicatorTypes; },
            pm25Types () { return this.indicatorTypes['PM25']; },
            otherTypes () {
                return Object.keys(this.indicatorTypes).filter(type => {
                    return type !== 'PM25';
                });
            },

            indicatorType: {
                get: function () {
                    return this.$store.getters['site/getIndicatorType'];
                },
                set: function (type) {
                    if (this.pm25Types.indexOf(type) > -1) {
                        let pm25Type = type;
                        type = "PM25";
                        this.$store.commit('site/setPM25IndicatorType', pm25Type);
                    }

                    this.$store.commit('site/setMeasureType', type);
                }
            },
        },
    }
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>