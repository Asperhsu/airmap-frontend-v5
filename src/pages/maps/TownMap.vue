<template>
    <div style="width: 100%; height: 100%;">
        <GoogleMap ref="map" @mapBooted="mapBooted" />

        <Loading :show="isLoading" :msg="loadingMsg" />

        <WindLayer :map="$refs.map && $refs.map.mapObject" :show="showWindLayer" />

        <PublishWatermark :timestamp="dataFetchedAt" />
    </div>
</template>

<script>
    import moment from 'moment'
    import {deletedDiff} from 'deep-object-diff';

    import {addButton} from '@/services/maps/mapService';
    import {getTypeColor} from '@/services/indicator';
    import {fetchTownMap} from '@/services/resourceLoader';
    import {createTownInfowindow} from '@/services/infowindow';

    import TownMapSetting from '@/pages/maps/TownMapSetting'
    import Loading from '@/components/Loading'
    import GoogleMap from '@/components/maps/GoogleMap'
    import WindLayer from '@/components/maps/WindLayer'
    import PublishWatermark from '@/components/maps/PublishWatermark'

    export default {
        components: {GoogleMap, Loading, WindLayer, PublishWatermark},

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
            pm25IndicatorType () { return this.$store.state.app.pm25IndicatorType; },
            dataFetchedAt () { return this.$store.state.town.dataFetchedAt; },

            navigatorStack () { return [].concat(this.$store.state.navigator.stack); },
        },

        watch: {
            pm25IndicatorType () { this.updateRegionColor(); },
            navigatorStack (current, prev) {
                let index = Object.keys(deletedDiff(prev, current)).pop();
                if (index && prev[index] && prev[index].name === 'town-map-setting') {
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
                return town ? getTypeColor(this.pm25IndicatorType, Math.round(town.pm25)) : 'transparent';
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

                this.infowindow = createTownInfowindow(this.mapObject, latlng, info);
                this.infowindow.open();
            },
            backFromSetting () {
                this.showWindLayer = this.$store.state.windLayer.enable;
            }
        },
    }
</script>

<style lang="scss" src="@/assets/styles/sites-infowindow.scss"></style>