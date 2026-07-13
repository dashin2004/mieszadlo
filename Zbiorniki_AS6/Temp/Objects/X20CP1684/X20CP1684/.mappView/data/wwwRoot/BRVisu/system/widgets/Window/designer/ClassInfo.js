define(["brease/core/designer/BaseWidget/ClassInfo"], function(s, e) {const classInfo={meta:{className:"system.widgets.Window",parents:["*"],children:[],inheritance:["system.widgets.Window","brease.core.BaseWidget"],creator:"c625da6a5059a5e1c50b3b74c0c02111",eventBindingApi:function (w) {
function a(e, f) { w.addServerEventListener(e, f); }
function c(...args) { const [{ action: a }] = args.slice(-1); return w[a](...args); }
return {
disabledClick: f => a('DisabledClick', f),
focusIn: f => a('FocusIn', f),
focusOut: f => a('FocusOut', f),
focus: function () { c({ origin: 'action', action: 'focus' }); },
showTooltip: function () { c({ origin: 'action', action: 'showTooltip' }); }
};
},actions:{"Focus":{"method":"focus"},"setAdditionalStyle":{"method":"setAdditionalStyle","parameter":{"styleName":{"name":"styleName","index":0,"type":"StyleReference"}}},"setEditable":{"method":"setEditable","parameter":{"editable":{"name":"editable","index":0,"type":"Boolean"},"metaData":{"name":"metaData","index":1,"type":"Object"}}},"setEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setOmitDisabledClick":{"method":"setOmitDisabledClick"},"setParentCoWiId":{"method":"setParentCoWiId","parameter":{"value":{"name":"value","index":0,"type":"String"}}},"setParentEnableState":{"method":"setParentEnableState"},"setParentVisibleState":{"method":"setParentVisibleState"},"setStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setTabIndex":{"method":"setTabIndex","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"setVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"ShowTooltip":{"method":"showTooltip"}},properties:{}}};if(s.classExtension) {classInfo.classExtension = s.classExtension;}if(e) {classInfo.classExtension = e;}return classInfo;});
