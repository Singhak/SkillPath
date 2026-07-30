import {r as re}from'./chunk-BYz2AlVv.js';import {X as Xo}from'./chunk-BaWgWCdN.js';import {aa as KI,ab as bs,ac as el,bf as Wc,ad as hr,I,ax as C,ae as Hc,aG as NL,K as Kw,r,af as Le,aO as Bi,ao as py,Z as ZI,c as cn,aq as us,ar as cs,as as ls,aI as dt,bw as lt,au as rh,av as OL,aJ as GD,T as Ti,k as ih,aZ as zw,U as Uc,f as yh,a_ as WD,a$ as KD,C as fw,u as uh,aK as lh,l as gE,a3 as Aw,ay as wo,az as iD,aA as Ih,aB as QD,aC as ZD,aD as Eh,Q as Qu,aF as ve$1,e as ee,o as LD,b0 as Wc$1,p as wu,n as UD,s as Tu,b1 as zc,b as ww,L as Lh,b2 as hh,aP as Lu,d as dh}from'./main-PV6KZ257.js';var ce=`
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
`;var me=["header"],ue=["expandicon"],_e=["collapseicon"],be=["content"],he=["contentWrapper"],ye=["*",[["p-header"]]],Te=["*","p-header"];function ve(t,d){if(t&1&&(Lu(),dh(0,"svg",11)),t&2){let e=UD(3);fw(e.cx("toggleIcon")),uh("pBind",e.ptm("toggleIcon"));}}function Ie(t,d){t&1&&hh(0);}function xe(t,d){if(t&1&&(Ti(0,"span",3),ih(1,Ie,1,0,"ng-container",6),Uc()),t&2){let e=UD(3);fw(e.cx("toggleIcon")),uh("pBind",e.ptm("toggleIcon")),gE(),uh("ngTemplateOutlet",e.expandIconTemplate||e._expandIconTemplate);}}function Ce(t,d){if(t&1&&(Wc$1(0),ih(1,ve,1,3,"svg",9)(2,xe,2,4,"span",10),zc()),t&2){let e=UD(2);gE(),uh("ngIf",!e.expandIconTemplate&&!e._expandIconTemplate),gE(),uh("ngIf",e.expandIconTemplate||e._expandIconTemplate);}}function Me(t,d){if(t&1&&(Lu(),dh(0,"svg",13)),t&2){let e=UD(3);fw(e.cx("toggleIcon")),uh("pBind",e.ptm("toggleIcon")),lh("aria-hidden",true);}}function we(t,d){t&1&&hh(0);}function Ee(t,d){if(t&1&&(Ti(0,"span",3),ih(1,we,1,0,"ng-container",6),Uc()),t&2){let e=UD(3);fw(e.cx("toggleIcon")),uh("pBind",e.ptm("toggleIcon")),gE(),uh("ngTemplateOutlet",e.collapseIconTemplate||e._collapseIconTemplate);}}function Be(t,d){if(t&1&&(Wc$1(0),ih(1,Me,1,4,"svg",12)(2,Ee,2,4,"span",10),zc()),t&2){let e=UD(2);gE(),uh("ngIf",!e.collapseIconTemplate&&!e._collapseIconTemplate),gE(),uh("ngIf",e.collapseIconTemplate||e._collapseIconTemplate);}}function Fe(t,d){t&1&&hh(0);}function Se(t,d){if(t&1){let e=LD();Wc$1(0),Ti(1,"button",7),yh("click",function(n){wu(e);let a=UD();return Tu(a.toggle(n))})("keydown",function(n){wu(e);let a=UD();return Tu(a.onKeyDown(n))}),ih(2,Ce,3,2,"ng-container",8)(3,Be,3,2,"ng-container",8)(4,Fe,1,0,"ng-container",6),Uc(),zc();}if(t&2){let e=UD(),o=KD(4);gE(),fw(e.cx("toggleButton")),uh("pBind",e.ptm("toggleButton")),lh("id",e.id+"_header")("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)("aria-label",e.buttonAriaLabel),gE(),uh("ngIf",e.collapsed),gE(),uh("ngIf",!e.collapsed),gE(),uh("ngTemplateOutlet",o);}}function Oe(t,d){t&1&&hh(0);}function ke(t,d){if(t&1&&(Ti(0,"span",3),ww(1),Uc(),WD(2,1),ih(3,Oe,1,0,"ng-container",6)),t&2){let e=UD();fw(e.cx("legendLabel")),uh("pBind",e.ptm("legendLabel")),gE(),Lh(e.legend),gE(2),uh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function De(t,d){t&1&&hh(0);}var Ae={root:({instance:t})=>["p-fieldset p-component",{"p-fieldset-toggleable":t.toggleable,"p-fieldset-collapsed":t.collapsed&&t.toggleable}],legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",contentWrapper:"p-fieldset-content-wrapper",content:"p-fieldset-content"},ge=(()=>{class t extends ve$1{name="fieldset";style=ce;classes=Ae;static \u0275fac=(()=>{let e;return function(n){return (e||(e=py(t)))(n||t)}})();static \u0275prov=ee({token:t,factory:t.\u0275fac})}return t})();var fe=new C("FIELDSET_INSTANCE"),Ne=(()=>{class t extends hr{componentName="Fieldset";$pcFieldset=I(fe,{optional:true,skipSelf:true})??void 0;_componentStyle=I(ge);bindDirectiveInstance=I(Hc,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"));}get dataP(){return this.cn({toggleable:this.toggleable})}legend;toggleable;style;styleClass;transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";motionOptions=NL(void 0);computedMotionOptions=Kw(()=>r(r({},this.ptm("motion")),this.motionOptions()));collapsedChange=new Le;onBeforeToggle=new Le;onAfterToggle=new Le;contentWrapperViewChild;_id=Bi("pn_id_");get id(){return this._id}get buttonAriaLabel(){return this.legend}_collapsed;get collapsed(){return this._collapsed}set collapsed(e){this._collapsed=e;}headerTemplate;expandIconTemplate;collapseIconTemplate;contentTemplate;toggle(e){this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),e.preventDefault();}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault());}expand(){this._collapsed=false,this.collapsedChange.emit(false),this.updateTabIndex();}collapse(){this._collapsed=true,this.collapsedChange.emit(true),this.updateTabIndex();}getBlockableElement(){return this.el.nativeElement.children[0]}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(o=>{this.collapsed?o.setAttribute("tabindex","-1"):o.removeAttribute("tabindex");});}onToggleDone(e){this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed});}_headerTemplate;_expandIconTemplate;_collapseIconTemplate;_contentTemplate;templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "expandicon":this._expandIconTemplate=e.template;break;case "collapseicon":this._collapseIconTemplate=e.template;break;case "content":this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=py(t)))(n||t)}})();static \u0275cmp=ZI({type:t,selectors:[["p-fieldset"]],contentQueries:function(o,n,a){if(o&1&&Eh(a,me,4)(a,ue,4)(a,_e,4)(a,be,4)(a,Qu,4),o&2){let r;QD(r=ZD())&&(n.headerTemplate=r.first),QD(r=ZD())&&(n.expandIconTemplate=r.first),QD(r=ZD())&&(n.collapseIconTemplate=r.first),QD(r=ZD())&&(n.contentTemplate=r.first),QD(r=ZD())&&(n.templates=r);}},viewQuery:function(o,n){if(o&1&&Ih(he,5),o&2){let a;QD(a=ZD())&&(n.contentWrapperViewChild=a.first);}},inputs:{legend:"legend",toggleable:[2,"toggleable","toggleable",OL],style:"style",styleClass:"styleClass",transitionOptions:"transitionOptions",motionOptions:[1,"motionOptions"],collapsed:[2,"collapsed","collapsed",OL]},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[Aw([ge,{provide:fe,useExisting:t},{provide:wo,useExisting:t}]),iD([Hc]),rh],ngContentSelectors:Te,decls:11,vars:28,consts:[["legendContent",""],["contentWrapper",""],[3,"ngStyle","pBind"],[3,"pBind"],[4,"ngIf","ngIfElse"],["pMotionName","p-collapsible","role","region",3,"pMotionOnAfterEnter","pMotionOnAfterLeave","pBind","pMotion","pMotionOptions","id"],[4,"ngTemplateOutlet"],["tabindex","0","role","button",3,"click","keydown","pBind"],[4,"ngIf"],["data-p-icon","plus",3,"class","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],["data-p-icon","plus",3,"pBind"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],["data-p-icon","minus",3,"pBind"]],template:function(o,n){if(o&1&&(GD(ye),Ti(0,"fieldset",2)(1,"legend",3),ih(2,Se,5,10,"ng-container",4)(3,ke,4,5,"ng-template",null,0,zw),Uc(),Ti(5,"div",5),yh("pMotionOnAfterEnter",function(r){return n.onToggleDone(r)})("pMotionOnAfterLeave",function(r){return n.onToggleDone(r)}),Ti(6,"div",3)(7,"div",3,1),WD(9),ih(10,De,1,0,"ng-container",6),Uc()()()()),o&2){let a=KD(4);fw(n.cn(n.cx("root"),n.styleClass)),uh("ngStyle",n.style)("pBind",n.ptm("root")),lh("id",n.id)("data-p",n.dataP),gE(),fw(n.cx("legend")),uh("pBind",n.ptm("legend")),lh("data-p",n.dataP),gE(),uh("ngIf",n.toggleable)("ngIfElse",a),gE(3),fw(n.cx("contentContainer")),uh("pBind",n.ptm("contentContainer"))("pMotion",!n.toggleable||n.toggleable&&!n.collapsed)("pMotionOptions",n.computedMotionOptions())("id",n.id+"_content"),lh("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("tabindex",n.collapsed?"-1":void 0),gE(),fw(n.cx("contentWrapper")),uh("pBind",n.ptm("contentWrapper")),gE(),fw(n.cx("content")),uh("pBind",n.ptm("content")),gE(3),uh("ngTemplateOutlet",n.contentTemplate||n._contentTemplate);}},dependencies:[cn,us,cs,ls,re,Xo,el,Wc,Hc,dt,lt],encapsulation:2})}return t})(),rt=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=KI({type:t});static \u0275inj=bs({imports:[Ne,el,Wc,el,Wc]})}return t})();export{Ne as N,rt as r};