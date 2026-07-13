'use strict';
define(['brease',
    'widgets/brease/common/libs/BoxLayout',
    'widgets/brease/common/libs/wfUtils/UtilsCommon'
], function ({ services }, BoxLayout, Utils) {

    /**
     * @class widgets.brease.common.libs.redux.view.TextView.TextView
     *
     * This View is using following Utils:
     * {@link widgets.brease.common.libs.wfUtils.UtilsCommon UtilsCommon}
     */

    var TextView = function (props, parent) {
        this.render(props, parent);
    };

    var p = TextView.prototype;
    /**
    * @method render
    * Renders the View
    * @param {Object} props
    * @param {String} props.text
    * @param {Object} props.textSettings
    * @param {Boolean} props.selected
    * @return {jQuery} parent
    */
    p.render = function render(props, parent) {
        let box = BoxLayout.createBox();
        let span = document.createElement('SPAN');
        box.appendChild(span);
        this.el = $(box);
        this.span = $(span);
        Utils.addCssClasses(this.el, props.textSettings, props.selected);
        props.text = '' + props.text;
        this.span.text(services.language.unescapeText(props.text));
        parent.append(this.el);
    };

    p.dispose = function dispose() {
        this.span.remove();
        this.el.remove();
    };

    return TextView;

});
