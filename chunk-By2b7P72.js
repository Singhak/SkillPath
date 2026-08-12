import {a2 as eD,a3 as Ms,br as Vo,a5 as z,I,a6 as C,a7 as Ue,aE as gy,c as JI,ah as oh,s as sr,a4 as st,an as QD,C as Ci,aI as ZD,h as Wc,aJ as gw,u as dh,L as Lw,ao as at,ap as cD,_ as uh,A as pw,aD as A$1,n as ne}from'./main-UMGO3TEL.js';var j=`
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
`;var N=["*"],w={root:({instance:e})=>({justifyContent:e.layout==="horizontal"?e.align==="center"||e.align==null?"center":e.align==="left"?"flex-start":e.align==="right"?"flex-end":null:null,alignItems:e.layout==="vertical"?e.align==="center"||e.align==null?"center":e.align==="top"?"flex-start":e.align==="bottom"?"flex-end":null:null})},A={root:({instance:e})=>["p-divider p-component","p-divider-"+e.layout,"p-divider-"+e.type,{"p-divider-left":e.layout==="horizontal"&&(!e.align||e.align==="left")},{"p-divider-center":e.layout==="horizontal"&&e.align==="center"},{"p-divider-right":e.layout==="horizontal"&&e.align==="right"},{"p-divider-top":e.layout==="vertical"&&e.align==="top"},{"p-divider-center":e.layout==="vertical"&&(!e.align||e.align==="center")},{"p-divider-bottom":e.layout==="vertical"&&e.align==="bottom"}],content:"p-divider-content"},E=(()=>{class e extends A$1{name="divider";style=j;classes=A;inlineStyles=w;static \u0275fac=(()=>{let i;return function(t){return (i||(i=gy(e)))(t||e)}})();static \u0275prov=ne({token:e,factory:e.\u0275fac})}return e})();var F=new C("DIVIDER_INSTANCE"),T=(()=>{class e extends z{componentName="Divider";$pcDivider=I(F,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Ue,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}styleClass;layout="horizontal";type="solid";align;_componentStyle=I(E);get dataP(){return this.cn({[this.align]:this.align,[this.layout]:this.layout,[this.type]:this.type})}static \u0275fac=(()=>{let i;return function(t){return (i||(i=gy(e)))(t||e)}})();static \u0275cmp=JI({type:e,selectors:[["p-divider"]],hostAttrs:["role","separator"],hostVars:6,hostBindings:function(n,t){n&2&&(uh("aria-orientation",t.layout)("data-p",t.dataP),pw(t.sx("root")),gw(t.cn(t.cx("root"),t.styleClass)));},inputs:{styleClass:"styleClass",layout:"layout",type:"type",align:"align"},features:[Lw([E,{provide:F,useExisting:e},{provide:at,useExisting:e}]),cD([Ue]),oh],ngContentSelectors:N,decls:2,vars:3,consts:[[3,"pBind"]],template:function(n,t){n&1&&(QD(),Ci(0,"div",0),ZD(1),Wc()),n&2&&(gw(t.cx("content")),dh("pBind",t.ptm("content")));},dependencies:[sr,st,Vo,Ue],encapsulation:2})}return e})(),Y=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=eD({type:e});static \u0275inj=Ms({imports:[T,Vo,Vo]})}return e})();export{Y};