<template>
    <div class="infowindow">
        <div class="header">
            <div class="title">{{ site.title }}</div>
            <button type="button" class="si-close-button" @click.prevent.stop="closeWindow">×</button>
        </div>

        <div class="content">
            <Lamp v-if="site.pm25 !== null"
                :title="pm25IndicatorType"
                :indicatorType="pm25IndicatorType" :value="site.pm25"
                style="font-size: 1.2em;"
                class="color-right" />

            <PM25Suggestion
                v-if="site.pm25 !== null"
                :showDatasource="false"
                :indicatorType="pm25IndicatorType" :value="site.pm25" />

            <div class="lamp-container">
                <Lamp v-if="site.temp" :title="lang('site.temperature')"
                    indicatorType="Temperature" :value="site.temp" />

                <Lamp v-if="site.humidity" :title="lang('site.humidity')"
                    indicatorType="Humidity" :value="site.humidity" />
            </div>

            <div class="position" v-if="site.region">
                <i class="fa fa-map-marker" style="color: red" aria-hidden="true"></i>
                {{ site.region.country }} {{ site.region.town }}
            </div>
        </div>

        <div class="footer">
            <div class="published-time" :title="site.publishedAt.format('YYYY-MM-DD HH:mm:ss')">
                <i class="fa fa-clock-o" aria-hidden="true" style="padding: 0 5px;"></i>
                {{ site.publishedAt.toNow(true) }}
            </div>

            <div class="ranking" v-if="site.analysisRanking">
                <i class="fa fa-star" style="padding: 0 2px;" v-for="i in site.analysisRanking" :key="i"></i>
            </div>

            <div class="buttons">
                <v-ons-button class="btn btn-site-page" @click="openSiteDetail">
                    <i class="fa fa-info-circle"></i> {{ lang('site.infowindow.detail') }}
                </v-ons-button>
            </div>
        </div>
    </div>
</template>

<script>
    import Lamp from '@/components/Lamp';
    import PM25Suggestion from '@/components/PM25Suggestion'
    import ListSiteDetail from '@/pages/lists/ListSiteDetail'

    export default {
        components: {Lamp, PM25Suggestion},

        props: {
            site: {
                required: true,
            },
            closeWindow: {
                type: Function,
                default: () => {},
            },
        },

        computed: {
            pm25IndicatorType () { return this.$store.state.app.pm25IndicatorType; },
        },

        methods: {
            openSiteDetail () {
                this.$store.commit('navigator/push', {
                    ...ListSiteDetail,
                    store: this.$store,
                    onsNavigatorProps: {
                        site: this.site,
                    }
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .lamp-container {
        display: flex;
        margin-top: .3em;

        .lamp {
            flex-grow: 1;
        }
    }

    .position {
        text-align: right;
        margin-top: .3em;
        font-size: .8em;
    }

    .ranking {
        font-size: .8em;
    }
</style>
