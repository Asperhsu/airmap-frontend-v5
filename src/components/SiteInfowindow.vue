<template>
    <div>
        <div class="header">
            <p class="title">{{ site.title }}</p>
        </div>

        <div class="content">
            <Meter :indicatorType="pm25IndicatorType" :value="site.pm25" />

            <PM25Suggestion :showDatasource="false" :indicatorType="pm25IndicatorType" :value="site.pm25" />

            <Meter v-if="site.temp" indicatorType="Temperature" :value="site.temp" />

            <Meter v-if="site.humidity" indicatorType="Humidity" :value="site.humidity" />
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
                <v-ons-button modifier="light" class="btn btn-site-page"><i class="fa fa-bookmark"></i></v-ons-button>
                <v-ons-button modifier="light" class="btn btn-widget-page"><i class="fa fa-tachometer"></i></v-ons-button>
            </div>
        </div>
    </div>
</template>

<script>
    import Meter from '@/components/Meter';
    import PM25Suggestion from '@/components/PM25Suggestion'

    export default {
        components: {Meter, PM25Suggestion},

        props: ['site', 'pm25IndicatorType'],

        computed: {
            //
        }
    }
</script>

<style lang="scss">
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
            width: 2em;
            text-align: center;
        }
    }
</style>
