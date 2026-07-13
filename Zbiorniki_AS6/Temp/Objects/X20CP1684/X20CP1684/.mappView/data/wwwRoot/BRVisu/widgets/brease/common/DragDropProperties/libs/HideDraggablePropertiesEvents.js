'use strict';
define(function () {

    /**
    * @class widgets.brease.common.DragDropProperties.libs.HideDraggablePropertiesEvents
    * @extends core.javascript.Object
    */

    /**
    * @cfg {Boolean} draggable=false
    * @iatCategory Behavior
    * Make widget draggable.
    */

    /**
    * @event OnDragStart
    * Fired when element has OnDragStart.
    * @param {String} contentId content id of the widget where the drag operation has been started
    * @param {String} widgetId id of the widget where the drag operation has been started
    */

    /**
    * @event OnDragEnd
    * Fired when element has OnDragEnd.
    * @param {String} contentId content id of the widget where the drag operation has ended
    * @param {String} widgetId id of the widget where the drag operation has ended
    */

    var DraggablePropertiesEvents = {
    };

    return DraggablePropertiesEvents;
});
