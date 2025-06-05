import{a0 as f,a2 as m,Z as $,b8 as v,bw as y,aw as B,a8 as w,g as k,t as p,v as s,x as d,z as g,ao as o,N as c,ap as n,y as P,T as C,A as h,M as A,aq as D,at as S,aJ as T,ar as I}from"./C3tVsWYY.js";var K=({dt:e})=>`
.p-panel {
    border: 1px solid ${e("panel.border.color")};
    border-radius: ${e("panel.border.radius")};
    background: ${e("panel.background")};
    color: ${e("panel.color")};
}

.p-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${e("panel.header.padding")};
    background: ${e("panel.header.background")};
    color: ${e("panel.header.color")};
    border-style: solid;
    border-width: ${e("panel.header.border.width")};
    border-color: ${e("panel.header.border.color")};
    border-radius: ${e("panel.header.border.radius")};
}

.p-panel-toggleable .p-panel-header {
    padding: ${e("panel.toggleable.header.padding")};
}

.p-panel-title {
    line-height: 1;
    font-weight: ${e("panel.title.font.weight")};
}

.p-panel-content {
    padding: ${e("panel.content.padding")};
}

.p-panel-footer {
    padding: ${e("panel.footer.padding")};
}
`,L={root:function(a){var u=a.props;return["p-panel p-component",{"p-panel-toggleable":u.toggleable}]},header:"p-panel-header",title:"p-panel-title",headerActions:"p-panel-header-actions",pcToggleButton:"p-panel-toggle-button",contentContainer:"p-panel-content-container",content:"p-panel-content",footer:"p-panel-footer"},N=f.extend({name:"panel",style:K,classes:L}),E={name:"BasePanel",extends:B,props:{header:String,toggleable:Boolean,collapsed:Boolean,toggleButtonProps:{type:Object,default:function(){return{severity:"secondary",text:!0,rounded:!0}}}},style:N,provide:function(){return{$pcPanel:this,$parentInstance:this}}},M={name:"Panel",extends:E,inheritAttrs:!1,emits:["update:collapsed","toggle"],data:function(){return{d_collapsed:this.collapsed}},watch:{collapsed:function(a){this.d_collapsed=a}},methods:{toggle:function(a){this.d_collapsed=!this.d_collapsed,this.$emit("update:collapsed",this.d_collapsed),this.$emit("toggle",{originalEvent:a,value:this.d_collapsed})},onKeyDown:function(a){(a.code==="Enter"||a.code==="NumpadEnter"||a.code==="Space")&&(this.toggle(a),a.preventDefault())}},computed:{buttonAriaLabel:function(){return this.toggleButtonProps&&this.toggleButtonProps.ariaLabel?this.toggleButtonProps.ariaLabel:this.header},dataP:function(){return w({toggleable:this.toggleable})}},components:{PlusIcon:y,MinusIcon:v,Button:$},directives:{ripple:m}},V=["data-p"],j=["data-p"],z=["id"],q=["id","aria-labelledby"];function J(e,a,u,O,l,t){var b=k("Button");return s(),p("div",n({class:e.cx("root"),"data-p":t.dataP},e.ptmi("root")),[d("div",n({class:e.cx("header"),"data-p":t.dataP},e.ptm("header")),[o(e.$slots,"header",{id:e.$id+"_header",class:C(e.cx("title"))},function(){return[e.header?(s(),p("span",n({key:0,id:e.$id+"_header",class:e.cx("title")},e.ptm("title")),P(e.header),17,z)):c("",!0)]}),d("div",n({class:e.cx("headerActions")},e.ptm("headerActions")),[o(e.$slots,"icons"),e.toggleable?o(e.$slots,"togglebutton",{key:0,collapsed:l.d_collapsed,toggleCallback:function(i){return t.toggle(i)},keydownCallback:function(i){return t.onKeyDown(i)}},function(){return[g(b,n({id:e.$id+"_header",class:e.cx("pcToggleButton"),"aria-label":t.buttonAriaLabel,"aria-controls":e.$id+"_content","aria-expanded":!l.d_collapsed,unstyled:e.unstyled,onClick:a[0]||(a[0]=function(r){return t.toggle(e.event)}),onKeydown:a[1]||(a[1]=function(r){return t.onKeyDown(e.event)})},e.toggleButtonProps,{pt:e.ptm("pcToggleButton")}),{icon:h(function(r){return[o(e.$slots,e.$slots.toggleicon?"toggleicon":"togglericon",{collapsed:l.d_collapsed},function(){return[(s(),A(D(l.d_collapsed?"PlusIcon":"MinusIcon"),n({class:r.class},e.ptm("pcToggleButton").icon),null,16,["class"]))]})]}),_:3},16,["id","class","aria-label","aria-controls","aria-expanded","unstyled","pt"])]}):c("",!0)],16)],16,j),g(I,n({name:"p-toggleable-content"},e.ptm("transition")),{default:h(function(){return[S(d("div",n({id:e.$id+"_content",class:e.cx("contentContainer"),role:"region","aria-labelledby":e.$id+"_header"},e.ptm("contentContainer")),[d("div",n({class:e.cx("content")},e.ptm("content")),[o(e.$slots,"default")],16),e.$slots.footer?(s(),p("div",n({key:0,class:e.cx("footer")},e.ptm("footer")),[o(e.$slots,"footer")],16)):c("",!0)],16,q),[[T,!l.d_collapsed]])]}),_:3},16)],16,V)}M.render=J;export{M as default};
