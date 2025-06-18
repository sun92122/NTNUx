import{a7 as l,aC as r,ap as o,bH as c,b6 as d,bU as k,bV as n,bI as m,t as u,v as p,av as h,aw as b}from"./Q0IBlKV6.js";var v=({dt:s})=>`
.p-blockui {
    position: relative;
}

.p-blockui-mask {
    border-radius: ${s("blockui.border.radius")};
}

.p-blockui-mask.p-overlay-mask {
    position: absolute;
}

.p-blockui-mask-document.p-overlay-mask {
    position: fixed;
}
`,f={root:"p-blockui"},y=l.extend({name:"blockui",style:v,classes:f}),B={name:"BaseBlockUI",extends:r,props:{blocked:{type:Boolean,default:!1},fullScreen:{type:Boolean,default:!1},baseZIndex:{type:Number,default:0},autoZIndex:{type:Boolean,default:!0}},style:y,provide:function(){return{$pcBlockUI:this,$parentInstance:this}}},I={name:"BlockUI",extends:B,inheritAttrs:!1,emits:["block","unblock"],mask:null,data:function(){return{isBlocked:!1}},watch:{blocked:function(e){e===!0?this.block():this.unblock()}},mounted:function(){this.blocked&&this.block()},methods:{block:function(){var e="p-blockui-mask p-overlay-mask p-overlay-mask-enter";this.fullScreen?(e+=" p-blockui-mask-document",this.mask=n("div",{style:{position:"fixed",top:"0",left:"0",width:"100%",height:"100%"},class:!this.isUnstyled&&e,"p-bind":this.ptm("mask")}),document.body.appendChild(this.mask),m(),document.activeElement.blur()):(this.mask=n("div",{style:{position:"absolute",top:"0",left:"0",width:"100%",height:"100%"},class:!this.isUnstyled&&e,"p-bind":this.ptm("mask")}),this.$refs.container.appendChild(this.mask)),this.autoZIndex&&o.set("modal",this.mask,this.baseZIndex+this.$primevue.config.zIndex.modal),this.isBlocked=!0,this.$emit("block")},unblock:function(){var e=this;if(this.mask){!this.isUnstyled&&d(this.mask,"p-overlay-mask-leave");var t=function(){clearTimeout(i),e.mask.removeEventListener("animationend",t),e.mask.removeEventListener("webkitAnimationEnd",t)},i=setTimeout(function(){e.removeMask()},10);k(this.mask)>0&&(this.mask.addEventListener("animationend",t),this.mask.addEventListener("webkitAnimationEnd",t))}else this.removeMask()},removeMask:function(){if(o.clear(this.mask),this.fullScreen)document.body.removeChild(this.mask),c();else{var e;(e=this.$refs.container)===null||e===void 0||e.removeChild(this.mask)}this.isBlocked=!1,this.$emit("unblock")}}},x=["aria-busy"];function S(s,e,t,i,a,C){return p(),u("div",b({ref:"container",class:s.cx("root"),"aria-busy":a.isBlocked},s.ptmi("root")),[h(s.$slots,"default")],16,x)}I.render=S;export{I as default};
