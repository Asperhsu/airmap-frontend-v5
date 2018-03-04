<template>
    <div style="width: 100%; height: 100%;">
        <GoogleMap ref="map" @mapBooted="mapBooted" />

        <v-ons-modal :visible="isLoading">
            <p style="text-align: center">
                <v-ons-progress-circular indeterminate></v-ons-progress-circular>
                <br><br>
                {{ loadingMsg }}
            </p>
        </v-ons-modal>

        <WindLayer :map="$refs.map && $refs.map.mapObject" :show="showWindLayer" />
    </div>
</template>

<script>
    import Vue from 'vue'
    import moment from 'moment'
    import SnazzyInfoWindow from 'snazzy-info-window';
    import {deletedDiff} from 'deep-object-diff';

    import {addButton} from '@/services/maps/mapService';
    import {getTypeColor} from '@/services/indicator';
    import {getInstanceName} from '@/services/helpers'
    import {fetchTownMap} from '@/services/resourceLoader';

    import TownMapSetting from '@/pages/maps/TownMapSetting'
    import GoogleMap from '@/components/maps/GoogleMap'
    import WindLayer from '@/components/maps/WindLayer'
    import TownInfowindow from '@/components/maps/TownInfowindow'

    export default {
        components: {GoogleMap, WindLayer},

        mounted () {
            this.loadingMsg = lang('loading.map');
        },

        data () {
            return {
                isLoading: true,
                loadingMsg: null,
                showWindLayer: false,
                infowindow: null,
            };
        },

        computed: {
            mapObject () { return this.$refs.map.mapObject; },
            indicatorType () { return this.$store.getters['app/getIndicatorType']; },
            pm25IndicatorType () { return this.$store.state.app.pm25IndicatorType; },

            navigatorStack () { return [].concat(this.$store.state.navigator.stack); },
        },

        watch: {
            indicatorType () { this.updateRegionColor(); },
            navigatorStack (current, prev) {
                let index = Object.keys(deletedDiff(prev, current)).pop();
                if (index && getInstanceName(prev[index]) === 'TownMapSetting') {
                    this.backFromSetting();
                }
            }
        },

        methods: {
            mapBooted () {
                this.addSettingButton();
                this.loadGeoJson();
                this.fetchSites().then(() => {
                    this.registerFeatureHandler();
                });
            },
            addSettingButton () {
                let html = [
                    "<div class='map-controls' style='margin-bottom:7px'>",
                    "<button>",
                    "<div class='fa fa-sliders'></div>",
                    "</button>",
                    "</div>"
                ].join('');

                addButton(this.mapObject, 'RIGHT_BOTTOM', html, () => {
                    this.$store.commit('navigator/push', TownMapSetting);
                });
            },

            loadGeoJson () {
                this.mapObject.data.loadGeoJson('geojson/town.json');
            },
            getFeatureStyle (feature) {
                let color = this.getRegionColor(feature);

                return {
                    fillColor: color,
                    fillOpacity: .6,
                    strokeColor: '#4F595D',
                    strokeWeight: 1,
                    strokeOpacity: .3,
                };
            },
            registerFeatureHandler () {
                let mapData = this.mapObject.data;

                mapData.setStyle((feature) => this.getFeatureStyle(feature));

                mapData.addListener('click', (event) => {
                    let feature = event.feature;

                    mapData.revertStyle();
                    mapData.overrideStyle(event.feature, {
                        strokeWeight: 5,
                        strokeOpacity: .6,
                    });

                    this.openInfoWindow(feature, event.latLng.toJSON());
                });
            },

            getRegion (country, town) {
                return this.$store.getters['town/findTown'](country, town);
            },
            getRegionColor (feature) {
                let town = this.getRegion(feature.f.COUNTYNAME, feature.f.TOWNNAME);
                return town ? getTypeColor(this.indicatorType, Math.round(town.pm25)) : 'transparent';
            },
            updateRegionColor () {
                this.mapObject.data.setStyle((feature) => this.getFeatureStyle(feature));
            },

            fetchSites () {
                this.isLoading = true;
                this.loadingMsg = lang('loading.town');

                return fetchTownMap().then((data) => {
                    this.isLoading = false;
                });
            },

            infowindowNoData(info) {
                let townName = info.COUNTYNAME + info.TOWNNAME;
                this.$ons.notification.toast(townName + ' ' + lang('town.notfound'), {timeout: 2000});

                this.mapObject.data.revertStyle();
                return;
            },
            openInfoWindow(feature, latlng) {
                this.infowindow && this.infowindow.destroy();

                let town = this.getRegion(feature.f.COUNTYNAME, feature.f.TOWNNAME);
                if (!town) {
                    return this.infowindowNoData(feature.f);
                }

                // prepare component
                let info = Object.assign({}, town, {
                    publishedAt: moment(this.$store.getters['town/getPublished'])
                });

                this.infowindow = new SnazzyInfoWindow({
                    map: this.mapObject,
                    position: latlng,
                    content: "<div id='town-infowindow'></div>",
                    closeOnMapClick: true,
                    callbacks: {
                        open: () => {
                            new Vue({
                                el: '#town-infowindow',
                                store: this.$store,
                                render: h => h(TownInfowindow, {
                                    props: {town: info, pm25IndicatorType: this.pm25IndicatorType}
                                })
                            })
                        },
                    }
                });
                this.infowindow.open();
            },
            backFromSetting () {
                this.showWindLayer = this.$store.state.windLayer.enable;
            }
        },
    }
</script>

<style lang="scss" src="@/assets/styles/sites-infowindow.scss"></style>