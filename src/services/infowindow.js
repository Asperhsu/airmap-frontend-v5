import Vue from 'vue'
import SnazzyInfoWindow from 'snazzy-info-window';
import store from '@/store';

import SiteInfowindow from '@/components/maps/SiteInfowindow'
import TownInfowindow from '@/components/maps/TownInfowindow'

const snazzyInfoWindowOptions = {
    closeOnMapClick: true,
    showCloseButton: false,
    edgeOffset: {top: 55, right: 55, left: 55,},
};

export const createSiteInfowindow = (map, position, site) => {
    let id = 'site-infowindow';
    let options = Object.assign({}, snazzyInfoWindowOptions, {
        map: map,
        position: position,
        content: `<div id='${id}'></div>`,
        offset: {top: '-25px'},
        callbacks: {
            open: openCallback('#'+id, SiteInfowindow, {site}),
        }
    })

    return new SnazzyInfoWindow(options);
}


export const createTownInfowindow = (map, position, town) => {
    let id = 'town-infowindow';
    let options = Object.assign({}, snazzyInfoWindowOptions, {
        map: map,
        position: position,
        content: `<div id='${id}'></div>`,
        callbacks: {
            open: openCallback('#'+id, TownInfowindow, {town}),
        }
    })

    return new SnazzyInfoWindow(options);
}

const openCallback = function (el, component, props) {
    return function () {
        let SnazzyInfoWindow = this;
        let closeWindow = function () { SnazzyInfoWindow.close(); };

        new Vue({
            el,
            store,
            render: h => h(component, {
                props: Object.assign({}, props, { closeWindow })
            })
        });
    }
}