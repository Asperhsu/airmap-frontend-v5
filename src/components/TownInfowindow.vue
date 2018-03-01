<template>
    <div>
        <div class="header">
            <p class="title">{{ town.country }} {{ town.town }}</p>
        </div>

        <div class="content">
            <Meter v-if="town.pm25 !== null"
                :title="pm25IndicatorType"
                :indicatorType="pm25IndicatorType" :value="town.pm25" />

            <PM25Suggestion v-if="town.pm25 !== null"
                :showDatasource="false"
                :indicatorType="pm25IndicatorType" :value="town.pm25" />

            <hr>

            <div class="sites">
                <div class="valids" v-if="town.valids.length">
                    <div class="title">{{ lang('infowindow.townInfowindow.valids') }} ({{ town.valids.length }})</div>
                    <div class="labels">
                        <span v-for="site in town.valids" :key="site.uid"
                            class="label" @click="openSiteDetail(site.uid)">{{ site.name }}</span>
                    </div>
                </div>

                <div class="outliners" v-if="town.outliners.length">
                    <div class="title">{{ lang('infowindow.townInfowindow.outliners') }} ({{ town.outliners.length }})</div>
                    <div class="labels">
                        <span v-for="site in town.outliners" :key="site.uid"
                            class="label" @click="openSiteDetail(site.uid)">{{ site.name }}</span>
                    </div>
                </div>

                <div class="info">
                    <i aria-hidden="true" class="fa fa-info-circle"></i>
                    {{ lang('infowindow.townInfowindow.sitesInfo') }}
                </div>
            </div>

        </div>

        <div class="footer">
            <div class="published-time" :title="town.publishedAt.format('YYYY-MM-DD HH:mm:ss')">
                <i class="fa fa-clock-o" aria-hidden="true" style="padding: 0 5px;"></i>
                {{ town.publishedAt.toNow(true) }}
            </div>

            <div class="buttons"></div>
        </div>
    </div>
</template>

<script>
    import Meter from '@/components/Meter';
    import PM25Suggestion from '@/components/PM25Suggestion'
    import ListSiteDetail from '@/pages/ListSiteDetail'
    import {fetchSiteMap} from '@/services/resourceLoader';

    export default {
        components: {Meter, PM25Suggestion},

        props: {
            town: {
                required: true,
            },
            pm25IndicatorType: {
                type: String,
                required: true,
            }
        },

        methods: {
            openSiteDetail (uid) {
                fetchSiteMap().then(({sites, groups, analysis}) => {
                    return sites.find(site => {
                        return site.uid == uid;
                    });
                }).then(site => {
                    if (!site) {
                        this.$ons.notification.toast(lang('site.notfound'), {timeout: 2000});
                        return;
                    }

                    this.$store.commit('navigator/push', {
                        ...ListSiteDetail,
                        store: this.$store,
                        onsNavigatorProps: {
                            site: site,
                        }
                    });
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .header .title {
        margin-top: 0px;
        margin-bottom: 8px;
        font-size: .9em;
    }

    .sites {
        font-size: .8em;

        .title {
            margin-top: .5em;
            margin-bottom: .3em;
            font-weight: bold;
            padding: 3px 8px 3px 0;
        }

        .label {
            display: inline-block;
            border-radius: 8px;
            border: 1px solid #aaa;
            font-size: .8em;

            padding: 1px 6px;
            margin-right: .3em;
            margin-bottom: .2em;
        }

        .info {
            font-size: .8em;
            margin-top: .5em;
        }
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
