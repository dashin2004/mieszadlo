'use strict';
define([
    'widgets/brease/common/AlarmUtils/AlarmStateParser'
], function (AlarmStateParser) {

    /**
    * @class widgets.brease.common.AlarmUtils.UtilsAlarm
    * @extends core.javascript.Object
    */

    class UtilsAlarm {
        static comparativeValue(id) {
            return COMPARATIVE_VALUE[id];
        }
        static comparativeValueToString(comparativeValue) {
            return COMPVALTOSTRING[comparativeValue];
        }
    
        /**
         * @method compareStates
         * For operators == and != we use the flags "active","acknowledged" and "confirmed", for all other operators we use the state value "sta".
         * "Contains" and "Does not contain" always return false.
         * Default return value is true. (e.g. for wrong operators)
         * @private
         * @param {Object} origVal
         * @param {Integer} origVal.sta original state value in currentData
         * @param {Boolean} origVal.active flag for active state
         * @param {Boolean} origVal.acknowledged flag for acknowledged state
         * @param {Boolean} origVal.confirmed flag for confirmed state
         * @param {Integer} op operator value. Could either be (!= [0], == [1], < [2], <= [3], > [4], >= [5], Contains [6], Does not contain [7])
         * @param {String} compVal The comparative value. '1':'active', '2':'active acknowledged', '3':'inactive', '10':'active unconfirmed'
         * @return {Boolean}
         */
        static compareStates(origVal, op, compVal) {
            let result;
            let intCompVal = parseInt(compVal, 10); 
            switch (compVal) {
                case COMPARATIVE_VALUE['act']: // active
                    result = compareAct(origVal, op, intCompVal);
                    break;
                case COMPARATIVE_VALUE['actack']: // active, acknowledged
                    result = compareActack(origVal, op, intCompVal);
                    break;
                case COMPARATIVE_VALUE['inact']: // inactive
                    result = compareInact(origVal, op, intCompVal);
                    break;
                case COMPARATIVE_VALUE['inactack']: // inactive, acknowledged
                    result = compareInactack(origVal, op, intCompVal);
                    break;
                case COMPARATIVE_VALUE['actunconf']: // active, unconfirmed
                    result = compareActunconf(origVal, op, intCompVal);
                    break;
                case COMPARATIVE_VALUE['actconf']: // active, confirmed
                    result = compareActconf(origVal, op, intCompVal);
                    break;
                case COMPARATIVE_VALUE['inactconf']: // inactive, confirmed
                    result = compareInactconf(origVal, op, intCompVal);
                    break;
                default:
                    result = true;
            }
            return result;
        }
        
        /**
         * @method getNestedFilterStatement
         * @param {UInteger} compVal 0=active, 1=inactive
         * @param {UInteger} sta
         * @return {Boolean}
         */
        static getNestedFilterStatement(compVal, sta) {
            if (isNaN(sta)) { return false; }
            if (isNaN(compVal)) { return false; }
            let flags = AlarmStateParser.stateToFlags(sta);
            if (compVal === 0 && flags.active === true) {
                return true;
            } else if (compVal === 1 && flags.active === false) {
                return true;
            }
            return false;
        }
    
    }

    const COMPARATIVE_VALUE = {
        'act': '1',
        'actack': '2',
        'inact': '3',
        'inactack': '4',
        'any': '5',
        'actunconf': '10',
        'actconf': '12',
        'inactconf': '13'
    };

    const COMPVALTOSTRING = {
        '1': 'active',
        '2': 'active acknowledged',
        '3': 'inactive',
        '4': 'inactive acknowledged',
        '5': 'any',
        '10': 'active unconfirmed',
        '12': 'active confirmed',
        '13': 'inactive confirmed'
    };

    function compareAct(origVal, op, intCompVal) {
        if (op === 0) { // !=
            return (origVal.active !== true);
        } else if (op === 1) { // ==
            return (origVal.active === true);
        } else {
            return compareValues(origVal.sta, op, intCompVal);
        }
    }

    function compareActack(origVal, op, intCompVal) {
        if (op === 0) {
            return (origVal.active !== true || origVal.acknowledged !== true);
        } else if (op === 1) { // ==
            return (origVal.active === true && origVal.acknowledged === true);
        } else {
            return compareValues(origVal.sta, op, intCompVal);
        }
    }

    function compareInact(origVal, op, intCompVal) {
        if (op === 0) { // !=
            return (origVal.active !== false);
        } else if (op === 1) { // ==
            return (origVal.active === false);
        } else {
            return compareValues(origVal.sta, op, intCompVal);
        }
    }

    function compareInactack(origVal, op, intCompVal) {
        if (op === 0) { // !=
            return (origVal.active !== false || origVal.acknowledged !== true);
        } else if (op === 1) { // ==
            return (origVal.active === false && origVal.acknowledged === true);
        } else {
            return compareValues(origVal.sta, op, intCompVal);
        }
    }

    function compareActunconf(origVal, op, intCompVal) {
        if (op === 0) { // !=
            return (origVal.active !== true || origVal.confirmed !== false);
        } else if (op === 1) { // ==
            return (origVal.active === true && origVal.confirmed === false);
        } else {
            return compareValues(origVal.sta, op, intCompVal);
        }
    }

    function compareActconf(origVal, op, intCompVal) {
        if (op === 0) { // !=
            return (origVal.active !== true || origVal.confirmed !== true);
        } else if (op === 1) { // ==
            return (origVal.active === true && origVal.confirmed === true);
        } else {
            return compareValues(origVal.sta, op, intCompVal);
        }
    }

    function compareInactconf(origVal, op, intCompVal) {
        if (op === 0) { // !=
            return (origVal.active !== false || origVal.confirmed !== true);
        } else if (op === 1) { // ==
            return (origVal.active === false && origVal.confirmed === true);
        } else {
            return compareValues(origVal.sta, op, intCompVal);
        }
    }

    function compareValues(v1, op, v2) {
        let result;
        switch (op) {
            case 2:
                result = (v1 < v2);
                break;
            case 3:
                result = (v1 <= v2);
                break;
            case 4:
                result = (v1 > v2);
                break;
            case 5:
                result = (v1 >= v2);
                break;
            case 6:
                result = false;
                break;
            case 7:
                result = false;
                break;
            default:
                result = true;
        }
        return result;
    }
    
    return UtilsAlarm;

});
