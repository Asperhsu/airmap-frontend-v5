<template>
    <v-ons-page>
        <p>
            <v-ons-search-input placeholder="Search something" class="site-search-input"></v-ons-search-input>
        </p>

        <v-ons-list modifier="inset">
            <v-ons-list-header>Default</v-ons-list-header>

            <v-ons-list-item tappable>
                All
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-button modifier="light" class="btn-site-page"><i class="fa fa-bookmark"></i></v-ons-button>
        <v-ons-button modifier="outline" class="btn-widget-page"><i class="fa fa-tachometer"></i></v-ons-button>
    </v-ons-page>
</template>

<script>
    export default {
        methods: {

        },
        data() {
            return {
                //
            };
        }
    };
</script>

<style lang="scss" scoped>
    .site-search-input { display: block; padding: 0 8px; }
</style>
