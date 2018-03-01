<template>
    <v-ons-page>
        <BasicToolbar>{{ lang('menu.favorite') }}</BasicToolbar>

        <v-ons-list v-if="favorites.length">
            <v-ons-lazy-repeat
                ref="lazyRepeat"
                :render-item="renderItem"
                :length="favorites.length"
            >
            </v-ons-lazy-repeat>
        </v-ons-list>

        <v-ons-card v-else>
            <div class="title" style="text-align: center;">
                <i class="fa fa-info-circle" aria-hidden="true"></i><br/>
                {{ lang('list.favorite.noneSites') }}
            </div>
        </v-ons-card>

        <v-ons-modal :visible="isLoading">
            <p style="text-align: center">
                <v-ons-progress-circular indeterminate></v-ons-progress-circular>
                <br><br>
                {{ lang('list.loading') }}
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>

<script>
    import Vue from 'vue';
    import {fetchSiteMap} from '@/services/resourceLoader';
    import BasicToolbar from '@/components/BasicToolbar'
    import ListSiteItem from '@/components/ListSiteItem';
    import ListSiteItemNoData from '@/components/ListSiteItemNoData';

    export default {
        components: {BasicToolbar},

        mounted () {
            this.favorites.length && this.fetchSites();
        },

        data() {
            return {
                isLoading: false,
                favoriteSites: {},
            };
        },

        computed: {
            favorites () { return this.$store.state.site.favorites; }
        },

        methods: {
            fetchSites () {
                this.isLoading = true;

                fetchSiteMap().then(({sites, groups, analysis}) => {
                    let favoriteSites = {};
                    let favoriteUids = this.favorites.map(favorite => favorite.uid);

                    sites.map(site => {
                        if (favoriteUids.indexOf(site.uid) > -1) {
                            favoriteSites[site.uid] = site;
                        }
                    });

                    this.favoriteSites = favoriteSites;
                    this.isLoading = false;

                    this.$refs.lazyRepeat && this.$refs.lazyRepeat.refresh();
                });
            },
            renderItem (index) {
                let favorite = this.favorites[index];
                if (this.favoriteSites.hasOwnProperty(favorite.uid)) {
                    return new Vue({
                        store: this.$store,
                        render: h => h(ListSiteItem, {
                            props: {
                                site: this.favoriteSites[favorite.uid]
                            }
                        })
                    });
                }

                return new Vue({
                    store: this.$store,
                    render: h => h(ListSiteItemNoData, {
                        props: {favorite}
                    })
                });
            },
        }
    };
</script>

<style lang="scss">
    .list-item.disable { color: #b8b7b7; }
</style>
