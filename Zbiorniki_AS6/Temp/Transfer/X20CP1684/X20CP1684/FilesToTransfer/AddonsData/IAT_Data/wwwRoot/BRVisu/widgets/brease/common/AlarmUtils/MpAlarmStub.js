'use strict';
define(['brease'], function ({ callWidget, events: { BreaseEvent } }) {
    // helper to extract method arguments from mplink telegrams
    const MethodArguments = {
        SetConfirm(parameters) {
            return [parameters?.ins];
        }
    };
    /** 
    * @class widgets.brease.common.AlarmUtils.MpAlarmStub
    * stub for the MpAlarm interface
    */
    class MpAlarmStub extends EventTarget {
        #alarmList;
        #widgetId;
        #boundAttributeChanged;
        constructor(widgetId, alarmList = []) {
            super();
            this.#alarmList = Array.isArray(alarmList) ? alarmList : [];
            this.#widgetId = widgetId;
            this.#boundAttributeChanged = this.onAttributeChanged.bind(this);
            document.body.addEventListener(BreaseEvent.ATTRIBUTE_CHANGE, this.#boundAttributeChanged, true);
        }
        // call the set mplink method with data
        #callWidget(data) {
            callWidget(this.widgetId, 'setMpLink', data);
        }
        // activeates the stub
        activate() {
            this.#callWidget({ 'data': null, 'methodID': 'GetActiveState', 'response': this.GetAtiveState() });
        }
        // set mocked data for the current list
        setAlarmList(value = []) {
            this.#alarmList = value;
        }
        get widgetId() {
            return this.#widgetId;
        }
        // used internally to communicate with the mpLink property of the widget instance
        onAttributeChanged(e) {
            if (e?.target?.id === this.widgetId) {
                let message = e?.detail?.mpLink;
                let methodID = message?.methodID;
                if (typeof this[methodID] === 'function') {
                    let request = message?.request;
                    switch (request) {
                        case 'Set':
                            if (MethodArguments.hasOwnProperty(methodID)) {
                                let args = MethodArguments[methodID](message?.parameter);
                                this[methodID](...args);
                            } else {
                                this[methodID]();
                            }
                            this.#callWidget({ 'data': null, 'methodID': methodID, parameter: { widgetId: this.widgetId }, 'response': 'OK' });
                            break;
                        case 'Get':
                            this.#callWidget({ 'data': this[methodID](), 'methodID': methodID, parameter: { widgetId: this.widgetId }, 'response': 'Data' });
                            break;
                        default:
                            this[methodID]();
                    }
                }
            }
        }
        // used internally to dispose the class
        dispose() {
            document.body.removeEventListener(BreaseEvent.ATTRIBUTE_CHANGED, this.#boundAttributeChanged, true);
            this.#widgetId = null;
        }
        /**
        * @method GetAtiveState
        * returns OK if connection is established
        * @returns {String} state 
        */
        GetAtiveState() {
            return 'OK';
        }
        /**
        * @method GetUpdateCount
        * returns the current value of the alarm-list update counter (this counter is increased whenever the alarm-list is changed in some way). This method can be subscribed by the widget to detect changes and upload the alarm-list when necessary.
        * @returns {Number} update count 
        */
        GetUpdateCount() {
            return 0;
        }
        /**
        * @method GetAlarmList
        * returns the AlarmList
        * @returns {Object[]}
        * @returns {Number} return.ins Alarm-Session ID
        * @returns {String} return.nam Alarm-Session name
        * @returns {String} return.sco Scope of alarm-session
        * @returns {String} return.mes Localized alarm-message
        * @returns {String} return.ad1 Localized additonal information (#1)
        * @returns {String} return.ad2 Localized additonal information (#2)
        * @returns {Number} return.cod Alarm Code
        * @returns {Number} return.sev Alarm Severity
        * @returns {String} return.cat Alarm Category
        * @returns {Number} return.sta Alarm State 
        * Current situation in mapp 5.x 
        * 0 ... Inaktiv und nicht acknowledged (sollte nie auftreten)
        * 1 ... Active / NotAcknowledged
        * 2 .... Active / Acknowledged
        * 3 ... Inactive / Acknowledged
        * 
        * Bit-coded alarm-state
        * 
        * Bit0: Active-State (0=inactive, 1=active)
        * Bit1: Acknowledge-State (0=unacknowledged, 1=acknowledged)
        * Bit2: Confirmed-State (0=unconfirmed, 1=confirmed)
        * Bit3: Confirm required (0=not required, 1=required). Indicates that the Confirm-state is supported (if not that the Confirmed-State/Bit2 is always true)
        */
        GetAlarmList() {
            return this.#alarmList;
        }
        /**
        * @method GetCategoryList
        * returns a list of possible alarm-categories
        * @returns {String[]}
        */
        GetCategoryList() {
            return [];
        }
        /**
        * @method SetAcknowledge
        * Acknowledges the given alarm-session.
        * @param {Number} inst Alarm-Session ID
        */
        SetAcknowledge() {

        }
        /**
        * @method SetAcknowledgeAll
        * Acknowledges all pending alarms
        */
        SetAcknowledgeAll() {

        }
        /**
        * @method SetConfirm
        * confirms an Alarm by its alarm session id
        * @param {Number} inst Alarm-Session ID
        */
        SetConfirm() {

        }
    }

    return MpAlarmStub;

});
