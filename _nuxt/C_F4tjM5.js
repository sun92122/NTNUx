import{X as r,aw as a,ax as t,t as n,v as s,ak as p,am as c}from"./C90GeY4M.js";var u=`
.p-checkbox-group {
    display: inline-flex;
}
`,i={root:"p-checkbox-group p-component"},l=r.extend({name:"checkboxgroup",style:u,classes:i}),m={name:"BaseCheckboxGroup",extends:a,style:l,provide:function(){return{$pcCheckboxGroup:this,$parentInstance:this}}},d={name:"CheckboxGroup",extends:m,inheritAttrs:!1,data:function(){return{groupName:this.name}},watch:{name:function(o){this.groupName=o||t("checkbox-group-")}},mounted:function(){this.groupName=this.groupName||t("checkbox-group-")}};function h(e,o,x,k,f,g){return s(),n("div",c({class:e.cx("root")},e.ptmi("root")),[p(e.$slots,"default")],16)}d.render=h;export{d as default};
