<template>
    <v-ons-page>
        <v-ons-toolbar modifier="transparent cover-content">
            <div class="left">
                <a id="siteLogo" href="http://beta.hackfoldr.org/g0vairmap/g0v--riRTvbB0E5x">
                    <img src="https://i.imgur.com/IWqy7yh.png">
                </a>
            </div>
        </v-ons-toolbar>

        <div class="mapContainer" v-show="mapType === 'site'">
            <SiteMap v-if="mapType === 'site'" />
        </div>
        <div class="mapContainer" v-show="mapType === 'town'">
            <TownMap v-if="mapType === 'town'" />
        </div>

        <IndicatorVertical />
    </v-ons-page>
</template>

<script>
    import SiteMap from '@/pages/maps/SiteMap'
    import TownMap from '@/pages/maps/TownMap'
    import IndicatorVertical from '@/components/maps/IndicatorVertical'

    export default {
        name: 'map-page',

        components: {SiteMap, TownMap, IndicatorVertical},

        mounted () {
            this.mapType = this.mapStateType;
        },

        data() {
            return {
                mapType: null,
            }
        },

        computed: {
            mapStateType () { return this.$store.state.app.mapType; }
        },


        watch: {
            '$route' (to, from) {
                // change map when on view
                if (to.name === 'map' && this.mapType !== this.mapStateType) {
                    this.$store.commit('windLayer/setEnable', false);
                    this.mapType = this.mapStateType;
                }
            }
        }
    }
</script>

<style lang="scss">
    .toolbar.toolbar--transparent.toolbar--cover-content+.page__background+.page__content,
    .toolbar.toolbar--transparent.toolbar--cover-content+.page__background+.page__content .page_content,
    .toolbar.toolbar--material.toolbar--transparent.toolbar--cover-content+.page__background+.page__content,
    .toolbar.toolbar--material.toolbar--transparent.toolbar--cover-content+.page__background+.page__content .page_content{
        padding-top: 0px;
    }

    #siteLogo {
        z-index:91;

        img {
            height: 30px; vertical-align: middle;
            filter: drop-shadow(0px 0px 3px #fff) drop-shadow(0px 0px 5px #fff);
		    -webkit-filter: drop-shadow(0px 0px 3px #fff) drop-shadow(0px 0px 5px #fff);
        }
    }

    .mapContainer {
        width: 100%; height: 100%;
    }
</style>