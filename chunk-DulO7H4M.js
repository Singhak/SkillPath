import {ag as Y,I,aB as C,ah as R,aK as ML,$ as Qw,r as r$1,ai as Le,aS as mt,ar as dy,z as zI,f as fe$1,au as In,av as Pn,aw as On,cw as re,af as Pe,bs as _r,aM as dt,cn as lt,ay as th,az as kL,aN as $D,T as Ti,m as rh,a$ as qw,U as Uc,g as gh,b2 as UD,b3 as QD,u as lw,o as ch,aO as ah,p as pE,X as Nw,aC as he$1,aD as rD,aE as vh,aF as GD,aG as WD,aH as yh,h as cr,ad as ZI,ae as bs,aJ as H,e as ee,k as kD,b4 as Wc,D as Du,H as HD,c as wu,b5 as zc,E as Ew,n as Oh,b6 as fh,aT as Pu,l as lh}from'./main-GV7BBZP3.js';import {X as Xo}from'./chunk-CWVoO9wm.js';var ce=`
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
`;var me=["header"],ue=["expandicon"],_e=["collapseicon"],be=["content"],he=["contentWrapper"],ye=["*",[["p-header"]]],Te=["*","p-header"];function ve(t,d){if(t&1&&(Pu(),lh(0,"svg",11)),t&2){let e=HD(3);lw(e.cx("toggleIcon")),ch("pBind",e.ptm("toggleIcon"));}}function Ie(t,d){t&1&&fh(0);}function xe(t,d){if(t&1&&(Ti(0,"span",3),rh(1,Ie,1,0,"ng-container",6),Uc()),t&2){let e=HD(3);lw(e.cx("toggleIcon")),ch("pBind",e.ptm("toggleIcon")),pE(),ch("ngTemplateOutlet",e.expandIconTemplate||e._expandIconTemplate);}}function Ce(t,d){if(t&1&&(Wc(0),rh(1,ve,1,3,"svg",9)(2,xe,2,4,"span",10),zc()),t&2){let e=HD(2);pE(),ch("ngIf",!e.expandIconTemplate&&!e._expandIconTemplate),pE(),ch("ngIf",e.expandIconTemplate||e._expandIconTemplate);}}function Me(t,d){if(t&1&&(Pu(),lh(0,"svg",13)),t&2){let e=HD(3);lw(e.cx("toggleIcon")),ch("pBind",e.ptm("toggleIcon")),ah("aria-hidden",true);}}function we(t,d){t&1&&fh(0);}function Ee(t,d){if(t&1&&(Ti(0,"span",3),rh(1,we,1,0,"ng-container",6),Uc()),t&2){let e=HD(3);lw(e.cx("toggleIcon")),ch("pBind",e.ptm("toggleIcon")),pE(),ch("ngTemplateOutlet",e.collapseIconTemplate||e._collapseIconTemplate);}}function Be(t,d){if(t&1&&(Wc(0),rh(1,Me,1,4,"svg",12)(2,Ee,2,4,"span",10),zc()),t&2){let e=HD(2);pE(),ch("ngIf",!e.collapseIconTemplate&&!e._collapseIconTemplate),pE(),ch("ngIf",e.collapseIconTemplate||e._collapseIconTemplate);}}function Fe(t,d){t&1&&fh(0);}function Se(t,d){if(t&1){let e=kD();Wc(0),Ti(1,"button",7),gh("click",function(n){Du(e);let a=HD();return wu(a.toggle(n))})("keydown",function(n){Du(e);let a=HD();return wu(a.onKeyDown(n))}),rh(2,Ce,3,2,"ng-container",8)(3,Be,3,2,"ng-container",8)(4,Fe,1,0,"ng-container",6),Uc(),zc();}if(t&2){let e=HD(),o=QD(4);pE(),lw(e.cx("toggleButton")),ch("pBind",e.ptm("toggleButton")),ah("id",e.id+"_header")("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)("aria-label",e.buttonAriaLabel),pE(),ch("ngIf",e.collapsed),pE(),ch("ngIf",!e.collapsed),pE(),ch("ngTemplateOutlet",o);}}function Oe(t,d){t&1&&fh(0);}function ke(t,d){if(t&1&&(Ti(0,"span",3),Ew(1),Uc(),UD(2,1),rh(3,Oe,1,0,"ng-container",6)),t&2){let e=HD();lw(e.cx("legendLabel")),ch("pBind",e.ptm("legendLabel")),pE(),Oh(e.legend),pE(2),ch("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function De(t,d){t&1&&fh(0);}var Ae={root:({instance:t})=>["p-fieldset p-component",{"p-fieldset-toggleable":t.toggleable,"p-fieldset-collapsed":t.collapsed&&t.toggleable}],legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",contentWrapper:"p-fieldset-content-wrapper",content:"p-fieldset-content"},ge=(()=>{class t extends H{name="fieldset";style=ce;classes=Ae;static \u0275fac=(()=>{let e;return function(n){return (e||(e=dy(t)))(n||t)}})();static \u0275prov=ee({token:t,factory:t.\u0275fac})}return t})();var fe=new C("FIELDSET_INSTANCE"),Ne=(()=>{class t extends Y{componentName="Fieldset";$pcFieldset=I(fe,{optional:true,skipSelf:true})??void 0;_componentStyle=I(ge);bindDirectiveInstance=I(R,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"));}get dataP(){return this.cn({toggleable:this.toggleable})}legend;toggleable;style;styleClass;transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";motionOptions=ML(void 0);computedMotionOptions=Qw(()=>r$1(r$1({},this.ptm("motion")),this.motionOptions()));collapsedChange=new Le;onBeforeToggle=new Le;onAfterToggle=new Le;contentWrapperViewChild;_id=mt("pn_id_");get id(){return this._id}get buttonAriaLabel(){return this.legend}_collapsed;get collapsed(){return this._collapsed}set collapsed(e){this._collapsed=e;}headerTemplate;expandIconTemplate;collapseIconTemplate;contentTemplate;toggle(e){this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),e.preventDefault();}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault());}expand(){this._collapsed=false,this.collapsedChange.emit(false),this.updateTabIndex();}collapse(){this._collapsed=true,this.collapsedChange.emit(true),this.updateTabIndex();}getBlockableElement(){return this.el.nativeElement.children[0]}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(o=>{this.collapsed?o.setAttribute("tabindex","-1"):o.removeAttribute("tabindex");});}onToggleDone(e){this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed});}_headerTemplate;_expandIconTemplate;_collapseIconTemplate;_contentTemplate;templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "expandicon":this._expandIconTemplate=e.template;break;case "collapseicon":this._collapseIconTemplate=e.template;break;case "content":this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=dy(t)))(n||t)}})();static \u0275cmp=zI({type:t,selectors:[["p-fieldset"]],contentQueries:function(o,n,a){if(o&1&&yh(a,me,4)(a,ue,4)(a,_e,4)(a,be,4)(a,cr,4),o&2){let r;GD(r=WD())&&(n.headerTemplate=r.first),GD(r=WD())&&(n.expandIconTemplate=r.first),GD(r=WD())&&(n.collapseIconTemplate=r.first),GD(r=WD())&&(n.contentTemplate=r.first),GD(r=WD())&&(n.templates=r);}},viewQuery:function(o,n){if(o&1&&vh(he,5),o&2){let a;GD(a=WD())&&(n.contentWrapperViewChild=a.first);}},inputs:{legend:"legend",toggleable:[2,"toggleable","toggleable",kL],style:"style",styleClass:"styleClass",transitionOptions:"transitionOptions",motionOptions:[1,"motionOptions"],collapsed:[2,"collapsed","collapsed",kL]},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[Nw([ge,{provide:fe,useExisting:t},{provide:he$1,useExisting:t}]),rD([R]),th],ngContentSelectors:Te,decls:11,vars:28,consts:[["legendContent",""],["contentWrapper",""],[3,"ngStyle","pBind"],[3,"pBind"],[4,"ngIf","ngIfElse"],["pMotionName","p-collapsible","role","region",3,"pMotionOnAfterEnter","pMotionOnAfterLeave","pBind","pMotion","pMotionOptions","id"],[4,"ngTemplateOutlet"],["tabindex","0","role","button",3,"click","keydown","pBind"],[4,"ngIf"],["data-p-icon","plus",3,"class","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],["data-p-icon","plus",3,"pBind"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],["data-p-icon","minus",3,"pBind"]],template:function(o,n){if(o&1&&($D(ye),Ti(0,"fieldset",2)(1,"legend",3),rh(2,Se,5,10,"ng-container",4)(3,ke,4,5,"ng-template",null,0,qw),Uc(),Ti(5,"div",5),gh("pMotionOnAfterEnter",function(r){return n.onToggleDone(r)})("pMotionOnAfterLeave",function(r){return n.onToggleDone(r)}),Ti(6,"div",3)(7,"div",3,1),UD(9),rh(10,De,1,0,"ng-container",6),Uc()()()()),o&2){let a=QD(4);lw(n.cn(n.cx("root"),n.styleClass)),ch("ngStyle",n.style)("pBind",n.ptm("root")),ah("id",n.id)("data-p",n.dataP),pE(),lw(n.cx("legend")),ch("pBind",n.ptm("legend")),ah("data-p",n.dataP),pE(),ch("ngIf",n.toggleable)("ngIfElse",a),pE(3),lw(n.cx("contentContainer")),ch("pBind",n.ptm("contentContainer"))("pMotion",!n.toggleable||n.toggleable&&!n.collapsed)("pMotionOptions",n.computedMotionOptions())("id",n.id+"_content"),ah("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("tabindex",n.collapsed?"-1":void 0),pE(),lw(n.cx("contentWrapper")),ch("pBind",n.ptm("contentWrapper")),pE(),lw(n.cx("content")),ch("pBind",n.ptm("content")),pE(3),ch("ngTemplateOutlet",n.contentTemplate||n._contentTemplate);}},dependencies:[fe$1,In,Pn,On,re,Xo,Pe,_r,R,dt,lt],encapsulation:2})}return t})(),rt=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=ZI({type:t});static \u0275inj=bs({imports:[Ne,Pe,_r,Pe,_r]})}return t})();export{Ne as N,rt as r};