define(["jquery","./bindings/click","./bindings/keypressed","./bindings/keyup","./bindings/timeout"],function(e,t,n,r,i){return function(s,o){var u=o.on;if(typeof u=="function"){s.on=o.on,s.off=o.off;if(typeof s.off!="function")throw new Error("Interface off is not a function for "+o.handle);return!0}switch(u){case"keypressed":n(s,o);break;case"keyup":r(s,o);break;case"click":t(s,o);break;case"timeout":i(s,o);break;case"enter":n(s,e.extend({key:13},o));break;case"space":n(s,e.extend({key:32},o));break;case"esc":n(s,e.extend({key:27},o));break;case"leftTouch":o.element=e("<div>").css({position:"absolute",left:0,width:"30%",height:"100%",background:"#00FF00",opacity:.3}),t(s,o);break;case"rightTouch":o.element=e("<div>").css({position:"absolute",right:0,width:"30%",height:"100%",background:"#00FF00",opacity:.3}),t(s,o);break;case"topTouch":o.element=e("<div>").css({position:"absolute",top:0,width:"100%",height:"30%",background:"#00FF00",opacity:.3}),t(s,o);break;case"bottomTouch":o.element=e("<div>").css({position:"absolute",bottom:0,width:"100%",height:"30%",background:"#00FF00",opacity:.3}),t(s,o);break;default:throw new Error("Unknown interface element "+u)}return!0}});