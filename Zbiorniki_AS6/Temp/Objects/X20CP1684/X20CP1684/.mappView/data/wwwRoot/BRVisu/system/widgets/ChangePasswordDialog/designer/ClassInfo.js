define(["system/widgets/Window/designer/ClassInfo"], function(s, e) {const classInfo={meta:{className:"system.widgets.ChangePasswordDialog",parents:["*"],children:[],inheritance:["system.widgets.ChangePasswordDialog","system.widgets.Window","brease.core.BaseWidget"],creator:"e44806a5a1ac62092020a48d5de646ee",eventBindingApi:function (w) {
function a(e, f) { w.addServerEventListener(e, f); }
function c(...args) { const [{ action: a }] = args.slice(-1); return w[a](...args); }
return {
focusIn: f => a('FocusIn', f),
focusOut: f => a('FocusOut', f),
focus: function () { c({ origin: 'action', action: 'focus' }); }
};
},actions:{"Focus":{"method":"focus"},"setAdditionalStyle":{"method":"setAdditionalStyle","parameter":{"styleName":{"name":"styleName","index":0,"type":"StyleReference"}}},"setEditable":{"method":"setEditable","parameter":{"editable":{"name":"editable","index":0,"type":"Boolean"},"metaData":{"name":"metaData","index":1,"type":"Object"}}},"setOmitDisabledClick":{"method":"setOmitDisabledClick"},"setParentCoWiId":{"method":"setParentCoWiId","parameter":{"value":{"name":"value","index":0,"type":"String"}}},"setParentEnableState":{"method":"setParentEnableState"},"setParentVisibleState":{"method":"setParentVisibleState"},"setTabIndex":{"method":"setTabIndex","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"setVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}}},properties:{}}};if(s.classExtension) {classInfo.classExtension = s.classExtension;}if(e) {classInfo.classExtension = e;}return classInfo;});
