import{a7 as o,aC as n,t as l,v as s,x as r,av as t,aw as a}from"./Q0IBlKV6.js";var d=({dt:e})=>`
.p-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: ${e("toolbar.padding")};
    background: ${e("toolbar.background")};
    border: 1px solid ${e("toolbar.border.color")};
    color: ${e("toolbar.color")};
    border-radius: ${e("toolbar.border.radius")};
    gap: ${e("toolbar.gap")};
}

.p-toolbar-start,
.p-toolbar-center,
.p-toolbar-end {
    display: flex;
    align-items: center;
}
`,p={root:"p-toolbar p-component",start:"p-toolbar-start",center:"p-toolbar-center",end:"p-toolbar-end"},i=o.extend({name:"toolbar",style:d,classes:p}),b={name:"BaseToolbar",extends:n,props:{ariaLabelledby:{type:String,default:null}},style:i,provide:function(){return{$pcToolbar:this,$parentInstance:this}}},c={name:"Toolbar",extends:b,inheritAttrs:!1},$=["aria-labelledby"];function m(e,v,u,y,f,g){return s(),l("div",a({class:e.cx("root"),role:"toolbar","aria-labelledby":e.ariaLabelledby},e.ptmi("root")),[r("div",a({class:e.cx("start")},e.ptm("start")),[t(e.$slots,"start")],16),r("div",a({class:e.cx("center")},e.ptm("center")),[t(e.$slots,"center")],16),r("div",a({class:e.cx("end")},e.ptm("end")),[t(e.$slots,"end")],16)],16,$)}c.render=m;export{c as default};
