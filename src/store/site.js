import {isTypeExist, getSupportTypes} from '@/services/indicator';
import {arrayIntersection} from '@/services/helpers';

export default {
    strict: true,
    namespaced: true,
    state: {
        groups: {},
        activeGroups: null,

        indicatorTypes: {
            'PM25': ['PM2.5', 'AQI', 'PM2.5_NASA'],
            'Temperature': null,
            'Humidity': null,
        },
        measureType: 'PM25',
        pm25IndicatorType: 'PM2.5',

        analysisTypes: [
            {name: 'normal', text: '一般站點 (無分析資料)', method: 'getCircleUrl', count: 0},
            {name: 'indoor', text: '可能放置於室內或設備故障', method: 'getHomeUrl', count: 0},
            {name: 'shortterm-pollution', text: '偵測到小型污染源', method: 'getFactoryUrl', count: 0},
            {name: 'longterm-pollution', text: '可能接近長時間的固定污染源或設備故障', method: 'getCloudUrl', count: 0},
        ],
        activeAnalysisTypes: ['normal', 'indoor', 'shortterm-pollution', 'longterm-pollution'],

        onlyShowFavoriteSwitch: false,
        favorites: [],
    },
    getters: {
        getIndicatorType: state => {
            if (state.measureType == 'PM25') {
                return state.pm25IndicatorType;
            }

            return state.measureType;
        },
        isInFavorite: state => (site) => {
            return state.favorites.indexOf(site.uid) > -1;
        },
    },
    mutations: {
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

        setMeasureType(state, type) {
            if (Object.keys(state.indicatorTypes).indexOf(type) > -1) {
                state.measureType = type;
            }
        },
        setPM25IndicatorType(state, type) {
            if (state.indicatorTypes['PM25'].indexOf(type) > -1) {
                state.pm25IndicatorType = type;
            }
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
            state.favorites = [].concat(state.favorites, site.uid);
        },
        removeFavorite(state, site) {
            state.favorites = state.favorites.filter(uid => {
                return uid !== site.uid;
            });
        },
    }
};