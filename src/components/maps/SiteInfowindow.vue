<template>
    <div @touchstart.stop="touchHandler">
        <button type="button" class="si-close-button" @click.stop="closeWindow">×</button>

        <div class="header">
            <p class="title">{{ site.title }}</p>
        </div>

        <div class="content">
            <Meter v-if="site.pm25 !== null"
                :title="pm25IndicatorType"
                :indicatorType="pm25IndicatorType" :value="site.pm25" />

            <PM25Suggestion
                v-if="site.pm25 !== null"
                :showDatasource="false"
                :indicatorType="pm25IndicatorType" :value="site.pm25" />

            <Meter v-if="site.temp" :title="lang('temperature')"
                indicatorType="Temperature" :value="site.temp" />

            <Meter v-if="site.humidity" :title="lang('humidity')"
                indicatorType="Humidity" :value="site.humidity" />
        </div>

        <div class="footer">
            <div class="published-time" :title="site.publishedAt.format('YYYY-MM-DD HH:mm:ss')">
                <i class="fa fa-clock-o" aria-hidden="true" style="padding: 0 5px;"></i>
                {{ site.publishedAt.toNow(true) }}
            </div>

            <div class="ranking" title="">
                <i class="fa fa-star" style="padding: 0 2px;" v-for="i in site.analysisRanking" :key="i"></i>
            </div>

            <div class="buttons">
                <v-ons-button modifier="outline" class="btn btn-site-page" @click="openSiteDetail">
                    <i class="fa fa-info-circle"></i> {{ lang('infowindow.siteInfowindow.detail') }}
                </v-ons-button>
            </div>
        </div>
    </div>
</template>

<script>
    import Meter from '@/components/Meter';
    import PM25Suggestion from '@/components/PM25Suggestion'
    import ListSiteDetail from '@/pages/lists/ListSiteDetail'

    export default {
        components: {Meter, PM25Suggestion},

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
            touchHandler (e)  { // proxy to trigger click for mobile event it will trigger touchstart
                try {
                    e.target.dispatchEvent(new Event("mousedown"));
                    e.target.dispatchEvent(new Event("mouseup"));
                    e.target.dispatchEvent(new Event("click"));
                } catch (err) {}
            },
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
    .title {
        margin-top: 0px;
        margin-bottom: 8px;
        font-size: .9em;
    }

    .footer {
        margin-top: 1em;
        padding-top: .5em;
        border-top: 1px solid #999999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: .8em;

        .published-time {
            font-size: .8em;
        }

        .btn {
            padding: 5px 6px;
            font-size: 1em;
            line-height: 1em;
            text-align: center;
        }
    }
</style>
