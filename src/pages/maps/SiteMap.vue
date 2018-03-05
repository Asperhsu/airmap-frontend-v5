<template>
    <div style="width: 100%; height: 100%;">
        <GoogleMap ref="map" :loadMarker="true" @markerClicked="markerClicked" @mapBooted="mapBooted" @markersUpdated="markersUpdated" />

        <div id="sites-count">{{ siteCount }}</div>

        <Loading :show="isLoading" :msg="loadingMsg" />

        <WindLayer :map="$refs.map && $refs.map.mapObject" :show="showWindLayer" />
    </div>
</template>

<script>
    import Vue from 'vue'
    import SnazzyInfoWindow from 'snazzy-info-window';
    import {deletedDiff} from 'deep-object-diff';

    import {getObjectValue, debounce, arrayIntersection, getInstanceName} from '@/services/helpers'
    import {fetchSiteMap} from '@/services/resourceLoader';
    import {addButton} from '@/services/maps/mapService';

    import SiteMapSetting from '@/pages/maps/SiteMapSetting'
    import Loading from '@/components/Loading'
    import GoogleMap from '@/components/maps/GoogleMap'
    import SiteInfowindow from '@/components/maps/SiteInfowindow'
    import WindLayer from '@/components/maps/WindLayer'

    let config = {
        enableReloadSite: true,
        reloadSiteSeconds: 5 * 60,
    };

    export default {
        components: {GoogleMap, Loading, WindLayer},

        mounted () {
            this.loadingMsg = lang('loading.map');
        },

        data () {
            return {
                infowindow: null,
                siteCount: 0,
                isLoading: true,
                loadingMsg: null,

                showWindLayer: false,
            };
        },

        computed: {
            mapObject () { return this.$refs.map.mapObject; },
            markerInstances () { return this.$refs.map.markerInstances; },

            onlyShowFavorite () { return this.$store.state.site.onlyShowFavorite; },
            favorites () { return this.$store.state.site.favorites; },

            indicatorType () { return this.$store.getters['app/getIndicatorType']; },
            pm25IndicatorType () { return this.$store.state.app.pm25IndicatorType; },

            activeGroups () { return this.$store.state.site.activeGroups; },
            activeAnalysisTypes () { return this.$store.state.site.activeAnalysisTypes; },

            navigatorStack () { return [].concat(this.$store.state.navigator.stack); },
        },

        watch: {
            onlyShowFavorite () { this.applyMarkerFilter(); },
            favorites () { this.applyMarkerFilter(); },
            indicatorType () { this.updateMarkerIcon(); },
            activeGroups () { this.applyMarkerFilter(); },
            activeAnalysisTypes () { this.applyMarkerFilter(); },
            navigatorStack (current, prev) {
                let index = Object.keys(deletedDiff(prev, current)).pop();
                if (index && prev[index] && prev[index].name === 'site-map-setting') {
                    this.backFromSetting();
                }
            }
        },

        methods: {
            mapBooted () {
                this.addSettingButton();
                this.fetchSites();

                google.maps.event.addListener(this.mapObject, 'bounds_changed',
                    debounce(() => this.countSitesInView(), 500)
                );
            },
            markersUpdated () {
                this.countSitesInView();
                this.applyMarkerFilter();

                this.isLoading = false;
            },
            markerClicked (marker) {
                this.openInfowindow(marker);
            },
            addSettingButton () {
                let html = [
                    "<div class='map-controls' style='margin-bottom:7px' title='地圖設定'>",
                    "<button>",
                    "<div class='fa fa-sliders'></div>",
                    "</button>",
                    "</div>"
                ].join('');

                addButton(this.mapObject, 'RIGHT_BOTTOM', html, () => {
                    this.$store.commit('navigator/push', SiteMapSetting);
                });
            },
            fetchSites () {
                this.isLoading = true;
                this.loadingMsg = lang('loading.site');

                fetchSiteMap().then(({sites, groups, analysis}) => {
                    let markers = sites.map(site => {
                        let marker = site.marker(this.indicatorType);
                        marker.site = site;
                        marker.callbacks = {
                            'icon': () => site.markerIcon(this.indicatorType),
                        };
                        return marker;
                    });

                    this.$store.commit('map/setMarkers', markers);
                    this.$store.commit('site/setGroups', groups);
                    this.$store.commit('site/updateAnalysisTypeCount', analysis);
                });

                // set interval
                if (this.$route.name == 'map' && config.enableReloadSite) {
                    setTimeout(() => {this.fetchSites();}, config.reloadSiteSeconds * 1000);
                }
            },
            openInfowindow (marker) {
                if (this.infowindow) {
                    this.infowindow.destroy();
                }

                this.infowindow = new SnazzyInfoWindow({
                    map: this.mapObject,
                    position: marker.getPosition(),
                    content: "<div id='site-infowindow'></div>",
                    closeOnMapClick: true,
                    offset: {top: '-25px'},
                    edgeOffset: {top: 50},
                    callbacks: {
                        open: () => {
                            new Vue({
                                el: '#site-infowindow',
                                store: this.$store,
                                render: h => h(SiteInfowindow, {
                                    props: {site: marker.site, pm25IndicatorType: this.pm25IndicatorType}
                                })
                            });

                            $(".si-content").trigger('click');
                        },
                    }
                });
                this.infowindow.open();
            },
            countSitesInView() {
                let count = 0;

                this.markerInstances.map(marker => {
                    marker.getVisible() && count++;
                })

                this.siteCount = count;
            },
            updateMarkerIcon() {
                this.markerInstances.map(marker => {
                    let site = marker.site;
                    let icon = site.markerIcon(this.indicatorType);
                    marker.setIcon(icon);
                });
            },
            applyMarkerFilter() {
                this.markerInstances.map(marker => {
                    let site = marker.site;

                    if (this.onlyShowFavorite) {
                        let isInfavorite = this.$store.getters['site/isInFavorite'](site);
                        marker.setVisible(isInfavorite);
                    } else {
                        let inGroup = this.activeGroups.indexOf(site.group) > -1;
                        let inAnalysisType = arrayIntersection(this.activeAnalysisTypes,site.analysisStatus).length > 0;
                        marker.setVisible(inGroup && inAnalysisType);
                    }
                });

                this.countSitesInView();
            },
            backFromSetting () {
                this.showWindLayer = this.$store.state.windLayer.enable;
            }
        }
    }
</script>

<style lang="scss">
    .toolbar .mapSetting{ padding: 0; }
    #sites-count {
        position: absolute;
        bottom: 195px;
        right: 10px;
        cursor: default;
        border-radius: 2px;
        background-color: #fff;
        color: #000;
        text-align: center;
        width: 2.3em;
        line-height: 2.3em;
        font-size: .75em;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }
</style>

<style lang="scss" src="@/assets/styles/sites-infowindow.scss"></style>