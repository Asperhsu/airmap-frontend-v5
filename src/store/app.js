import {isTypeExist, getSupportTypes} from '@/services/indicator';

export default {
    strict: true,
    namespaced: true,

    state: {
        lang: 'tw',
        mapType: 'town',
        hideTabbar: false,

        indicatorTypes: {
            'PM25': ['PM2.5', 'AQI', 'PM2.5_NASA'],
            'Temperature': null,
            'Humidity': null,
        },
        measureType: 'PM25',
        pm25IndicatorType: 'PM2.5',

        geolocationMethod: 'google',
    },

    getters: {
        getIndicatorType: state => {
            if (state.measureType == 'PM25') {
                return state.pm25IndicatorType;
            }

            return state.measureType;
        },
    },

    mutations: {
        setLang(state, lang) {
            state.lang = lang;
        },
        setMapType(state, type) {
            state.mapType = type;
        },
        setHideTabbar(state, flag) {
            state.hideTabbar = !!flag;
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

        setGeolocationMethod(state, method) {
            state.geolocationMethod = method;
        },
    }
};