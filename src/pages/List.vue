<template>
    <v-ons-page>
        <BasicToolbar>{{ lang('list.site') }}</BasicToolbar>

        <div class="search-container">
            <v-ons-search-input
                v-model="search"
                :placeholder="lang('list.searchPlaceholder')" class="site-search-input">
            </v-ons-search-input>

            <div class="close" @click="clearSearch">
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
        </div>

        <v-ons-list>
            <v-ons-list-item v-for="(count, name) in filterGroups" :key="name" modifier="chevron" tappable @click="showSites(name)">
                <div class="left">
                    <img :src="getLogo(name)" style="width: 100%"/>
                </div>
                <label class="center" :for="'groupcheckbox-' + name">
                    {{ name }}
                </label>
                <div class="right">
                    <div class="badge badge-fill badge-primary">{{ count }}</div>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-modal :visible="isLoading">
            <p style="text-align: center">
                <v-ons-progress-circular indeterminate></v-ons-progress-circular>
                <br><br>
                {{ loadingMsg }}
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>

<script>
    import {fetchSiteMap} from '@/services/resourceLoader';
    import Logo from '@/config/logo';

    import BasicToolbar from '@/components/BasicToolbar'
    import ListGroupSites from '@/pages/ListGroupSites'

    export default {
        name: 'list-page',

        components: {BasicToolbar},

        mounted () {
            this.fetchSites();
        },

        data() {
            return {
                isLoading: false,
                loadingMsg: 'Loading Data',
                search: '',

                groups: {},
                sites: {},

                filterGroups: {},
                filterSites: {},
            };
        },

        computed: {
            indicatorType () { return this.store.getters['app/getIndicatorType']; },
        },

        watch: {
            search (keyword) {
                if (keyword && keyword.length) {
                    let filterGroups = {};
                    let filterSites = {};

                    for(let group in this.sites) {
                        let sites = this.sites[group].filter(site => {
                            return site.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
                        });

                        filterGroups[group] = sites.length;
                        filterSites[group] = sites;
                    }

                    this.filterGroups = filterGroups;
                    this.filterSites = filterSites;
                    return;
                }

                this.filterGroups = this.groups;
                this.filterSites = this.sites;
            }
        },

        methods: {
            clearSearch () {
                this.search = '';
            },
            getLogo (name) {
                name = name.toLowerCase();
                if (Logo.hasOwnProperty(name)) {
                    return Logo[name];
                }

                return Logo.nologo;
            },
            fetchSites () {
                this.isLoading = true;

                fetchSiteMap().then(({sites, groups, analysis}) => {
                    let groupSites = {};

                    sites.map(site => {
                        if (!groupSites.hasOwnProperty(site.group)) {
                            groupSites[site.group] = [];
                        }

                        groupSites[site.group].push(site);
                    });

                    this.sites = this.filterSites = groupSites;
                    this.groups = this.filterGroups = groups;
                    this.isLoading = false;
                });
            },
            showSites(group) {
                this.$store.commit('navigator/push', {
                    ...ListGroupSites,
                    store: this.$store,
                    onsNavigatorProps: {
                        name: group,
                        sites: this.filterSites[group],
                    }
                });
            },
        }
    };
</script>

<style lang="scss" scoped>
    .search-container {
        margin: .5em;
        display: flex;

        .site-search-input {
            flex-grow: 1;
            margin: 0 .5em;
        }

        .close {
            margin-right: .5em;
        }
    }

    .list-item .left {
        width: 3em;
        justify-content: center;
    }
</style>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>