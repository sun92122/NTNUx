import{a1 as f,a3 as m,$,b9 as v,bx as y,ax as B,a9 as k,g as w,v as p,x as s,y as d,A as g,ap as o,O as c,aq as n,z as P,V as C,B as h,N as A,ar as D,au as S,aK as K,as as I}from"./BL3XqLIb.js";var L=({dt:e})=>`
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
`,N={root:function(a){var u=a.props;return["p-panel p-component",{"p-panel-toggleable":u.toggleable}]},header:"p-panel-header",title:"p-panel-title",headerActions:"p-panel-header-actions",pcToggleButton:"p-panel-toggle-button",contentContainer:"p-panel-content-container",content:"p-panel-content",footer:"p-panel-footer"},T=f.extend({name:"panel",style:L,classes:N}),E={name:"BasePanel",extends:B,props:{header:String,toggleable:Boolean,collapsed:Boolean,toggleButtonProps:{type:Object,default:function(){return{severity:"secondary",text:!0,rounded:!0}}}},style:T,provide:function(){return{$pcPanel:this,$parentInstance:this}}},V={name:"Panel",extends:E,inheritAttrs:!1,emits:["update:collapsed","toggle"],data:function(){return{d_collapsed:this.collapsed}},watch:{collapsed:function(a){this.d_collapsed=a}},methods:{toggle:function(a){this.d_collapsed=!this.d_collapsed,this.$emit("update:collapsed",this.d_collapsed),this.$emit("toggle",{originalEvent:a,value:this.d_collapsed})},onKeyDown:function(a){(a.code==="Enter"||a.code==="NumpadEnter"||a.code==="Space")&&(this.toggle(a),a.preventDefault())}},computed:{buttonAriaLabel:function(){return this.toggleButtonProps&&this.toggleButtonProps.ariaLabel?this.toggleButtonProps.ariaLabel:this.header},dataP:function(){return k({toggleable:this.toggleable})}},components:{PlusIcon:y,MinusIcon:v,Button:$},directives:{ripple:m}},j=["data-p"],z=["data-p"],M=["id"],O=["id","aria-labelledby"];function q(e,a,u,R,l,t){var b=w("Button");return s(),p("div",n({class:e.cx("root"),"data-p":t.dataP},e.ptmi("root")),[d("div",n({class:e.cx("header"),"data-p":t.dataP},e.ptm("header")),[o(e.$slots,"header",{id:e.$id+"_header",class:C(e.cx("title"))},function(){return[e.header?(s(),p("span",n({key:0,id:e.$id+"_header",class:e.cx("title")},e.ptm("title")),P(e.header),17,M)):c("",!0)]}),d("div",n({class:e.cx("headerActions")},e.ptm("headerActions")),[o(e.$slots,"icons"),e.toggleable?o(e.$slots,"togglebutton",{key:0,collapsed:l.d_collapsed,toggleCallback:function(i){return t.toggle(i)},keydownCallback:function(i){return t.onKeyDown(i)}},function(){return[g(b,n({id:e.$id+"_header",class:e.cx("pcToggleButton"),"aria-label":t.buttonAriaLabel,"aria-controls":e.$id+"_content","aria-expanded":!l.d_collapsed,unstyled:e.unstyled,onClick:a[0]||(a[0]=function(r){return t.toggle(e.event)}),onKeydown:a[1]||(a[1]=function(r){return t.onKeyDown(e.event)})},e.toggleButtonProps,{pt:e.ptm("pcToggleButton")}),{icon:h(function(r){return[o(e.$slots,e.$slots.toggleicon?"toggleicon":"togglericon",{collapsed:l.d_collapsed},function(){return[(s(),A(D(l.d_collapsed?"PlusIcon":"MinusIcon"),n({class:r.class},e.ptm("pcToggleButton").icon),null,16,["class"]))]})]}),_:3},16,["id","class","aria-label","aria-controls","aria-expanded","unstyled","pt"])]}):c("",!0)],16)],16,z),g(I,n({name:"p-toggleable-content"},e.ptm("transition")),{default:h(function(){return[S(d("div",n({id:e.$id+"_content",class:e.cx("contentContainer"),role:"region","aria-labelledby":e.$id+"_header"},e.ptm("contentContainer")),[d("div",n({class:e.cx("content")},e.ptm("content")),[o(e.$slots,"default")],16),e.$slots.footer?(s(),p("div",n({key:0,class:e.cx("footer")},e.ptm("footer")),[o(e.$slots,"footer")],16)):c("",!0)],16,O),[[K,!l.d_collapsed]])]}),_:3},16)],16,j)}V.render=q;export{V as default};
