import {diff} from 'deep-object-diff'
import store from '@/store';
import {getObjectValue} from '@/services/helpers';

class SettingStorage {
    constructor() {
        this.storageKey = 'appsetting';
        this.settings = {};
        this.watchers = [];

        this.load();
        this.emitCommit();
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

    emitCommit () {
        Object.keys(this.settings).map(commit => {
            store.commit(commit, this.settings[commit]);
        });
    }

    registerWatcher (configs = []) {
        configs.map(config => {
            let watcher = store.watch(
                (state) => {
                    if (config.hasOwnProperty('getter')) {
                        return store.getters[config.getter];
                    }

                    return getObjectValue(state, config.stateKey);
                },
                (newValue, oldValue) => {
                    let isEqual = false;

                    if (typeof newValue === "object" && typeof oldValue === "object") {
                        isEqual = Object.keys(diff(oldValue, newValue)).length === 0;
                    } else {
                        isEqual = oldValue === newValue;
                    }

                    !isEqual && this.set(config.commit, newValue);
                },
                { deep: true }
            );

            this.watchers.push(watcher);
        });
    }
}

export default new SettingStorage();