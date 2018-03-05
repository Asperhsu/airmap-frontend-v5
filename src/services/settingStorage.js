import {diff} from 'deep-object-diff'
import store from '@/store';

class SettingStorage {
    constructor() {
        this.storageKey = 'appsetting';
        this.settings = {};
        this.watchers = [];

        this.load();
    }

    load () {
        let value = window.localStorage.getItem(this.storageKey);
        if (value === null) { return; }

        this.settings = JSON.parse(value);
    }

    save () {
        let value = JSON.stringify(this.settings);
        window.localStorage.setItem(this.storageKey, value);
    }

    get (key) {
        if (!key) { return this.settings; }

        return this.settings.hasOwnProperty(key)
                ? this.settings[key]
                : null;
    }

    set (key, value, save=true) {
        if (key && typeof key === 'object' && typeof value === 'undefined') {
            let values = key;
            Object.keys(values).map(key => {
                let value = values[key];
                this.settings[key] = value;
            });
        } else {
            this.settings[key] = value;
        }

        save && this.save();
    }

    clear () {
        this.settings = {};
        window.localStorage.removeItem(this.storageKey);
    }
}

export default new SettingStorage();