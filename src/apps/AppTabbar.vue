<template>
    <v-ons-page>
        <Bulletin />

        <v-ons-tabbar position="bottom" @postchange="postchange" :hide-tabs="hideTabbar">
            <keep-alive slot="pages" include="map-page">
                <router-view></router-view>
            </keep-alive>

            <v-ons-tab v-for="tab in tabs" :key="tab.name" :ref="tab.name"
                :label="lang(tab.label)"
                :icon="tab.icon"
                :active="$route.name === tab.name"
                :badge="getBadge(tab)"
                @click.prevent="$router.push(tab.name)"
            ></v-ons-tab>
        </v-ons-tabbar>
    </v-ons-page>
</template>

<script>
    import Map from '@/pages/maps/Map.vue';
    import List from '@/pages/lists/List.vue';
    import Resource from '@/pages/resources/Resource.vue';
    import AppSetting from '@/pages/AppSetting.vue';
    import Bulletin from '@/components/Bulletin.vue';

    export default {
        components: { Bulletin },

        data () {
            return {
                tabs: [
                    {
                        label: 'app.menu.map',
                        icon: 'fa-map',
                        name: 'map',
                    },
                    {
                        label: 'app.menu.list',
                        icon: 'fa-list',
                        name: 'list',
                    },
                    {
                        label: 'app.menu.favorite',
                        icon: 'fa-star',
                        name: 'favorite-list',
                        badge: 'favoriteCount'
                    },
                    {
                        label: 'app.menu.resource',
                        icon: 'fa-bookmark',
                        name: 'resource',
                    },
                    {
                        label: 'app.menu.setting',
                        icon: 'fa-cog',
                        name: 'setting',
                    },
                ]
            };
        },

        computed: {
            title() {
                return this.tabs[this.index].title || this.tabs[this.index].label;
            },
            favoriteCount () {
                return this.$store.state.site.favorites.length || null;
            },
            hideTabbar () {
                return this.$store.state.app.hideTabbar;
            },
        },

        methods: {
            postchange (e) {
                this.tabs.map(tab => {
                    if (!this.$refs.hasOwnProperty(this.$route.name)) {
                        return;
                    }

                    let active = tab.name == this.$route.name;
                    this.$refs[tab.name][0].$el.setActive(active);
                });
            },
            getBadge (tab) {
                return tab.badge ? this[tab.badge]: null;
            }
        }
    };
</script>