<template>
    <div :id="mapElementId" class='google-map-element'></div>
</template>

<script>
    import {findCurrentLocation, updateMarkers} from '@/services/maps/mapService';
    import {debounce} from '@/services/helpers';

    let mapOption = {
        streetViewControl: true,
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.HYBRID,
                google.maps.MapTypeId.TERRAIN,
            ]
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        scaleControl: true,
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#4f595d"},{"visibility":"on"}]}]
    };

    export default {
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
                return this.$store.state.map.markers;
            },
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
                var $element = $([
                    "<div class='map-controls' id='gps-locate-control'>",
                    "<button>",
                    "<div class='icon-gps'></div>",
                    "</button>",
                    "</div>"
                ].join(''));

                google.maps.event.addListener(this.mapObject, 'dragend', function() {
                    $element.find('.icon-gps').removeClass('gps-located gps-unlocate');
                });

                let btn = $element.find('button')
                btn.click(() => {
                    let info = $element.data('info');
                    if (info) {
                        this.$store.commit('map/setCenter', info.position);
                        this.$store.commit('map/setZoom', info.zoom);
                        return;
                    }

                    this.fetchCurrentLocation();
                });

                var controlDiv = $element[0];
                controlDiv.index = 1;
                this.mapObject.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
            },
            fetchCurrentLocation() {
                return findCurrentLocation().then((info) => {
                    if (!info) { return; }

                    this.currentLocaton.marker = new google.maps.Marker({
                        position: info.position,
                        map: this.mapObject,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: "#4285F4",
                            fillOpacity: 1,
                            scale: 8,
                            strokeColor: "#FFFFFF",
                            strokeWeight: 1,
                        }
                    });
                    // this.currentLocaton.circle = new google.maps.Circle({
                    //     center: info.position,
                    //     radius: info.accuracy,
                    //     map: this.mapObject,
                    //     options: {
                    //         fillColor: "#4285F4",
                    //         fillOpacity: 0.1,
                    //         strokeColor: "#4285F4",
                    //         strokeOpacity: 0.2
                    //     }
                    // });

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