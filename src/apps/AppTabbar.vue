<template>
<v-ons-page>
    <v-ons-tabbar position="bottom"
        modifier="null"
        :tabs="tabs"
        :index.sync="index"
    ></v-ons-tabbar>
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
            topPosition: 0,
            tabs: [
                {
                    label: 'Map',
                    icon: 'fa-map',
                    page: Map,
                    top: -105 // Toolbar + Tabbar heights
                },
                {
                    label: 'Lists',
                    icon: 'fa-list',
                    page: List,
                },
                {
                    label: 'Resources',
                    icon: 'fa-server',
                    page: Resource,
                },
                {
                    label: 'Setting',
                    icon: 'fa-cog',
                    page: AppSetting,
                },
            ]
        };
    },

    methods: {
        //
    },

    computed: {
        index: {
            get() {
                return this.$store.state.tabbar.index;
            },
            set(newValue) {
                this.$store.commit('tabbar/set', newValue)
            }
        },
        title() {
            return this.tabs[this.index].title || this.tabs[this.index].label;
        },
    }
};
</script>