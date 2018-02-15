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

    emitCommit () {

    }

    registerWatcher (configs = []) {
        configs.map(config => {
            let watcher = store.watch(
                (state) => {
                    return getObjectValue(state, config.stateKey);
                },
                (oldValue, newValue) => {
                    this.set(config.commit, newValue);
                    console.log(`set ${config.commit}`);
                },
                { deep: true }
            );

            this.watchers.push(watcher);
        });
    }
}

export default new SettingStorage();