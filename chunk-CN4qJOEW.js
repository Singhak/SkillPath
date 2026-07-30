import {I as Ie$1}from'./chunk-pmi0P1vI.js';import {m,p as pe}from'./chunk-BsBRikx5.js';import {aa as YI,ab as bs,ac as el,aN as nd,ao as fy,Q as QI,au as nh,aP as Pu,aR as dh,aG as NL,af as Le,cH as lu,H as Ho,I,ae as Hc,ax as C,Y as Yw,bj as Qe,c as cn,a as as,aq as us,ar as cs,bW as f,bf as Wc,av as OL,aw as PL,T as Ti,m as mh,U as Uc,o as oh,aX as lw,E as dw,l as lh,aK as ch,h as hE,b5 as Ow,a3 as xw,ay as wo,az as oD,aA as Eh,aB as zD,aC as QD,aD as vh,b as Qu,aF as ve$1,e as ee,b0 as Wc$1,b1 as zc,$ as $D,bh as Io,u as uh}from'./main-SOSPWNWC.js';var re=(()=>{class e extends nd{static \u0275fac=(()=>{let n;return function(t){return (n||(n=fy(e)))(t||e)}})();static \u0275cmp=QI({type:e,selectors:[["","data-p-icon","minus"]],features:[nh],decls:1,vars:0,consts:[["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(o,t){o&1&&(Pu(),dh(0,"path",0));},encapsulation:2,changeDetection:1})}return e})();var de=`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;var be=["icon"],ue=["input"],ke=(e,r,n)=>({checked:e,class:r,dataP:n});function xe(e,r){if(e&1&&uh(0,"span",8),e&2){let n=$D(3);dw(n.cx("icon")),lh("ngClass",n.checkboxIcon)("pBind",n.ptm("icon")),ch("data-p",n.dataP);}}function me(e,r){if(e&1&&(Pu(),uh(0,"svg",9)),e&2){let n=$D(3);dw(n.cx("icon")),lh("pBind",n.ptm("icon")),ch("data-p",n.dataP);}}function fe(e,r){if(e&1&&(Wc$1(0),oh(1,xe,1,5,"span",6)(2,me,1,4,"svg",7),zc()),e&2){let n=$D(2);hE(),lh("ngIf",n.checkboxIcon),hE(),lh("ngIf",!n.checkboxIcon);}}function ge(e,r){if(e&1&&(Pu(),uh(0,"svg",10)),e&2){let n=$D(2);dw(n.cx("icon")),lh("pBind",n.ptm("icon")),ch("data-p",n.dataP);}}function ve(e,r){if(e&1&&(Wc$1(0),oh(1,fe,3,2,"ng-container",3)(2,ge,1,4,"svg",5),zc()),e&2){let n=$D();hE(),lh("ngIf",n.checked),hE(),lh("ngIf",n._indeterminate());}}function Ce(e,r){}function _e(e,r){e&1&&oh(0,Ce,0,0,"ng-template");}var ye=`
    ${de}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,Ie={root:({instance:e})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":e.checked,"p-disabled":e.$disabled(),"p-invalid":e.invalid(),"p-variant-filled":e.$variant()==="filled","p-checkbox-sm p-inputfield-sm":e.size()==="small","p-checkbox-lg p-inputfield-lg":e.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},le=(()=>{class e extends ve$1{name="checkbox";style=ye;classes=Ie;static \u0275fac=(()=>{let n;return function(t){return (n||(n=fy(e)))(t||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var se=new C("CHECKBOX_INSTANCE"),Be={provide:pe,useExisting:Io(()=>he),multi:true},he=(()=>{class e extends Ie$1{componentName="Checkbox";hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=false;formControl;checkboxIcon;readonly;autofocus;trueValue=true;falseValue=false;variant=NL();size=NL();onChange=new Le;onFocus=new Le;onBlur=new Le;inputViewChild;get checked(){return this._indeterminate()?false:this.binary?this.modelValue()===this.trueValue:lu(this.value,this.modelValue())}_indeterminate=Ho(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=false;_componentStyle=I(le);bindDirectiveInstance=I(Hc,{self:true});$pcCheckbox=I(se,{optional:true,skipSelf:true})??void 0;$variant=Yw(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(n=>{switch(n.getType()){case "icon":this._checkboxIconTemplate=n.template;break;case "checkboxicon":this._checkboxIconTemplate=n.template;break}});}onChanges(n){n.indeterminate&&this._indeterminate.set(n.indeterminate.currentValue);}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}updateModel(n){let o,t=this.injector.get(m,null,{optional:true,self:true}),i=t&&!this.formControl?t.value:this.modelValue();this.binary?(o=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(o),this.onModelChange(o)):(this.checked||this._indeterminate()?o=i.filter(c=>!Qe(c,this.value)):o=i?[...i,this.value]:[this.value],this.onModelChange(o),this.writeModelValue(o),this.formControl&&this.formControl.setValue(o)),this._indeterminate()&&this._indeterminate.set(false),this.onChange.emit({checked:o,originalEvent:n});}handleChange(n){this.readonly||this.updateModel(n);}onInputFocus(n){this.focused=true,this.onFocus.emit(n);}onInputBlur(n){this.focused=false,this.onBlur.emit(n),this.onModelTouched();}focus(){this.inputViewChild?.nativeElement.focus();}writeControlValue(n,o){o(n),this.cd.markForCheck();}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let n;return function(t){return (n||(n=fy(e)))(t||e)}})();static \u0275cmp=QI({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(o,t,i){if(o&1&&vh(i,be,4)(i,Qu,4),o&2){let c;zD(c=QD())&&(t.checkboxIconTemplate=c.first),zD(c=QD())&&(t.templates=c);}},viewQuery:function(o,t){if(o&1&&Eh(ue,5),o&2){let i;zD(i=QD())&&(t.inputViewChild=i.first);}},hostVars:6,hostBindings:function(o,t){o&2&&(ch("data-p-highlight",t.checked)("data-p-checked",t.checked)("data-p-disabled",t.$disabled())("data-p",t.dataP),dw(t.cn(t.cx("root"),t.styleClass)));},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",OL],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",PL],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",OL],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",OL],autofocus:[2,"autofocus","autofocus",OL],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[xw([Be,le,{provide:se,useExisting:e},{provide:wo,useExisting:e}]),oD([Hc]),nh],decls:5,vars:26,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(o,t){o&1&&(Ti(0,"input",1,0),mh("focus",function(c){return t.onInputFocus(c)})("blur",function(c){return t.onInputBlur(c)})("change",function(c){return t.handleChange(c)}),Uc(),Ti(2,"div",2),oh(3,ve,3,2,"ng-container",3)(4,_e,1,0,null,4),Uc()),o&2&&(lw(t.inputStyle),dw(t.cn(t.cx("input"),t.inputClass)),lh("checked",t.checked)("pBind",t.ptm("input")),ch("id",t.inputId)("value",t.value)("name",t.name())("tabindex",t.tabindex)("required",t.required()?"":void 0)("readonly",t.readonly?"":void 0)("disabled",t.$disabled()?"":void 0)("aria-labelledby",t.ariaLabelledBy)("aria-label",t.ariaLabel),hE(2),dw(t.cx("box")),lh("pBind",t.ptm("box")),ch("data-p",t.dataP),hE(),lh("ngIf",!t.checkboxIconTemplate&&!t._checkboxIconTemplate),hE(),lh("ngTemplateOutlet",t.checkboxIconTemplate||t._checkboxIconTemplate)("ngTemplateOutletContext",Ow(22,ke,t.checked,t.cx("icon"),t.dataP)));},dependencies:[cn,as,us,cs,el,f,re,Wc,Hc],encapsulation:2})}return e})(),Ye=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=YI({type:e});static \u0275inj=bs({imports:[he,el,el]})}return e})();export{Ye as Y,he as h,re as r};