import{a7 as a,aF as r,aG as t,t as n,v as s,av as p,aw as c}from"./Q0IBlKV6.js";var u=`
.p-checkbox-group {
    display: inline-flex;
}
`,i={root:"p-checkbox-group p-component"},l=a.extend({name:"checkboxgroup",style:u,classes:i}),d={name:"BaseCheckboxGroup",extends:r,style:l,provide:function(){return{$pcCheckboxGroup:this,$parentInstance:this}}},h={name:"CheckboxGroup",extends:d,inheritAttrs:!1,data:function(){return{groupName:this.name}},watch:{name:function(o){this.groupName=o||t("checkbox-group-")}},mounted:function(){this.groupName=this.groupName||t("checkbox-group-")}};function m(e,o,x,k,f,g){return s(),n("div",c({class:e.cx("root")},e.ptmi("root")),[p(e.$slots,"default")],16)}h.render=m;export{h as default};
