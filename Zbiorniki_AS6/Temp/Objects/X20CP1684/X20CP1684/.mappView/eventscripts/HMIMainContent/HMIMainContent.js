define(function () {
    function initEventBinding(widgets, opcua, opcuaSystem, variables, timers, clientSystem) {
        widgets.ButtonStart.click(e => {
    opcua('::Tanks:Start').toggleValueBool();
});
widgets.Button2.click(e => {
    opcua('::Tanks:StopBtn').toggleValueBool();
});
widgets.ToggleSwitch1.click(e => {
    opcua('::Tanks:TrybPracy').toggleValueBool();
});
widgets.Zb1ZaworButton.click(e => {
    opcua('::Tanks:Zb1_zawor_view').toggleValueBool();
});
widgets.Zb2ZaworButton.click(e => {
    opcua('::Tanks:Zb2_zawor_view').toggleValueBool();
});
widgets.Button4.click(e => {
    opcua('::Tanks:Zb3_zawor_glowny_view').toggleValueBool();
});
widgets.MieszanieButton.click(e => {
    opcua('::Tanks:MieszanieBtn').toggleValueBool();
});

    }
    return initEventBinding;
});