'use strict';
define(['brease',
    'widgets/brease/common/DragDropHandler/libs/dragDropBase',
    'widgets/brease/common/DragDropHandler/libs/dragDropTouch',
    'widgets/brease/common/DragDropHandler/libs/dragDropPointer'],
function ({ core: { Utils } }, DragDropBase, DragDropTouch, DragDropPointer) {

    function DragDropHandler() {
        if (DragDropHandler.supportsPointer()) {
            return new DragDropPointer();
        } else if (DragDropHandler.isTouch()) {
            return new DragDropTouch();
        } else {
            return new DragDropBase();
        }
    }
    DragDropHandler.supportsPointer = function () {
        if (window.PointerEvent) {
            return true;
        }
        return false;
    };
    DragDropHandler.isTouch = function () {
        return Utils.hasTouch();
    };

    return DragDropHandler;
});
