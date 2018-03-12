<template>
    <div :id="mapElementId" class='google-map-element'></div>
</template>

<script>
    import GeoLocation from '@/services/maps/geolocation';
    import {mapOption, addButton} from '@/services/maps/mapService';
    import {debounce} from '@/services/helpers';

    export default {
        props: {
            loadMarker: {
                type: Boolean,
                default: false,
            }
        },

        mounted () {
            // google.maps.event.addDomListener(window, "load", this.init);
            this.init();
        },

        beforeDestroy () {
            this.listeners.map(listener => listener.remove());
        },

        data() {
            let id = "id" + Math.random().toString(16).slice(2)

            return {
                booted: false,
                listeners: [],
                mapElementId: 'google-map-'+id,
                mapObject: null,
                markerInstances: [],
                circleInstances: [],
                currentLocaton: {marker: null, circle: null},
            }
        },

        computed: {
            center () {
                return this.$store.state.map.center;
            },
            zoom () {
                return this.$store.state.map.zoom;
            },
            markers () {
                return this.loadMarker ? this.$store.state.map.markers : [];
            },
            geolocationMethod () {
                return this.$store.state.app.geolocationMethod;
            }
        },

        watch: {
            center (latlng) {
                let center = this.mapObject.getCenter().toJSON();
                if (center.lat !== latlng.lat || center.lng !== latlng.lng) {
                    this.mapObject.setCenter(latlng);
                }
            },
            zoom (zoom) {
                if (zoom === this.mapObject.getZoom()) { return; }
                this.mapObject.setZoom(zoom);
            },
            markers () {
                this.updateMarkers();
            },
        },

        methods: {
            init () {
                // init map
                this.mapObject = new google.maps.Map(
                    document.getElementById(this.mapElementId),
                    $.extend({}, mapOption, {
                        center: this.center,
                        zoom: this.zoom,
                    })
                );

                this.addUserLocationButton();
                this.bindEvents();

                if (this.$store.state.map.startupUseMyLocation) {
                    this.fetchCurrentLocation();
                }
            },
            bindEvents () {
                this.listeners.push(google.maps.event.addListenerOnce(this.mapObject, 'idle', () => {
                    this.$emit('mapBooted');
                }));

                this.listeners.push(google.maps.event.addListener(this.mapObject, 'center_changed', debounce(() => {
                    this.$store.commit('map/setCenter', this.mapObject.getCenter().toJSON());
                }, 500)));

                this.listeners.push(google.maps.event.addListener(this.mapObject, 'zoom_changed', debounce(() => {
                    this.$store.commit('map/setZoom', this.mapObject.getZoom());
                }, 500)));

                this.listeners.push(google.maps.event.addListener(this.mapObject, 'bounds_changed', debounce(() => {
                    this.updateMarkers();
                }, 500)));
            },
            addUserLocationButton () {
                addButton(this.mapObject, 'RIGHT_BOTTOM', GeoLocation.locationButtonHtml(), ($element) => {
                    let info = $element.data('info');
                    if (info) {
                        this.$store.commit('map/setCenter', info.position);
                        this.$store.commit('map/setZoom', info.zoom);
                        return;
                    }

                    this.fetchCurrentLocation();
                });

                google.maps.event.addListener(this.mapObject, 'dragend', function() {
                    GeoLocation.setIconStatus(null);
                });
            },
            fetchCurrentLocation() {
                return GeoLocation.findCurrentLocation(this.geolocationMethod).then((info) => {
                    if (!info) { return; }

                    this.currentLocaton.marker = GeoLocation.createCurrentLocationMarker(this.mapObject, info);
                    // this.currentLocaton.circle = GeoLocation.createCurrentLocationCircle(this.mapObject, info);

                    if (info.zoom > 14) { info.zoom = 14; }

                    this.$store.commit('map/setCenter', info.position);
                    this.$store.commit('map/setZoom', info.zoom);

                    $("#gps-locate-control").data('info', info);
                });
            },
            positionInMap(position) {
                let bounds = this.mapObject.getBounds();
                return bounds && bounds.contains(position);
            },
            updateMarkers () {
                // remove all markers
                this.markerInstances.map(marker =>  marker.setMap(null));
                this.markerInstances.length = [];

                // add markers
                this.markers && this.markers.map(markerOption => {
                    if (!markerOption.hasOwnProperty('position') || !this.positionInMap(markerOption.position)) {
                        return;
                    }

                    let option = $.extend({}, {
                        map: this.mapObject,
                    }, markerOption);

                    if (markerOption.hasOwnProperty('callbacks')) {
                        for (let index in markerOption.callbacks) {
                            option[index] = markerOption.callbacks[index]();
                        }
                    }

                    let marker = new google.maps.Marker(option);

                    google.maps.event.addListener(marker, 'click', () => {
                        this.$emit('markerClicked', marker);
                    });

                    this.markerInstances.push(marker);
                });

                this.$emit('markersUpdated');
            },
        }
    }
</script>

<style lang="scss">
    .google-map-element { width: 100%; height: 100%; }

    .map-controls {
        margin: 0 0 -5px 10px;

        > button{
            background-color: #fff;
            border: medium none;
            border-radius: 2px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            height: 28px;
            margin-right: 10px;
            outline: medium none;
            padding: 0;
            width: 28px;
        }
    }

    .icon-gps{
        background-image: url("https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png");
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: 180px 18px;
        height: 18px;
        margin: 5px;
        width: 18px;

        &.gps-located{
            background-position: -144px 0;
        }
        &.gps-unlocate{
            background-position: -18px 0;
        }
    }
</style>