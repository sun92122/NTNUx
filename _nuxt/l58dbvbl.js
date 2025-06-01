import{a0 as e,az as r,aA as a,t as n,v as s,ao as u,ap as i}from"./5czFQKUz.js";var p=`
.p-radiobutton-group {
    display: inline-flex;
}
`,d={root:"p-radiobutton-group p-component"},c=e.extend({name:"radiobuttongroup",style:p,classes:d}),l={name:"BaseRadioButtonGroup",extends:r,style:c,provide:function(){return{$pcRadioButtonGroup:this,$parentInstance:this}}},m={name:"RadioButtonGroup",extends:l,inheritAttrs:!1,data:function(){return{groupName:this.name}},watch:{name:function(o){this.groupName=o||a("radiobutton-group-")}},mounted:function(){this.groupName=this.groupName||a("radiobutton-group-")}};function f(t,o,g,h,v,$){return s(),n("div",i({class:t.cx("root")},t.ptmi("root")),[u(t.$slots,"default")],16)}m.render=f;export{m as default};
