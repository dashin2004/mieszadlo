'use strict';
define(function () {
    // Maps an AlarmState to a widget property
    const AlarmStatePropMap = new Map();
    AlarmStatePropMap.set(0, 'imageInactive');
    AlarmStatePropMap.set(1, 'imageActive');
    AlarmStatePropMap.set(2, 'imageInactive');
    AlarmStatePropMap.set(3, 'imageActiveAcknowledged');
    // state 4-7 falls back to 0-3
    AlarmStatePropMap.set(8, 'imageInactiveUnconfirmed');
    AlarmStatePropMap.set(9, 'imageActiveUnconfirmed');
    AlarmStatePropMap.set(10, 'imageInactiveAcknowledgedUnconfirmed');
    AlarmStatePropMap.set(11, 'imageActiveAcknowledgedUnconfirmed');
    AlarmStatePropMap.set(12, 'imageInactiveConfirmed');
    AlarmStatePropMap.set(13, 'imageActiveConfirmed');
    AlarmStatePropMap.set(14, 'imageInactiveAcknowledgedConfirmed');
    AlarmStatePropMap.set(15, 'imageActiveAcknowledgedConfirmed');
    
    return AlarmStatePropMap;
});
