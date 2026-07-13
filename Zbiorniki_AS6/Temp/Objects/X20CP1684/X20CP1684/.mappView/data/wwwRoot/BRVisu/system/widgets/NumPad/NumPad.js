define([
    'system/widgets/Window/Window',
    'brease/controller/WidgetRegistry',
    'brease/events/BreaseEvent',
    'brease/helper/NumberFormatter',
    'brease/enum/Enum',
    'brease/core/Utils',
    'brease/objects/NumberFormat',
    'brease/services/MeasurementSystem',
    'brease/decorators/MeasurementSystemDependency',
    'brease/decorators/LanguageDependency',
    'system/widgets/NumPad/libs/NumPadSlider',
    'system/widgets/NumPad/libs/NumPadNumericValue',
    'system/widgets/NumPad/libs/ValueProcessor',
    'system/widgets/NumPad/libs/Validator',
    'system/widgets/NumPad/libs/InputElements',
    'system/widgets/NumPad/libs/OutputElements',
    'system/widgets/NumPad/libs/ButtonElements',
    'system/widgets/common/keyboards/NodeInfo',
    'system/widgets/common/keyboards/UnitInfo', 
    'system/widgets/common/window/WindowType',
    'brease/core/DOM',
    'brease/config',
    'brease/settings'],
function (SuperClass, widgetRegistry, BreaseEvent, numberFormatter, Enum, Utils, NumberFormat, 
    measurementSystem, 
    MeasurementSystemDependency, LanguageDependency, NumPadSlider, NumericValue, ValueProcessor, Validator, InputElements, OutputElements, ButtonElements, NodeInfo, UnitInfo, WindowType, 
    DOM, breaseConfig, breaseSettings) {

    'use strict';

    /**
    * @class system.widgets.NumPad
    * @extends system.widgets.Window
    *
    * @iatMeta studio:visible
    * false
    * @iatMeta category:Category
    * System
    */
    var defaultSettings = {
            modal: true,
            showCloseButton: true,
            forceInteraction: false,
            limitViolationPolicy: Enum.LimitViolationPolicy.NO_SUBMIT,
            format: { default: { decimalPlaces: 2, minimumIntegerDigits: 1 } },
            arrow: {
                show: true,
                position: 'left',
                width: 12
            },
            positionOffset: 5,
            scale2fit: true,
            precision: 6
        },

        // eslint-disable-next-line no-unused-vars
        WidgetClass = SuperClass.extend(function NumPadBase(elem, options, deferredInit, inherited) {
            if (inherited === true) {
                SuperClass.call(this, null, null, true, true);
            } else {
                SuperClass.call(this, elem, options, false, true);
            }

        }, defaultSettings),

        p = WidgetClass.prototype;

    const ROUND_UP = 'ROUND_UP';
    const ROUND_DOWN = 'ROUND_DOWN';
    const ROUND_DEFAULT = 'ROUND_DEFAULT';    

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseNumPad');
        }
        this.settings.windowType = WindowType.NUMPAD;
        SuperClass.prototype.init.call(this, true);

        this.settings.mms = measurementSystem.getCurrentMeasurementSystem();
        this.settings.numberFormat = NumberFormat.getFormat(this.settings.format, this.settings.mms);

        this.settings.roundedMinValue = this.settings.minValue;
        this.settings.roundedMaxValue = this.settings.maxValue;
        this.minEl = this.el.find('.minValue');
        this.maxEl = this.el.find('.maxValue');
        this.numRegExp = new RegExp('[0-9]');

        this.value = new ValueProcessor();
        this.validator = new Validator();
        this.outputElements = new OutputElements();
        this.inputElements = new InputElements();
        this.buttons = new ButtonElements(this);
        this.nodeInfo = new NodeInfo(this);
        this.unitInfo = new UnitInfo(this.el);

        this.validator.addEventListener('Validation', this.outputElements.validListener.bind(this.outputElements));
        this.validator.addEventListener('Validation', this.unitInfo.validListener.bind(this.unitInfo));
        this.inputElements.addEventListener('ValueChanged', this.value.changeListener.bind(this.value));
        this.value.addEventListener('ValueChanged', this.outputElements.changeListener.bind(this.outputElements));
        this.value.addEventListener('ValueChanged', this.validator.changeListener.bind(this.validator));
        this.value.addEventListener('SignChanged', this.buttons.signChangeListener.bind(this.buttons));

        this.buttons.addEventListener('ButtonAction', this.value.actionListener.bind(this.value));
        this.buttons.addEventListener('ButtonAction', _buttonActionListener.bind(this));
    };

    p._setContent = function () {
        // overrides method to prevent execution in SuperClass 
    };

    p.validatePositions = function (options) {
        options.arrow = options.arrow || {};
        if (options.position) {
            var position = options.position;

            if (position.horizontal === 'left') {
                options.position.vertical = 'middle';
                options.arrow.position = 'right';
                options.arrow.show = true;
            } else if (position.horizontal === 'right') {
                options.position.vertical = 'middle';
                options.arrow.position = 'left';
                options.arrow.show = true;
            } else {
                if (position.vertical === 'top') {
                    options.position.horizontal = 'center';
                    options.arrow.position = 'bottom';
                    options.arrow.show = true;
                } else if (position.vertical === 'bottom') {
                    options.position.horizontal = 'center';
                    options.arrow.position = 'top';
                    options.arrow.show = true;
                } else {
                    options.position.vertical = 'middle';
                    options.position.horizontal = 'center';
                    options.arrow.show = false;
                }
            }
        } else {
            options.position = {
                vertical: 'middle',
                horizontal: 'center'
            };
            options.arrow.show = false;
        }
        return options;
    };

    /**
    * @method show
    * opens NumPad relative to opener (usually NumericInput)  
    * @param {brease.objects.NumpadOptions} options
    * @param {HTMLElement} refElement Either HTML element of opener widget or any HTML element for relative positioning.
    */
    p.show = function (options, refElement) {
        var validOptions = this.validatePositions(options);
        SuperClass.prototype.show.call(this, validOptions, refElement); // settings are extended in super call
        this.nodeInfo.show(validOptions);
        this.unitInfo.show(validOptions.unit);
        this.closeOnLostContent(refElement);

        this.settings.mms = measurementSystem.getCurrentMeasurementSystem();
        this.settings.numberFormat = NumberFormat.getFormat(this.settings.format, this.settings.mms);
        this.settings.smallChange = this.settings.numberFormat.decimalPlaces > 0 ? (1 / Math.pow(10, this.settings.numberFormat.decimalPlaces)) : 1;

        this.settings = _validateValues(this.settings);
        if (this.settings.minValue !== undefined && this.settings.maxValue !== undefined) {
            this.settings.largeChange = Math.pow(10, Math.round(Math.log10(this.settings.maxValue / 10 - this.settings.minValue / 10)));
        } else {
            this.settings.largeChange = 10 * this.settings.smallChange;
        }

        this.settings.roundedMinValue = _findLowestAllowedValue(this.settings.minValue, this.settings.numberFormat.decimalPlaces);
        this.settings.roundedMaxValue = _findHighestAllowedValue(this.settings.maxValue, this.settings.numberFormat.decimalPlaces);
        this.minEl.text(_format.call(this, this.settings.roundedMinValue));
        this.maxEl.text(_format.call(this, this.settings.roundedMaxValue));
        
        this.validator.setConfig({
            minValue: this.settings.roundedMinValue,
            maxValue: this.settings.roundedMaxValue
        });

        this.outputElements.setConfig({
            minValue: this.settings.roundedMinValue,
            maxValue: this.settings.roundedMaxValue,
            smallChange: this.settings.smallChange,
            largeChange: this.settings.largeChange,
            numberFormat: this.settings.numberFormat,
            useDigitGrouping: this.settings.useDigitGrouping
        });
        this.outputElements.update();

        this.value.setConfig({
            numberFormat: this.settings.numberFormat,
            useDigitGrouping: this.settings.useDigitGrouping
        });
        let roundedValue = _roundValueToSignificant(this.settings.value, this.settings.numberFormat.decimalPlaces, ROUND_DEFAULT);
        this.value.initialSetValue(roundedValue);
        
        if (this.eventsAttached !== true) {
            _addEventListeners.call(this);
        }
    };

    p.langChangeHandler = function () {
        this.hide();
    };

    p.measurementSystemChangeHandler = function () {
        this.hide();
    };

    /**
    * @method setStyle
    * Overwrites method from BaseWidget module  
    * @param {StyleReference} style
    */
    p.setStyle = function (style) {
        // removes anything that starts with "stylePrefix"
        // eslint-disable-next-line no-unused-vars
        this.el.removeClass((index, className) => {
            var regex = new RegExp('\\b' + this.settings.stylePrefix + '\\S+', 'g');
            return (className.match(regex) || []).join(' ');
        });

        if (style !== 'default') {
            Utils.addClass(this.el, this.settings.stylePrefix + '_style_default');
        }

        SuperClass.prototype.setStyle.call(this, style);
    };

    p.hide = function () {
        if (this.eventsAttached === true) {
            _removeEventListeners.call(this);
        }
        this.buttons.reset();
        SuperClass.prototype.hide.call(this);
    };

    p.dispose = function () {
        _removeEventListeners.call(this);
        this.nodeInfo.dispose();
        this.unitInfo.dispose();
        this.validator.removeEventListener('Validation');
        this.inputElements.dispose();
        this.outputElements.dispose();
        this.value.removeEventListener('ValueChanged');
        this.value.removeEventListener('SignChanged');
        this.buttons.removeEventListener('ButtonAction');

        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.setValue = function (value) {
        this.value.setValue(value);
    };

    p.getValue = function () {
        return this.value.getValue();
    };

    p._keyDownHandler = function (e) {
        if (e.keyCode === 8) {
            e.preventDefault();
            this._keyUpHandler(e);
        } else if (breaseConfig.visu.keyboardOperation && e.key === 'Escape') {
            this.hide();
        }
    };

    p._keyUpHandler = function (e) {
        var value = String.fromCharCode(e.keyCode || e.charCode);
        if (this.numRegExp.test(value)) {
            this.buttons.triggerAction('value', value);
        } else if (value === ',' || value === '.') {
            this.buttons.triggerAction('comma');
        } else if (value === '-' || value === '+') {
            this.buttons.triggerAction('sign');
        } else if (e.keyCode === 8) {
            this.buttons.triggerAction('delete');
        } else if (e.keyCode === 13) {
            this.buttons.triggerAction('enter');
        }

    };

    p.loadHTML = function () {
        this.deferredInit(document.body, widgetRegistry.getByPath(this.settings.html), true);

        var elements = NumPadSlider.createInstances(this.el);
        elements.forEach(slider => {
            this.outputElements.addElement(slider);
            this.inputElements.addElement(slider);
        });

        var numericOutput = new NumericValue(this);
        this.outputElements.addElement(numericOutput);

        this.buttons.init();

        this.readyHandler();
    };

    // PRIVATE
    function _validateValues(options) {
        var minValue = parseFloat(options.minValue);
        options.minValue = isNaN(minValue) ? -Number.MAX_VALUE : minValue;
        var maxValue = parseFloat(options.maxValue);
        options.maxValue = isNaN(maxValue) ? Number.MAX_VALUE : maxValue;
        return options;
    }

    function _addEventListeners() {
        this.buttons.addListeners();
        DOM.bodyEl.on('keydown', this._bind('_keyDownHandler'));
        DOM.bodyEl.on('keypress', this._bind('_keyUpHandler'));
        this.eventsAttached = true;
    }

    function _removeEventListeners() {
        this.buttons.removeListeners();
        DOM.bodyEl.off('keydown', this._bind('_keyDownHandler'));
        DOM.bodyEl.off('keypress', this._bind('_keyUpHandler'));
        this.eventsAttached = false;
    }

    function _format(value) {
        if (isNaN(value)) {
            return breaseSettings.noValueString;
        } else {
            return numberFormatter.formatNumber(value, this.settings.numberFormat, this.settings.useDigitGrouping);
        }
    }

    function _inPutIsInvalid(value) {
        if (value % 1 === 0 || isNaN(value) || value === null || value === undefined) { return true; }
        return false;
    }

    function _findLowestAllowedValue(minValue, decimalPlaces) {
        if (_inPutIsInvalid(minValue)) { return minValue; }
        return _findPossibleFormatedValue(minValue, decimalPlaces, 'min');
    }

    function _findHighestAllowedValue(maxValue, decimalPlaces) {
        if (_inPutIsInvalid(maxValue)) { return maxValue; }
        return _findPossibleFormatedValue(maxValue, decimalPlaces, 'max');
    }

    function _findPossibleFormatedValue(value, decimalPlaces, type) {
        let cutValue = _cutValueToSignificant(value, decimalPlaces);
        let v = _roundValueToSignificant(cutValue, decimalPlaces, ROUND_DEFAULT) - cutValue;
        let delta = Math.pow(10, -(decimalPlaces + 2));
        let returnValue;
        /* If the rounded value is the same as the input, no adjustment
          is required. eg 2.0000 == 2.0000 */
        if (v <= delta && v >= (delta * -1)) { 
            returnValue = cutValue; 
        } else { 
            if (type === 'min') {
                if (cutValue > 0) { 
                    returnValue = _roundValueToSignificant(cutValue, decimalPlaces, ROUND_UP); 
                } else { 
                    returnValue = _roundValueToSignificant(cutValue, decimalPlaces, ROUND_DOWN); 
                }
            } else {
                if (cutValue > 0) { 
                    returnValue = _roundValueToSignificant(cutValue, decimalPlaces, ROUND_DOWN); 
                } else { 
                    returnValue = _roundValueToSignificant(cutValue, decimalPlaces, ROUND_UP); 
                }
            }
        }
        return returnValue;
    }

    function _cutValueToSignificant(value, decimalPlaces) {
        let valueString = value.toString();
        let splitString = valueString.split('.');
        return parseFloat(`${splitString[0]}.${splitString[1].slice(0, decimalPlaces + 1)}`);
    }

    function _roundValueToSignificant(value, decimalPlaces, type) {
        let pow = Math.pow(10, decimalPlaces);
        let powVal = value * pow;

        switch (type) {
            case ROUND_UP:
                if (powVal < 0.0) { powVal = Math.ceil(powVal - 1.0); } else { powVal = Math.floor(powVal + 1.0); }
                break;
            case ROUND_DOWN:
                if (powVal < 0.0) { powVal = Math.ceil(powVal); } else { powVal = Math.floor(powVal); }
                break;
            case ROUND_DEFAULT:
                if (powVal < 0.0) { powVal = Math.ceil(powVal - 0.5); } else { powVal = Math.floor(powVal + 0.5); }
                break;
        }
        return powVal / pow;
    }

    function _buttonActionListener(e) {
        if (e.detail.action === 'close') {
            this.debouncedHide();
        } else if (e.detail.action === 'enter') {
            let submit = false;
            let close = false;
            let value = this.getValue();

            if (value >= this.settings.roundedMinValue && value <= this.settings.roundedMaxValue) {
                submit = true;
                close = true;
            } else {    
                switch (this.settings.limitViolationPolicy) {
                    case Enum.LimitViolationPolicy.NO_SUBMIT:
                        submit = false;
                        close = false;
                        break;
                    case Enum.LimitViolationPolicy.NO_SUBMIT_AND_CLOSE:
                        submit = false;
                        close = true;
                        break;
                    case Enum.LimitViolationPolicy.SUBMIT_ALL:
                        submit = true;
                        close = true;
                        break;
                    case Enum.LimitViolationPolicy.SET_TO_LIMIT:
                        if (Math.abs(value - this.settings.roundedMaxValue) < Math.abs(value - this.settings.roundedMinValue)) {
                            this.value.setValue(this.settings.maxValue);
                        } else {
                            this.value.setValue(this.settings.minValue);
                        }
                        submit = false;
                        close = false;
                        break;
                    case Enum.LimitViolationPolicy.SET_TO_LIMIT_AND_SUBMIT:
                        if (Math.abs(value - this.settings.roundedMaxValue) < Math.abs(value - this.settings.roundedMinValue)) {
                            this.value.setValue(this.settings.maxValue);
                        } else {
                            this.value.setValue(this.settings.minValue);
                        }
                        submit = true;
                        close = true;
                        break;
                }
            }
            /**
                * @event value_submit
                * Fired after user clicks 'enter' to submit value    
                * @param {Object} detail  
                * @param {Number} detail.value  
                * @param {String} type {@link brease.events.BreaseEvent#static-property-SUBMIT BreaseEvent.SUBMIT}
                * @param {HTMLElement} target element of widget
                */
            if (submit === true) {
                this.dispatchEvent(new CustomEvent(BreaseEvent.SUBMIT, { detail: { value: this.getValue() } }));
            }
            if (close === true) {
                this.hide();
            }
        }
    }

    return MeasurementSystemDependency.decorate(LanguageDependency.decorate(WidgetClass, true), true);

});
