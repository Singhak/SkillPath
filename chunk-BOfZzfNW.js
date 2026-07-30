import {aa as YI,ab as bs,ac as el,bf as Wc,ad as hr,I,ax as C,ae as Hc,bj as Qe,H as Ho,ao as fy,Q as QI,c as cn,aq as us,ar as cs,au as nh,aJ as qD,o as oh,T as Ti,a_ as GD,U as Uc,l as lh,h as hE,E as dw,a3 as xw,ay as wo,az as oD,aX as lw,aD as vh,bX as qu,bw as Ju,b as Qu,aB as zD,aC as QD,aF as ve,e as ee$1,$ as $D,b2 as ph,b0 as Wc$1,D as Dw,b1 as zc,P as Ph}from'./main-PYZMBKVO.js';var U=`
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
`;var Y=["header"],Z=["title"],ee=["subtitle"],te=["content"],ne=["footer"],ie=["*",[["p-header"]],[["p-footer"]]],ae=["*","p-header","p-footer"];function re(t,l){t&1&&ph(0);}function oe(t,l){if(t&1&&(Ti(0,"div",1),GD(1,1),oh(2,re,1,0,"ng-container",2),Uc()),t&2){let e=$D();dw(e.cx("header")),lh("pBind",e.ptm("header")),hE(2),lh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function le(t,l){if(t&1&&(Wc$1(0),Dw(1),zc()),t&2){let e=$D(2);hE(),Ph(e.header);}}function pe(t,l){t&1&&ph(0);}function ce(t,l){if(t&1&&(Ti(0,"div",1),oh(1,le,2,1,"ng-container",3)(2,pe,1,0,"ng-container",2),Uc()),t&2){let e=$D();dw(e.cx("title")),lh("pBind",e.ptm("title")),hE(),lh("ngIf",e.header&&!e._titleTemplate&&!e.titleTemplate),hE(),lh("ngTemplateOutlet",e.titleTemplate||e._titleTemplate);}}function de(t,l){if(t&1&&(Wc$1(0),Dw(1),zc()),t&2){let e=$D(2);hE(),Ph(e.subheader);}}function se(t,l){t&1&&ph(0);}function me(t,l){if(t&1&&(Ti(0,"div",1),oh(1,de,2,1,"ng-container",3)(2,se,1,0,"ng-container",2),Uc()),t&2){let e=$D();dw(e.cx("subtitle")),lh("pBind",e.ptm("subtitle")),hE(),lh("ngIf",e.subheader&&!e._subtitleTemplate&&!e.subtitleTemplate),hE(),lh("ngTemplateOutlet",e.subtitleTemplate||e._subtitleTemplate);}}function fe(t,l){t&1&&ph(0);}function ue(t,l){t&1&&ph(0);}function _e(t,l){if(t&1&&(Ti(0,"div",1),GD(1,2),oh(2,ue,1,0,"ng-container",2),Uc()),t&2){let e=$D();dw(e.cx("footer")),lh("pBind",e.ptm("footer")),hE(2),lh("ngTemplateOutlet",e.footerTemplate||e._footerTemplate);}}var ye=`
    ${U}

    .p-card {
        display: block;
    }
`,he={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},W=(()=>{class t extends ve{name="card";style=ye;classes=he;static \u0275fac=(()=>{let e;return function(n){return (e||(e=fy(t)))(n||t)}})();static \u0275prov=ee$1({token:t,factory:t.\u0275fac})}return t})();var X=new C("CARD_INSTANCE"),Te=(()=>{class t extends hr{componentName="Card";$pcCard=I(X,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Hc,{self:true});_componentStyle=I(W);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}header;subheader;set style(e){Qe(this._style(),e)||(this._style.set(e),this.el?.nativeElement&&e&&Object.keys(e).forEach(o=>{this.el.nativeElement.style[o]=e[o];}));}get style(){return this._style()}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=Ho(null);getBlockableElement(){return this.el.nativeElement}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "title":this._titleTemplate=e.template;break;case "subtitle":this._subtitleTemplate=e.template;break;case "content":this._contentTemplate=e.template;break;case "footer":this._footerTemplate=e.template;break;default:this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=fy(t)))(n||t)}})();static \u0275cmp=QI({type:t,selectors:[["p-card"]],contentQueries:function(o,n,s){if(o&1&&vh(s,qu,5)(s,Ju,5)(s,Y,4)(s,Z,4)(s,ee,4)(s,te,4)(s,ne,4)(s,Qu,4),o&2){let a;zD(a=QD())&&(n.headerFacet=a.first),zD(a=QD())&&(n.footerFacet=a.first),zD(a=QD())&&(n.headerTemplate=a.first),zD(a=QD())&&(n.titleTemplate=a.first),zD(a=QD())&&(n.subtitleTemplate=a.first),zD(a=QD())&&(n.contentTemplate=a.first),zD(a=QD())&&(n.footerTemplate=a.first),zD(a=QD())&&(n.templates=a);}},hostVars:4,hostBindings:function(o,n){o&2&&(lw(n._style()),dw(n.cn(n.cx("root"),n.styleClass)));},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[xw([W,{provide:X,useExisting:t},{provide:wo,useExisting:t}]),oD([Hc]),nh],ngContentSelectors:ae,decls:8,vars:11,consts:[[3,"pBind","class",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(o,n){o&1&&(qD(ie),oh(0,oe,3,4,"div",0),Ti(1,"div",1),oh(2,ce,3,5,"div",0)(3,me,3,5,"div",0),Ti(4,"div",1),GD(5),oh(6,fe,1,0,"ng-container",2),Uc(),oh(7,_e,3,4,"div",0),Uc()),o&2&&(lh("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),hE(),dw(n.cx("body")),lh("pBind",n.ptm("body")),hE(),lh("ngIf",n.header||n.titleTemplate||n._titleTemplate),hE(),lh("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),hE(),dw(n.cx("content")),lh("pBind",n.ptm("content")),hE(2),lh("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),hE(),lh("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate));},dependencies:[cn,us,cs,el,Wc,Hc],encapsulation:2})}return t})(),Oe=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=YI({type:t});static \u0275inj=bs({imports:[Te,el,Wc,el,Wc]})}return t})();export{Oe as O};