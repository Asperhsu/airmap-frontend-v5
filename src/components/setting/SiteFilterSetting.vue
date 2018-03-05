<template>
    <div>
        <v-ons-list-title>{{ lang('setting.siteFilter') }}</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-header>{{ lang('setting.favorite') }}</v-ons-list-header>
            <v-ons-list-item tappable>
                <div class="center"></div>
                <label class="center" for="onlyShowFavoriteSwitch">
                    {{ lang('setting.onlyShowFavorite') }}
                </label>
                <div class="right">
                    <v-ons-switch input-id="onlyShowFavoriteSwitch" v-model="onlyShowFavorite" />
                </div>
            </v-ons-list-item>

            <v-ons-list-header>{{ lang('setting.group') }}</v-ons-list-header>
            <v-ons-list-item v-for="(count, name) in groups" :key="name" tappable>
                <div class="left">
                    <img :src="getLogo(name)" style="width: 100%"/>
                </div>
                <label class="center" :for="'groupcheckbox-' + name">
                    {{ name }}
                    <div class="badge badge-fill badge-primary">{{ count }}</div>
                </label>
                <label class="right">
                    <v-ons-checkbox
                        :input-id="'groupcheckbox-' + name"
                        :value="name"
                        :disabled="onlyShowFavorite"
                        v-model="activeGroups"
                    >
                    </v-ons-checkbox>
                </label>
            </v-ons-list-item>

            <v-ons-list-header>{{ lang('setting.markerIcon') }}</v-ons-list-header>
            <v-ons-list-item v-for="(stat, index) in analysisTypes" :key="stat.name" tappable>
                <label class="left">
                    <img :src="getIcon(stat.method, stat.count)" />
                </label>
                <label class="center" :for="'statcheckbox-' + index">
                    {{ lang(`analysisTypes.${stat.name}`) }}
                </label>
                <label class="right">
                    <v-ons-checkbox
                        :input-id="'statcheckbox-' + index"
                        :value="stat.name"
                        :disabled="onlyShowFavorite"
                        v-model="activeAnalysisTypes"
                    ></v-ons-checkbox>
                </label>
            </v-ons-list-item>
        </v-ons-list>
    </div>
</template>

<script>
    import * as MarkerIcon from '@/services/maps/markerIconService'
    import Logo from '@/config/logo';

    export default {
        computed: {
            groups () { return this.$store.state.site.groups; },
            activeGroups: {
                get: function () {
                    return this.$store.state.site.activeGroups;
                },
                set: function (groups) {
                    this.$store.commit('site/setActiveGroups', groups);
                }
            },

            analysisTypes () { return this.$store.state.site.analysisTypes; },
            activeAnalysisTypes: {
                get: function () {
                    return this.$store.state.site.activeAnalysisTypes;
                },
                set: function (types) {
                    this.$store.commit('site/setActiveAnalysisTypes', types);
                }
            },

            onlyShowFavorite: {
                get: function () {
                    return this.$store.state.site.onlyShowFavorite;
                },
                set: function (value) {
                    this.$store.commit('site/setOnlyShowFavorite', value);
                }
            }
        },

        methods: {
            getIcon(method, cnt) {
                return MarkerIcon[method]('#999', cnt);
            },
            getLogo (name) {
                name = name.toLowerCase();
                if (Logo.hasOwnProperty(name)) {
                    return Logo[name];
                }

                return Logo.nologo;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .list-item .left {
        width: 3em;
        justify-content: center;
    }
    .badge {
        margin-left: .5em;
    }
</style>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>