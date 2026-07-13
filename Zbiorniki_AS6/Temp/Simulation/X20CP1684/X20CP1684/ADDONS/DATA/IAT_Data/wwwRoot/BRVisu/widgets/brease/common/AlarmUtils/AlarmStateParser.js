
'use strict';
define(function () {

    /** 
     * @class widgets.brease.common.AlarmUtils.AlarmStateParser
     * Class for parsing the sta property of an Alarm into sperate bits in 
    * order to map it to an image path
    */
    class AlarmStateParser {
        /**
         * @method parseState
         * parses the alarm state from the server. removes confirm information
         * if confirmable = false
         * @param {Number} sta the actual alarm state from the server
         * @returns {Number} 
         */
        static parseState(sta) {
            if (this.isConfirmable(sta) === true) {
                return sta;
            } else {
                return sta & 3;
            }
        }
        /**
         * @method isConfirmable
         * returns true if the alarm is confirmable
         * @param {Number} sta the actual alarm state from the server
         * @returns {Boolean} 
         */
        static isConfirmable(sta) {
            return (sta & 8) > 0;
        }
        /**
         * @method toLegacyState
         * parses the alarm state from the server to the legacy state compatible with mv 5.x
         * @param {Number} sta the actual alarm state from the server
         * @returns {Number} 
         */
        static toLegacyState(sta) {
            let state = sta & 3;
            if (state === 2 || state === 0) {
                state = 3;
            } else if (state === 3) {
                state = 2;
            }
            return state;
        }
        /**
         * @method stateToFlags
         * parses the alarm state from the server to an object containing flags of the state
         * @param {Number} sta the actual alarm state from the server
         * @returns {Object} 
         * @returns {Boolean} return.active
         * @returns {Boolean} return.acknowledged
         * @returns {Boolean} return.confirmed
         * @returns {Boolean} return.confirmable
         */
        static stateToFlags(sta) {
            return {
                active: (sta & 1) > 0,
                acknowledged: (sta & 2) > 0,
                confirmed: (sta & 4) > 0,
                confirmable: (sta & 8) > 0
            };
        }
        /**
         * @method imagePathFromState
         * maps boolean flags to an alarm state in order to retrieve an image
         * @param {Number} sta
         * @param {Object} settings widget settings containing custom image paths
         * @param {Object} defaultImagePaths a map object containing the default paths if none
         * is defined in the widget settings
         * @param {Object} alarmStatePropMap a map object which maps an alarm state to a widget property
         * @returns {ImagePath}
         */
        static imagePathFromState(sta, settings, defaultImagePaths, alarmStatePropMap) {
            let parsedState = this.parseState(sta);
            let propName = alarmStatePropMap.get(parsedState);
            let imageFromSettings = _imagePathFromSettings(settings, propName);
            let imagePath = '';
            if (imageFromSettings) {
                imagePath = imageFromSettings;
            } else if (defaultImagePaths.has(propName)) {
                imagePath = defaultImagePaths.get(propName);
            }
            return imagePath;
        }
    }

    function _imagePathFromSettings(settings, propName) {
        let imagePath = '';
        if (settings && settings.hasOwnProperty(propName)) {
            imagePath = settings[propName];
        }
        return imagePath;
    }

    return AlarmStateParser;

});
