define(['brease/events/EventDispatcher'], function (EventDispatcher) {

    'use strict';

    /**
     * @class system.widgets.NumPad.libs.InputElements
     * @extends core.javascript.Object
     */
    var InputElements = function () {
        this.elements = [];
        this.valueChangedListener = this.valueChangedListener.bind(this);
    };

    InputElements.prototype = new EventDispatcher();

    InputElements.prototype.addElement = function (element) {
        if (this.elements.indexOf(element) === -1) {
            this.elements.push(element);
            if (typeof element.addEventListener === 'function') {
                element.addEventListener('ValueChanged', this.valueChangedListener); 
            } 
        }
    };

    InputElements.prototype.valueChangedListener = function (e) {
        var value = (e && e.detail) ? e.detail.value : undefined;
        /**
        * @event ValueChanged 
        * @param {Number} value  
        */
        this.dispatchEvent({ type: 'ValueChanged', 
            detail: {
                'value': value
            } 
        }); 
    };

    InputElements.prototype.dispose = function () {
        this.removeEventListener('ValueChanged');
        this.elements.forEach(function (element) {
            if (typeof element.dispose === 'function') {
                element.dispose();
            }
        });
    };

    return InputElements;
});
