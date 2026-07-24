import {af as Y,E,aA as C,ag as R,aJ as GL,W as PT,r as r$1,ah as Pe,aR as mt,aq as Xm,L as LI,g as fe$1,at as In,au as Pn,av as On,cu as u,ae as Pe$1,br as _r,aL as st,cl as at,ax as zp,ay as KL,aM as xD,v as vi,Z as Zp,a_ as RT,F as Fc,e as ah,b1 as AD,b2 as PD,K as KD,w as eh,aN as Xp,c as tE,U as mT,aB as he$1,aC as GI,aD as uh,aE as kD,aF as OD,aG as lh,j as cr,ac as FI,ad as Es,aI as H,X,D as DD,b3 as Hc,p as pu,N as ND,h as hu,b4 as Bc,l as aT,u as bh,b5 as oh,aS as _u,b as th}from'./main-FSOJG4I4.js';import {g}from'./chunk-B-KtKpuM.js';var ce=`
    .p-fieldset {
        background: dt('fieldset.background');
        border: 1px solid dt('fieldset.border.color');
        border-radius: dt('fieldset.border.radius');
        color: dt('fieldset.color');
        padding: dt('fieldset.padding');
        margin: 0;
    }

    .p-fieldset-legend {
        background: dt('fieldset.legend.background');
        border-radius: dt('fieldset.legend.border.radius');
        border-width: dt('fieldset.legend.border.width');
        border-style: solid;
        border-color: dt('fieldset.legend.border.color');
        color: dt('fieldset.legend.color');
        padding: dt('fieldset.legend.padding');
        transition:
            background dt('fieldset.transition.duration'),
            color dt('fieldset.transition.duration'),
            outline-color dt('fieldset.transition.duration'),
            box-shadow dt('fieldset.transition.duration');
    }

    .p-fieldset-toggleable > .p-fieldset-legend {
        padding: 0;
    }

    .p-fieldset-toggle-button {
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        text-decoration: none;
        display: flex;
        gap: dt('fieldset.legend.gap');
        align-items: center;
        justify-content: center;
        padding: dt('fieldset.legend.padding');
        background: transparent;
        border: 0 none;
        border-radius: dt('fieldset.legend.border.radius');
        transition:
            background dt('fieldset.transition.duration'),
            color dt('fieldset.transition.duration'),
            outline-color dt('fieldset.transition.duration'),
            box-shadow dt('fieldset.transition.duration');
        outline-color: transparent;
    }

    .p-fieldset-legend-label {
        font-weight: dt('fieldset.legend.font.weight');
    }

    .p-fieldset-toggle-button:focus-visible {
        box-shadow: dt('fieldset.legend.focus.ring.shadow');
        outline: dt('fieldset.legend.focus.ring.width') dt('fieldset.legend.focus.ring.style') dt('fieldset.legend.focus.ring.color');
        outline-offset: dt('fieldset.legend.focus.ring.offset');
    }

    .p-fieldset-toggleable > .p-fieldset-legend:hover {
        color: dt('fieldset.legend.hover.color');
        background: dt('fieldset.legend.hover.background');
    }

    .p-fieldset-toggle-icon {
        color: dt('fieldset.toggle.icon.color');
        transition: color dt('fieldset.transition.duration');
    }

    .p-fieldset-toggleable > .p-fieldset-legend:hover .p-fieldset-toggle-icon {
        color: dt('fieldset.toggle.icon.hover.color');
    }

    .p-fieldset-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-fieldset-content-wrapper {
        min-height: 0;
    }

    .p-fieldset-content {
        padding: dt('fieldset.content.padding');
    }
`;var me=["header"],ue=["expandicon"],_e=["collapseicon"],be=["content"],he=["contentWrapper"],ye=["*",[["p-header"]]],Te=["*","p-header"];function ve(t,d){if(t&1&&(_u(),th(0,"svg",11)),t&2){let e=ND(3);KD(e.cx("toggleIcon")),eh("pBind",e.ptm("toggleIcon"));}}function Ie(t,d){t&1&&oh(0);}function xe(t,d){if(t&1&&(vi(0,"span",3),Zp(1,Ie,1,0,"ng-container",6),Fc()),t&2){let e=ND(3);KD(e.cx("toggleIcon")),eh("pBind",e.ptm("toggleIcon")),tE(),eh("ngTemplateOutlet",e.expandIconTemplate||e._expandIconTemplate);}}function Ce(t,d){if(t&1&&(Hc(0),Zp(1,ve,1,3,"svg",9)(2,xe,2,4,"span",10),Bc()),t&2){let e=ND(2);tE(),eh("ngIf",!e.expandIconTemplate&&!e._expandIconTemplate),tE(),eh("ngIf",e.expandIconTemplate||e._expandIconTemplate);}}function Me(t,d){if(t&1&&(_u(),th(0,"svg",13)),t&2){let e=ND(3);KD(e.cx("toggleIcon")),eh("pBind",e.ptm("toggleIcon")),Xp("aria-hidden",true);}}function we(t,d){t&1&&oh(0);}function Ee(t,d){if(t&1&&(vi(0,"span",3),Zp(1,we,1,0,"ng-container",6),Fc()),t&2){let e=ND(3);KD(e.cx("toggleIcon")),eh("pBind",e.ptm("toggleIcon")),tE(),eh("ngTemplateOutlet",e.collapseIconTemplate||e._collapseIconTemplate);}}function Be(t,d){if(t&1&&(Hc(0),Zp(1,Me,1,4,"svg",12)(2,Ee,2,4,"span",10),Bc()),t&2){let e=ND(2);tE(),eh("ngIf",!e.collapseIconTemplate&&!e._collapseIconTemplate),tE(),eh("ngIf",e.collapseIconTemplate||e._collapseIconTemplate);}}function Fe(t,d){t&1&&oh(0);}function Se(t,d){if(t&1){let e=DD();Hc(0),vi(1,"button",7),ah("click",function(n){pu(e);let a=ND();return hu(a.toggle(n))})("keydown",function(n){pu(e);let a=ND();return hu(a.onKeyDown(n))}),Zp(2,Ce,3,2,"ng-container",8)(3,Be,3,2,"ng-container",8)(4,Fe,1,0,"ng-container",6),Fc(),Bc();}if(t&2){let e=ND(),o=PD(4);tE(),KD(e.cx("toggleButton")),eh("pBind",e.ptm("toggleButton")),Xp("id",e.id+"_header")("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)("aria-label",e.buttonAriaLabel),tE(),eh("ngIf",e.collapsed),tE(),eh("ngIf",!e.collapsed),tE(),eh("ngTemplateOutlet",o);}}function Oe(t,d){t&1&&oh(0);}function ke(t,d){if(t&1&&(vi(0,"span",3),aT(1),Fc(),AD(2,1),Zp(3,Oe,1,0,"ng-container",6)),t&2){let e=ND();KD(e.cx("legendLabel")),eh("pBind",e.ptm("legendLabel")),tE(),bh(e.legend),tE(2),eh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function De(t,d){t&1&&oh(0);}var Ae={root:({instance:t})=>["p-fieldset p-component",{"p-fieldset-toggleable":t.toggleable,"p-fieldset-collapsed":t.collapsed&&t.toggleable}],legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",contentWrapper:"p-fieldset-content-wrapper",content:"p-fieldset-content"},ge=(()=>{class t extends H{name="fieldset";style=ce;classes=Ae;static \u0275fac=(()=>{let e;return function(n){return (e||(e=Xm(t)))(n||t)}})();static \u0275prov=X({token:t,factory:t.\u0275fac})}return t})();var fe=new C("FIELDSET_INSTANCE"),Ne=(()=>{class t extends Y{componentName="Fieldset";$pcFieldset=E(fe,{optional:true,skipSelf:true})??void 0;_componentStyle=E(ge);bindDirectiveInstance=E(R,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"));}get dataP(){return this.cn({toggleable:this.toggleable})}legend;toggleable;style;styleClass;transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";motionOptions=GL(void 0);computedMotionOptions=PT(()=>r$1(r$1({},this.ptm("motion")),this.motionOptions()));collapsedChange=new Pe;onBeforeToggle=new Pe;onAfterToggle=new Pe;contentWrapperViewChild;_id=mt("pn_id_");get id(){return this._id}get buttonAriaLabel(){return this.legend}_collapsed;get collapsed(){return this._collapsed}set collapsed(e){this._collapsed=e;}headerTemplate;expandIconTemplate;collapseIconTemplate;contentTemplate;toggle(e){this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),e.preventDefault();}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault());}expand(){this._collapsed=false,this.collapsedChange.emit(false),this.updateTabIndex();}collapse(){this._collapsed=true,this.collapsedChange.emit(true),this.updateTabIndex();}getBlockableElement(){return this.el.nativeElement.children[0]}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(o=>{this.collapsed?o.setAttribute("tabindex","-1"):o.removeAttribute("tabindex");});}onToggleDone(e){this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed});}_headerTemplate;_expandIconTemplate;_collapseIconTemplate;_contentTemplate;templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "expandicon":this._expandIconTemplate=e.template;break;case "collapseicon":this._collapseIconTemplate=e.template;break;case "content":this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=Xm(t)))(n||t)}})();static \u0275cmp=LI({type:t,selectors:[["p-fieldset"]],contentQueries:function(o,n,a){if(o&1&&lh(a,me,4)(a,ue,4)(a,_e,4)(a,be,4)(a,cr,4),o&2){let r;kD(r=OD())&&(n.headerTemplate=r.first),kD(r=OD())&&(n.expandIconTemplate=r.first),kD(r=OD())&&(n.collapseIconTemplate=r.first),kD(r=OD())&&(n.contentTemplate=r.first),kD(r=OD())&&(n.templates=r);}},viewQuery:function(o,n){if(o&1&&uh(he,5),o&2){let a;kD(a=OD())&&(n.contentWrapperViewChild=a.first);}},inputs:{legend:"legend",toggleable:[2,"toggleable","toggleable",KL],style:"style",styleClass:"styleClass",transitionOptions:"transitionOptions",motionOptions:[1,"motionOptions"],collapsed:[2,"collapsed","collapsed",KL]},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[mT([ge,{provide:fe,useExisting:t},{provide:he$1,useExisting:t}]),GI([R]),zp],ngContentSelectors:Te,decls:11,vars:28,consts:[["legendContent",""],["contentWrapper",""],[3,"ngStyle","pBind"],[3,"pBind"],[4,"ngIf","ngIfElse"],["pMotionName","p-collapsible","role","region",3,"pMotionOnAfterEnter","pMotionOnAfterLeave","pBind","pMotion","pMotionOptions","id"],[4,"ngTemplateOutlet"],["tabindex","0","role","button",3,"click","keydown","pBind"],[4,"ngIf"],["data-p-icon","plus",3,"class","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],["data-p-icon","plus",3,"pBind"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],["data-p-icon","minus",3,"pBind"]],template:function(o,n){if(o&1&&(xD(ye),vi(0,"fieldset",2)(1,"legend",3),Zp(2,Se,5,10,"ng-container",4)(3,ke,4,5,"ng-template",null,0,RT),Fc(),vi(5,"div",5),ah("pMotionOnAfterEnter",function(r){return n.onToggleDone(r)})("pMotionOnAfterLeave",function(r){return n.onToggleDone(r)}),vi(6,"div",3)(7,"div",3,1),AD(9),Zp(10,De,1,0,"ng-container",6),Fc()()()()),o&2){let a=PD(4);KD(n.cn(n.cx("root"),n.styleClass)),eh("ngStyle",n.style)("pBind",n.ptm("root")),Xp("id",n.id)("data-p",n.dataP),tE(),KD(n.cx("legend")),eh("pBind",n.ptm("legend")),Xp("data-p",n.dataP),tE(),eh("ngIf",n.toggleable)("ngIfElse",a),tE(3),KD(n.cx("contentContainer")),eh("pBind",n.ptm("contentContainer"))("pMotion",!n.toggleable||n.toggleable&&!n.collapsed)("pMotionOptions",n.computedMotionOptions())("id",n.id+"_content"),Xp("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("tabindex",n.collapsed?"-1":void 0),tE(),KD(n.cx("contentWrapper")),eh("pBind",n.ptm("contentWrapper")),tE(),KD(n.cx("content")),eh("pBind",n.ptm("content")),tE(3),eh("ngTemplateOutlet",n.contentTemplate||n._contentTemplate);}},dependencies:[fe$1,In,Pn,On,u,g,Pe$1,_r,R,st,at],encapsulation:2})}return t})(),rt=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=FI({type:t});static \u0275inj=Es({imports:[Ne,Pe$1,_r,Pe$1,_r]})}return t})();export{Ne as N,rt as r};