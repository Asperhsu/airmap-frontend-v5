<template>
    <div class="infowindow">
        <div class="header">
            <div class="title">
                <i class="fa fa-map-marker" style="color: red; font-size: 1.3em; margin-right: .2em;" aria-hidden="true"></i>
                {{ town.country }} {{ town.town }}
            </div>
            <button type="button" class="si-close-button" @click.prevent.stop="closeWindow">×</button>
        </div>

        <div class="content">
            <Lamp v-if="town.pm25 !== null"
                :title="pm25IndicatorType"
                :indicatorType="pm25IndicatorType" :value="town.pm25"
                class="color-right" />

            <PM25Healthy v-if="town.pm25 !== null"
                :indicatorType="pm25IndicatorType" :value="town.pm25" :useBorder="false" />

            <hr>

            <div class="sites">
                <div class="valids" v-show="town.valids.length">
                    <div class="title">
                        <i class="fa fa-sign-in" aria-hidden="true"></i>
                        {{ lang('town.infowindow.valids') }}
                        ({{ town.valids.length }})
                    </div>
                    <div class="labels">
                        <div v-for="site in sortSites(town.valids)" :key="site.uid"
                            class="label" @click="openSiteDetail(site.uid)">{{ site.name }}</div>
                    </div>
                </div>

                <div class="outliners" v-show="town.outliners.length">
                    <div class="title">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                        {{ lang('town.infowindow.outliners') }}
                        ({{ town.outliners.length }})
                    </div>
                    <div class="labels">
                        <div v-for="site in sortSites(town.outliners)" :key="site.uid"
                            class="label" @click="openSiteDetail(site.uid)">{{ site.name }}</div>
                    </div>
                </div>

                <div class="info">
                    <i aria-hidden="true" class="fa fa-info-circle"></i>
                    {{ lang('town.infowindow.sitesInfo') }}
                </div>
            </div>

        </div>

        <div class="footer">
            <div class="published-time" :title="town.publishedAt.format('YYYY-MM-DD HH:mm:ss')">
                <i class="fa fa-clock-o" aria-hidden="true" style="padding: 0 5px;"></i>
                {{ town.publishedAt.toNow(true) }}
            </div>
        </div>

        <Loading :show="isLoading" />
    </div>
</template>

<script>
    import Loading from '@/components/Loading'
    import Lamp from '@/components/Lamp';
    import PM25Healthy from '@/components/PM25Healthy'
    import ListSiteDetail from '@/pages/lists/ListSiteDetail'
    import {fetchSiteMap} from '@/services/resourceLoader';

    export default {
        components: {Loading, Lamp, PM25Healthy},

        props: {
            town: {
                type: Object,
                required: true,
            },
            closeWindow: {
                type: Function,
                default: () => {},
            },
        },

        data () {
            return {
                isLoading: false,
            };
        },

        computed: {
            pm25IndicatorType () { return this.$store.state.app.pm25IndicatorType; },
        },

        methods: {
            openSiteDetail (uid) {
                this.isLoading = true;

                fetchSiteMap().then(({sites, groups, analysis}) => {
                    return sites.find(site => {
                        return site.uid == uid;
                    });
                }).then(site => {
                    this.isLoading = false;

                    if (!site) {
                        this.$ons.notification.toast(lang('town.notfound'), {timeout: 2000});
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
            sortSites (sites) {
                return [].concat(sites).sort((a, b) => {
                    return a.name.localeCompare(b.name);
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .sites {
        font-size: .8em;

        .title {
            margin-top: .5em;
            margin-bottom: .3em;
            font-weight: bold;
            padding: 3px 8px 3px 0;
        }

        .labels {
            display: flex;
            flex-wrap: wrap;

            .label {
                border-radius: 3px;
                border: 1px solid #0076FF;
                color: #0076FF;
                font-size: .9em;

                padding: 1px 6px;
                margin-right: .3em;
                margin-bottom: .5em;

                cursor: pointer;
                flex-grow: 1;
                text-align: center;

                &:active {
                    background: #0076FF;
                    color: #fff;
                }
            }
        }

        .info {
            font-size: .8em;
            margin-top: .5em;
        }
    }

    .published-time {
        text-align: right;
        width: 100%;
    }
</style>
