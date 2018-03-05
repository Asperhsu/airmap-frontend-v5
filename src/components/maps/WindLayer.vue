<template>
    <div></div>
</template>

<script>
    import axios from 'axios';
    import WindLayer from '@/services/maps/windLayer';

    export default {
        beforeDestroy () {
            this.overlay && this.overlay.destroy();
        },

        props: {
            map: {
                required: true,
            },
            show: {
                type: Boolean,
                default: true,
            },
            opts: {
                type: Object,
                default: () => {},
            },
        },

        data () {
            return {
                booted: false,
                overlay: null,
            }
        },

        computed: {
            fillOpacity () { return this.$store.state.windLayer.fillOpacity; },
            moveSpeed () { return this.$store.state.windLayer.moveSpeed; },

            overlayFillOpacity () {return this.overlay && this.overlay.fillOpacity; },
            overlayMoveSpeed () {return this.overlay && this.overlay.moveSpeed; },
            gfsPublishAt () { return this.overlay && this.overlay.gfsPublishAt; },
        },

        watch: {
            show (flag) {
                this.booted && (this.overlay.enable = flag);

                if (!this.booted) { this.boot(); }
            },
            fillOpacity (value) {
                this.overlay && (this.overlay.fillOpacity = value);
            },
            overlayFillOpacity (value) {
                if (value !== this.fillOpacity) {
                    this.$store.commit('windLayer/setFillOpacity', value);
                }
            },
            moveSpeed (value) {
                this.overlay && (this.overlay.moveSpeed = value);
            },
            overlayMoveSpeed (value) {
                if (value !== this.moveSpeed) {
                    this.$store.commit('windLayer/setMoveSpeed', value);
                }
            },
            gfsPublishAt (value) {
                value && this.$store.commit('windLayer/setPublishedAt', value);
            },
        },

        methods: {
            boot () {
                let opts = Object.assign({}, this.opts, {
                    map: this.map,
                    fillOpacity: this.fillOpacity,
                    moveSpeed: this.moveSpeed,
                });

                this.overlay = new WindLayer(opts);
                this.show && this.fetchGfs();
            },
            fetchGfs() {
                axios.get('/json/gfs.json').then(response => {
                    this.overlay.gfs = response.data;
                    this.overlay.enable = this.show;

                    this.booted = true;
                });
            }
        },
    }
</script>
