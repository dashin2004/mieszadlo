define(['brease/config'], function (breaseConfig) {
    'use strict';

    var dictionaries = new Map();

    function _load(mode) {
        return new Promise(function (resolve) {
            var _mode = mode.replace('-', '_');
            // this promise may take some time
            let dictPromise = import(`./dict_${_mode}`).then(module => module.default);
            // this will resolve instant => eager = already bundled with main bundle
            import(/* webpackMode: "eager" */ `./cdict_${_mode}`).then(async ({ default: cdict }) => {
                if (_hasCustomDictionaries()) {
                    cdict.load().then(async function (entries) {
                        let dict = await dictPromise;
                        dictionaries.set(mode, Array.isArray(entries) ? entries.concat(dict) : dict);
                        resolve();
                    });
                } else {
                    let dict = await dictPromise;
                    dictionaries.set(mode, dict);
                    resolve();
                }
            });

        });
    }
    function _hasCustomDictionaries() {
        return breaseConfig.virtualKeyboards && breaseConfig.virtualKeyboards.CustomDictionaries;
    }
    return {
        get: function (value) {
            return dictionaries.get(value);
        },
        has: function (value) {
            return dictionaries.has(value);
        },
        load: function (mode) {
            return new Promise(function (resolve) {
                if (mode !== 'disabled') {
                    _load(mode).then(resolve);
                } else {
                    resolve();
                }
            });
            
        },
        MAX_FREQUENCY: 400,
        MIN_FREQUENCY: 0
    };
});
