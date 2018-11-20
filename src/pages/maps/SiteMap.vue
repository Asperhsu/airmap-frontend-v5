<template>
    <div style="width: 100%; height: 100%;">
        <GoogleMap ref="map" :loadMarker="true"
            @mapBooted="mapBooted"
            @markersUpdated="markersUpdated" />

        <!-- <div id="sites-count">{{ siteCount }}</div> -->

        <Loading :show="isLoading" :msg="loadingMsg" />

        <WindLayer :map="$refs.map && $refs.map.mapObject" :show="showWindLayer" />

        <PublishWatermark :timestamp="dataFetchedAt" />
    </div>
</template>

<script>
    import {deletedDiff} from 'deep-object-diff';

    import {debounce, arrayIntersection} from '@/services/helpers'
    import {fetchSiteMap} from '@/services/resourceLoader';
    import {addButton} from '@/services/maps/mapService';
    import {createSiteInfowindow} from '@/services/infowindow';

    import SiteMapSetting from '@/pages/maps/SiteMapSetting'
    import Loading from '@/components/Loading'
    import GoogleMap from '@/components/maps/GoogleMap'
    import WindLayer from '@/components/maps/WindLayer'
    import PublishWatermark from '@/components/maps/PublishWatermark'

    let config = {
        enableReloadSite: true,
        reloadSiteSeconds: 5 * 60,
    };

    export default {
        components: {GoogleMap, Loading, WindLayer, PublishWatermark},

        data () {
            return {
                infowindow: null,
                siteCount: 0,
                isLoading: true,
                loadingMsg: lang('site.loading.map'),

                showWindLayer: false,
            };
        },

        computed: {
            mapObject () { return this.$refs.map.mapObject; },
            markers () { return this.$store.state.map.markers; },

            onlyShowFavorite () { return this.$store.state.site.onlyShowFavorite; },
            favorites () { return this.$store.state.site.favorites; },

            indicatorType () { return this.$store.getters['app/getIndicatorType']; },
            pm25IndicatorType () { return this.$store.state.app.pm25IndicatorType; },
            dataFetchedAt () { return this.$store.state.site.dataFetchedAt; },

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
                this.addSitesCountButton();
            },
            markersUpdated () {
                this.applyMarkerFilter();
                this.countSitesInView();

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
            addSitesCountButton () {
                let html = [
                    "<div class='map-controls' style='margin-bottom:7px' title='站點數量'>",
                    "<button>",
                    "<span id='sites-count'>" + this.siteCount + "</span>",
                    "</button>",
                    "</div>"
                ].join('');

                addButton(this.mapObject, 'RIGHT_BOTTOM', html);
            },
            fetchSites () {
                this.isLoading = true;
                this.loadingMsg = lang('site.loading.data');

                fetchSiteMap().then(({sites, groups, analysis}) => {
                    let markers = sites.map(site => {
                        let markerOptions = site.marker(this.indicatorType);
                        let marker = new google.maps.Marker(markerOptions);
                        marker.site = site;
                        google.maps.event.addListener(marker, 'click', () => {
                            this.markerClicked(marker);
                        });

                        return marker;
                    });

                    this.$store.commit('map/setMarkers', markers);
                    this.$store.commit('site/setGroups', groups);
                    this.$store.commit('site/updateAnalysisTypeCount', analysis);

                    this.isLoading = false;
                }).catch(() => {
                    this.isLoading = false;
                    this.$ons.notification.toast(lang('site.errors.loadFailed'), {timeout: 2000})
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

                this.infowindow = createSiteInfowindow(this.mapObject, marker.getPosition(), marker.site);
                this.infowindow.open();
            },
            countSitesInView() {
                this.siteCount = this.markers.length;
                $("#sites-count").text(this.siteCount);
            },
            updateMarkerIcon() {
                this.markers.map(marker => {
                    let site = marker.site;
                    let icon = site.markerIcon(this.indicatorType);
                    marker.setIcon(icon);
                });
            },
            applyMarkerFilter() {
                this.markers.map(marker => {
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
    // #sites-count {
    //     position: absolute;
    //     bottom: 195px;
    //     right: 10px;
    //     cursor: default;
    //     border-radius: 2px;
    //     background-color: #fff;
    //     color: #000;
    //     text-align: center;
    //     width: 2.3em;
    //     line-height: 2.3em;
    //     font-size: .75em;
    //     box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    // }
</style>

<style lang="scss" src="@/assets/styles/infowindow.scss"></style>