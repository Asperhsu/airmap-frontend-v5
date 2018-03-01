import {arrayIntersection} from '@/services/helpers';

export default {
    strict: true,
    namespaced: true,
    state: {
        data: null,
        dataFetchedAt: null,

        groups: {},
        activeGroups: null,

        analysisTypes: [
            {name: 'normal', method: 'getCircleUrl', count: 0},
            {name: 'indoor', method: 'getHomeUrl', count: 0},
            {name: 'shortterm-pollution', method: 'getFactoryUrl', count: 0},
            {name: 'longterm-pollution', method: 'getCloudUrl', count: 0},
        ],
        activeAnalysisTypes: ['normal', 'indoor', 'shortterm-pollution', 'longterm-pollution'],

        onlyShowFavoriteSwitch: false,
        favorites: [],
    },
    getters: {
        isInFavorite: state => (site) => {
            return state.favorites.filter(favorite => {
                return favorite.uid === site.uid;
            }).length > 0;
        },
    },
    mutations: {
        setData(state, data) {
            if (data) {
                state.data = data;
                state.dataFetchedAt = (new Date()).getTime();
            }
        },

        setGroups(state, groups) {
            state.groups = Object.assign({}, groups);

            if (state.activeGroups === null) {
                // set default activeGroups
                state.activeGroups = Object.keys(state.groups);
            } else {
                // remove group not in groups
                let groupNames =  Object.keys(state.groups);
                let activeGroups = state.activeGroups.filter(group => {
                    return groupNames.indexOf(group) > -1;
                });

                if (activeGroups.length !== state.activeGroups.length) {
                    state.activeGroups = activeGroups;
                }
            }
        },
        setActiveGroups(state, groups) {
            state.activeGroups = [].concat(groups);
        },

        updateAnalysisTypeCount(state, analysis) {
            let types = [];

            state.analysisTypes.map(type => {
                types.push(Object.assign({}, type, {
                    count: analysis[type.name],
                }));
            });

            state.analysisTypes = types;
        },
        setActiveAnalysisTypes(state, types) {
            state.activeAnalysisTypes = [].concat(types);
        },

        setOnlyShowFavoriteSwitch(state, flag) {
            state.onlyShowFavoriteSwitch = !!flag;
        },
        setFavorites(state, favorites) {
            state.favorites = favorites;
        },
        addFavorite(state, site) {
            state.favorites = [].concat(state.favorites, {
                uid: site.uid,
                name: site.name,
            });
        },
        removeFavorite(state, site) {
            state.favorites = state.favorites.filter(favorite => {
                return favorite.uid !== site.uid;
            });
        },
    }
};