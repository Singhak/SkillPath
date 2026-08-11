import {a2 as eD,a3 as Ms,a4 as st,br as Vo,a5 as z,I,a6 as C,a7 as Ue,bv as S,B as Bo,aE as gy,c as JI,ah as oh,s as sr,ak as Xn,al as Yn,an as QD,j as sh,C as Ci,aI as ZD,h as Wc,u as dh,k as vE,aJ as gw,L as Lw,ao as at,ap as cD,A as pw,aq as Ih,c5 as et,ar as at$1,d as rt,E as KD,G as JD,aD as A,n as ne$1,as as WD,aM as gh,bk as Zc,g as bw,bl as Yc,F as Fh}from'./main-VNA6OXP6.js';var U=`
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
`;var Y=["header"],Z=["title"],ee=["subtitle"],te=["content"],ne=["footer"],ie=["*",[["p-header"]],[["p-footer"]]],ae=["*","p-header","p-footer"];function re(t,l){t&1&&gh(0);}function oe(t,l){if(t&1&&(Ci(0,"div",1),ZD(1,1),sh(2,re,1,0,"ng-container",2),Wc()),t&2){let e=WD();gw(e.cx("header")),dh("pBind",e.ptm("header")),vE(2),dh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate);}}function le(t,l){if(t&1&&(Zc(0),bw(1),Yc()),t&2){let e=WD(2);vE(),Fh(e.header);}}function pe(t,l){t&1&&gh(0);}function ce(t,l){if(t&1&&(Ci(0,"div",1),sh(1,le,2,1,"ng-container",3)(2,pe,1,0,"ng-container",2),Wc()),t&2){let e=WD();gw(e.cx("title")),dh("pBind",e.ptm("title")),vE(),dh("ngIf",e.header&&!e._titleTemplate&&!e.titleTemplate),vE(),dh("ngTemplateOutlet",e.titleTemplate||e._titleTemplate);}}function de(t,l){if(t&1&&(Zc(0),bw(1),Yc()),t&2){let e=WD(2);vE(),Fh(e.subheader);}}function se(t,l){t&1&&gh(0);}function me(t,l){if(t&1&&(Ci(0,"div",1),sh(1,de,2,1,"ng-container",3)(2,se,1,0,"ng-container",2),Wc()),t&2){let e=WD();gw(e.cx("subtitle")),dh("pBind",e.ptm("subtitle")),vE(),dh("ngIf",e.subheader&&!e._subtitleTemplate&&!e.subtitleTemplate),vE(),dh("ngTemplateOutlet",e.subtitleTemplate||e._subtitleTemplate);}}function fe(t,l){t&1&&gh(0);}function ue(t,l){t&1&&gh(0);}function _e(t,l){if(t&1&&(Ci(0,"div",1),ZD(1,2),sh(2,ue,1,0,"ng-container",2),Wc()),t&2){let e=WD();gw(e.cx("footer")),dh("pBind",e.ptm("footer")),vE(2),dh("ngTemplateOutlet",e.footerTemplate||e._footerTemplate);}}var ye=`
    ${U}

    .p-card {
        display: block;
    }
`,he={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},W=(()=>{class t extends A{name="card";style=ye;classes=he;static \u0275fac=(()=>{let e;return function(n){return (e||(e=gy(t)))(n||t)}})();static \u0275prov=ne$1({token:t,factory:t.\u0275fac})}return t})();var X=new C("CARD_INSTANCE"),Te=(()=>{class t extends z{componentName="Card";$pcCard=I(X,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Ue,{self:true});_componentStyle=I(W);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}header;subheader;set style(e){S(this._style(),e)||(this._style.set(e),this.el?.nativeElement&&e&&Object.keys(e).forEach(o=>{this.el.nativeElement.style[o]=e[o];}));}get style(){return this._style()}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=Bo(null);getBlockableElement(){return this.el.nativeElement}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "header":this._headerTemplate=e.template;break;case "title":this._titleTemplate=e.template;break;case "subtitle":this._subtitleTemplate=e.template;break;case "content":this._contentTemplate=e.template;break;case "footer":this._footerTemplate=e.template;break;default:this._contentTemplate=e.template;break}});}static \u0275fac=(()=>{let e;return function(n){return (e||(e=gy(t)))(n||t)}})();static \u0275cmp=JI({type:t,selectors:[["p-card"]],contentQueries:function(o,n,s){if(o&1&&Ih(s,et,5)(s,at$1,5)(s,Y,4)(s,Z,4)(s,ee,4)(s,te,4)(s,ne,4)(s,rt,4),o&2){let a;KD(a=JD())&&(n.headerFacet=a.first),KD(a=JD())&&(n.footerFacet=a.first),KD(a=JD())&&(n.headerTemplate=a.first),KD(a=JD())&&(n.titleTemplate=a.first),KD(a=JD())&&(n.subtitleTemplate=a.first),KD(a=JD())&&(n.contentTemplate=a.first),KD(a=JD())&&(n.footerTemplate=a.first),KD(a=JD())&&(n.templates=a);}},hostVars:4,hostBindings:function(o,n){o&2&&(pw(n._style()),gw(n.cn(n.cx("root"),n.styleClass)));},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[Lw([W,{provide:X,useExisting:t},{provide:at,useExisting:t}]),cD([Ue]),oh],ngContentSelectors:ae,decls:8,vars:11,consts:[[3,"pBind","class",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(o,n){o&1&&(QD(ie),sh(0,oe,3,4,"div",0),Ci(1,"div",1),sh(2,ce,3,5,"div",0)(3,me,3,5,"div",0),Ci(4,"div",1),ZD(5),sh(6,fe,1,0,"ng-container",2),Wc(),sh(7,_e,3,4,"div",0),Wc()),o&2&&(dh("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),vE(),gw(n.cx("body")),dh("pBind",n.ptm("body")),vE(),dh("ngIf",n.header||n.titleTemplate||n._titleTemplate),vE(),dh("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),vE(),gw(n.cx("content")),dh("pBind",n.ptm("content")),vE(2),dh("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),vE(),dh("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate));},dependencies:[sr,Xn,Yn,st,Vo,Ue],encapsulation:2})}return t})(),Oe=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=eD({type:t});static \u0275inj=Ms({imports:[Te,st,Vo,st,Vo]})}return t})();export{Oe as O};