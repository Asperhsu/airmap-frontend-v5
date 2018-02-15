<template>
    <div style="width: 100%; height: 100%;">
        <GoogleMap ref="map" @markerClicked="markerClicked" @mapBooted="mapBooted" @markersLoaded="countSitesInView" />
        <div id="sites-count" title="站點數量">{{ siteCount }}</div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios';
    import SnazzyInfoWindow from 'snazzy-info-window';
    import {debounce} from '@/services/helpers'
    import SiteMapSetting from '@/pages/SiteMapSetting'
    import GoogleMap from '@/components/GoogleMap'
    import SiteInfowindow from '@/components/SiteInfowindow'
    import Site from '@/model/site'

    export default {
        components: {SiteMapSetting, GoogleMap},

        data () {
            return {
                infowindow: null,
                siteCount: 0,
            };
        },

        computed: {
            mapObject () { return this.$refs.map.mapObject; },
            markerInstances () { return this.$refs.map.markerInstances; },
            indicatorType () { return this.$store.state.site.indicatorType; },
            markers () { return this.$store.state.map.markers; }
        },

        methods: {
            mapBooted () {
                this.addSettingButton();
                this.fetchSites();

                google.maps.event.addListener(this.mapObject, 'bounds_changed',
                    debounce(() => this.countSitesInView(), 500)
                );
            },
            markerClicked (marker) {
                this.openInfowindow(marker);
            },
            addSettingButton () {
                var $element = $([
                    "<div class='map-controls' style='margin-bottom:7px' title='地圖設定'>",
                    "<button>",
                    "<div class='fa fa-sliders'></div>",
                    "</button>",
                    "</div>"
                ].join(''));

                $element.find('button').click(() => {
                    this.$store.commit('navigator/push', SiteMapSetting);
                });

                var controlDiv = $element[0];
                controlDiv.index = 1;
                this.mapObject.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
            },
            fetchSites () {
                let markers = [];
                let groups = {};
                let analysis = {};
                let indicatorType = this.$store.getters['site/getIndicatorType'];

                // axios.get('json/airmap.json').then(response => {
                axios.get('static/lass.json').then(response => {
                    response.data.map(data => {
                        let site = new Site(data);

                        // markers
                        let marker = site.marker(indicatorType);
                        marker.site = site;
                        markers.push(marker);

                        // site groups
                        let group = site.group;
                        groups.hasOwnProperty(group) ? groups[group]++ : (groups[group] = 1);

                        // analysis status
                        let statuses = site.analysisStatus;
                        if (statuses.length) {
                            statuses.map(status => {
                                analysis.hasOwnProperty(status) ? analysis[status]++ : (analysis[status] = 1);
                            });
                        } else {
                            analysis.hasOwnProperty('normal') ? analysis['normal']++ : (analysis['normal'] = 1);
                        }
                    });

                    this.$store.commit('map/setMarkers', markers);
                    this.$store.commit('site/setGroups', groups);
                    this.$store.commit('site/setActiveGroups', Object.keys(groups));
                    this.$store.commit('site/updateAnalysisTypeCount', analysis);
                });

                // set interval
                // setTimeout(() => {this.fetchSites();}, 5 * 60 * 1000);
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
                    offset: {
                        top: '-25px',
                    },
                    callbacks: {
                        open: () => {
                            new Vue({
                                el: '#site-infowindow',
                                render: h => h(SiteInfowindow, {
                                    props: {site: marker.site, indicatorType: this.indicatorType}
                                })
                            })
                        },
                    }
                });
                this.infowindow.open();
            },
            countSitesInView() {
                let count = 0;
                let bounds = this.mapObject.getBounds();

                this.markerInstances.map(marker => {
                    if (marker.getVisible() && bounds && bounds.contains(marker.getPosition())) {
                        count++;
                    }
                })

                this.siteCount = count;
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
    }
</style>

<style lang="scss" src="@/assets/styles/sites-infowindow.scss"></style>