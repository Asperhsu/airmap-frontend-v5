<template>
    <div id="google-map"></div>
</template>

<script>
    import {findCurrentLocation, updateMarkers} from '@/services/map/mapService'

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

        props: {

        },

        data() {
            return {
                booted: false,
                mapElementId: 'google-map',
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
            center (latlng) { this.mapObject.setCenter(latlng); },
            zoom (zoom) { this.mapObject.setZoom(zoom); },
            markers (newMarkers, oldMarkers) {
                this.updateMarkers(oldMarkers, newMarkers);
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

                // location button
                this.addUserLocationButton();

                // event map booted
                google.maps.event.addListenerOnce(this.mapObject, 'idle', () => {
                    this.$emit('mapBooted');
                });
            },
            addUserLocationButton () {
                var $element = $([
                    "<div class='map-controls' title='定位'>",
                    "<button>",
                    "<div class='icon-gps'></div>",
                    "</button>",
                    "</div>"
                ].join(''));

                google.maps.event.addListener(this.mapObject, 'dragend', function() {
                    $element.find('.icon-gps').removeClass('gps-located gps-unlocate');
                });

                $element.find('button').click(() => {
                    let info = $element.data('info');
                    if (info) {
                        this.$store.commit('map/setCenter', info.position);
                        this.$store.commit('map/setZoom', info.zoom);
                        return;
                    }

                    findCurrentLocation().then((info) => {
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
                        this.currentLocaton.circle = new google.maps.Circle({
                            center: info.position,
                            radius: info.accuracy,
                            map: this.mapObject,
                            options: {
                                fillColor: "#4285F4",
                                fillOpacity: 0.1,
                                strokeColor: "#4285F4",
                                strokeOpacity: 0.2
                            }
                        });

                        if (info.zoom > 14) { info.zoom = 14; }

                        this.$store.commit('map/setCenter', info.position);
                        this.$store.commit('map/setZoom', info.zoom);

                        $element.data('info', info);
                    });
                });

                var controlDiv = $element[0];
                controlDiv.index = 1;
                this.mapObject.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
            },
            updateMarkers (oldMarkers, newMarkers) {
                let markerInstances = [].concat(this.markerInstances);
                this.markerInstances = updateMarkers(oldMarkers, newMarkers, markerInstances, (option) => {
                    let marker = new google.maps.Marker($.extend({}, {
                        map: this.mapObject,
                    }, option));

                    google.maps.event.addListener(marker, 'click', () => {
                        this.$emit('markerClicked', marker);
                    });

                    return marker;
                });

                this.$emit('markersLoaded');
            }
        }
    }
</script>

<style lang="scss">
    #google-map { width: 100%; height: 100%; }

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