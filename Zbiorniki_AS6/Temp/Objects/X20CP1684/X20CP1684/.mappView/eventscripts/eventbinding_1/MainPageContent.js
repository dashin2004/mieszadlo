define(function () {
    function initEventBinding(widgets, opcua, opcuaSystem, variables, timers, clientSystem) {
        variables.ClockSignal.valueChanged(e => {
    Promise.all([variables.Zb1_zawor.getValue()]).then(o => {
        if (o[0]===true) {
                        widgets.ProgressBarTank1Top1.setValue(1);
widgets.ProgressBarTank1Top2.setValue(1);
widgets.ProgressBarTank1Inside.setVisible(true);

                    }
if (o[0]===false) {
                        widgets.ProgressBarTank1Top1.setValue(0);
widgets.ProgressBarTank1Top2.setValue(0);
widgets.ProgressBarTank1Inside.setVisible(false);

                    }
});
});
variables.ClockSignal.valueChanged(e => {
    Promise.all([variables.Zb2_zawor.getValue()]).then(o => {
        if (o[0]===true) {
                        widgets.ProgressBarTank2Top1.setValue(1);
widgets.ProgressBarTank2Top2.setValue(1);
widgets.ProgressBarTank2Inside.setVisible(true);

                    }
if (o[0]===false) {
                        widgets.ProgressBarTank2Top1.setValue(0);
widgets.ProgressBarTank2Top2.setValue(0);
widgets.ProgressBarTank2Inside.setVisible(false);

                    }
});
});
variables.Zb3_prawy_przeplyw_expression_result.valueChanged(e => {
    if (e.detail.newValue===true) {
                        widgets.PrgBarTank2Right1.setValue(1);
widgets.PrgBarTank2Right2.setValue(1);
widgets.PrgBarTank2Right3.setValue(1);
widgets.PrgBarTank2Right4.setValue(1);

                    }
if (e.detail.newValue===false) {
                        widgets.PrgBarTank2Right1.setValue(0);
widgets.PrgBarTank2Right2.setValue(0);
widgets.PrgBarTank2Right3.setValue(0);
widgets.PrgBarTank2Right4.setValue(0);

                    }
});
variables.Zb3_lewy_przeplyw_expression_result.valueChanged(e => {
    if (e.detail.newValue===true) {
                        widgets.PrgBarTank1Left1.setValue(1);
widgets.PrgBarTank1Left2.setValue(1);
widgets.PrgBarTank1Left3.setValue(1);
widgets.PrgBarTank1Left4.setValue(1);

                    }
if (e.detail.newValue===false) {
                        widgets.PrgBarTank1Left1.setValue(0);
widgets.PrgBarTank1Left2.setValue(0);
widgets.PrgBarTank1Left3.setValue(0);
widgets.PrgBarTank1Left4.setValue(0);

                    }
});
variables.Zb3_przeplyw_expression_result.valueChanged(e => {
    if (e.detail.newValue===true) {
                        widgets.ProgressBarTank3Sink1.setValue(1);
widgets.ProgressBarTank3Sink2.setValue(1);

                    }
if (e.detail.newValue===false) {
                        widgets.ProgressBarTank3Sink1.setValue(0);
widgets.ProgressBarTank3Sink2.setValue(0);

                    }
});
variables.Zb3_zawor_lewy.valueChanged(e => {
    Promise.all([variables.Zawory_dwustanowe.getValue(), variables.Zb3_zawor_lewy.getValue()]).then(o => {
        if (e.detail.newValue > 0 && o[0]===true) {
                        widgets.LeftValveNumericOutput.setValue(100);
                    }
if (e.detail.newValue > 0 && o[0]===false) {
                        widgets.LeftValveNumericOutput.setValue(o[1]);
                    }
if (e.detail.newValue===0) {
                        widgets.LeftValveNumericOutput.setValue(0);
                    }
});
});
variables.Zb3_zawor_prawy.valueChanged(e => {
    Promise.all([variables.Zawory_dwustanowe.getValue(), variables.Zb3_zawor_prawy.getValue()]).then(o => {
        if (e.detail.newValue > 0 && o[0]===true) {
                        widgets.RightValveNumericOutput.setValue(100);
                    }
if (e.detail.newValue > 0 && o[0]===false) {
                        widgets.RightValveNumericOutput.setValue(o[1]);
                    }
if (e.detail.newValue===0) {
                        widgets.RightValveNumericOutput.setValue(0);
                    }
});
});

    }
    return initEventBinding;
});