<template>
    <v-ons-page>
        <v-ons-toolbar modifier="transparent cover-content">
            <div class="left">
                <a id="siteLogo" href="http://beta.hackfoldr.org/g0vairmap/g0v--riRTvbB0E5x">
                    <img src="https://i.imgur.com/IWqy7yh.png">
                </a>
            </div>
        </v-ons-toolbar>

        <SitesMap />

        <indicator />
    </v-ons-page>
</template>

<script>
    import SitesMap from '@/pages/SitesMap'
    import Indicator from '@/components/Indicator'

    export default {
        name: 'map-page',

        components: {Indicator, SitesMap},

        data() {
            return {
                //
            }
        },
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
</style>


