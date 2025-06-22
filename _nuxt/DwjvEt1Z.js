import{a6 as b,bh as v,aB as k,aK as P,as as f,a$ as $,g as C,v as g,x as i,J as d,G as y,y as S,av as p,au as n,ay as h,B as l,U as m,M as T,C as R,z as L}from"./BQzQASQ-.js";var A=({dt:e})=>`
.p-dataview {
    border-color: ${e("dataview.border.color")};
    border-width: ${e("dataview.border.width")};
    border-style: solid;
    border-radius: ${e("dataview.border.radius")};
    padding: ${e("dataview.padding")};
}

.p-dataview-header {
    background: ${e("dataview.header.background")};
    color: ${e("dataview.header.color")};
    border-color: ${e("dataview.header.border.color")};
    border-width: ${e("dataview.header.border.width")};
    border-style: solid;
    padding: ${e("dataview.header.padding")};
    border-radius: ${e("dataview.header.border.radius")};
}

.p-dataview-content {
    background: ${e("dataview.content.background")};
    border-color: ${e("dataview.content.border.color")};
    border-width: ${e("dataview.content.border.width")};
    border-style: solid;
    color: ${e("dataview.content.color")};
    padding: ${e("dataview.content.padding")};
    border-radius: ${e("dataview.content.border.radius")};
}

.p-dataview-footer {
    background: ${e("dataview.footer.background")};
    color: ${e("dataview.footer.color")};
    border-color: ${e("dataview.footer.border.color")};
    border-width: ${e("dataview.footer.border.width")};
    border-style: solid;
    padding: ${e("dataview.footer.padding")};
    border-radius: ${e("dataview.footer.border.radius")};
}

.p-dataview-paginator-top {
    border-width: ${e("dataview.paginator.top.border.width")};
    border-color: ${e("dataview.paginator.top.border.color")};
    border-style: solid;
}

.p-dataview-paginator-bottom {
    border-width: ${e("dataview.paginator.bottom.border.width")};
    border-color: ${e("dataview.paginator.bottom.border.color")};
    border-style: solid;
}
`,B={root:function(a){var r=a.props;return["p-dataview p-component",{"p-dataview-list":r.layout==="list","p-dataview-grid":r.layout==="grid"}]},header:"p-dataview-header",pcPaginator:function(a){var r=a.position;return"p-dataview-paginator-"+r},content:"p-dataview-content",emptyMessage:"p-dataview-empty-message",footer:"p-dataview-footer"},O=b.extend({name:"dataview",style:A,classes:B}),z={name:"BaseDataView",extends:k,props:{value:{type:Array,default:null},layout:{type:String,default:"list"},rows:{type:Number,default:0},first:{type:Number,default:0},totalRecords:{type:Number,default:0},paginator:{type:Boolean,default:!1},paginatorPosition:{type:String,default:"bottom"},alwaysShowPaginator:{type:Boolean,default:!0},paginatorTemplate:{type:String,default:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"},pageLinkSize:{type:Number,default:5},rowsPerPageOptions:{type:Array,default:null},currentPageReportTemplate:{type:String,default:"({currentPage} of {totalPages})"},sortField:{type:[String,Function],default:null},sortOrder:{type:Number,default:null},lazy:{type:Boolean,default:!1},dataKey:{type:String,default:null}},style:O,provide:function(){return{$pcDataView:this,$parentInstance:this}}};function D(e){return N(e)||M(e)||V(e)||F()}function F(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function V(e,a){if(e){if(typeof e=="string")return w(e,a);var r={}.toString.call(e).slice(8,-1);return r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set"?Array.from(e):r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?w(e,a):void 0}}function M(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function N(e){if(Array.isArray(e))return w(e)}function w(e,a){(a==null||a>e.length)&&(a=e.length);for(var r=0,u=Array(a);r<a;r++)u[r]=e[r];return u}var I={name:"DataView",extends:z,inheritAttrs:!1,emits:["update:first","update:rows","page"],data:function(){return{d_first:this.first,d_rows:this.rows}},watch:{first:function(a){this.d_first=a},rows:function(a){this.d_rows=a},sortField:function(){this.resetPage()},sortOrder:function(){this.resetPage()}},methods:{getKey:function(a,r){return this.dataKey?f(a,this.dataKey):r},onPage:function(a){this.d_first=a.first,this.d_rows=a.rows,this.$emit("update:first",this.d_first),this.$emit("update:rows",this.d_rows),this.$emit("page",a)},sort:function(){var a=this;if(this.value){var r=D(this.value),u=P();return r.sort(function(s,o){var c=f(s,a.sortField),t=f(o,a.sortField);return $(c,t,a.sortOrder,u)}),r}else return null},resetPage:function(){this.d_first=0,this.$emit("update:first",this.d_first)}},computed:{getTotalRecords:function(){return this.totalRecords?this.totalRecords:this.value?this.value.length:0},empty:function(){return!this.value||this.value.length===0},emptyMessageText:function(){var a;return((a=this.$primevue.config)===null||a===void 0||(a=a.locale)===null||a===void 0?void 0:a.emptyMessage)||""},paginatorTop:function(){return this.paginator&&(this.paginatorPosition!=="bottom"||this.paginatorPosition==="both")},paginatorBottom:function(){return this.paginator&&(this.paginatorPosition!=="top"||this.paginatorPosition==="both")},items:function(){if(this.value&&this.value.length){var a=this.value;if(a&&a.length&&this.sortField&&(a=this.sort()),this.paginator){var r=this.lazy?0:this.d_first;return a.slice(r,r+this.d_rows)}else return a}else return null}},components:{DVPaginator:v}};function K(e,a,r,u,s,o){var c=C("DVPaginator");return i(),g("div",p({class:e.cx("root")},e.ptmi("root")),[e.$slots.header?(i(),g("div",p({key:0,class:e.cx("header")},e.ptm("header")),[n(e.$slots,"header")],16)):d("",!0),o.paginatorTop?(i(),y(c,{key:1,rows:s.d_rows,first:s.d_first,totalRecords:o.getTotalRecords,pageLinkSize:e.pageLinkSize,template:e.paginatorTemplate,rowsPerPageOptions:e.rowsPerPageOptions,currentPageReportTemplate:e.currentPageReportTemplate,class:m(e.cx("pcPaginator",{position:"top"})),alwaysShow:e.alwaysShowPaginator,onPage:a[0]||(a[0]=function(t){return o.onPage(t)}),unstyled:e.unstyled,pt:e.ptm("pcPaginator")},h({_:2},[e.$slots.paginatorcontainer?{name:"container",fn:l(function(t){return[n(e.$slots,"paginatorcontainer",{first:t.first,last:t.last,rows:t.rows,page:t.page,pageCount:t.pageCount,pageLinks:t.pageLinks,totalRecords:t.totalRecords,firstPageCallback:t.firstPageCallback,lastPageCallback:t.lastPageCallback,prevPageCallback:t.prevPageCallback,nextPageCallback:t.nextPageCallback,rowChangeCallback:t.rowChangeCallback,changePageCallback:t.changePageCallback})]}),key:"0"}:void 0,e.$slots.paginatorstart?{name:"start",fn:l(function(){return[n(e.$slots,"paginatorstart")]}),key:"1"}:void 0,e.$slots.paginatorend?{name:"end",fn:l(function(){return[n(e.$slots,"paginatorend")]}),key:"2"}:void 0]),1032,["rows","first","totalRecords","pageLinkSize","template","rowsPerPageOptions","currentPageReportTemplate","class","alwaysShow","unstyled","pt"])):d("",!0),S("div",p({class:e.cx("content")},e.ptm("content")),[o.empty?(i(),g("div",p({key:1,class:e.cx("emptyMessage")},e.ptm("emptyMessage")),[n(e.$slots,"empty",{layout:e.layout},function(){return[R(L(o.emptyMessageText),1)]})],16)):(i(),g(T,{key:0},[e.$slots.list&&e.layout==="list"?n(e.$slots,"list",{key:0,items:o.items}):d("",!0),e.$slots.grid&&e.layout==="grid"?n(e.$slots,"grid",{key:1,items:o.items}):d("",!0)],64))],16),o.paginatorBottom?(i(),y(c,{key:2,rows:s.d_rows,first:s.d_first,totalRecords:o.getTotalRecords,pageLinkSize:e.pageLinkSize,template:e.paginatorTemplate,rowsPerPageOptions:e.rowsPerPageOptions,currentPageReportTemplate:e.currentPageReportTemplate,class:m(e.cx("pcPaginator",{position:"bottom"})),alwaysShow:e.alwaysShowPaginator,onPage:a[1]||(a[1]=function(t){return o.onPage(t)}),unstyled:e.unstyled,pt:e.ptm("pcPaginator")},h({_:2},[e.$slots.paginatorcontainer?{name:"container",fn:l(function(t){return[n(e.$slots,"paginatorcontainer",{first:t.first,last:t.last,rows:t.rows,page:t.page,pageCount:t.pageCount,pageLinks:t.pageLinks,totalRecords:t.totalRecords,firstPageCallback:t.firstPageCallback,lastPageCallback:t.lastPageCallback,prevPageCallback:t.prevPageCallback,nextPageCallback:t.nextPageCallback,rowChangeCallback:t.rowChangeCallback,changePageCallback:t.changePageCallback})]}),key:"0"}:void 0,e.$slots.paginatorstart?{name:"start",fn:l(function(){return[n(e.$slots,"paginatorstart")]}),key:"1"}:void 0,e.$slots.paginatorend?{name:"end",fn:l(function(){return[n(e.$slots,"paginatorend")]}),key:"2"}:void 0]),1032,["rows","first","totalRecords","pageLinkSize","template","rowsPerPageOptions","currentPageReportTemplate","class","alwaysShow","unstyled","pt"])):d("",!0),e.$slots.footer?(i(),g("div",p({key:3,class:e.cx("footer")},e.ptm("footer")),[n(e.$slots,"footer")],16)):d("",!0)],16)}I.render=K;export{I as default};
