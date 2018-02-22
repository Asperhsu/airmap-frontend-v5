import CanvasLayer from '@/services/vendor/CanvasLayer';
import Windy from '@/services/vendor/windy';
import {debounce} from '@/services/helpers';

let defaultOptions = {
    divId: 'wind-overlay',
    fillOpacity: 0.6, // range: 0 ~ 1
    moveSpeed: 1,   // range: 1 ~ 10
    callbacks: {
        beforeRedraw: () => {},
        afterRedraw: () => {},
    }
};

export default class WindLayer {
    constructor (opts) {
        this._opts = $.extend({}, defaultOptions, opts);

        // dom
        this._divId = this._opts.divId;
        this._map = this._opts.map;

        // wind property
        this._windy = null;
        this._canvasLayer = null;
        this._fillOpacity = this._opts.fillOpacity;
        this._moveSpeed = this._opts.moveSpeed;

        // gfs data
        this._gfs = null;

        // instance state
        this._redrawDelayTimer = null;
        this._isInit = false;
        this._isLayerEnable = false;

        if (!this._map) {
            console.log('wind layer: need google map instance'); return;
        }

        this.bindEvents();
    }

    get enable() { return this._isLayerEnable; }
    set enable(flag) {
        this._isLayerEnable = !!flag;
        this._isLayerEnable ? this.start() : this.stop();
    }

    get fillOpacity() { return this._fillOpacity; }
    set fillOpacity(opacity) {
        if (opacity) { this._fillOpacity = opacity; }

        if (this._windy) {
            this._windy.setFillOpacity(this._fillOpacity);
            return true;
        }

        return false;
    }

    get moveSpeed() { return Math.log(this._moveSpeed) / Math.log(2) +1; }
    set moveSpeed (speed) {
        if (speed && speed > 0) { this._moveSpeed = Math.pow(2, speed - 1); }

        if (this._windy) {
            this._windy.setMovingSpeed(this._moveSpeed);
            this._windy.params.moveSpeed = this._moveSpeed;
            return true;
        }

        return false;
    }

    get gfs() { return this._gfs; }
    set gfs(data) { this._gfs = data; }
    get gfsPublishAt() {
        try {
            return this._gfs[0]['header']['refTime'];
        } catch(err) {}
        return null;
    }

    bindEvents () {
        // when move map, clean old wind lines
        google.maps.event.addListenerOnce(this._map, 'bounds_changed', () => {
            this.clear();
        });

        // change move speed for map zoom level
        google.maps.event.addListenerOnce(this._map, 'zoom_changed', () => {
            let zoom = this._map.getZoom();

			if( zoom <= 7 ){ this.moveSpeed = 1; return; }
			if( zoom <= 8 ){ this.moveSpeed = 2; return; }
			if( zoom <= 10 ){ this.moveSpeed = 3; return; }
			if( zoom <= 11 ){ this.moveSpeed = 4; return; }
			if( zoom <= 12 ){ this.moveSpeed = 5; return; }
			if( zoom <= 14 ){ this.moveSpeed = 6; return; }
			if( zoom <= 15 ){ this.moveSpeed = 7; return; }
			if( zoom <= 16 ){ this.moveSpeed = 8; return; }
			if( zoom <= 17 ){ this.moveSpeed = 9; return; }
			if( zoom >= 17 ){ this.moveSpeed = 10; return; }
        });
    }

    initCanvasLayer () {
        if (!this._canvasLayer) {
            this._canvasLayer = new CanvasLayer({
                map: this._map,
                animate: false,
                updateHandler: debounce(() => {
                    this.redraw();
                }, 500),
            });
        }

        return this._canvasLayer;
    }

    redraw () {
        if (!this._isLayerEnable || !this._windy) { return; }
        if( this._redrawDelayTimer ){ clearTimeout(this._redrawDelayTimer); }

        this._opts.callbacks.beforeRedraw();

        let $mapElement = $(this._map.getDiv());
        let bounds = this._map.getBounds();
        let mapElementWidth = $mapElement.width();
        let mapElementHeight = $mapElement.height();

        // set default
        this.fillOpacity = null;
        this.moveSpeed = null;

        this._windy.start(
            [
                [0,0],
                [mapElementWidth, mapElementHeight]
            ],
            mapElementWidth, mapElementHeight,
            [
                [bounds.getSouthWest().lng(), bounds.getSouthWest().lat() ],
                [bounds.getNorthEast().lng(), bounds.getNorthEast().lat() ]
            ]
        );

        this._opts.callbacks.afterRedraw();
    }

    init () {
        if (this._isInit) { console.log('wind layer: already init'); return; }
        if (!this._gfs) { console.log('wind layer: require gfs data'); return; }

        this.initCanvasLayer();
        this._windy = new Windy({canvas: this._canvasLayer.canvas, data: this._gfs});
        this._isInit = true;
    }

    start () {
        if (this._map.getZoom() <= 4){ return; }

        this._isInit ? this.redraw() : this.init();
    }

    stop () {
        this._isInit = false;
        this.clear();
    }

    clear () {
        if (this._windy) {
            this._windy.stop();

			this._canvasLayer.canvas.getContext('2d').clearRect(0, 0, 3000, 3000);
        }
    }

}