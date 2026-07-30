import {aa as KI,ab as bs,ac as el,bf as Wc,ad as hr,I,ax as C,ae as Hc,bj as Qe,H as Ho,ao as py,Z as ZI,c as cn,aq as us,ar as cs,au as rh,aJ as GD,k as ih,T as Ti,a_ as WD,U as Uc,u as uh,l as gE,C as fw,a3 as Aw,ay as wo,az as iD,aX as uw,aD as Eh,bY as qu,bx as Ju,Q as Qu,aB as QD,aC as ZD,aF as ve,e as ee$1,n as UD,b2 as hh,b0 as Wc$1,b as ww,b1 as zc,L as Lh}from'./main-PV6KZ257.js';var U=`
    .p-card {
        background: dt('card.background');
        color: dt('card.color');
        box-shadow: dt('card.shadow');
        border-radius: dt('card.border.radius');
        display: flex;
        flex-direction: column;
    }

    .p-card-caption {
        display: flex;
        flex-direction: column;
        gap: dt('card.caption.gap');
    }

    .p-card-body {
        padding: dt('card.body.padding');
        display: flex;
        flex-direction: column;
        gap: dt('card.body.gap');
    }

    .p-card-title {
        font-size: dt('card.title.font.size');
        font-weight: dt('card.title.font.weight');
    }

    .p-card-subtitle {
        color: dt('card.subtitle.color');
    }
`;var Y=["header"],Z=["title"],ee=["subtitle"],te=["content"],ne=["footer"],ie=["*",[["p-header"]],[["p-footer"]]],ae=["*","p-header","p-footer"];function re(t,l){t&1&&hh(0);}function oe(t,l){if(t&1&&(Ti(0,"div",1),WD(1,1),ih(2,re,1,0,"ng-container",2),Uc()),t&2){let e=UD();fw(e.cx("header")),uh("pBind",e.ptm("header")),gE(2),uh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function le(t,l){if(t&1&&(Wc$1(0),ww(1),zc()),t&2){let e=UD(2);gE(),Lh(e.header);}}function pe(t,l){t&1&&hh(0);}function ce(t,l){if(t&1&&(Ti(0,"div",1),ih(1,le,2,1,"ng-container",3)(2,pe,1,0,"ng-container",2),Uc()),t&2){let e=UD();fw(e.cx("title")),uh("pBind",e.ptm("title")),gE(),uh("ngIf",e.header&&!e._titleTemplate&&!e.titleTemplate),gE(),uh("ngTemplateOutlet",e.titleTemplate||e._titleTemplate);}}function de(t,l){if(t&1&&(Wc$1(0),ww(1),zc()),t&2){let e=UD(2);gE(),Lh(e.subheader);}}function se(t,l){t&1&&hh(0);}function me(t,l){if(t&1&&(Ti(0,"div",1),ih(1,de,2,1,"ng-container",3)(2,se,1,0,"ng-container",2),Uc()),t&2){let e=UD();fw(e.cx("subtitle")),uh("pBind",e.ptm("subtitle")),gE(),uh("ngIf",e.subheader&&!e._subtitleTemplate&&!e.subtitleTemplate),gE(),uh("ngTemplateOutlet",e.subtitleTemplate||e._subtitleTemplate);}}function fe(t,l){t&1&&hh(0);}function ue(t,l){t&1&&hh(0);}function _e(t,l){if(t&1&&(Ti(0,"div",1),WD(1,2),ih(2,ue,1,0,"ng-container",2),Uc()),t&2){let e=UD();fw(e.cx("footer")),uh("pBind",e.ptm("footer")),gE(2),uh("ngTemplateOutlet",e.footerTemplate||e._footerTemplate);}}var ye=`
    ${U}

    .p-card {
        display: block;
    }
`,he={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},W=(()=>{class t extends ve{name="card";style=ye;classes=he;static \u0275fac=(()=>{let e;return function(n){return (e||(e=py(t)))(n||t)}})();static \u0275prov=ee$1({token:t,factory:t.\u0275fac})}return t})();var X=new C("CARD_INSTANCE"),Te=(()=>{class t extends hr{componentName="Card";$pcCard=I(X,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Hc,{self:true});_componentStyle=I(W);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}header;subheader;set style(e){Qe(this._style(),e)||(this._style.set(e),this.el?.nativeElement&&e&&Object.keys(e).forEach(o=>{this.el.nativeElement.style[o]=e[o];}));}get style(){return this._style()}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=Ho(null);getBlockableElement(){return this.el.nativeElement}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "title":this._titleTemplate=e.template;break;case "subtitle":this._subtitleTemplate=e.template;break;case "content":this._contentTemplate=e.template;break;case "footer":this._footerTemplate=e.template;break;default:this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=py(t)))(n||t)}})();static \u0275cmp=ZI({type:t,selectors:[["p-card"]],contentQueries:function(o,n,s){if(o&1&&Eh(s,qu,5)(s,Ju,5)(s,Y,4)(s,Z,4)(s,ee,4)(s,te,4)(s,ne,4)(s,Qu,4),o&2){let a;QD(a=ZD())&&(n.headerFacet=a.first),QD(a=ZD())&&(n.footerFacet=a.first),QD(a=ZD())&&(n.headerTemplate=a.first),QD(a=ZD())&&(n.titleTemplate=a.first),QD(a=ZD())&&(n.subtitleTemplate=a.first),QD(a=ZD())&&(n.contentTemplate=a.first),QD(a=ZD())&&(n.footerTemplate=a.first),QD(a=ZD())&&(n.templates=a);}},hostVars:4,hostBindings:function(o,n){o&2&&(uw(n._style()),fw(n.cn(n.cx("root"),n.styleClass)));},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[Aw([W,{provide:X,useExisting:t},{provide:wo,useExisting:t}]),iD([Hc]),rh],ngContentSelectors:ae,decls:8,vars:11,consts:[[3,"pBind","class",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(o,n){o&1&&(GD(ie),ih(0,oe,3,4,"div",0),Ti(1,"div",1),ih(2,ce,3,5,"div",0)(3,me,3,5,"div",0),Ti(4,"div",1),WD(5),ih(6,fe,1,0,"ng-container",2),Uc(),ih(7,_e,3,4,"div",0),Uc()),o&2&&(uh("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),gE(),fw(n.cx("body")),uh("pBind",n.ptm("body")),gE(),uh("ngIf",n.header||n.titleTemplate||n._titleTemplate),gE(),uh("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),gE(),fw(n.cx("content")),uh("pBind",n.ptm("content")),gE(2),uh("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),gE(),uh("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate));},dependencies:[cn,us,cs,el,Wc,Hc],encapsulation:2})}return t})(),Oe=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=KI({type:t});static \u0275inj=bs({imports:[Te,el,Wc,el,Wc]})}return t})();export{Oe as O};