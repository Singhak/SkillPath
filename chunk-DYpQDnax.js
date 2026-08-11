import {r as re}from'./chunk-Jf6PVjCJ.js';import {g}from'./chunk-BUx8VV4m.js';import {U as JI,W as bs,$ as st,bq as Vo,a0 as z,I,a1 as C,a2 as Ue,a3 as SL,X as Xw,r,a4 as Fe$1,a5 as We,aB as hy,Y as YI,ac as oh,ad as PL,b as rr,af as Wn,ag as Zn,b2 as Xn,b5 as dt,bG as lt,ai as WD,T as Ti,s as sh,aL as Zw,G as Gc,v as vh,aG as zD,bg as JD,aJ as pw,n as dh,P as uh,m as mE,y as kw,aj as at,ak as sD,D as Dh,Z as ZD,z as YD,al as Ih,d as rt$1,aA as A,e as ee,ap as FD,bh as Qc,aq as bu,an as qD,ar as _u,bi as Zc,h as Tw,F as Fh,aH as gh,L as ju,g as fh}from'./main-H2DRMQCD.js';var ce=`
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
`;var me=["header"],ue=["expandicon"],_e=["collapseicon"],be=["content"],he=["contentWrapper"],ye=["*",[["p-header"]]],Te=["*","p-header"];function ve(t,d){if(t&1&&(ju(),fh(0,"svg",11)),t&2){let e=qD(3);pw(e.cx("toggleIcon")),dh("pBind",e.ptm("toggleIcon"));}}function Ie(t,d){t&1&&gh(0);}function xe(t,d){if(t&1&&(Ti(0,"span",3),sh(1,Ie,1,0,"ng-container",6),Gc()),t&2){let e=qD(3);pw(e.cx("toggleIcon")),dh("pBind",e.ptm("toggleIcon")),mE(),dh("ngTemplateOutlet",e.expandIconTemplate||e._expandIconTemplate);}}function Ce(t,d){if(t&1&&(Qc(0),sh(1,ve,1,3,"svg",9)(2,xe,2,4,"span",10),Zc()),t&2){let e=qD(2);mE(),dh("ngIf",!e.expandIconTemplate&&!e._expandIconTemplate),mE(),dh("ngIf",e.expandIconTemplate||e._expandIconTemplate);}}function Me(t,d){if(t&1&&(ju(),fh(0,"svg",13)),t&2){let e=qD(3);pw(e.cx("toggleIcon")),dh("pBind",e.ptm("toggleIcon")),uh("aria-hidden",true);}}function we(t,d){t&1&&gh(0);}function Ee(t,d){if(t&1&&(Ti(0,"span",3),sh(1,we,1,0,"ng-container",6),Gc()),t&2){let e=qD(3);pw(e.cx("toggleIcon")),dh("pBind",e.ptm("toggleIcon")),mE(),dh("ngTemplateOutlet",e.collapseIconTemplate||e._collapseIconTemplate);}}function Be(t,d){if(t&1&&(Qc(0),sh(1,Me,1,4,"svg",12)(2,Ee,2,4,"span",10),Zc()),t&2){let e=qD(2);mE(),dh("ngIf",!e.collapseIconTemplate&&!e._collapseIconTemplate),mE(),dh("ngIf",e.collapseIconTemplate||e._collapseIconTemplate);}}function Fe(t,d){t&1&&gh(0);}function Se(t,d){if(t&1){let e=FD();Qc(0),Ti(1,"button",7),vh("click",function(n){bu(e);let a=qD();return _u(a.toggle(n))})("keydown",function(n){bu(e);let a=qD();return _u(a.onKeyDown(n))}),sh(2,Ce,3,2,"ng-container",8)(3,Be,3,2,"ng-container",8)(4,Fe,1,0,"ng-container",6),Gc(),Zc();}if(t&2){let e=qD(),o=JD(4);mE(),pw(e.cx("toggleButton")),dh("pBind",e.ptm("toggleButton")),uh("id",e.id+"_header")("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)("aria-label",e.buttonAriaLabel),mE(),dh("ngIf",e.collapsed),mE(),dh("ngIf",!e.collapsed),mE(),dh("ngTemplateOutlet",o);}}function Oe(t,d){t&1&&gh(0);}function ke(t,d){if(t&1&&(Ti(0,"span",3),Tw(1),Gc(),zD(2,1),sh(3,Oe,1,0,"ng-container",6)),t&2){let e=qD();pw(e.cx("legendLabel")),dh("pBind",e.ptm("legendLabel")),mE(),Fh(e.legend),mE(2),dh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function De(t,d){t&1&&gh(0);}var Ae={root:({instance:t})=>["p-fieldset p-component",{"p-fieldset-toggleable":t.toggleable,"p-fieldset-collapsed":t.collapsed&&t.toggleable}],legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",contentWrapper:"p-fieldset-content-wrapper",content:"p-fieldset-content"},ge=(()=>{class t extends A{name="fieldset";style=ce;classes=Ae;static \u0275fac=(()=>{let e;return function(n){return (e||(e=hy(t)))(n||t)}})();static \u0275prov=ee({token:t,factory:t.\u0275fac})}return t})();var fe=new C("FIELDSET_INSTANCE"),Ne=(()=>{class t extends z{componentName="Fieldset";$pcFieldset=I(fe,{optional:true,skipSelf:true})??void 0;_componentStyle=I(ge);bindDirectiveInstance=I(Ue,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"));}get dataP(){return this.cn({toggleable:this.toggleable})}legend;toggleable;style;styleClass;transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";motionOptions=SL(void 0);computedMotionOptions=Xw(()=>r(r({},this.ptm("motion")),this.motionOptions()));collapsedChange=new Fe$1;onBeforeToggle=new Fe$1;onAfterToggle=new Fe$1;contentWrapperViewChild;_id=We("pn_id_");get id(){return this._id}get buttonAriaLabel(){return this.legend}_collapsed;get collapsed(){return this._collapsed}set collapsed(e){this._collapsed=e;}headerTemplate;expandIconTemplate;collapseIconTemplate;contentTemplate;toggle(e){this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),e.preventDefault();}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault());}expand(){this._collapsed=false,this.collapsedChange.emit(false),this.updateTabIndex();}collapse(){this._collapsed=true,this.collapsedChange.emit(true),this.updateTabIndex();}getBlockableElement(){return this.el.nativeElement.children[0]}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(o=>{this.collapsed?o.setAttribute("tabindex","-1"):o.removeAttribute("tabindex");});}onToggleDone(e){this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed});}_headerTemplate;_expandIconTemplate;_collapseIconTemplate;_contentTemplate;templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "expandicon":this._expandIconTemplate=e.template;break;case "collapseicon":this._collapseIconTemplate=e.template;break;case "content":this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=hy(t)))(n||t)}})();static \u0275cmp=YI({type:t,selectors:[["p-fieldset"]],contentQueries:function(o,n,a){if(o&1&&Ih(a,me,4)(a,ue,4)(a,_e,4)(a,be,4)(a,rt$1,4),o&2){let r;ZD(r=YD())&&(n.headerTemplate=r.first),ZD(r=YD())&&(n.expandIconTemplate=r.first),ZD(r=YD())&&(n.collapseIconTemplate=r.first),ZD(r=YD())&&(n.contentTemplate=r.first),ZD(r=YD())&&(n.templates=r);}},viewQuery:function(o,n){if(o&1&&Dh(he,5),o&2){let a;ZD(a=YD())&&(n.contentWrapperViewChild=a.first);}},inputs:{legend:"legend",toggleable:[2,"toggleable","toggleable",PL],style:"style",styleClass:"styleClass",transitionOptions:"transitionOptions",motionOptions:[1,"motionOptions"],collapsed:[2,"collapsed","collapsed",PL]},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[kw([ge,{provide:fe,useExisting:t},{provide:at,useExisting:t}]),sD([Ue]),oh],ngContentSelectors:Te,decls:11,vars:28,consts:[["legendContent",""],["contentWrapper",""],[3,"ngStyle","pBind"],[3,"pBind"],[4,"ngIf","ngIfElse"],["pMotionName","p-collapsible","role","region",3,"pMotionOnAfterEnter","pMotionOnAfterLeave","pBind","pMotion","pMotionOptions","id"],[4,"ngTemplateOutlet"],["tabindex","0","role","button",3,"click","keydown","pBind"],[4,"ngIf"],["data-p-icon","plus",3,"class","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],["data-p-icon","plus",3,"pBind"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],["data-p-icon","minus",3,"pBind"]],template:function(o,n){if(o&1&&(WD(ye),Ti(0,"fieldset",2)(1,"legend",3),sh(2,Se,5,10,"ng-container",4)(3,ke,4,5,"ng-template",null,0,Zw),Gc(),Ti(5,"div",5),vh("pMotionOnAfterEnter",function(r){return n.onToggleDone(r)})("pMotionOnAfterLeave",function(r){return n.onToggleDone(r)}),Ti(6,"div",3)(7,"div",3,1),zD(9),sh(10,De,1,0,"ng-container",6),Gc()()()()),o&2){let a=JD(4);pw(n.cn(n.cx("root"),n.styleClass)),dh("ngStyle",n.style)("pBind",n.ptm("root")),uh("id",n.id)("data-p",n.dataP),mE(),pw(n.cx("legend")),dh("pBind",n.ptm("legend")),uh("data-p",n.dataP),mE(),dh("ngIf",n.toggleable)("ngIfElse",a),mE(3),pw(n.cx("contentContainer")),dh("pBind",n.ptm("contentContainer"))("pMotion",!n.toggleable||n.toggleable&&!n.collapsed)("pMotionOptions",n.computedMotionOptions())("id",n.id+"_content"),uh("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("tabindex",n.collapsed?"-1":void 0),mE(),pw(n.cx("contentWrapper")),dh("pBind",n.ptm("contentWrapper")),mE(),pw(n.cx("content")),dh("pBind",n.ptm("content")),mE(3),dh("ngTemplateOutlet",n.contentTemplate||n._contentTemplate);}},dependencies:[rr,Wn,Zn,Xn,re,g,st,Vo,Ue,dt,lt],encapsulation:2})}return t})(),rt=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=JI({type:t});static \u0275inj=bs({imports:[Ne,st,Vo,st,Vo]})}return t})();export{Ne as N,rt as r};