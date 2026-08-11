import {U as JI,W as bs,$ as st,bq as Vo,a0 as z,I,a1 as C,a2 as Ue,bu as S,H as Ho,aB as hy,Y as YI,ac as oh,b as rr,af as Wn,ag as Zn,ai as WD,s as sh,T as Ti,aG as zD,G as Gc,n as dh,m as mE,aJ as pw,y as kw,aj as at,ak as sD,u as dw,al as Ih,c3 as et,am as at$1,d as rt,Z as ZD,z as YD,aA as A,e as ee$1,an as qD,aH as gh,bh as Qc,h as Tw,bi as Zc,F as Fh}from'./main-H2DRMQCD.js';var U=`
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
`;var Y=["header"],Z=["title"],ee=["subtitle"],te=["content"],ne=["footer"],ie=["*",[["p-header"]],[["p-footer"]]],ae=["*","p-header","p-footer"];function re(t,l){t&1&&gh(0);}function oe(t,l){if(t&1&&(Ti(0,"div",1),zD(1,1),sh(2,re,1,0,"ng-container",2),Gc()),t&2){let e=qD();pw(e.cx("header")),dh("pBind",e.ptm("header")),mE(2),dh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function le(t,l){if(t&1&&(Qc(0),Tw(1),Zc()),t&2){let e=qD(2);mE(),Fh(e.header);}}function pe(t,l){t&1&&gh(0);}function ce(t,l){if(t&1&&(Ti(0,"div",1),sh(1,le,2,1,"ng-container",3)(2,pe,1,0,"ng-container",2),Gc()),t&2){let e=qD();pw(e.cx("title")),dh("pBind",e.ptm("title")),mE(),dh("ngIf",e.header&&!e._titleTemplate&&!e.titleTemplate),mE(),dh("ngTemplateOutlet",e.titleTemplate||e._titleTemplate);}}function de(t,l){if(t&1&&(Qc(0),Tw(1),Zc()),t&2){let e=qD(2);mE(),Fh(e.subheader);}}function se(t,l){t&1&&gh(0);}function me(t,l){if(t&1&&(Ti(0,"div",1),sh(1,de,2,1,"ng-container",3)(2,se,1,0,"ng-container",2),Gc()),t&2){let e=qD();pw(e.cx("subtitle")),dh("pBind",e.ptm("subtitle")),mE(),dh("ngIf",e.subheader&&!e._subtitleTemplate&&!e.subtitleTemplate),mE(),dh("ngTemplateOutlet",e.subtitleTemplate||e._subtitleTemplate);}}function fe(t,l){t&1&&gh(0);}function ue(t,l){t&1&&gh(0);}function _e(t,l){if(t&1&&(Ti(0,"div",1),zD(1,2),sh(2,ue,1,0,"ng-container",2),Gc()),t&2){let e=qD();pw(e.cx("footer")),dh("pBind",e.ptm("footer")),mE(2),dh("ngTemplateOutlet",e.footerTemplate||e._footerTemplate);}}var ye=`
    ${U}

    .p-card {
        display: block;
    }
`,he={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},W=(()=>{class t extends A{name="card";style=ye;classes=he;static \u0275fac=(()=>{let e;return function(n){return (e||(e=hy(t)))(n||t)}})();static \u0275prov=ee$1({token:t,factory:t.\u0275fac})}return t})();var X=new C("CARD_INSTANCE"),Te=(()=>{class t extends z{componentName="Card";$pcCard=I(X,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Ue,{self:true});_componentStyle=I(W);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}header;subheader;set style(e){S(this._style(),e)||(this._style.set(e),this.el?.nativeElement&&e&&Object.keys(e).forEach(o=>{this.el.nativeElement.style[o]=e[o];}));}get style(){return this._style()}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=Ho(null);getBlockableElement(){return this.el.nativeElement}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "title":this._titleTemplate=e.template;break;case "subtitle":this._subtitleTemplate=e.template;break;case "content":this._contentTemplate=e.template;break;case "footer":this._footerTemplate=e.template;break;default:this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=hy(t)))(n||t)}})();static \u0275cmp=YI({type:t,selectors:[["p-card"]],contentQueries:function(o,n,s){if(o&1&&Ih(s,et,5)(s,at$1,5)(s,Y,4)(s,Z,4)(s,ee,4)(s,te,4)(s,ne,4)(s,rt,4),o&2){let a;ZD(a=YD())&&(n.headerFacet=a.first),ZD(a=YD())&&(n.footerFacet=a.first),ZD(a=YD())&&(n.headerTemplate=a.first),ZD(a=YD())&&(n.titleTemplate=a.first),ZD(a=YD())&&(n.subtitleTemplate=a.first),ZD(a=YD())&&(n.contentTemplate=a.first),ZD(a=YD())&&(n.footerTemplate=a.first),ZD(a=YD())&&(n.templates=a);}},hostVars:4,hostBindings:function(o,n){o&2&&(dw(n._style()),pw(n.cn(n.cx("root"),n.styleClass)));},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[kw([W,{provide:X,useExisting:t},{provide:at,useExisting:t}]),sD([Ue]),oh],ngContentSelectors:ae,decls:8,vars:11,consts:[[3,"pBind","class",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(o,n){o&1&&(WD(ie),sh(0,oe,3,4,"div",0),Ti(1,"div",1),sh(2,ce,3,5,"div",0)(3,me,3,5,"div",0),Ti(4,"div",1),zD(5),sh(6,fe,1,0,"ng-container",2),Gc(),sh(7,_e,3,4,"div",0),Gc()),o&2&&(dh("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),mE(),pw(n.cx("body")),dh("pBind",n.ptm("body")),mE(),dh("ngIf",n.header||n.titleTemplate||n._titleTemplate),mE(),dh("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),mE(),pw(n.cx("content")),dh("pBind",n.ptm("content")),mE(2),dh("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),mE(),dh("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate));},dependencies:[rr,Wn,Zn,st,Vo,Ue],encapsulation:2})}return t})(),Oe=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=JI({type:t});static \u0275inj=bs({imports:[Te,st,Vo,st,Vo]})}return t})();export{Oe as O};