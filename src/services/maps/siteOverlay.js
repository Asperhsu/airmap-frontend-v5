const getGoogleClass = () => {
    return typeof google !== 'undefined' ? google.maps.OverlayView : function noop() {};
};

let defaultOptions = {
    divId: 'site-overlay',
};

export default class SiteOverlay extends getGoogleClass() {
    constructor(opts) {
        super(opts);
        if (typeof google === 'undefined') {
            console.warn('SiteOverlay: Google Maps is not defined!'); //eslint-disable-line
            return;
        }

        this._opts = Object.assign({}, defaultOptions, opts);
        this._map = this._opts.map;
        this._divId = this._opts.divId;
    }

    onAdd () {
        let div = document.createElement('div');
        div.id = this._divId;
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        this._div = div;

        // Add the element to the "overlayLayer" pane.
        let panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
    }

    onRemove () {
        this._div.parentNode.removeChild(this._div);
	    this._div = null;
    }

    draw () {
        let overlayProjection = this.getProjection();
        let sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
        let ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        let div = this._div;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
    }

    googleMapProjection (lat, lng) {
        let overlayProjection = this.getProjection();
        let googleCoordinates = new google.maps.LatLng(lat, lng);
        return overlayProjection.fromLatLngToDivPixel(googleCoordinates);
    }
}