define(function () {

    'use strict';

    /**
     * @class system.widgets.common.keyboards.FocusUtils
     * @extends core.javascript.Object
     */

    return {
        
        /**
        * @method
        * focus an input element
        * @param {jQuery} $elem jQuery object of an <input> element
        */
        focusInputField: function ($elem) {
            var fieldHasFocus = (document.activeElement === $elem[0]);
            if (!fieldHasFocus) {
                // sets the focus to the html element only if necessary
                $elem[0].focus();
            }
            if (fieldHasFocus) {
                // if focus is already in the input field, we have to trigger the event for jquery listeners
                $elem.trigger('focus');
            }
        }
    };

});
