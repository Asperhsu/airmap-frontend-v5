import {diff} from 'deep-object-diff'
import store, {getInitialState} from '@/store';
import SettingStorage from '@/services/settingStorage';
import {getObjectValue} from '@/services/helpers';


const stateWatchers = [
    {commit: 'app/setLang', stateKey: 'app.lang'},
    {commit: 'app/setMapType', stateKey: 'app.mapType'},
    {commit: 'app/setHideTabbar', stateKey: 'app.hideTabbar'},
    {commit: 'app/setMeasureType', stateKey: 'app.measureType'},
    {commit: 'app/setPM25IndicatorType', stateKey: 'app.pm25IndicatorType'},
    {commit: 'app/setGeolocationMethod', stateKey: 'app.geolocationMethod'},

    {commit: 'map/setCenter', stateKey: 'map.center'},
    {commit: 'map/setZoom', stateKey: 'map.zoom'},
    {commit: 'map/setShowIndicator', stateKey: 'map.showIndicator'},
    {commit: 'map/setShowPublishWatermark', stateKey: 'map.showPublishWatermark'},
    {commit: 'map/setStartupUseMyLocation', stateKey: 'map.startupUseMyLocation'},

    {commit: 'site/setActiveAnalysisTypes', stateKey: 'site.activeAnalysisTypes'},
    {commit: 'site/setFavorites', stateKey: 'site.favorites'},
    {commit: 'site/setOnlyShowFavorite', stateKey: 'site.onlyShowFavorite'},
];

const stateCanReset = [
    'app',
    'map.center',
    'map.zoom',
    'map.showIndicator',
    'map.setShowPublishWatermark',
    'map.startupUseMyLocation',
    'site.favorites',
    'site.onlyShowFavorite',
    'windLayer',
];


export const registerSettingWatcher = () => {
    stateWatchers.map(config => {
        store.watch(
            (state) => {
                if (config.hasOwnProperty('getter')) {
                    return store.getters[config.getter];
                }

                return getObjectValue(state, config.stateKey);
            },
            (newValue, oldValue) => {
                let isEqual = false;

                if (typeof newValue === "object" && typeof oldValue === "object") {
                    isEqual = Object.keys(diff(oldValue, newValue)).length === 0;
                } else {
                    isEqual = oldValue === newValue;
                }

                !isEqual && SettingStorage.set(config.commit, newValue);
            },
            { deep: true }
        );
    })
}

export const emitSettingCommit = () => {
    let settings = SettingStorage.get();

    if (settings['app/setGeolocationMethod']) {
        settings['app/setGeolocationMethod'] = 'geo';
        SettingStorage.set('app/setGeolocationMethod', 'geo');
    }

    Object.keys(settings).map(commit => {
        store.commit(commit, settings[commit]);
    });
}

export const resetState = () => {
    let initState = JSON.parse(JSON.stringify(getInitialState()));
    let currentState = $.extend({}, store.state);

    stateCanReset.map(index => {
        let evalStr = `currentState.${index} = initState.${index}`;
        eval(evalStr);
    });

    store.replaceState(currentState);
}