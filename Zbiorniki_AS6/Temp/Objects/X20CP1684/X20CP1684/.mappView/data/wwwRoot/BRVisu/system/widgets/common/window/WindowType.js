define(['brease/core/Utils'], function (Utils) {

    'use strict';

    /** 
    * @enum {String} system.widgets.common.window.WindowType
    */
    /** 
    * @property {String} DIALOGWINDOW='DialogWindow'
    */
    /** 
    * @property {String} MESSAGEBOX='MessageBox'
    */
    /** 
    * @property {String} KEYBOARD='KeyBoard'
    */
    /** 
    * @property {String} NUMPAD='NumPad'
    */
    /** 
    * @property {String} DATETIMEPICKER='DateTimePicker'
    */
    /** 
    * @property {String} CHANGEPASSWORDDIALOG='ChangePasswordDialog'
    */
    /** 
    * @property {String} GENERICDIALOG='GenericDialog'
    */

    const Types = {};

    Utils.defineProperty(Types, 'DIALOGWINDOW', 'DialogWindow');
    Utils.defineProperty(Types, 'MESSAGEBOX', 'MessageBox');
    Utils.defineProperty(Types, 'KEYBOARD', 'KeyBoard');
    Utils.defineProperty(Types, 'NUMPAD', 'NumPad');
    Utils.defineProperty(Types, 'DATETIMEPICKER', 'DateTimePicker');
    Utils.defineProperty(Types, 'CHANGEPASSWORDDIALOG', 'ChangePasswordDialog');
    Utils.defineProperty(Types, 'GENERICDIALOG', 'GenericDialog');

    return Types;
});
