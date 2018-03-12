export default {
    setting: {
        showIndicator: 'Display indicator bar',
        showPublishWatermark: 'Display data timestmp',
        measureType: 'Indicator Type',
        other: 'Other Types',

        windLayer: {
            title: 'Wind Layer',
            enable: 'Enable',
            fillOpacity: 'Line opacity',
            moveSpeed: 'Line move speed',
            information: 'Information',
            publishTime: 'Data Published time',
            waitForReturnMap: 'Load until return to map',
            notice: 'Notice',
            noticeText: 'Wind Layer is very resource-consuming, easy to cause the browser crashes, please use discretion. Wind data updated at 5, 11, 17, 23 (UTC +8)',
        },

        map: {
            title: 'Map',
        },

        mapType: {
            title: 'Map Type',
            site: 'Site Map',
            town: 'Taiwan Town Map',
        },

        startupUseMyLocation: {
            title: 'Use current location when startup',
            enable: 'Enable',
        },

        geolocation: {
            title: 'Position Locate Method',

            google: {
                title: 'Google API',
                info: 'guess location by network address, may not be accurate.',
            },

            geo: {
                title: 'Browser geolocation',
                info: 'Use HTML5 positioning, if you have a GPS device, you need to authorize use.',
            }
        },
    },
}