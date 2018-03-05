<template>
    <v-ons-page>
        <BackToolbar>關於 g0v 零時空汙觀測網</BackToolbar>

        <v-ons-list-title><i class="fa fa-github-square" aria-hidden="true"></i> Github 原始碼</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-link" aria-hidden="true"></i>
                </div>
                <div class="center">
                    <a target="_blank" href="https://github.com/Aspertw/airmap-laravel">Backend 後端程式碼</a>
                </div>
                <div class="right">
                    Laravel
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-link" aria-hidden="true"></i>
                </div>
                <div class="center">
                    <a target="_blank" href="https://github.com/Aspertw/Airmap_v4">Frontend 前端程式碼</a>
                </div>
                <div class="right">
                    TODO
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-link" aria-hidden="true"></i>
                </div>
                <div class="center">
                    <a target="_blank" href="https://github.com/Aspertw/airmap-widget">Widget 程式碼</a>
                </div>
                <div class="right">
                    Vue.js
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-link" aria-hidden="true"></i>
                </div>
                <div class="center">
                    <a target="_blank" href="https://github.com/Aspertw/noaa-windy-layer">Wind Layer</a>
                </div>
                <div class="right">
                    wind.js
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-list-title><i class="fa fa-book" aria-hidden="true"></i> Library</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-map" aria-hidden="true"></i>
                </div>
                <div class="center">
                    <a target="_blank" href="https://snazzymaps.com/">Snazzy Maps</a>
                </div>
                <div class="right">
                    Map Style
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-list-title><i class="fa fa-user" aria-hidden="true"></i> Coder :: Asper</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-home" aria-hidden="true"></i>
                </div>
                <div class="center">
                    <a target="_blank" href="http://www.asper.tw/">Asper Blog!</a>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <div class="center">
                    asperwon (at) gmail.com
                </div>
            </v-ons-list-item>
        </v-ons-list>
    </v-ons-page>
</template>

<script>
    import BackToolbar from '@/components/toolbars/BackToolbar'

    export default {
        components: {BackToolbar},
    }
</script>

<style lang="scss" scoped>
    .list-title {
        font-size: 1em;
        padding: .5em 0;
        margin-left: .5em;
    }
</style>
