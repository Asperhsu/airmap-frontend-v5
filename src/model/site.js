import axios from 'axios';
import moment from 'moment';
import {getObjectValue} from '@/services/helpers';
import {getTypeColor} from '@/services/indicator';
import * as MarkerIcon from '@/services/maps/markerIconService'

let historyUrlTemplate = "/json/query-history?group={{group}}&id={{id}}&start={{start}}&end={{end}}";
let lassPredictionTemplateUrl = "/json/query-prediction?id={{id}}";


export default class Site {
    constructor(data) {
        this.property = data;
    }

    getProperty(key) {
        return getObjectValue(this.property, key);
    }


    get uid() {
        return this.getProperty('SiteGroup') + '$' + this.getProperty('uniqueKey');
    }
    get uniqKey() {
        return this.getProperty('uniqueKey');
    }
    get title() {
        return '[' + this.getProperty('SiteGroup') + '] ' + this.getProperty('SiteName');
    }
    get name() {
        return this.getProperty('SiteName');
    }
    get group() {
        return this.getProperty('SiteGroup');
    }
    get position() {
        return this.getProperty('LatLng');
    }
    get pm25() {
        return this.getProperty('Data.Dust2_5');
    }
    get temp() {
        return this.getProperty('Data.Temperature');
    }
    get humidity() {
        return this.getProperty('Data.Humidity');
    }
    get publishedAt() {
        return moment(this.getProperty('Data.Create_at'));
    }
    get analysisRanking() {
        let ranking = this.getProperty('Analysis.ranking');
        return ranking === null ? 0 : ranking;
    }
    get analysisStatus() {
        let status = this.getProperty('Analysis.status');
        return status ? status.split('|') : ['normal'];
    }
    get region() {
        let geometry = this.getProperty('Geometry');
        return geometry ? {
            country: geometry.COUNTYNAME,
            town: geometry.TOWNNAME,
        } : null;
    }


    measureValue(indicatorType) {
        if (['PM2.5', 'PM2.5_NASA', 'AQI'].indexOf(indicatorType) > -1) {
            return this.pm25;
        }

        if (indicatorType == 'Temperature') {
            return this.temp;
        }

        if (indicatorType == 'Humidity') {
            return this.humidity;
        }
    }

    marker(indicatorType) {
        return {
            title: this.title,
            position: this.position,
            icon: this.markerIcon(indicatorType)
        };
    }

    markerIcon(indicatorType) {
        let url = null;
        let measureValue = Math.round(this.measureValue(indicatorType));
        let indicatorColor = getTypeColor(indicatorType, measureValue);

        let analysisStatus = this.getProperty('Analysis.status');
        if (!analysisStatus) {
            url = MarkerIcon.getCircleUrl(indicatorColor, measureValue);
        } else {
            if(analysisStatus.indexOf('indoor') > -1){ url = MarkerIcon.getHomeUrl(indicatorColor, measureValue); }
            if(analysisStatus.indexOf('longterm-pollution') > -1){ url = MarkerIcon.getFactoryUrl(indicatorColor, measureValue); }
            if(analysisStatus.indexOf('shortterm-pollution') > -1){ url = MarkerIcon.getCloudUrl(indicatorColor, measureValue); }
        }

        return {
            anchor: google.maps.Point(15, 15),
            url: url,
        }
    }

    fetchHistory(offsetHours = 12) {
        // get url
        let params = {
            group: this.group,
            id: this.uniqKey,
            start: moment().subtract(parseInt(offsetHours), 'hours').unix(),
            end: moment().unix(),
        };

        let url = historyUrlTemplate;
        Object.keys(params).map(name => {
            url = url.replace(`{{${name}}}`, params[name]);
        });

        return axios.get(url).then(response => {
            let labels = [];
            let datasets = {};

            Object.keys(response.data).map(index => {
                let data = response.data[index];

                if (index === 'isotimes') {
                    labels = data.map(isoString => {
						return moment(isoString).format('kk:mm');
					});
					return;
                }

                datasets[index] = data;
            });

            return {labels, datasets};
        });
    }

    fetchLassPrediction() {
        let url = lassPredictionTemplateUrl.replace('{{id}}', this.uniqKey);

        return axios.get(url).then(response => {
            if (!response.data.labels || !response.data.data) return null;

            let datasets = [];
            Object.keys(response.data.data).map(index => {
                datasets.push({
                    label: index,
                    data: response.data.data[index],
                });
            });

            return {labels: response.data.labels, datasets};
        }, (error) => {
            return null;
        });
    }
}