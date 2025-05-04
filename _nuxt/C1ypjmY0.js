import{T as r,am as a,an as t,t as n,v as s,ac as c,ad as p}from"./xlUua8LK.js";var u=`
.p-checkbox-group {
    display: inline-flex;
}
`,i={root:"p-checkbox-group p-component"},d=r.extend({name:"checkboxgroup",style:u,classes:i}),l={name:"BaseCheckboxGroup",extends:a,style:d,provide:function(){return{$pcCheckboxGroup:this,$parentInstance:this}}},m={name:"CheckboxGroup",extends:l,inheritAttrs:!1,data:function(){return{groupName:this.name}},watch:{name:function(o){this.groupName=o||t("checkbox-group-")}},mounted:function(){this.groupName=this.groupName||t("checkbox-group-")}};function h(e,o,x,k,f,g){return s(),n("div",p({class:e.cx("root")},e.ptmi("root")),[c(e.$slots,"default")],16)}m.render=h;export{m as default};
