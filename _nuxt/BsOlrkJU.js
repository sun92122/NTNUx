import{a7 as c,aC as g,b9 as m,bR as d,aV as p,bS as u,t as a,v as i,av as l,I as $,H as b,aw as o,ax as f}from"./Q0IBlKV6.js";var h=({dt:e})=>`
.p-inlinemessage {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${e("inlinemessage.padding")};
    border-radius: ${e("inlinemessage.border.radius")};
    gap: ${e("inlinemessage.gap")};
}

.p-inlinemessage-text {
    font-weight: ${e("inlinemessage.text.font.weight")};
}

.p-inlinemessage-icon {
    flex-shrink: 0;
    font-size: ${e("inlinemessage.icon.size")};
    width: ${e("inlinemessage.icon.size")};
    height: ${e("inlinemessage.icon.size")};
}

.p-inlinemessage-icon-only .p-inlinemessage-text {
    visibility: hidden;
    width: 0;
}

.p-inlinemessage-info {
    background: ${e("inlinemessage.info.background")};
    border: 1px solid ${e("inlinemessage.info.border.color")};
    color: ${e("inlinemessage.info.color")};
    box-shadow: ${e("inlinemessage.info.shadow")};
}

.p-inlinemessage-info .p-inlinemessage-icon {
    color: ${e("inlinemessage.info.color")};
}

.p-inlinemessage-success {
    background: ${e("inlinemessage.success.background")};
    border: 1px solid ${e("inlinemessage.success.border.color")};
    color: ${e("inlinemessage.success.color")};
    box-shadow: ${e("inlinemessage.success.shadow")};
}

.p-inlinemessage-success .p-inlinemessage-icon {
    color: ${e("inlinemessage.success.color")};
}

.p-inlinemessage-warn {
    background: ${e("inlinemessage.warn.background")};
    border: 1px solid ${e("inlinemessage.warn.border.color")};
    color: ${e("inlinemessage.warn.color")};
    box-shadow: ${e("inlinemessage.warn.shadow")};
}

.p-inlinemessage-warn .p-inlinemessage-icon {
    color: ${e("inlinemessage.warn.color")};
}

.p-inlinemessage-error {
    background: ${e("inlinemessage.error.background")};
    border: 1px solid ${e("inlinemessage.error.border.color")};
    color: ${e("inlinemessage.error.color")};
    box-shadow: ${e("inlinemessage.error.shadow")};
}

.p-inlinemessage-error .p-inlinemessage-icon {
    color: ${e("inlinemessage.error.color")};
}

.p-inlinemessage-secondary {
    background: ${e("inlinemessage.secondary.background")};
    border: 1px solid ${e("inlinemessage.secondary.border.color")};
    color: ${e("inlinemessage.secondary.color")};
    box-shadow: ${e("inlinemessage.secondary.shadow")};
}

.p-inlinemessage-secondary .p-inlinemessage-icon {
    color: ${e("inlinemessage.secondary.color")};
}

.p-inlinemessage-contrast {
    background: ${e("inlinemessage.contrast.background")};
    border: 1px solid ${e("inlinemessage.contrast.border.color")};
    color: ${e("inlinemessage.contrast.color")};
    box-shadow: ${e("inlinemessage.contrast.shadow")};
}

.p-inlinemessage-contrast .p-inlinemessage-icon {
    color: ${e("inlinemessage.contrast.color")};
}
`,w={root:function(n){var s=n.props,r=n.instance;return["p-inlinemessage p-component p-inlinemessage-"+s.severity,{"p-inlinemessage-icon-only":!r.$slots.default}]},icon:function(n){var s=n.props;return["p-inlinemessage-icon",s.icon]},text:"p-inlinemessage-text"},y=c.extend({name:"inlinemessage",style:h,classes:w}),v={name:"BaseInlineMessage",extends:g,props:{severity:{type:String,default:"error"},icon:{type:String,default:void 0}},style:y,provide:function(){return{$pcInlineMessage:this,$parentInstance:this}}},x={name:"InlineMessage",extends:v,inheritAttrs:!1,timeout:null,data:function(){return{visible:!0}},mounted:function(){var n=this;this.sticky||setTimeout(function(){n.visible=!1},this.life)},computed:{iconComponent:function(){return{info:u,success:p,warn:d,error:m}[this.severity]}}};function k(e,n,s,r,C,t){return i(),a("div",o({role:"alert","aria-live":"assertive","aria-atomic":"true",class:e.cx("root")},e.ptmi("root")),[l(e.$slots,"icon",{},function(){return[(i(),b(f(e.icon?"span":t.iconComponent),o({class:e.cx("icon")},e.ptm("icon")),null,16,["class"]))]}),e.$slots.default?(i(),a("div",o({key:0,class:e.cx("text")},e.ptm("text")),[l(e.$slots,"default")],16)):$("",!0)],16)}x.render=k;export{x as default};
