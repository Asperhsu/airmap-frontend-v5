import {detailedDiff} from 'deep-object-diff';

/* gps locate */

let locateIconBlinkInterval;

const setIconStatus = (status) => {
    const $icon = $("#geoLocate .icon-gps");

    if (locateIconBlinkInterval) {
        $icon.removeClass('gps-located gps-unlocate');
        clearInterval(locateIconBlinkInterval);
    }

    if (status == 'searching') {
        locateIconBlinkInterval = setInterval(function () {
            $icon.toggleClass('gps-unlocate');
        }, 500);
        return;
    }

    if (status == 'located') {
        $icon.removeClass('gps-unlocate').addClass('gps-located');
        return;
    }

    if (status == 'notFound') {
        $icon.addClass('gps-unlocate');
        return;
    }
};

export const findZoomLevelByAccuracy = (accuracy) => {
    if (parseFloat(accuracy) <= 0) { return 12; }
    //591657550.500000 / 2^(level-1)
    var level = (Math.log(591657550.500000 / accuracy) / Math.log(2)) + 1;
    return Math.floor(level);
};

export const findCurrentLocation = () => {
    var url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCDRRT8it4AZpwbORhHeqoi2qrWDmQqD48";
    setIconStatus('searching');
    return new Promise((resolve, reject) => {
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: url,
            success: (data) => {
                if (!data.location.lat || !data.location.lng) {
                    setIconStatus('notFound');
                    return resolve(null);
                }

                setIconStatus('located');
                resolve({
                    accuracy: data.accuracy,
                    position: data.location,
                    zoom: findZoomLevelByAccuracy(data.accuracy),
                });
            },
            error: reject,
        });
    });
}


/* marker diff */

export const updateMarkers = (oldMarkers, newMarkers, markerInstances, createCb) => {
    let diff = detailedDiff(oldMarkers, newMarkers);

    // added
    createCb && Object.values(diff.added).map((option) => {
        let marker = createCb(option);
        markerInstances.push(marker);
    });

    // updated
    Object.values(diff.updated).map((option) => {
        markerInstances.map((marker, index) => {
            let position = marker.getPosition();
            if (option.position.lat === position.lat && option.position.lng === position.lng) {
                marker.setOptions(option);
            }
        });
    });

    // deleted
    let deleted = Object.values(diff.deleted);
    if (deleted.length) {
        deleted.map((option) => {
            markerInstances.map((marker, index) => {
                let position = marker.getPosition();
                if (option.position.lat === position.lat && option.position.lng === position.lng) {
                    marker.setMap(null);
                    markerInstances[index] = null;
                }
            });
        });

        markerInstances = markerInstances.filter((marker) => {
            return marker !== null;
        });
    }

    return markerInstances;
}
