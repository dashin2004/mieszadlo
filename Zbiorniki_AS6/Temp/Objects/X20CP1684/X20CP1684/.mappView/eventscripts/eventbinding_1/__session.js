define(function () {
    function initEventBinding(opcua, opcuaSystem, variables, timers, clientSystem) {
        variables.Zb1_zawor.valueChanged(e => {
    if (e.detail.newValue===true) {
                        variables.Zb1_increase.setValueNumber(100);
                    }
if (e.detail.newValue===false) {
                        variables.Zb1_increase.setValueNumber(0);
                    }
});
variables.ClockSignal.valueChanged(e => {
    Promise.all([variables.Zb3_zawor_lewy.getValue(), variables.Zb1_poziom.getValue(), variables.Zb3_poziom.getValue(), variables.Zawory_dwustanowe.getValue()]).then(o => {
        if (e.detail.newValue===true && o[1] > 0 && o[3]===true && o[0] > 0 && o[2] < 10000) {
                        variables.Zb1_decrease.setValueNumber(100);
                    }
if (e.detail.newValue===true && o[1] > 0 && o[3]===true && (o[0] <= 0 || o[2] > 10000)) {
                        variables.Zb1_decrease.setValueNumber(0);
                    }
if (e.detail.newValue===true && o[1] > 0 && o[3]===false && o[0] > 0 && o[2] < 10000) {
                        variables.Zb1_decrease.setValueNumber(o[0]);
                    }
if (e.detail.newValue===true && o[1] > 0 && o[3]===false && (o[0] <= 0 || o[2] > 10000)) {
                        variables.Zb1_decrease.setValueNumber(0);
                    }
if (e.detail.newValue===true && o[1] <= 0) {
                        variables.Zb1_decrease.setValueNumber(0);
                    }
});
});
variables.ClockSignal.valueChanged(e => {
    Promise.all([variables.Zb1_change.getValue()]).then(o => {
        if (e.detail.newValue===true) {
                        variables.Zb1_poziom.addValue(o[0]);
                    }
});
});
variables.Zb2_zawor.valueChanged(e => {
    if (e.detail.newValue===true) {
                        variables.Zb2_increase.setValueNumber(100);
                    }
if (e.detail.newValue===false) {
                        variables.Zb2_increase.setValueNumber(0);
                    }
});
variables.ClockSignal.valueChanged(e => {
    Promise.all([variables.Zb3_zawor_prawy.getValue(), variables.Zb2_poziom.getValue(), variables.Zb3_poziom.getValue(), variables.Zawory_dwustanowe.getValue()]).then(o => {
        if (e.detail.newValue===true && o[1] > 0 && o[3]===true && o[0] > 0 && o[2] < 10000 ) {
                        variables.Zb2_decrease.setValueNumber(100);
                    }
if (e.detail.newValue===true && o[1] > 0 && o[3]===true && (o[0] <= 0 || o[2] > 10000)) {
                        variables.Zb2_decrease.setValueNumber(0);
                    }
if (e.detail.newValue===true && o[1] > 0 && o[3]===false && o[0] > 0 && o[2] < 10000) {
                        variables.Zb2_decrease.setValueNumber(o[0]);
                    }
if (e.detail.newValue===true && o[1] > 0 && o[3]===false && (o[0] <= 0 || o[2] > 10000)) {
                        variables.Zb2_decrease.setValueNumber(0);
                    }
if (e.detail.newValue===true && o[1] <= 0 ) {
                        variables.Zb2_decrease.setValueNumber(0);
                    }
});
});
variables.ClockSignal.valueChanged(e => {
    Promise.all([variables.Zb2_change.getValue()]).then(o => {
        if (e.detail.newValue===true) {
                        variables.Zb2_poziom.addValue(o[0]);
                    }
});
});
variables.Zb3_zawor.valueChanged(e => {
    if (e.detail.newValue===true) {
                        variables.Zb3_decrease.setValueNumber(100);
                    }
if (e.detail.newValue===false) {
                        variables.Zb3_decrease.setValueNumber(0);
                    }
});
variables.ClockSignal.valueChanged(e => {
    Promise.all([variables.Zb3_change.getValue(), variables.Zawory_dwustanowe.getValue(), variables.Zb3_zawor_lewy.getValue(), variables.Zb3_zawor_prawy.getValue(), variables.Zb3_poziom.getValue()]).then(o => {
        if (e.detail.newValue===true && o[4] <= 10000) {
                        variables.Zb3_poziom.addValue(o[0]);
                    }
});
});
variables.Zb1_poziom.valueChanged(e => {
    if (e.detail.newValue < 0) {
                        variables.Zb1_poziom.setValueNumber(0);
                    }
if (e.detail.newValue > 10000) {
                        variables.Zb1_poziom.setValueNumber(10000);
                    }
});
variables.Zb2_poziom.valueChanged(e => {
    if (e.detail.newValue < 0) {
                        variables.Zb2_poziom.setValueNumber(0);
                    }
if (e.detail.newValue > 10000) {
                        variables.Zb2_poziom.setValueNumber(10000);
                    }
});
variables.Zb3_poziom.valueChanged(e => {
    if (e.detail.newValue < 0) {
                        variables.Zb3_poziom.setValueNumber(0);
                    }
if (e.detail.newValue > 10000) {
                        variables.Zb3_poziom.setValueNumber(10000);
                    }
});
variables.Zb3_zawor_lewy.valueChanged(e => {
    if (e.detail.newValue < 0) {
                        variables.Zb3_zawor_lewy.setValueNumber(0);
                    }
if (e.detail.newValue > 100) {
                        variables.Zb3_zawor_lewy.setValueNumber(100);
                    }
});
variables.Zb3_zawor_prawy.valueChanged(e => {
    if (e.detail.newValue < 0) {
                        variables.Zb3_zawor_prawy.setValueNumber(0);
                    }
if (e.detail.newValue > 100) {
                        variables.Zb3_zawor_prawy.setValueNumber(100);
                    }
});
variables.Zawory_dwustanowe.valueChanged(e => {
    variables.Zb3_zawor_lewy.setValueNumber(0);
});
variables.Zawory_dwustanowe.valueChanged(e => {
    variables.Zb3_zawor_prawy.setValueNumber(0);
});

    }
    return initEventBinding;
});