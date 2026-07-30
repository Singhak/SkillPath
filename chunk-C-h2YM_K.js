import {I as Ie}from'./chunk-Cqg45ug-.js';import {D as Dn,v as vn,q as qt,p as pe}from'./chunk-CmVjBcAv.js';import {aa as YI,ab as bs,ac as el,aG as NL,av as OL,af as Le,I,ax as C,ae as Hc,bz as Nt$1,bj as Qe,ao as fy,Q as QI,c as cn,ar as cs,bf as Wc,au as nh,aw as PL,N as ND,S as SD,a3 as xw,ay as wo,az as oD,aK as ch,B as dw,aD as vh,b as Qu,aB as zD,aC as QD,aF as ve,e as ee,T as Ti,o as oh,C as CD,U as Uc,l as lh,h as hE,aY as Rw,f as bD,aH as ce,m as mh,i as PD,k as Du,$ as $D,p as wu,n as nI,d as oI,bh as Io,b2 as ph,D as Dw,P as Ph,be as kw,u as uh,aZ as Ww}from'./main-3QSGXNYS.js';var ft=`
    .p-togglebutton {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        color: dt('togglebutton.color');
        background: dt('togglebutton.background');
        border: 1px solid dt('togglebutton.border.color');
        padding: dt('togglebutton.padding');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
        border-radius: dt('togglebutton.border.radius');
        outline-color: transparent;
        font-weight: dt('togglebutton.font.weight');
    }

    .p-togglebutton-content {
        display: inline-flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        gap: dt('togglebutton.gap');
        padding: dt('togglebutton.content.padding');
        background: transparent;
        border-radius: dt('togglebutton.content.border.radius');
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover {
        background: dt('togglebutton.hover.background');
        color: dt('togglebutton.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked {
        background: dt('togglebutton.checked.background');
        border-color: dt('togglebutton.checked.border.color');
        color: dt('togglebutton.checked.color');
    }

    .p-togglebutton-checked .p-togglebutton-content {
        background: dt('togglebutton.content.checked.background');
        box-shadow: dt('togglebutton.content.checked.shadow');
    }

    .p-togglebutton:focus-visible {
        box-shadow: dt('togglebutton.focus.ring.shadow');
        outline: dt('togglebutton.focus.ring.width') dt('togglebutton.focus.ring.style') dt('togglebutton.focus.ring.color');
        outline-offset: dt('togglebutton.focus.ring.offset');
    }

    .p-togglebutton.p-invalid {
        border-color: dt('togglebutton.invalid.border.color');
    }

    .p-togglebutton:disabled {
        opacity: 1;
        cursor: default;
        background: dt('togglebutton.disabled.background');
        border-color: dt('togglebutton.disabled.border.color');
        color: dt('togglebutton.disabled.color');
    }

    .p-togglebutton-label,
    .p-togglebutton-icon {
        position: relative;
        transition: none;
    }

    .p-togglebutton-icon {
        color: dt('togglebutton.icon.color');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover .p-togglebutton-icon {
        color: dt('togglebutton.icon.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked .p-togglebutton-icon {
        color: dt('togglebutton.icon.checked.color');
    }

    .p-togglebutton:disabled .p-togglebutton-icon {
        color: dt('togglebutton.icon.disabled.color');
    }

    .p-togglebutton-sm {
        padding: dt('togglebutton.sm.padding');
        font-size: dt('togglebutton.sm.font.size');
    }

    .p-togglebutton-sm .p-togglebutton-content {
        padding: dt('togglebutton.content.sm.padding');
    }

    .p-togglebutton-lg {
        padding: dt('togglebutton.lg.padding');
        font-size: dt('togglebutton.lg.font.size');
    }

    .p-togglebutton-lg .p-togglebutton-content {
        padding: dt('togglebutton.content.lg.padding');
    }

    .p-togglebutton-fluid {
        width: 100%;
    }
`;var Bt=["icon"],wt=["content"],yt=e=>({$implicit:e});function Lt(e,a){e&1&&ph(0);}function Ot(e,a){if(e&1&&uh(0,"span",0),e&2){let t=$D(3);dw(t.cn(t.cx("icon"),t.checked?t.onIcon:t.offIcon,t.iconPos==="left"?t.cx("iconLeft"):t.cx("iconRight"))),lh("pBind",t.ptm("icon"));}}function St(e,a){if(e&1&&CD(0,Ot,1,3,"span",2),e&2){let t=$D(2);bD(t.onIcon||t.offIcon?0:-1);}}function It(e,a){e&1&&ph(0);}function Mt(e,a){if(e&1&&oh(0,It,1,0,"ng-container",1),e&2){let t=$D(2);lh("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)("ngTemplateOutletContext",Rw(2,yt,t.checked));}}function Dt(e,a){if(e&1&&(CD(0,St,1,1)(1,Mt,1,4,"ng-container"),Ti(2,"span",0),Dw(3),Uc()),e&2){let t=$D();bD(t.iconTemplate?1:0),hE(2),dw(t.cx("label")),lh("pBind",t.ptm("label")),hE(),Ph(t.checked?t.hasOnLabel?t.onLabel:"\xA0":t.hasOffLabel?t.offLabel:"\xA0");}}var Nt=`
    ${ft}

    /* For PrimeNG (iconPos) */
    .p-togglebutton-icon-right {
        order: 1;
    }

    .p-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`,Ft={root:({instance:e})=>["p-togglebutton p-component",{"p-togglebutton-checked":e.checked,"p-invalid":e.invalid(),"p-disabled":e.$disabled(),"p-togglebutton-sm p-inputfield-sm":e.size==="small","p-togglebutton-lg p-inputfield-lg":e.size==="large","p-togglebutton-fluid":e.fluid()}],content:"p-togglebutton-content",icon:"p-togglebutton-icon",iconLeft:"p-togglebutton-icon-left",iconRight:"p-togglebutton-icon-right",label:"p-togglebutton-label"},mt=(()=>{class e extends ve{name="togglebutton";style=Nt;classes=Ft;static \u0275fac=(()=>{let t;return function(o){return (t||(t=fy(e)))(o||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var ht=new C("TOGGLEBUTTON_INSTANCE"),At={provide:pe,useExisting:Io(()=>X),multi:true},X=(()=>{class e extends Ie{componentName="ToggleButton";$pcToggleButton=I(ht,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Hc,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}onKeyDown(t){switch(t.code){case "Enter":this.toggle(t),t.preventDefault();break;case "Space":this.toggle(t),t.preventDefault();break}}toggle(t){!this.$disabled()&&!(this.allowEmpty===false&&this.checked)&&(this.checked=!this.checked,this.writeModelValue(this.checked),this.onModelChange(this.checked),this.onModelTouched(),this.onChange.emit({originalEvent:t,checked:this.checked}),this.cd.markForCheck());}onLabel="Yes";offLabel="No";onIcon;offIcon;ariaLabel;ariaLabelledBy;styleClass;inputId;tabindex=0;iconPos="left";autofocus;size;allowEmpty;fluid=NL(void 0,{transform:OL});onChange=new Le;iconTemplate;contentTemplate;templates;checked=false;onInit(){(this.checked===null||this.checked===void 0)&&(this.checked=false);}_componentStyle=I(mt);onBlur(){this.onModelTouched();}get hasOnLabel(){return this.onLabel&&this.onLabel.length>0}get hasOffLabel(){return this.offLabel&&this.offLabel.length>0}get active(){return this.checked===true}_iconTemplate;_contentTemplate;onAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case "icon":this._iconTemplate=t.template;break;case "content":this._contentTemplate=t.template;break;default:this._contentTemplate=t.template;break}});}writeControlValue(t,n){this.checked=t,n(t),this.cd.markForCheck();}get dataP(){return this.cn({checked:this.active,invalid:this.invalid(),[this.size]:this.size})}static \u0275fac=(()=>{let t;return function(o){return (t||(t=fy(e)))(o||e)}})();static \u0275cmp=QI({type:e,selectors:[["p-toggleButton"],["p-togglebutton"],["p-toggle-button"]],contentQueries:function(n,o,i){if(n&1&&vh(i,Bt,4)(i,wt,4)(i,Qu,4),n&2){let l;zD(l=QD())&&(o.iconTemplate=l.first),zD(l=QD())&&(o.contentTemplate=l.first),zD(l=QD())&&(o.templates=l);}},hostVars:11,hostBindings:function(n,o){n&1&&mh("keydown",function(l){return o.onKeyDown(l)})("click",function(l){return o.toggle(l)}),n&2&&(ch("aria-labelledby",o.ariaLabelledBy)("aria-label",o.ariaLabel)("aria-pressed",o.checked?"true":"false")("role","button")("tabindex",o.tabindex!==void 0?o.tabindex:o.$disabled()?-1:0)("data-pc-name","togglebutton")("data-p-checked",o.active)("data-p-disabled",o.$disabled())("data-p",o.dataP),dw(o.cn(o.cx("root"),o.styleClass)));},inputs:{onLabel:"onLabel",offLabel:"offLabel",onIcon:"onIcon",offIcon:"offIcon",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",styleClass:"styleClass",inputId:"inputId",tabindex:[2,"tabindex","tabindex",PL],iconPos:"iconPos",autofocus:[2,"autofocus","autofocus",OL],size:"size",allowEmpty:"allowEmpty",fluid:[1,"fluid"]},outputs:{onChange:"onChange"},features:[xw([At,mt,{provide:ht,useExisting:e},{provide:wo,useExisting:e}]),oD([ce,Hc]),nh],decls:3,vars:9,consts:[[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class","pBind"]],template:function(n,o){n&1&&(Ti(0,"span",0),oh(1,Lt,1,0,"ng-container",1),CD(2,Dt,4,5),Uc()),n&2&&(dw(o.cx("content")),lh("pBind",o.ptm("content")),ch("data-p",o.dataP),hE(),lh("ngTemplateOutlet",o.contentTemplate||o._contentTemplate)("ngTemplateOutletContext",Rw(7,yt,o.checked)),hE(),bD(o.contentTemplate?-1:2));},dependencies:[cn,cs,el,Wc,Hc],encapsulation:2})}return e})();var _t=`
    .p-selectbutton {
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        outline-color: transparent;
        border-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton {
        border-radius: 0;
        border-width: 1px 1px 1px 0;
    }

    .p-selectbutton .p-togglebutton:focus-visible {
        position: relative;
        z-index: 1;
    }

    .p-selectbutton .p-togglebutton:first-child {
        border-inline-start-width: 1px;
        border-start-start-radius: dt('selectbutton.border.radius');
        border-end-start-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton:last-child {
        border-start-end-radius: dt('selectbutton.border.radius');
        border-end-end-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton.p-invalid {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }

    .p-selectbutton-fluid {
        width: 100%;
    }
    
    .p-selectbutton-fluid .p-togglebutton {
        flex: 1 1 0;
    }
`;var Vt=["item"],$t=(e,a)=>({$implicit:e,index:a});function zt(e,a){return this.getOptionLabel(a)}function Rt(e,a){e&1&&ph(0);}function Pt(e,a){if(e&1&&oh(0,Rt,1,0,"ng-container",3),e&2){let t=$D(2),n=t.$implicit,o=t.$index,i=$D();lh("ngTemplateOutlet",i.itemTemplate||i._itemTemplate)("ngTemplateOutletContext",kw(2,$t,n,o));}}function jt(e,a){e&1&&oh(0,Pt,1,5,"ng-template",null,0,Ww);}function Ht(e,a){if(e&1){let t=PD();Ti(0,"p-togglebutton",2),mh("onChange",function(o){let i=Du(t),l=i.$implicit,m=i.$index,q=$D();return wu(q.onOptionSelect(o,l,m))}),CD(1,jt,2,0),Uc(),nI();}if(e&2){let t=a.$implicit,n=$D();lh("autofocus",n.autofocus)("styleClass",n.styleClass)("ngModel",n.isSelected(t))("onLabel",n.getOptionLabel(t))("offLabel",n.getOptionLabel(t))("disabled",n.$disabled()||n.isOptionDisabled(t))("allowEmpty",n.getAllowEmpty())("size",n.size())("fluid",n.fluid())("pt",n.ptm("pcToggleButton"))("unstyled",n.unstyled()),oI(),hE(),bD(n.itemTemplate||n._itemTemplate?1:-1);}}var Kt=`
    ${_t}

    /* For PrimeNG */
    .p-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`,Qt={root:({instance:e})=>["p-selectbutton p-component",{"p-invalid":e.invalid(),"p-selectbutton-fluid":e.fluid()}]},vt=(()=>{class e extends ve{name="selectbutton";style=Kt;classes=Qt;static \u0275fac=(()=>{let t;return function(o){return (t||(t=fy(e)))(o||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var Ct=new C("SELECTBUTTON_INSTANCE"),Gt={provide:pe,useExisting:Io(()=>Tt),multi:true},Tt=(()=>{class e extends Ie{componentName="SelectButton";options;optionLabel;optionValue;optionDisabled;get unselectable(){return this._unselectable}_unselectable=false;set unselectable(t){this._unselectable=t,this.allowEmpty=!t;}tabindex=0;multiple;allowEmpty=true;styleClass;ariaLabelledBy;dataKey;autofocus;size=NL();fluid=NL(void 0,{transform:OL});onOptionClick=new Le;onChange=new Le;itemTemplate;_itemTemplate;get equalityKey(){return this.optionValue?null:this.dataKey}value;focusedIndex=0;_componentStyle=I(vt);$pcSelectButton=I(Ct,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Hc,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}getAllowEmpty(){return this.multiple?this.allowEmpty||this.value?.length!==1:this.allowEmpty}getOptionLabel(t){return this.optionLabel?Nt$1(t,this.optionLabel):t.label!=null?t.label:t}getOptionValue(t){return this.optionValue?Nt$1(t,this.optionValue):this.optionLabel||t.value===void 0?t:t.value}isOptionDisabled(t){return this.optionDisabled?Nt$1(t,this.optionDisabled):t.disabled!==void 0?t.disabled:false}onOptionSelect(t,n,o){if(this.$disabled()||this.isOptionDisabled(n))return;let i=this.isSelected(n);if(i&&this.unselectable)return;let l=this.getOptionValue(n),m;if(this.multiple)i?m=this.value.filter(q=>!Qe(q,l,this.equalityKey||void 0)):m=this.value?[...this.value,l]:[l];else {if(i&&!this.allowEmpty)return;m=i?null:l;}this.focusedIndex=o,this.value=m,this.writeModelValue(this.value),this.onModelChange(this.value),this.onChange.emit({originalEvent:t,value:this.value}),this.onOptionClick.emit({originalEvent:t,option:n,index:o});}changeTabIndexes(t,n){let o,i;for(let l=0;l<=this.el.nativeElement.children.length-1;l++)this.el.nativeElement.children[l].getAttribute("tabindex")==="0"&&(o={elem:this.el.nativeElement.children[l],index:l});n==="prev"?o.index===0?i=this.el.nativeElement.children.length-1:i=o.index-1:o.index===this.el.nativeElement.children.length-1?i=0:i=o.index+1,this.focusedIndex=i,this.el.nativeElement.children[i].focus();}onFocus(t,n){this.focusedIndex=n;}onBlur(){this.onModelTouched();}removeOption(t){this.value=this.value.filter(n=>!Qe(n,this.getOptionValue(t),this.dataKey));}isSelected(t){let n=false,o=this.getOptionValue(t);if(this.multiple){if(this.value&&Array.isArray(this.value)){for(let i of this.value)if(Qe(i,o,this.dataKey)){n=true;break}}}else n=Qe(this.getOptionValue(t),this.value,this.equalityKey||void 0);return n}templates;onAfterContentInit(){this.templates.forEach(t=>{t.getType()==="item"&&(this._itemTemplate=t.template);});}writeControlValue(t,n){this.value=t,n(this.value),this.cd.markForCheck();}get dataP(){return this.cn({invalid:this.invalid()})}static \u0275fac=(()=>{let t;return function(o){return (t||(t=fy(e)))(o||e)}})();static \u0275cmp=QI({type:e,selectors:[["p-selectButton"],["p-selectbutton"],["p-select-button"]],contentQueries:function(n,o,i){if(n&1&&vh(i,Vt,4)(i,Qu,4),n&2){let l;zD(l=QD())&&(o.itemTemplate=l.first),zD(l=QD())&&(o.templates=l);}},hostVars:5,hostBindings:function(n,o){n&2&&(ch("role","group")("aria-labelledby",o.ariaLabelledBy)("data-p",o.dataP),dw(o.cx("root")));},inputs:{options:"options",optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",unselectable:[2,"unselectable","unselectable",OL],tabindex:[2,"tabindex","tabindex",PL],multiple:[2,"multiple","multiple",OL],allowEmpty:[2,"allowEmpty","allowEmpty",OL],styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy",dataKey:"dataKey",autofocus:[2,"autofocus","autofocus",OL],size:[1,"size"],fluid:[1,"fluid"]},outputs:{onOptionClick:"onOptionClick",onChange:"onChange"},features:[xw([Gt,vt,{provide:Ct,useExisting:e},{provide:wo,useExisting:e}]),oD([Hc]),nh],decls:2,vars:0,consts:[["content",""],[3,"autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[3,"onChange","autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,o){n&1&&ND(0,Ht,2,12,"p-togglebutton",1,zt,true),n&2&&SD(o.options);},dependencies:[X,Dn,vn,qt,cn,cs,el,Wc],encapsulation:2})}return e})(),Ve=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=YI({type:e});static \u0275inj=bs({imports:[Tt,el,el]})}return e})();export{Tt as T,Ve as V};