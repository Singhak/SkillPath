import {r as re}from'./chunk-B4Hqqe-9.js';import {g}from'./chunk-D8QVL7jY.js';import {a2 as eD,a3 as Ms,a4 as st,br as Vo,a5 as z,I,a6 as C,a7 as Ue,a8 as xL,a as nT,r,a9 as Fe$1,aa as We,aE as gy,c as JI,ah as oh,ai as LL,s as sr,ak as Xn,al as Yn,b5 as Zn,b8 as dt,bH as lt,an as QD,C as Ci,j as sh,aQ as Jw,h as Wc,v as vh,aI as ZD,bj as ew,aJ as gw,u as dh,_ as uh,k as vE,L as Lw,ao as at,ap as cD,D as Dh,E as KD,G as JD,aq as Ih,d as rt$1,aD as A,n as ne,au as VD,bk as Zc,av as bu,as as WD,aw as _u,bl as Yc,g as bw,F as Fh,aM as gh,Y as ju,f as fh}from'./main-KGKRJELG.js';var ce=`
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
`;var me=["header"],ue=["expandicon"],_e=["collapseicon"],be=["content"],he=["contentWrapper"],ye=["*",[["p-header"]]],Te=["*","p-header"];function ve(t,d){if(t&1&&(ju(),fh(0,"svg",11)),t&2){let e=WD(3);gw(e.cx("toggleIcon")),dh("pBind",e.ptm("toggleIcon"));}}function Ie(t,d){t&1&&gh(0);}function xe(t,d){if(t&1&&(Ci(0,"span",3),sh(1,Ie,1,0,"ng-container",6),Wc()),t&2){let e=WD(3);gw(e.cx("toggleIcon")),dh("pBind",e.ptm("toggleIcon")),vE(),dh("ngTemplateOutlet",e.expandIconTemplate||e._expandIconTemplate);}}function Ce(t,d){if(t&1&&(Zc(0),sh(1,ve,1,3,"svg",9)(2,xe,2,4,"span",10),Yc()),t&2){let e=WD(2);vE(),dh("ngIf",!e.expandIconTemplate&&!e._expandIconTemplate),vE(),dh("ngIf",e.expandIconTemplate||e._expandIconTemplate);}}function Me(t,d){if(t&1&&(ju(),fh(0,"svg",13)),t&2){let e=WD(3);gw(e.cx("toggleIcon")),dh("pBind",e.ptm("toggleIcon")),uh("aria-hidden",true);}}function we(t,d){t&1&&gh(0);}function Ee(t,d){if(t&1&&(Ci(0,"span",3),sh(1,we,1,0,"ng-container",6),Wc()),t&2){let e=WD(3);gw(e.cx("toggleIcon")),dh("pBind",e.ptm("toggleIcon")),vE(),dh("ngTemplateOutlet",e.collapseIconTemplate||e._collapseIconTemplate);}}function Be(t,d){if(t&1&&(Zc(0),sh(1,Me,1,4,"svg",12)(2,Ee,2,4,"span",10),Yc()),t&2){let e=WD(2);vE(),dh("ngIf",!e.collapseIconTemplate&&!e._collapseIconTemplate),vE(),dh("ngIf",e.collapseIconTemplate||e._collapseIconTemplate);}}function Fe(t,d){t&1&&gh(0);}function Se(t,d){if(t&1){let e=VD();Zc(0),Ci(1,"button",7),vh("click",function(n){bu(e);let a=WD();return _u(a.toggle(n))})("keydown",function(n){bu(e);let a=WD();return _u(a.onKeyDown(n))}),sh(2,Ce,3,2,"ng-container",8)(3,Be,3,2,"ng-container",8)(4,Fe,1,0,"ng-container",6),Wc(),Yc();}if(t&2){let e=WD(),o=ew(4);vE(),gw(e.cx("toggleButton")),dh("pBind",e.ptm("toggleButton")),uh("id",e.id+"_header")("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)("aria-label",e.buttonAriaLabel),vE(),dh("ngIf",e.collapsed),vE(),dh("ngIf",!e.collapsed),vE(),dh("ngTemplateOutlet",o);}}function Oe(t,d){t&1&&gh(0);}function ke(t,d){if(t&1&&(Ci(0,"span",3),bw(1),Wc(),ZD(2,1),sh(3,Oe,1,0,"ng-container",6)),t&2){let e=WD();gw(e.cx("legendLabel")),dh("pBind",e.ptm("legendLabel")),vE(),Fh(e.legend),vE(2),dh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function De(t,d){t&1&&gh(0);}var Ae={root:({instance:t})=>["p-fieldset p-component",{"p-fieldset-toggleable":t.toggleable,"p-fieldset-collapsed":t.collapsed&&t.toggleable}],legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",contentWrapper:"p-fieldset-content-wrapper",content:"p-fieldset-content"},ge=(()=>{class t extends A{name="fieldset";style=ce;classes=Ae;static \u0275fac=(()=>{let e;return function(n){return (e||(e=gy(t)))(n||t)}})();static \u0275prov=ne({token:t,factory:t.\u0275fac})}return t})();var fe=new C("FIELDSET_INSTANCE"),Ne=(()=>{class t extends z{componentName="Fieldset";$pcFieldset=I(fe,{optional:true,skipSelf:true})??void 0;_componentStyle=I(ge);bindDirectiveInstance=I(Ue,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"));}get dataP(){return this.cn({toggleable:this.toggleable})}legend;toggleable;style;styleClass;transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";motionOptions=xL(void 0);computedMotionOptions=nT(()=>r(r({},this.ptm("motion")),this.motionOptions()));collapsedChange=new Fe$1;onBeforeToggle=new Fe$1;onAfterToggle=new Fe$1;contentWrapperViewChild;_id=We("pn_id_");get id(){return this._id}get buttonAriaLabel(){return this.legend}_collapsed;get collapsed(){return this._collapsed}set collapsed(e){this._collapsed=e;}headerTemplate;expandIconTemplate;collapseIconTemplate;contentTemplate;toggle(e){this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),e.preventDefault();}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault());}expand(){this._collapsed=false,this.collapsedChange.emit(false),this.updateTabIndex();}collapse(){this._collapsed=true,this.collapsedChange.emit(true),this.updateTabIndex();}getBlockableElement(){return this.el.nativeElement.children[0]}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(o=>{this.collapsed?o.setAttribute("tabindex","-1"):o.removeAttribute("tabindex");});}onToggleDone(e){this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed});}_headerTemplate;_expandIconTemplate;_collapseIconTemplate;_contentTemplate;templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "expandicon":this._expandIconTemplate=e.template;break;case "collapseicon":this._collapseIconTemplate=e.template;break;case "content":this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=gy(t)))(n||t)}})();static \u0275cmp=JI({type:t,selectors:[["p-fieldset"]],contentQueries:function(o,n,a){if(o&1&&Ih(a,me,4)(a,ue,4)(a,_e,4)(a,be,4)(a,rt$1,4),o&2){let r;KD(r=JD())&&(n.headerTemplate=r.first),KD(r=JD())&&(n.expandIconTemplate=r.first),KD(r=JD())&&(n.collapseIconTemplate=r.first),KD(r=JD())&&(n.contentTemplate=r.first),KD(r=JD())&&(n.templates=r);}},viewQuery:function(o,n){if(o&1&&Dh(he,5),o&2){let a;KD(a=JD())&&(n.contentWrapperViewChild=a.first);}},inputs:{legend:"legend",toggleable:[2,"toggleable","toggleable",LL],style:"style",styleClass:"styleClass",transitionOptions:"transitionOptions",motionOptions:[1,"motionOptions"],collapsed:[2,"collapsed","collapsed",LL]},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[Lw([ge,{provide:fe,useExisting:t},{provide:at,useExisting:t}]),cD([Ue]),oh],ngContentSelectors:Te,decls:11,vars:28,consts:[["legendContent",""],["contentWrapper",""],[3,"ngStyle","pBind"],[3,"pBind"],[4,"ngIf","ngIfElse"],["pMotionName","p-collapsible","role","region",3,"pMotionOnAfterEnter","pMotionOnAfterLeave","pBind","pMotion","pMotionOptions","id"],[4,"ngTemplateOutlet"],["tabindex","0","role","button",3,"click","keydown","pBind"],[4,"ngIf"],["data-p-icon","plus",3,"class","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],["data-p-icon","plus",3,"pBind"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],["data-p-icon","minus",3,"pBind"]],template:function(o,n){if(o&1&&(QD(ye),Ci(0,"fieldset",2)(1,"legend",3),sh(2,Se,5,10,"ng-container",4)(3,ke,4,5,"ng-template",null,0,Jw),Wc(),Ci(5,"div",5),vh("pMotionOnAfterEnter",function(r){return n.onToggleDone(r)})("pMotionOnAfterLeave",function(r){return n.onToggleDone(r)}),Ci(6,"div",3)(7,"div",3,1),ZD(9),sh(10,De,1,0,"ng-container",6),Wc()()()()),o&2){let a=ew(4);gw(n.cn(n.cx("root"),n.styleClass)),dh("ngStyle",n.style)("pBind",n.ptm("root")),uh("id",n.id)("data-p",n.dataP),vE(),gw(n.cx("legend")),dh("pBind",n.ptm("legend")),uh("data-p",n.dataP),vE(),dh("ngIf",n.toggleable)("ngIfElse",a),vE(3),gw(n.cx("contentContainer")),dh("pBind",n.ptm("contentContainer"))("pMotion",!n.toggleable||n.toggleable&&!n.collapsed)("pMotionOptions",n.computedMotionOptions())("id",n.id+"_content"),uh("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("tabindex",n.collapsed?"-1":void 0),vE(),gw(n.cx("contentWrapper")),dh("pBind",n.ptm("contentWrapper")),vE(),gw(n.cx("content")),dh("pBind",n.ptm("content")),vE(3),dh("ngTemplateOutlet",n.contentTemplate||n._contentTemplate);}},dependencies:[sr,Xn,Yn,Zn,re,g,st,Vo,Ue,dt,lt],encapsulation:2})}return t})(),rt=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=eD({type:t});static \u0275inj=Ms({imports:[Ne,st,Vo,st,Vo]})}return t})();export{Ne as N,rt as r};