let locateIconBlinkInterval;
const LOCATE_BTN_ID = 'gps-locate-control';
const LOCATION_SEARCHING = 'LOCATION_SEARCHING';
const LOCATION_LOCATED = 'LOCATION_LOCATED';
const LOCATION_NOTFOUND = 'LOCATION_NOTFOUND';
const LOCATION_RESET = 'LOCATION_RESET';


const setIconStatus = (status) => {
    const $icon = $(`#${LOCATE_BTN_ID} .icon-gps`);

    if (locateIconBlinkInterval) {
        $icon.removeClass('gps-located gps-unlocate');
        clearInterval(locateIconBlinkInterval);
    }

    if (!status || status === LOCATION_RESET) {
        $icon.removeClass('gps-located gps-unlocate');
        return;
    }

    if (status === LOCATION_SEARCHING) {
        locateIconBlinkInterval = setInterval(function () {
            $icon.toggleClass('gps-unlocate');
        }, 500);
        return;
    }

    if (status === LOCATION_LOCATED) {
        $icon.removeClass('gps-unlocate').addClass('gps-located');
        return;
    }

    if (status === LOCATION_NOTFOUND) {
        $icon.addClass('gps-unlocate');
        return;
    }
};

const locationButtonHtml = () => {
    return [
        `<div class='map-controls' id='${LOCATE_BTN_ID}'>`,
        "<button>",
        "<div class='icon-gps'></div>",
        "</button>",
        "</div>"
    ].join('');
}


const findZoomLevelByAccuracy = (accuracy) => {
    if (parseFloat(accuracy) <= 0) { return 12; }
    //591657550.500000 / 2^(level-1)
    var level = (Math.log(591657550.500000 / accuracy) / Math.log(2)) + 1;
    return Math.floor(level);
};

const findCurrentLocation = (method) => {
    let handler;
    switch (method) {
        default:
        case 'geo': handler = geolocation(); break; //todo
        case 'google': handler = googleLocation(); break;
    }

    setIconStatus(LOCATION_SEARCHING);
    return handler.then(result => {
        setIconStatus(result.status || LOCATION_NOTFOUND);
        return result.hasOwnProperty('data') ? result.data : null;
    }, () => {
        console.warn('location can not retrive.');
        setIconStatus(LOCATION_NOTFOUND);
    });
};

const googleLocation = () => {
    return $.ajax({
        dataType: 'json',
        method: 'POST',
        url: "https://www.googleapis.com/geolocation/v1/geolocate?key=" + process.env.GOOGLE_MAP_KEY,
    }).then((data) => {
        if (!data.location.lat || !data.location.lng) {
            return {
                status: LOCATION_NOTFOUND,
                data: null,
            };
        }

        return {
            status: LOCATION_LOCATED,
            data: {
                accuracy: data.accuracy,
                position: data.location,
                zoom: findZoomLevelByAccuracy(data.accuracy),
            }
        };
    });
};

const geolocation = () => {
    let notFoundResult = {
        status: LOCATION_NOTFOUND,
        data: null,
    };

    if (!navigator.geolocation) {
        return Promise.resolve(notFoundResult);
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            resolve({
                status: LOCATION_LOCATED,
                data: {
                    accuracy: 0,
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    zoom: findZoomLevelByAccuracy(0),
                }
            });
        }, () => {
            resolve(notFoundResult);
        })
    });
};

const createCurrentLocationMarker = (map, info) => {
    return new google.maps.Marker({
        position: info.position,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4285F4",
            fillOpacity: 1,
            scale: 8,
            strokeColor: "#FFFFFF",
            strokeWeight: 1,
        }
    });
}

const createCurrentLocationCircle = (map, info) => {
    return new google.maps.Circle({
        center: info.position,
        radius: info.accuracy,
        map: map,
        options: {
            fillColor: "#4285F4",
            fillOpacity: 0.1,
            strokeColor: "#4285F4",
            strokeOpacity: 0.2
        }
    });
}

export default {
    setIconStatus, locationButtonHtml,
    findZoomLevelByAccuracy, findCurrentLocation,
    createCurrentLocationMarker, createCurrentLocationCircle
}