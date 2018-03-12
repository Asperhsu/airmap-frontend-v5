import {detailedDiff} from 'deep-object-diff';

export const mapOption = {
    streetViewControl: true,
    mapTypeControl: false,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT,
        mapTypeIds: [
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.HYBRID,
            google.maps.MapTypeId.TERRAIN,
        ]
    },
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    scaleControl: true,
    styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#4f595d" }, { "visibility": "on" }] }]
};

/* marker diff */

export const updateMarkers = (oldMarkers, newMarkers, markerInstances, createCb) => {
    let diff = detailedDiff(oldMarkers, newMarkers);

    // added
    createCb && Object.values(diff.added).map((option) => {
        let marker = createCb(option);
        markerInstances.push(marker);
    });

    // updated
    try {
        let updatedPositionStr = [];
        for (let key in diff.updated) {
            let updatedOption = newMarkers[key];
            let position = updatedOption.position;
            updatedPositionStr[key] = position.lat + '-' + position.lng;
        }

        markerInstances.map((marker, index) => {
            let position = marker.getPosition();
            let posStr = position.lat + '-' + position.lng;
            let key = updatedPositionStr.indexOf(posStr);

            if (key > -1) {
                let updatedOption = newMarkers[key];
                marker.setOptions(updatedOption);
            }
        });
    } catch(err) {
        // console.log(err);
    }

    // deleted
    try {
        let deletedPositionStr = Object.keys(diff.deleted).map(key => {
            let position = newMarkers[key].position;
            return position.lat + '-' + position.lng;
        });

        markerInstances.map((marker, index) => {
            let position = marker.getPosition();
            let posStr = position.lat + '-' + position.lng;

            if (deletedPositionStr.indexOf(posStr) > -1) {
                marker.setMap(null);
                markerInstances[index] = null;
            }
        });

        markerInstances = markerInstances.filter((marker) => {
            return marker !== null;
        });
    } catch(err) {
        // console.log(err);
    }

    return markerInstances;
}


/* map button */
export const addButton = (map, position, html, onClick=()=>{}) => {
    if (!map) { console.log('Need Pass Map instance'); return; }
    if (!position || !google.maps.ControlPosition.hasOwnProperty(position)) {
        console.log('map controls position not correct.'); return;
    }
    if (!html || !html.length) { console.log('Need Pass button html'); return; }

    let $element = $(html);
    $element.click(function () {
        onClick($element);
    });

    let controlDiv = $element[0];
    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition[position]].push(controlDiv);
}