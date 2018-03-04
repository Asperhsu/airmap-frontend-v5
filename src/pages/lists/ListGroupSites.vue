<template>
    <v-ons-page>
        <BackToolbar>{{ name }}</BackToolbar>

        <v-ons-list>
            <v-ons-lazy-repeat
                :render-item="renderItem"
                :length="sites.length"
            >
            </v-ons-lazy-repeat>
        </v-ons-list>
    </v-ons-page>
</template>

<script>
    import Vue from 'vue';
    import BackToolbar from '@/components/toolbars/BackToolbar';
    import ListSiteItem from '@/components/lists/ListSiteItem';

    export default {
        components: {BackToolbar},

        props: {
            name: {
                type: String,
                required: true,
            },
            sites: {
                type: Array,
                requied: true,
            }
        },

        methods: {
            renderItem (index) {
                return new Vue({
                    store: this.$store,
                    render: h => h(ListSiteItem, {
                        props: {
                            site: this.sites[index]
                        }
                    })
                });
            },
        }
    }
</script>
