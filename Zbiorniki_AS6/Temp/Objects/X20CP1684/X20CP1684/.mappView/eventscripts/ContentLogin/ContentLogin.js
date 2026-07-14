define(function () {
    function initEventBinding(widgets, opcua, opcuaSystem, variables, timers, clientSystem) {
        widgets.Login1.loginSuccess(e => {
    clientSystem.closeDialog(`LoginDialog`);
});

    }
    return initEventBinding;
});