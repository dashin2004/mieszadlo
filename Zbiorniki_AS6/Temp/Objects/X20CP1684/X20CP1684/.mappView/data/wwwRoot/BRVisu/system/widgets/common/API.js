define([
    './keyboards/LayoutSelector',
    './keyboards/FocusUtils',
    './keyboards/AutoSize',
    './keyboards/KeyboardType',
    './keyboards/KeyCollector',
    './keyboards/InputProcessor',
    './keyboards/InputValidator',
    './keyboards/FocusManager',
    './keyboards/Composer',
    './keyboards/Converter',
    './keyboards/external/dictionaries',
    './changePassword/Validator',
    './window/WindowType'
], function (LayoutSelector, FocusUtils, AutoSize, KeyboardType, KeyCollector, InputProcessor, InputValidator, FocusManager, Composer, Converter, dictionaries, Validator, WindowType) {

    'use strict';

    return {
        keyboards: {
            LayoutSelector,
            FocusUtils,
            AutoSize,
            KeyboardType,
            KeyCollector,
            InputProcessor,
            InputValidator,
            FocusManager,
            Composer,
            Converter,
            // do we really have to expose this?
            external: {
                dictionaries
            }
        },
        changePassword: {
            Validator
        },
        window: {
            WindowType
        }
    };
});
