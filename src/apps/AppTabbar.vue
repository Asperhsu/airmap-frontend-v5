<template>
    <v-ons-page>
        <v-ons-tabbar position="bottom" @postchange="postchange">
            <keep-alive slot="pages" include="map-page">
                <router-view></router-view>
            </keep-alive>

            <v-ons-tab v-for="tab in tabs" :key="tab.name" :ref="tab.name"
                :label="tab.label"
                :icon="tab.icon"
                :active="$route.name === tab.name"
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
                        label: 'Map',
                        icon: 'fa-map',
                        name: 'map',
                    },
                    {
                        label: 'List',
                        icon: 'fa-list',
                        name: 'list',
                    },
                    {
                        label: 'Favorite',
                        icon: 'fa-star',
                        name: 'favorite-list',
                    },
                    {
                        label: 'Resources',
                        icon: 'fa-bookmark',
                        name: 'resource',
                    },
                    {
                        label: 'Setting',
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
            }
        }
    };
</script>