import{a8 as c,aa as p,aG as f,ag as h,a9 as i,av as v,a0 as y,v as g,x as u,y as d,aw as s,U as m,J as $,ax as r,z as k}from"./Ct6jwAdj.js";var S=({dt:t})=>`
.p-togglebutton {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    position: relative;
    color: ${t("togglebutton.color")};
    background: ${t("togglebutton.background")};
    border: 1px solid ${t("togglebutton.border.color")};
    padding: ${t("togglebutton.padding")};
    font-size: 1rem;
    font-family: inherit;
    font-feature-settings: inherit;
    transition: background ${t("togglebutton.transition.duration")}, color ${t("togglebutton.transition.duration")}, border-color ${t("togglebutton.transition.duration")},
        outline-color ${t("togglebutton.transition.duration")}, box-shadow ${t("togglebutton.transition.duration")};
    border-radius: ${t("togglebutton.border.radius")};
    outline-color: transparent;
    font-weight: ${t("togglebutton.font.weight")};
}

.p-togglebutton-content {
    display: inline-flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    gap: ${t("togglebutton.gap")};
    padding: ${t("togglebutton.content.padding")};
    background: transparent;
    border-radius: ${t("togglebutton.content.border.radius")};
    transition: background ${t("togglebutton.transition.duration")}, color ${t("togglebutton.transition.duration")}, border-color ${t("togglebutton.transition.duration")},
            outline-color ${t("togglebutton.transition.duration")}, box-shadow ${t("togglebutton.transition.duration")};
}

.p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover {
    background: ${t("togglebutton.hover.background")};
    color: ${t("togglebutton.hover.color")};
}

.p-togglebutton.p-togglebutton-checked {
    background: ${t("togglebutton.checked.background")};
    border-color: ${t("togglebutton.checked.border.color")};
    color: ${t("togglebutton.checked.color")};
}

.p-togglebutton-checked .p-togglebutton-content {
    background: ${t("togglebutton.content.checked.background")};
    box-shadow: ${t("togglebutton.content.checked.shadow")};
}

.p-togglebutton:focus-visible {
    box-shadow: ${t("togglebutton.focus.ring.shadow")};
    outline: ${t("togglebutton.focus.ring.width")} ${t("togglebutton.focus.ring.style")} ${t("togglebutton.focus.ring.color")};
    outline-offset: ${t("togglebutton.focus.ring.offset")};
}

.p-togglebutton.p-invalid {
    border-color: ${t("togglebutton.invalid.border.color")};
}

.p-togglebutton:disabled {
    opacity: 1;
    cursor: default;
    background: ${t("togglebutton.disabled.background")};
    border-color: ${t("togglebutton.disabled.border.color")};
    color: ${t("togglebutton.disabled.color")};
}

.p-togglebutton-label,
.p-togglebutton-icon {
    position: relative;
    transition: none;
}

.p-togglebutton-icon {
    color: ${t("togglebutton.icon.color")};
}

.p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover .p-togglebutton-icon {
    color: ${t("togglebutton.icon.hover.color")};
}

.p-togglebutton.p-togglebutton-checked .p-togglebutton-icon {
    color: ${t("togglebutton.icon.checked.color")};
}

.p-togglebutton:disabled .p-togglebutton-icon {
    color: ${t("togglebutton.icon.disabled.color")};
}

.p-togglebutton-sm {
    padding: ${t("togglebutton.sm.padding")};
    font-size: ${t("togglebutton.sm.font.size")};
}

.p-togglebutton-sm .p-togglebutton-content {
    padding: ${t("togglebutton.content.sm.padding")};
}

.p-togglebutton-lg {
    padding: ${t("togglebutton.lg.padding")};
    font-size: ${t("togglebutton.lg.font.size")};
}

.p-togglebutton-lg .p-togglebutton-content {
    padding: ${t("togglebutton.content.lg.padding")};
}
`,P={root:function(n){var e=n.instance,l=n.props;return["p-togglebutton p-component",{"p-togglebutton-checked":e.active,"p-invalid":e.$invalid,"p-togglebutton-sm p-inputfield-sm":l.size==="small","p-togglebutton-lg p-inputfield-lg":l.size==="large"}]},content:"p-togglebutton-content",icon:"p-togglebutton-icon",label:"p-togglebutton-label"},B=c.extend({name:"togglebutton",style:S,classes:P}),w={name:"BaseToggleButton",extends:f,props:{onIcon:String,offIcon:String,onLabel:{type:String,default:"Yes"},offLabel:{type:String,default:"No"},iconPos:{type:String,default:"left"},readonly:{type:Boolean,default:!1},tabindex:{type:Number,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null},size:{type:String,default:null}},style:B,provide:function(){return{$pcToggleButton:this,$parentInstance:this}}};function a(t){"@babel/helpers - typeof";return a=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},a(t)}function L(t,n,e){return(n=z(n))in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}function z(t){var n=T(t,"string");return a(n)=="symbol"?n:n+""}function T(t,n){if(a(t)!="object"||!t)return t;var e=t[Symbol.toPrimitive];if(e!==void 0){var l=e.call(t,n);if(a(l)!="object")return l;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(t)}var x={name:"ToggleButton",extends:w,inheritAttrs:!1,emits:["change"],methods:{getPTOptions:function(n){var e=n==="root"?this.ptmi:this.ptm;return e(n,{context:{active:this.active,disabled:this.disabled}})},onChange:function(n){!this.disabled&&!this.readonly&&(this.writeValue(!this.d_value,n),this.$emit("change",n))},onBlur:function(n){var e,l;(e=(l=this.formField).onBlur)===null||e===void 0||e.call(l,n)}},computed:{active:function(){return this.d_value===!0},hasLabel:function(){return i(this.onLabel)&&i(this.offLabel)},label:function(){return this.hasLabel?this.d_value?this.onLabel:this.offLabel:" "},dataP:function(){return h(L({checked:this.active,invalid:this.$invalid},this.size,this.size))}},directives:{ripple:p}},C=["tabindex","disabled","aria-pressed","aria-label","aria-labelledby","data-p-checked","data-p-disabled","data-p"],I=["data-p"];function O(t,n,e,l,N,o){var b=v("ripple");return y((u(),g("button",r({type:"button",class:t.cx("root"),tabindex:t.tabindex,disabled:t.disabled,"aria-pressed":t.d_value,onClick:n[0]||(n[0]=function(){return o.onChange&&o.onChange.apply(o,arguments)}),onBlur:n[1]||(n[1]=function(){return o.onBlur&&o.onBlur.apply(o,arguments)})},o.getPTOptions("root"),{"aria-label":t.ariaLabel,"aria-labelledby":t.ariaLabelledby,"data-p-checked":o.active,"data-p-disabled":t.disabled,"data-p":o.dataP}),[d("span",r({class:t.cx("content")},o.getPTOptions("content"),{"data-p":o.dataP}),[s(t.$slots,"default",{},function(){return[s(t.$slots,"icon",{value:t.d_value,class:m(t.cx("icon"))},function(){return[t.onIcon||t.offIcon?(u(),g("span",r({key:0,class:[t.cx("icon"),t.d_value?t.onIcon:t.offIcon]},o.getPTOptions("icon")),null,16)):$("",!0)]}),d("span",r({class:t.cx("label")},o.getPTOptions("label")),k(o.label),17)]})],16,I)],16,C)),[[b]])}x.render=O;export{x as default};
