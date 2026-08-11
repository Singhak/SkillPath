import {x as xe}from'./chunk-C6FIRuMs.js';import {U as Un,R as Rn,n as nn,w}from'./chunk-CxdQyiSp.js';import {U as JI,W as bs,$ as st,a3 as SL,ad as PL,a4 as Fe,I,a1 as C,a2 as Ue,bJ as d,bu as S,aB as hy,Y as YI,ac as oh,ae as LL,b as rr,ag as Zn,bq as Vo,i as xD,A as AD,y as kw,aj as at,ak as sD,P as uh,aJ as pw,al as Ih,d as rt,Z as ZD,z as YD,aA as A,e as ee,T as Ti,s as sh,_ as _D,G as Gc,n as dh,m as mE,aI as Pw,k as MD,b4 as Vr,v as vh,ap as FD,aq as bu,an as qD,ar as _u,o as oI,p as sI,bs as wo,aH as gh,h as Tw,F as Fh,bp as Lw,g as fh,aL as Zw}from'./main-H2DRMQCD.js';var ft=`
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
`;var Bt=["icon"],wt=["content"],yt=e=>({$implicit:e});function Lt(e,a){e&1&&gh(0);}function Ot(e,a){if(e&1&&fh(0,"span",0),e&2){let t=qD(3);pw(t.cn(t.cx("icon"),t.checked?t.onIcon:t.offIcon,t.iconPos==="left"?t.cx("iconLeft"):t.cx("iconRight"))),dh("pBind",t.ptm("icon"));}}function St(e,a){if(e&1&&_D(0,Ot,1,3,"span",2),e&2){let t=qD(2);MD(t.onIcon||t.offIcon?0:-1);}}function It(e,a){e&1&&gh(0);}function Mt(e,a){if(e&1&&sh(0,It,1,0,"ng-container",1),e&2){let t=qD(2);dh("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)("ngTemplateOutletContext",Pw(2,yt,t.checked));}}function Dt(e,a){if(e&1&&(_D(0,St,1,1)(1,Mt,1,4,"ng-container"),Ti(2,"span",0),Tw(3),Gc()),e&2){let t=qD();MD(t.iconTemplate?1:0),mE(2),pw(t.cx("label")),dh("pBind",t.ptm("label")),mE(),Fh(t.checked?t.hasOnLabel?t.onLabel:"\xA0":t.hasOffLabel?t.offLabel:"\xA0");}}var Nt=`
    ${ft}

    /* For PrimeNG (iconPos) */
    .p-togglebutton-icon-right {
        order: 1;
    }

    .p-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`,Ft={root:({instance:e})=>["p-togglebutton p-component",{"p-togglebutton-checked":e.checked,"p-invalid":e.invalid(),"p-disabled":e.$disabled(),"p-togglebutton-sm p-inputfield-sm":e.size==="small","p-togglebutton-lg p-inputfield-lg":e.size==="large","p-togglebutton-fluid":e.fluid()}],content:"p-togglebutton-content",icon:"p-togglebutton-icon",iconLeft:"p-togglebutton-icon-left",iconRight:"p-togglebutton-icon-right",label:"p-togglebutton-label"},mt=(()=>{class e extends A{name="togglebutton";style=Nt;classes=Ft;static \u0275fac=(()=>{let t;return function(o){return (t||(t=hy(e)))(o||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var ht=new C("TOGGLEBUTTON_INSTANCE"),At={provide:w,useExisting:wo(()=>X),multi:true},X=(()=>{class e extends xe{componentName="ToggleButton";$pcToggleButton=I(ht,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Ue,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}onKeyDown(t){switch(t.code){case "Enter":this.toggle(t),t.preventDefault();break;case "Space":this.toggle(t),t.preventDefault();break}}toggle(t){!this.$disabled()&&!(this.allowEmpty===false&&this.checked)&&(this.checked=!this.checked,this.writeModelValue(this.checked),this.onModelChange(this.checked),this.onModelTouched(),this.onChange.emit({originalEvent:t,checked:this.checked}),this.cd.markForCheck());}onLabel="Yes";offLabel="No";onIcon;offIcon;ariaLabel;ariaLabelledBy;styleClass;inputId;tabindex=0;iconPos="left";autofocus;size;allowEmpty;fluid=SL(void 0,{transform:PL});onChange=new Fe;iconTemplate;contentTemplate;templates;checked=false;onInit(){(this.checked===null||this.checked===void 0)&&(this.checked=false);}_componentStyle=I(mt);onBlur(){this.onModelTouched();}get hasOnLabel(){return this.onLabel&&this.onLabel.length>0}get hasOffLabel(){return this.offLabel&&this.offLabel.length>0}get active(){return this.checked===true}_iconTemplate;_contentTemplate;onAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case "icon":this._iconTemplate=t.template;break;case "content":this._contentTemplate=t.template;break;default:this._contentTemplate=t.template;break}});}writeControlValue(t,n){this.checked=t,n(t),this.cd.markForCheck();}get dataP(){return this.cn({checked:this.active,invalid:this.invalid(),[this.size]:this.size})}static \u0275fac=(()=>{let t;return function(o){return (t||(t=hy(e)))(o||e)}})();static \u0275cmp=YI({type:e,selectors:[["p-toggleButton"],["p-togglebutton"],["p-toggle-button"]],contentQueries:function(n,o,i){if(n&1&&Ih(i,Bt,4)(i,wt,4)(i,rt,4),n&2){let l;ZD(l=YD())&&(o.iconTemplate=l.first),ZD(l=YD())&&(o.contentTemplate=l.first),ZD(l=YD())&&(o.templates=l);}},hostVars:11,hostBindings:function(n,o){n&1&&vh("keydown",function(l){return o.onKeyDown(l)})("click",function(l){return o.toggle(l)}),n&2&&(uh("aria-labelledby",o.ariaLabelledBy)("aria-label",o.ariaLabel)("aria-pressed",o.checked?"true":"false")("role","button")("tabindex",o.tabindex!==void 0?o.tabindex:o.$disabled()?-1:0)("data-pc-name","togglebutton")("data-p-checked",o.active)("data-p-disabled",o.$disabled())("data-p",o.dataP),pw(o.cn(o.cx("root"),o.styleClass)));},inputs:{onLabel:"onLabel",offLabel:"offLabel",onIcon:"onIcon",offIcon:"offIcon",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",styleClass:"styleClass",inputId:"inputId",tabindex:[2,"tabindex","tabindex",LL],iconPos:"iconPos",autofocus:[2,"autofocus","autofocus",PL],size:"size",allowEmpty:"allowEmpty",fluid:[1,"fluid"]},outputs:{onChange:"onChange"},features:[kw([At,mt,{provide:ht,useExisting:e},{provide:at,useExisting:e}]),sD([Vr,Ue]),oh],decls:3,vars:9,consts:[[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class","pBind"]],template:function(n,o){n&1&&(Ti(0,"span",0),sh(1,Lt,1,0,"ng-container",1),_D(2,Dt,4,5),Gc()),n&2&&(pw(o.cx("content")),dh("pBind",o.ptm("content")),uh("data-p",o.dataP),mE(),dh("ngTemplateOutlet",o.contentTemplate||o._contentTemplate)("ngTemplateOutletContext",Pw(7,yt,o.checked)),mE(),MD(o.contentTemplate?-1:2));},dependencies:[rr,Zn,st,Vo,Ue],encapsulation:2})}return e})();var _t=`
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
`;var Vt=["item"],$t=(e,a)=>({$implicit:e,index:a});function zt(e,a){return this.getOptionLabel(a)}function Rt(e,a){e&1&&gh(0);}function Pt(e,a){if(e&1&&sh(0,Rt,1,0,"ng-container",3),e&2){let t=qD(2),n=t.$implicit,o=t.$index,i=qD();dh("ngTemplateOutlet",i.itemTemplate||i._itemTemplate)("ngTemplateOutletContext",Lw(2,$t,n,o));}}function jt(e,a){e&1&&sh(0,Pt,1,5,"ng-template",null,0,Zw);}function Ht(e,a){if(e&1){let t=FD();Ti(0,"p-togglebutton",2),vh("onChange",function(o){let i=bu(t),l=i.$implicit,m=i.$index,q=qD();return _u(q.onOptionSelect(o,l,m))}),_D(1,jt,2,0),Gc(),oI();}if(e&2){let t=a.$implicit,n=qD();dh("autofocus",n.autofocus)("styleClass",n.styleClass)("ngModel",n.isSelected(t))("onLabel",n.getOptionLabel(t))("offLabel",n.getOptionLabel(t))("disabled",n.$disabled()||n.isOptionDisabled(t))("allowEmpty",n.getAllowEmpty())("size",n.size())("fluid",n.fluid())("pt",n.ptm("pcToggleButton"))("unstyled",n.unstyled()),sI(),mE(),MD(n.itemTemplate||n._itemTemplate?1:-1);}}var Kt=`
    ${_t}

    /* For PrimeNG */
    .p-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`,Qt={root:({instance:e})=>["p-selectbutton p-component",{"p-invalid":e.invalid(),"p-selectbutton-fluid":e.fluid()}]},vt=(()=>{class e extends A{name="selectbutton";style=Kt;classes=Qt;static \u0275fac=(()=>{let t;return function(o){return (t||(t=hy(e)))(o||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var Ct=new C("SELECTBUTTON_INSTANCE"),Gt={provide:w,useExisting:wo(()=>Tt),multi:true},Tt=(()=>{class e extends xe{componentName="SelectButton";options;optionLabel;optionValue;optionDisabled;get unselectable(){return this._unselectable}_unselectable=false;set unselectable(t){this._unselectable=t,this.allowEmpty=!t;}tabindex=0;multiple;allowEmpty=true;styleClass;ariaLabelledBy;dataKey;autofocus;size=SL();fluid=SL(void 0,{transform:PL});onOptionClick=new Fe;onChange=new Fe;itemTemplate;_itemTemplate;get equalityKey(){return this.optionValue?null:this.dataKey}value;focusedIndex=0;_componentStyle=I(vt);$pcSelectButton=I(Ct,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Ue,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}getAllowEmpty(){return this.multiple?this.allowEmpty||this.value?.length!==1:this.allowEmpty}getOptionLabel(t){return this.optionLabel?d(t,this.optionLabel):t.label!=null?t.label:t}getOptionValue(t){return this.optionValue?d(t,this.optionValue):this.optionLabel||t.value===void 0?t:t.value}isOptionDisabled(t){return this.optionDisabled?d(t,this.optionDisabled):t.disabled!==void 0?t.disabled:false}onOptionSelect(t,n,o){if(this.$disabled()||this.isOptionDisabled(n))return;let i=this.isSelected(n);if(i&&this.unselectable)return;let l=this.getOptionValue(n),m;if(this.multiple)i?m=this.value.filter(q=>!S(q,l,this.equalityKey||void 0)):m=this.value?[...this.value,l]:[l];else {if(i&&!this.allowEmpty)return;m=i?null:l;}this.focusedIndex=o,this.value=m,this.writeModelValue(this.value),this.onModelChange(this.value),this.onChange.emit({originalEvent:t,value:this.value}),this.onOptionClick.emit({originalEvent:t,option:n,index:o});}changeTabIndexes(t,n){let o,i;for(let l=0;l<=this.el.nativeElement.children.length-1;l++)this.el.nativeElement.children[l].getAttribute("tabindex")==="0"&&(o={elem:this.el.nativeElement.children[l],index:l});n==="prev"?o.index===0?i=this.el.nativeElement.children.length-1:i=o.index-1:o.index===this.el.nativeElement.children.length-1?i=0:i=o.index+1,this.focusedIndex=i,this.el.nativeElement.children[i].focus();}onFocus(t,n){this.focusedIndex=n;}onBlur(){this.onModelTouched();}removeOption(t){this.value=this.value.filter(n=>!S(n,this.getOptionValue(t),this.dataKey));}isSelected(t){let n=false,o=this.getOptionValue(t);if(this.multiple){if(this.value&&Array.isArray(this.value)){for(let i of this.value)if(S(i,o,this.dataKey)){n=true;break}}}else n=S(this.getOptionValue(t),this.value,this.equalityKey||void 0);return n}templates;onAfterContentInit(){this.templates.forEach(t=>{t.getType()==="item"&&(this._itemTemplate=t.template);});}writeControlValue(t,n){this.value=t,n(this.value),this.cd.markForCheck();}get dataP(){return this.cn({invalid:this.invalid()})}static \u0275fac=(()=>{let t;return function(o){return (t||(t=hy(e)))(o||e)}})();static \u0275cmp=YI({type:e,selectors:[["p-selectButton"],["p-selectbutton"],["p-select-button"]],contentQueries:function(n,o,i){if(n&1&&Ih(i,Vt,4)(i,rt,4),n&2){let l;ZD(l=YD())&&(o.itemTemplate=l.first),ZD(l=YD())&&(o.templates=l);}},hostVars:5,hostBindings:function(n,o){n&2&&(uh("role","group")("aria-labelledby",o.ariaLabelledBy)("data-p",o.dataP),pw(o.cx("root")));},inputs:{options:"options",optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",unselectable:[2,"unselectable","unselectable",PL],tabindex:[2,"tabindex","tabindex",LL],multiple:[2,"multiple","multiple",PL],allowEmpty:[2,"allowEmpty","allowEmpty",PL],styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy",dataKey:"dataKey",autofocus:[2,"autofocus","autofocus",PL],size:[1,"size"],fluid:[1,"fluid"]},outputs:{onOptionClick:"onOptionClick",onChange:"onChange"},features:[kw([Gt,vt,{provide:Ct,useExisting:e},{provide:at,useExisting:e}]),sD([Ue]),oh],decls:2,vars:0,consts:[["content",""],[3,"autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[3,"onChange","autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,o){n&1&&xD(0,Ht,2,12,"p-togglebutton",1,zt,true),n&2&&AD(o.options);},dependencies:[X,Un,Rn,nn,rr,Zn,st,Vo],encapsulation:2})}return e})(),Ve=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=JI({type:e});static \u0275inj=bs({imports:[Tt,st,st]})}return e})();export{Tt as T,Ve as V};