define(function () {
    function initEventBinding(widgets, opcua, opcuaSystem, variables, timers, clientSystem) {
        widgets.LoginImage.click(e => {
    clientSystem.openDialog(`LoginDialog`, undefined, undefined, undefined, `Log in`);
});
widgets.LogoutButton.click(e => {
    clientSystem.logout();
});

    }
    return initEventBinding;
});