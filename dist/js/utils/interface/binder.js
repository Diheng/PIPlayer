define(["jquery","./bindings/click","./bindings/keypressed","./bindings/timeout"],function(e,t,n,r){return function(i,s){var o=s.on;if(typeof o=="function"){i.on=s.on,i.off=s.off;if(typeof i.off!="function")throw new Error("Interface off is not a function for "+s.handle);return!0}switch(o){case"keypressed":n(i,s);break;case"click":t(i,s);break;case"timeout":r(i,s);break;case"enter":n(i,e.extend({key:13},s));break;case"space":n(i,e.extend({key:32},s));break;case"esc":n(i,e.extend({key:27},s));break;case"leftTouch":s.element=e("<div>").css({position:"absolute",left:0,width:"30%",height:"100%",background:"#00FF00",opacity:.3}),t(i,s);break;case"rightTouch":s.element=e("<div>").css({position:"absolute",right:0,width:"30%",height:"100%",background:"#00FF00",opacity:.3}),t(i,s);break;case"topTouch":s.element=e("<div>").css({position:"absolute",top:0,width:"100%",height:"30%",background:"#00FF00",opacity:.3}),t(i,s);break;case"bottomTouch":s.element=e("<div>").css({position:"absolute",bottom:0,width:"100%",height:"30%",background:"#00FF00",opacity:.3}),t(i,s);break;default:throw new Error("Unknown interface element "+s.handle)}return!0}});