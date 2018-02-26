import axios from 'axios';
import Site from '@/model/site';
import store from '@/store';

const resourceUrl = 'json/airmap.json';
// const resourceUrl = 'static/lass.json';

export const fetch = (url = resourceUrl) => {
    return axios.get(url).then(response => {
        return processSiteData(response.data);
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