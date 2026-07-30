import {aa as YI,ab as bs,bf as Wc,ad as hr,I,ax as C,ae as Hc,ao as fy,Q as QI,c as cn,ac as el,au as nh,aJ as qD,T as Ti,a_ as GD,U as Uc,E as dw,l as lh,a3 as xw,ay as wo,az as oD,aK as ch,aX as lw,aF as ve,e as ee}from'./main-SOSPWNWC.js';var j=`
    .p-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .p-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .p-divider-horizontal .p-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .p-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .p-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .p-divider.p-divider-vertical .p-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .p-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .p-divider-solid.p-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .p-divider-solid.p-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .p-divider-dashed.p-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .p-divider-dashed.p-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .p-divider-dotted.p-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .p-divider-dotted.p-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .p-divider-left:dir(rtl),
    .p-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`;var N=["*"],w={root:({instance:e})=>({justifyContent:e.layout==="horizontal"?e.align==="center"||e.align==null?"center":e.align==="left"?"flex-start":e.align==="right"?"flex-end":null:null,alignItems:e.layout==="vertical"?e.align==="center"||e.align==null?"center":e.align==="top"?"flex-start":e.align==="bottom"?"flex-end":null:null})},A={root:({instance:e})=>["p-divider p-component","p-divider-"+e.layout,"p-divider-"+e.type,{"p-divider-left":e.layout==="horizontal"&&(!e.align||e.align==="left")},{"p-divider-center":e.layout==="horizontal"&&e.align==="center"},{"p-divider-right":e.layout==="horizontal"&&e.align==="right"},{"p-divider-top":e.layout==="vertical"&&e.align==="top"},{"p-divider-center":e.layout==="vertical"&&(!e.align||e.align==="center")},{"p-divider-bottom":e.layout==="vertical"&&e.align==="bottom"}],content:"p-divider-content"},E=(()=>{class e extends ve{name="divider";style=j;classes=A;inlineStyles=w;static \u0275fac=(()=>{let i;return function(t){return (i||(i=fy(e)))(t||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var F=new C("DIVIDER_INSTANCE"),T=(()=>{class e extends hr{componentName="Divider";$pcDivider=I(F,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Hc,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}styleClass;layout="horizontal";type="solid";align;_componentStyle=I(E);get dataP(){return this.cn({[this.align]:this.align,[this.layout]:this.layout,[this.type]:this.type})}static \u0275fac=(()=>{let i;return function(t){return (i||(i=fy(e)))(t||e)}})();static \u0275cmp=QI({type:e,selectors:[["p-divider"]],hostAttrs:["role","separator"],hostVars:6,hostBindings:function(n,t){n&2&&(ch("aria-orientation",t.layout)("data-p",t.dataP),lw(t.sx("root")),dw(t.cn(t.cx("root"),t.styleClass)));},inputs:{styleClass:"styleClass",layout:"layout",type:"type",align:"align"},features:[xw([E,{provide:F,useExisting:e},{provide:wo,useExisting:e}]),oD([Hc]),nh],ngContentSelectors:N,decls:2,vars:3,consts:[[3,"pBind"]],template:function(n,t){n&1&&(qD(),Ti(0,"div",0),GD(1),Uc()),n&2&&(dw(t.cx("content")),lh("pBind",t.ptm("content")));},dependencies:[cn,el,Wc,Hc],encapsulation:2})}return e})(),Y=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=YI({type:e});static \u0275inj=bs({imports:[T,Wc,Wc]})}return e})();export{Y};