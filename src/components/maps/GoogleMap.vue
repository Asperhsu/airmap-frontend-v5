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
                markerUpdatedAt: null,
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
            },
            siteDataFetchedAt () {
                return this.$store.state.site.dataFetchedAt;
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
                    setTimeout(() => {
                        this.updateMarkers();
                    }, 500);
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
                return GeoLocation.findCurrentLocation(this.geolocationMethod).then((result) => {
                    if (this.currentLocaton.marker) { this.currentLocaton.marker.setMap(null); }
                    // if (this.currentLocaton.circle) { this.currentLocaton.circle.setMap(null); }

                    if (!result.data) {
                        let msg = result.msg || lang('map.geolocation.notfound');
                        this.$ons.notification.toast(`${this.geolocationMethod} Error: ` + msg, {timeout: 2000});
                        return;
                    }

                    this.currentLocaton.marker = GeoLocation.createCurrentLocationMarker(this.mapObject, result.data);
                    // this.currentLocaton.circle = GeoLocation.createCurrentLocationCircle(this.mapObject, info);

                    if (result.data.zoom > 14) { result.data.zoom = 14; }

                    this.$store.commit('map/setCenter', result.data.position);
                    this.$store.commit('map/setZoom', result.data.zoom);
                });
            },
            positionInMap(position) {
                let bounds = this.mapObject.getBounds();
                return bounds && bounds.contains(position);
            },
            updateMarkers () {
                if (this.updatingMarkers) {
                    return false;
                }
                this.updatingMarkers = true;

                // save markerInstances, remove markers not in map
                let prevMarkerInstances = [...this.markerInstances];
                this.markerInstances.length = [];
                prevMarkerInstances.map(marker => {
                    if (!this.positionInMap(marker.getPosition())) {
                        marker.setMap(null)
                    }
                });

                // add markers
                let isDataUpdated = this.markerUpdatedAt === null || this.markerUpdatedAt < this.siteDataFetchedAt;
                this.markers && this.markers.map((markerOption, i) => {
                    if (!markerOption.hasOwnProperty('position') || !this.positionInMap(markerOption.position)) {
                        return;
                    }

                    // check is already in map
                    let index = prevMarkerInstances.findIndex(marker => {
                        return markerOption.uid == marker.uid;
                    });
                    let isExist = index > -1;
                    let options = null;

                    if (!isExist || isDataUpdated) {
                        // process map options
                        options = {
                            map: this.mapObject,
                            ...markerOption
                        };

                        if (markerOption.hasOwnProperty('callbacks')) {
                            for (let index in markerOption.callbacks) {
                                options[index] = markerOption.callbacks[index]();
                            }
                        }
                    }

                    this.addOrUpdateMarker(options, isExist ? prevMarkerInstances[index] : null);
                });

                this.$emit('markersUpdated');
                this.updatingMarkers = false;
                this.markerUpdatedAt = (new Date).getTime();
            },
            addOrUpdateMarker (options = null, marker = null) {
                if (marker) {
                    options && marker.setOptions(options);
                    this.markerInstances.push(marker);
                    return;
                }

                if (!options) { return; }

                marker = new google.maps.Marker(options);
                google.maps.event.addListener(marker, 'click', () => {
                    this.$emit('markerClicked', marker);
                });
                this.markerInstances.push(marker);
            }
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
            margin-right: 10px;
            outline: medium none;
            padding: 0;
            width: 40px;
            height: 40px;
        }
    }

    .icon-gps{
        background-image: url("https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png");
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: 180px 18px;
        height: 18px;
        margin: 11px;
        width: 18px;

        &.gps-located{
            background-position: -144px 0;
        }
        &.gps-unlocate{
            background-position: -18px 0;
        }
    }
</style>