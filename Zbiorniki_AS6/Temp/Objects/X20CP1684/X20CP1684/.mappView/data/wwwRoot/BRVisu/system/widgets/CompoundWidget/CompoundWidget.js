define([
    'brease/core/BaseWidget', 
    'brease/events/BreaseEvent', 
    'brease/enum/Enum', 
    'brease/core/Utils', 
    'brease/config',
    'brease/controller/libs/Utils',
    'brease/controller/UIController',
    'brease/controller/WidgetRegistry'
], function (SuperClass, BreaseEvent, Enum, Utils, breaseConfig, controllerUtils, uiController, widgetRegistry) {

    'use strict';

    /**
    * @class system.widgets.CompoundWidget
    * @abstract
    * Base class for all Compound-Widgets. 
    * It should not usually be necessary to use this widget directly, because there are provided subclasses  
    * which implement specialized widget use cases which cover application needs.  
    * @extends brease.core.BaseWidget
    * @iatMeta category:Category
    * System
    * @iatMeta studio:visible
    * false
    * @iatMeta description:short
    * CompoundWidget
    * @iatMeta description:de
    * CompoundWidget
    * @iatMeta description:en
    * CompoundWidget
    */

    /**
    * @cfg {Boolean} focusable=false
    * The CompoundWidget itself will not be added to the focus chain.
    * Child widgets derive the tabIndex from its parent but the parent widget itself is not focusable.
    */
    /**
    * @cfg {Integer} tabIndex=0
    * @iatStudioExposed
    * @iatCategory Behavior 
    */
    /**
    * @cfg {StyleReference} style
    * @hide
    */
    /**
    * @cfg {Boolean} omitClass
    * @hide
    */
    /**
    * @method setStyle
    * @hide
    */
    var defaultSettings = {
            tabIndex: 0,
            focusable: false,
            addContent: window.brEnv?.editMode
        },

        WidgetClass = SuperClass.extend(function CompoundWidget() {
            this.abortController = new AbortController();
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;
    WidgetClass.static.delimiter = 'Θ';

    p.init = function () {
        this.data = {};
        this.addInitialClass('classCompoundWidget');
        if (this.settings.addContent === true) {
            addContentCSS.call(this);
            addContentHTML.call(this);
        } else {
            this.contentAdded();
        }
        this._onWidgetsReadyHandler();
        document.body.addEventListener(BreaseEvent.CONTENT_ACTIVATED, contentActivatedHandler.bind(this), { signal: this.abortController.signal });
    };

    /**
     * @method
     */
    p.childWidgetId = function (id) {
        return `${this.elem.id}${WidgetClass.static.delimiter}${id}`;
    };

    /**
     * @method
     */
    p._onWidgetsReadyHandler = function () {
        if (breaseConfig.editMode) { return; }
        let childrenWidgets = this.selectChildren();
        this.childrenWidgetIds = [];

        for (let i = 0; i < childrenWidgets.length; i++) {
            if (uiController.getWidgetState(childrenWidgets[i].id) !== 2) {
                this.childrenWidgetIds.push(childrenWidgets[i].id);
            }
        }
        this.elem.addEventListener(BreaseEvent.WIDGET_READY, this._bind('_childWidgetReadyHandler'), { signal: this.abortController.signal });
    };

    /**
     * @method
     */
    p._childWidgetReadyHandler = function (e) {
        let widgetIdIndex = this.childrenWidgetIds.indexOf(e.target.id);
        if (widgetIdIndex !== -1) {
            this.childrenWidgetIds.splice(widgetIdIndex, 1);
        }        
        if (this.childrenWidgetIds.length === 0) {
            this.elem.removeEventListener(BreaseEvent.WIDGET_READY, this._getBound('_childWidgetReadyHandler'));
            this._dispatchOnWidgetsReady();
            this._dispatchOnWidgetsActive(true);
        }
    };

    /**
     * @method
     */
    p._dispatchOnWidgetsReady = function () {
        let dispatch = (e) => {
            /**
            * @event OnWidgetsReady
            * @iatStudioExposed
            * Fired when compound and child widgets are ready
            */ 
            if (!e || e.detail.contentId === this.settings.parentContentId) {
                let onWidgetsReady = this.createEvent('OnWidgetsReady');
                onWidgetsReady.dispatch();
            }
        };
        if (this.constructor.static.eventScripts) {
            _initEventBindings(this);
            if (this.contentActivated) {
                dispatch();
            } else {
                document.body.addEventListener(BreaseEvent.CONTENT_ACTIVATED, dispatch.bind(this), { signal: this.abortController.signal });
            }
            return;
        }
        dispatch();
    };

    /**
     * @method
     */
    p._dispatchOnWidgetsActive = function (fromInit) {
        let dispatch = (e) => {
            /**
            * @event OnWidgetsActive
            * @iatStudioExposed
            * Fired when compound and child widgets are ready after being suspended
            */
            if (!e || e.detail.contentId === this.settings.parentContentId) {
                let onWidgetsActive = this.createEvent('OnWidgetsActive');
                onWidgetsActive.dispatch();
            }
        };
        if (this.constructor.static.eventScripts) {
            if (fromInit !== true) {
                _initEventBindings(this);
            }
            if (this.contentActivated) {
                dispatch();
            } else {
                document.body.addEventListener(BreaseEvent.CONTENT_ACTIVATED, dispatch.bind(this), { signal: this.abortController.signal });
            }
            return;
        }
        dispatch();
    };
    
    /**
     * @method
     */
    p.contentAdded = function () {
        SuperClass.prototype.init.call(this);
        this.setInitialValues();
        this.initEventMappings();
    };

    /**
     * @method
     */
    p.setInitialValues = function () {
        // override in derived compound widgets
    };

    /**
     * @method
     */
    p.initEventMappings = function () {
        // override in derived compound widgets
    };

    /**
     * @method
     */
    p.initMapping = function (mapping) {
        this.settings.idPrefix = this.elem.id + WidgetClass.static.delimiter;
        let converted = {};
        for (let key in mapping) {
            if (mapping[key] === 'all') {
                converted[key] = 'all';
            } else {
                let newObj = {};
                for (let widgetId in mapping[key]) {
                    newObj[this.settings.idPrefix + widgetId] = mapping[key][widgetId];
                }
                converted[key] = newObj;
            }
        }
        this.propertyMapping = converted;
    };

    /**
     * @method
     */
    p.selectChildren = function (level) {
        if (this.children === undefined || this.children.length === 0) {
            // Attention: this only works if widget elements are direct children in DOM
            this.directChildren = this.el.find('>[data-brease-widget]');
            this.children = this.el.find('[data-brease-widget]');
        }
        if (level === 'direct') {
            return this.directChildren;
        } else {
            return this.children;
        }
    };

    p.wake = function () {
        this.abortController = new AbortController();
        document.body.addEventListener(BreaseEvent.CONTENT_ACTIVATED, contentActivatedHandler.bind(this), { signal: this.abortController.signal });
        SuperClass.prototype.wake.apply(this, arguments);
        this.initEventMappings();
        queueMicrotask(() => {
            this._dispatchOnWidgetsActive();
        });
    };

    p.suspend = function () {
        this.abortController.abort();
        this.contentActivated = false;
        SuperClass.prototype.suspend.apply(this, arguments);
    };

    p.dispose = function () {
        this.abortController.abort();
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.disable = function () {
        SuperClass.prototype.disable.apply(this, arguments);
        if (this.initialized !== true) {
            var enabled = !this.isDisabled;
            if (breaseConfig.editMode === false) {
                this.selectChildren('direct').each(function () {
                    var widgetId = this.id;
                    uiController.setWidgetPropertyIndependentOfState(widgetId, 'parentEnableState', enabled);
                });
            }
        }
    };

    p._enableHandler = function () {
        SuperClass.prototype._enableHandler.apply(this, arguments);
        var enabled = !this.isDisabled;

        if (breaseConfig.editMode === false) {
            this.selectChildren('direct').each(function () {
                var widgetId = this.id;
                uiController.setWidgetPropertyIndependentOfState(widgetId, 'parentEnableState', enabled);
            });
        }
    };
    
    /**
     * @method
     */
    p.setChildProps = function (propName, value) {
        if (value !== undefined && value !== null) {
            var mapping = this.propertyMapping[propName];

            if (mapping) {
                this.selectChildren().each(function () {
                    var property = (mapping === 'all') ? propName : mapping[this.id];
                    if (property !== undefined) {
                        if (property.indexOf(',') !== -1) {
                            var props = property.split(',');
                            for (var i = 0; i < props.length; i += 1) {
                                setProperty(this.id, props[i], value);
                            }
                        } else {
                            setProperty(this.id, property, value);
                        }
                    }
                });
            }
        }
    };

    function contentActivatedHandler(e) {
        this.contentActivated = e.detail.contentId === this.settings.parentContentId;
    }

    function setProperty(widgetId, property, value) {
        if (uiController.getWidgetState(widgetId) < Enum.WidgetState.INITIALIZED || widgetSetProperty(widgetId, property, value) === null) {
            uiController.addWidgetOption(widgetId, property, value);
        }
    }

    function widgetSetProperty(widgetId, property, value) {
        var args = [widgetId, getSetter(property), value],
            key = getKey(property);
        if (key !== undefined) {
            args.push(key);
        }
        args.push({
            origin: 'cowi',
            attribute: property,
            value: value
        });

        return uiController.callWidget.apply(uiController, args);
    }

    function getSetter(property) {
        if (property === 'permissionOperate' || property === 'permissionView') {
            return '_setPermission';
        } else {
            return Utils.setter(property);
        }
    }

    function getKey(property) {
        if (property === 'permissionOperate') {
            return 'operate';
        } else if (property === 'permissionView') {
            return 'view';
        } else {
            return undefined;
        }
    }

    /**
     * @method
     */
    p.updateVisibility = function () {
        let visible = this.isVisible();
        SuperClass.prototype.updateVisibility.apply(this, arguments);
        // visibility is potentially changed in SuperClass
        if (visible !== this.isVisible() || breaseConfig.editMode) {
            visible = this.isVisible();

            this.selectChildren('direct').each(function () {
                const widgetId = this.id;
                uiController.setWidgetPropertyIndependentOfState(widgetId, 'parentVisibleState', visible);
            });
        }
    };

    /**
     * @method
     */
    p._getWidgetsProxy = function () {
        // override in derived compound widgets
        return {};
    };

    function addOverlay() {
        var zIndex = Utils.getHighestZindex(this.selectChildren('direct'));
        $('<div style="position:absolute;width:100%;height:100%; background-color:rgba(255,0,0,0); z-index:' + (zIndex + 1) + ';"></div>').appendTo(this.elem);
        this.elem.removeEventListener(BreaseEvent.CONTENT_PARSED, this._getBound(addOverlay));
    }

    function addContentHTML() {
        let content = widgetRegistry.get(this.settings.className.replaceAll('/', '.'))?.static.contentHTML ?? '';
        content = content.replace(/\{COWI_ID\}/g, this.elem.id);
        content = content.substring(5, content.length - 6);
        controllerUtils.appendHTML(this.elem, content);
        this.elem.addEventListener(BreaseEvent.CONTENT_PARSED, this._bind(addOverlay));
        uiController.parse(this.elem, false, this.settings.parentContentId);
        this.contentAdded();
    }

    function addContentCSS() {
        if (this.constructor.static.contentCSS) {
            controllerUtils.injectCSS(this.constructor.static.contentCSS.replace(/\{ID_PREFIX\}/g, this.settings.idPrefix));
        }
    }

    function _initEventBindings(widget) {
        const compound = widget.constructor.ClassInfo.meta.eventBindingApi(widget);
        const widgets = widget._getWidgetsProxy(widget);
        const contentId = widget.settings.parentContentId;
        const widgetId = widget.elem.id.replace(`${contentId}_`, '');
        const warnMessage = _getWarnMessage(widgetId, contentId);
        const consoleMessage = _getConsoleMessage(widgetId, contentId);
        const consoleStub = {
            log: consoleLogWrapper.bind(null, consoleMessage)
        };
        widget.constructor.static.eventScripts.forEach(script => {
            try {
                script.initEventBinding.call(null, compound, widgets, consoleStub);
            } catch (err) {
                console.warn(warnMessage, err);
            }
        });
    }

    function consoleLogWrapper() {
        console.log(...arguments); 
    }

    function _getWarnMessage(widgetId, contentId) {
        return `error when initializing event script of "${widgetId}" on content "${contentId}". original error:`;
    }

    function _getConsoleMessage(widgetId, contentId) {
        return `EventScript: content:"${contentId}", widget: "${widgetId}":`;
    }

    return WidgetClass;

});
