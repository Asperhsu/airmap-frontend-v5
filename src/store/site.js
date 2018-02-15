import {isTypeExist, getSupportTypes} from '@/services/indicator';

export default {
    strict: true,
    namespaced: true,
    state: {
        groups: {},
        activeGroups: [],
        indicators: getSupportTypes(),
        indicatorType: "PM2.5",
        analysisTypes: [
            {name: 'normal', text: '一般站點 (無分析資料)', method: 'getCircleUrl', count: 0},
            {name: 'indoor', text: '可能放置於室內或設備故障', method: 'getHomeUrl', count: 0},
            {name: 'shortterm-pollution', text: '偵測到小型污染源', method: 'getFactoryUrl', count: 0},
            {name: 'longterm-pollution', text: '可能接近長時間的固定污染源或設備故障', method: 'getCloudUrl', count: 0},
        ],
        activeAnalysisTypes: ['normal', 'indoor', 'shortterm-pollution', 'longterm-pollution'],
    },
    getters: {
        getIndicatorType: state => state.indicatorType,
    },
    mutations: {
        setGroups(state, groups) {
            state.groups = Object.assign({}, groups);
        },
        setActiveGroups(state, groups) {
            state.activeGroups = [].concat(groups);
        },
        setIndicatorType(state, type) {
            state.indicatorType = type;
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
    }
};