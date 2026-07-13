define([
    'system/widgets/Window/Window',
    'brease/services/RuntimeService',
    'brease/events/BreaseEvent',
    'brease/controller/UIController',
    'brease/controller/libs/InternalDispatcher'
], function (SuperClass, runtimeService, BreaseEvent, uiController, internalDispatcher) {

    'use strict';

    /**
    * @class system.widgets.Login
    * @abstract
    * @extends system.widgets.Window
    *
    * @iatMeta studio:visible
    * false
    * @iatMeta category:Category
    * System
    */

    var defaultSettings = {},
        WidgetClass = SuperClass.extend(function (elem, options, deferredInit) {
            SuperClass.call(this, elem, options, deferredInit, true);
        }, defaultSettings),
        p = WidgetClass.prototype;

    p.registerClientLogin = function (visuId, credentials) {
        runtimeService.registerClientLogin(visuId, credentials, this._bind('registerClientResponse'));
    };

    p.registerClientResponse = function () {
        
    };

    p.dispatchSuccess = function (ClientId) {
        internalDispatcher.dispatchEvent(new CustomEvent(BreaseEvent.SYSTEM_LOGIN, { detail: { ClientId: ClientId } }));
    };
    p.dispatchPasswordExpired = function (userName, passwordPolicy) {
        internalDispatcher.dispatchEvent(new CustomEvent(BreaseEvent.SYSTEM_LOGIN_PASSWORD_EXPIRED, { detail: { userName: userName, policies: passwordPolicy } }));
    };
    p.dispose = function () {
        uiController.walkWidgets(this.elem, false, 'onBeforeDispose');
        uiController.dispose(this.elem, false);
        SuperClass.prototype.dispose.call(this);
    };

    return WidgetClass;
});
