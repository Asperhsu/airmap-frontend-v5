<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="center">
                <v-ons-segment tabbar-id="tabbar" :index.sync="segmentIndex" style="width: 180px">
                    <button>ALL</button>
                    <button>Favorite</button>
                </v-ons-segment>
            </div>
        </v-ons-toolbar>

        <v-ons-tabbar id="tabbar"
            :tabs="tabs"
            :index.sync="tabbarIndex"
        ></v-ons-tabbar>

    </v-ons-page>
</template>

<script>
    import BasicToolbar from '@/components/BasicToolbar'
    import ListAll from '@/pages/ListAll'
    import ListFavorite from '@/pages/ListFavorite'

    export default {
        components: {BasicToolbar, ListAll, ListFavorite},
        methods: {

        },
        data() {
            return {
                segmentIndex: 0,
                tabbarIndex: 0,
                tabs: [
                    {page: ListAll},
                    {page: ListFavorite},
                ]
            };
        }
    };
</script>

<style lang="scss" scoped>

</style>
