import{a8 as g,aa as m,aG as S,ag as O,ak as c,au as d,g as A,t as b,v as p,G as B,H as L,F as w,aA as V,A as K,aw as $,x as T,ax as y,y as D}from"./Q2KG5fdx.js";import I from"./D9bPrsGf.js";var k=({dt:e})=>`
.p-selectbutton {
    display: inline-flex;
    user-select: none;
    vertical-align: bottom;
    outline-color: transparent;
    border-radius: ${e("selectbutton.border.radius")};
}

.p-selectbutton .p-togglebutton {
    border-radius: 0;
    border-width: 1px 1px 1px 0;
}

.p-selectbutton .p-togglebutton:focus-visible {
    position: relative;
    z-index: 1;
}

.p-selectbutton .p-togglebutton:first-child {
    border-inline-start-width: 1px;
    border-start-start-radius: ${e("selectbutton.border.radius")};
    border-end-start-radius: ${e("selectbutton.border.radius")};
}

.p-selectbutton .p-togglebutton:last-child {
    border-start-end-radius: ${e("selectbutton.border.radius")};
    border-end-end-radius: ${e("selectbutton.border.radius")};
}

.p-selectbutton.p-invalid {
    outline: 1px solid ${e("selectbutton.invalid.border.color")};
    outline-offset: 0;
}
`,R={root:function(n){var t=n.instance;return["p-selectbutton p-component",{"p-invalid":t.$invalid}]}},x=g.extend({name:"selectbutton",style:k,classes:R}),C={name:"BaseSelectButton",extends:S,props:{options:Array,optionLabel:null,optionValue:null,optionDisabled:null,multiple:Boolean,allowEmpty:{type:Boolean,default:!0},dataKey:null,ariaLabelledby:{type:String,default:null},size:{type:String,default:null}},style:x,provide:function(){return{$pcSelectButton:this,$parentInstance:this}}};function E(e,n){var t=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!t){if(Array.isArray(e)||(t=h(e))||n){t&&(e=t);var o=0,s=function(){};return{s,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(u){throw u},f:s}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var r,l=!0,a=!1;return{s:function(){t=t.call(e)},n:function(){var u=t.next();return l=u.done,u},e:function(u){a=!0,r=u},f:function(){try{l||t.return==null||t.return()}finally{if(a)throw r}}}}function _(e){return F(e)||z(e)||h(e)||q()}function q(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function h(e,n){if(e){if(typeof e=="string")return f(e,n);var t={}.toString.call(e).slice(8,-1);return t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set"?Array.from(e):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?f(e,n):void 0}}function z(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function F(e){if(Array.isArray(e))return f(e)}function f(e,n){(n==null||n>e.length)&&(n=e.length);for(var t=0,o=Array(n);t<n;t++)o[t]=e[t];return o}var P={name:"SelectButton",extends:C,inheritAttrs:!1,emits:["change"],methods:{getOptionLabel:function(n){return this.optionLabel?d(n,this.optionLabel):n},getOptionValue:function(n){return this.optionValue?d(n,this.optionValue):n},getOptionRenderKey:function(n){return this.dataKey?d(n,this.dataKey):this.getOptionLabel(n)},isOptionDisabled:function(n){return this.optionDisabled?d(n,this.optionDisabled):!1},isOptionReadonly:function(n){if(this.allowEmpty)return!1;var t=this.isSelected(n);return this.multiple?t&&this.d_value.length===1:t},onOptionSelect:function(n,t,o){var s=this;if(!(this.disabled||this.isOptionDisabled(t)||this.isOptionReadonly(t))){var r=this.isSelected(t),l=this.getOptionValue(t),a;if(this.multiple)if(r){if(a=this.d_value.filter(function(i){return!c(i,l,s.equalityKey)}),!this.allowEmpty&&a.length===0)return}else a=this.d_value?[].concat(_(this.d_value),[l]):[l];else{if(r&&!this.allowEmpty)return;a=r?null:l}this.writeValue(a,n),this.$emit("change",{event:n,value:a})}},isSelected:function(n){var t=!1,o=this.getOptionValue(n);if(this.multiple){if(this.d_value){var s=E(this.d_value),r;try{for(s.s();!(r=s.n()).done;){var l=r.value;if(c(l,o,this.equalityKey)){t=!0;break}}}catch(a){s.e(a)}finally{s.f()}}}else t=c(this.d_value,o,this.equalityKey);return t}},computed:{equalityKey:function(){return this.optionValue?null:this.dataKey},dataP:function(){return O({invalid:this.$invalid})}},directives:{ripple:m},components:{ToggleButton:I}},j=["aria-labelledby","data-p"];function H(e,n,t,o,s,r){var l=A("ToggleButton");return p(),b("div",y({class:e.cx("root"),role:"group","aria-labelledby":e.ariaLabelledby},e.ptmi("root"),{"data-p":r.dataP}),[(p(!0),b(B,null,L(e.options,function(a,i){return p(),w(l,{key:r.getOptionRenderKey(a),modelValue:r.isSelected(a),onLabel:r.getOptionLabel(a),offLabel:r.getOptionLabel(a),disabled:e.disabled||r.isOptionDisabled(a),unstyled:e.unstyled,size:e.size,readonly:r.isOptionReadonly(a),onChange:function(v){return r.onOptionSelect(v,a,i)},pt:e.ptm("pcToggleButton")},V({_:2},[e.$slots.option?{name:"default",fn:K(function(){return[$(e.$slots,"option",{option:a,index:i},function(){return[T("span",y({ref_for:!0},e.ptm("pcToggleButton").label),D(r.getOptionLabel(a)),17)]})]}),key:"0"}:void 0]),1032,["modelValue","onLabel","offLabel","disabled","unstyled","size","readonly","onChange","pt"])}),128))],16,j)}P.render=H;export{P as default};
