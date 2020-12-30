<template>
    <v-ons-list-item modifier="chevron longdivider" tappable @click="showSiteDetail">
        <div class="left">
            <img v-if="site.pm25 !== null" :src="getIcon()" />
            <div v-else style="width: 42.5px; text-align: center;">
                <i class="fa fa-2x fa-ban" aria-hidden="true"></i>
            </div>
        </div>

        <div class="center">
            <div class="ranking">
                <i class="fa fa-star" style="padding: 0 2px;" v-for="i in site.analysisRanking" :key="i"></i>
            </div>
            <div class="name">{{ site.name }}</div>
        </div>

        <div class="right">
            <div class="publishAt">{{ site.publishedAt.format('(dd) HH:mm M/D') }}</div>

            <div class="measures">
                <div class="pm25">
                    <span class="value" v-if="site.pm25 !== null">{{ Math.round(site.pm25) }}</span>
                    <span class="value" v-else><i class="fa fa-ban" aria-hidden="true"></i></span>
                    <span class="unit">μg<br/>/m3</span>
                </div>

                <div class="temp">
                    <span class="value" v-if="site.temp !== null">{{ Math.round(site.temp) }}</span>
                    <span class="value" v-else><i class="fa fa-ban" aria-hidden="true"></i></span>
                    <span class="unit">&#8451;</span>
                </div>

                <div class="humidity">
                    <span class="value" v-if="site.humidity !== null">{{ Math.round(site.humidity) }}</span>
                    <span class="value" v-else><i class="fa fa-ban" aria-hidden="true"></i></span>
                    <span class="unit">%</span>
                </div>
            </div>
        </div>
    </v-ons-list-item>
</template>

<style lang="scss" scoped>
    .left img {
        height: 2.5em;
    }

    .center {
        overflow: hidden;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin-right: .5em;
    }

    .ranking {
        font-size: .8em;
    }

    .right {
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
    }

    .publishAt {
        font-size: .8em;
        margin-bottom: .2em;
    }

    .measures {
        display: flex;
        flex-direction: row;
        align-items: flex-end;

        > div {
            border-right: 1px solid #ccc;
            padding: 0 5px;
            text-align: center;
            white-space: nowrap;

            &:last-child {
                border-right: 0px;
                padding-right: 0px;
            }

            .unit {
                font-size: 0.3em;
                display: inline-block;
                max-width: 2em;
                line-height: 1em;
                text-align: right;
                color: gray;
            }
        }
    }

    .humidity .value {
        min-width: 1.7em;
        text-align: right;
        display: inline-block;
    }
</style>


<script>
    import * as MarkerIcon from '@/services/maps/markerIconService'
    import ListSiteDetail from '@/pages/lists/ListSiteDetail'

    export default {
        props: {
            site: {
                required: true,
            }
        },

        computed: {
            indicatorType () { return this.$store.getters['app/getIndicatorType']; },
        },

        methods: {
            getIcon() {
                let markerIcon = this.site.markerIcon(this.indicatorType);

                return markerIcon.url;
            },
            showSiteDetail() {
                this.$store.commit('navigator/push', {
                    ...ListSiteDetail,
                    store: this.$store,
                    onsNavigatorProps: {
                        site: this.site,
                    }
                });
            },
        }
    }
</script>

