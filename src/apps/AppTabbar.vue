<template>
    <v-ons-page>
        <v-ons-tabbar position="bottom" @postchange="postchange">
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
    import Map from '@/pages/Map.vue';
    import List from '@/pages/List.vue';
    import Resource from '@/pages/Resource.vue';
    import AppSetting from '@/pages/AppSetting.vue';

    export default {
        data () {
            return {
                tabs: [
                    {
                        label: 'menu.map',
                        icon: 'fa-map',
                        name: 'map',
                    },
                    {
                        label: 'menu.list',
                        icon: 'fa-list',
                        name: 'list',
                    },
                    {
                        label: 'menu.favorite',
                        icon: 'fa-star',
                        name: 'favorite-list',
                        badge: 'favoriteCount'
                    },
                    {
                        label: 'menu.resource',
                        icon: 'fa-bookmark',
                        name: 'resource',
                    },
                    {
                        label: 'menu.setting',
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