import axios from 'axios';
import Site from '@/model/site';
import store from '@/store';

const airmapUrl = 'json/airmap.json';
const airmapExpiredms = 5 * 60 * 1000;  // 5 mins

const townUrl = 'json/townmap.json';
const townmapExpiredms = 5 * 60 * 1000;  // 5 mins

const currentTimestamp = function() {
    return (new Date()).getTime();
}

export const fetchSiteMap = (url = airmapUrl) => {
    if (store.state.site.data && store.state.site.dataFetchedAt > (currentTimestamp() - airmapExpiredms)) {
        return Promise.resolve(store.state.site.data);
    }

    return axios.get(url).then(response => {
        let data = processSiteData(response.data);
        store.commit('site/setData', data);

        return data;
    });
}

const processSiteData = (data = []) => {
    let sites = [];
    let groups = {};
    let analysis = {};

    data.map(data => {
        let site = new Site(data);
        sites.push(site);

        // site groups
        let group = site.group;
        groups.hasOwnProperty(group) ? groups[group]++ : (groups[group] = 1);

        // analysis status
        let statuses = site.analysisStatus;
        if (statuses.length) {
            statuses.map(status => {
                analysis.hasOwnProperty(status) ? analysis[status]++ : (analysis[status] = 1);
            });
        } else {
            analysis.hasOwnProperty('normal') ? analysis['normal']++ : (analysis['normal'] = 1);
        }
    });

    return {sites, groups, analysis};
}

export const fetchTownMap = (url = townUrl) => {
    if (store.state.town.data && store.state.town.dataFetchedAt > (currentTimestamp() - townmapExpiredms)) {
        return Promise.resolve(store.state.town.data);
    }

    return axios.get(url).then(response => {
        let data = response.data;
        store.commit('town/setData', data);

        return data;
    });
}