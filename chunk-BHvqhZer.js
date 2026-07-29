import {ac as YI,ad as bs,ae as Pe,bZ as mn,I,aB as C,ag as R,aL as NL,ah as Le,R as Yw,cO as ve,cu as V,aq as fy,Q as QI,f as fe,bP as Pr,br as Tr,ax as nh,ay as OL,az as PL,T as Ti,m as mh,U as Uc,u as uh,g as dw,l as lh,aP as ch,h as hE,L as xw,bS as $e,aC as he,aD as oD,aE as Eh,aF as zD,aG as QD,aK as H$1,e as ee,bt as Io}from'./main-ZVWFVFD2.js';var U=`
    .p-radiobutton {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('radiobutton.width');
        height: dt('radiobutton.height');
    }

    .p-radiobutton-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: 50%;
    }

    .p-radiobutton-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 1px solid dt('radiobutton.border.color');
        background: dt('radiobutton.background');
        width: dt('radiobutton.width');
        height: dt('radiobutton.height');
        transition:
            background dt('radiobutton.transition.duration'),
            color dt('radiobutton.transition.duration'),
            border-color dt('radiobutton.transition.duration'),
            box-shadow dt('radiobutton.transition.duration'),
            outline-color dt('radiobutton.transition.duration');
        outline-color: transparent;
        box-shadow: dt('radiobutton.shadow');
    }

    .p-radiobutton-icon {
        transition-duration: dt('radiobutton.transition.duration');
        background: transparent;
        font-size: dt('radiobutton.icon.size');
        width: dt('radiobutton.icon.size');
        height: dt('radiobutton.icon.size');
        border-radius: 50%;
        backface-visibility: hidden;
        transform: translateZ(0) scale(0.1);
    }

    .p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:hover) .p-radiobutton-box {
        border-color: dt('radiobutton.hover.border.color');
    }

    .p-radiobutton-checked .p-radiobutton-box {
        border-color: dt('radiobutton.checked.border.color');
        background: dt('radiobutton.checked.background');
    }

    .p-radiobutton-checked .p-radiobutton-box .p-radiobutton-icon {
        background: dt('radiobutton.icon.checked.color');
        transform: translateZ(0) scale(1, 1);
        visibility: visible;
    }

    .p-radiobutton-checked:not(.p-disabled):has(.p-radiobutton-input:hover) .p-radiobutton-box {
        border-color: dt('radiobutton.checked.hover.border.color');
        background: dt('radiobutton.checked.hover.background');
    }

    .p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:hover).p-radiobutton-checked .p-radiobutton-box .p-radiobutton-icon {
        background: dt('radiobutton.icon.checked.hover.color');
    }

    .p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:focus-visible) .p-radiobutton-box {
        border-color: dt('radiobutton.focus.border.color');
        box-shadow: dt('radiobutton.focus.ring.shadow');
        outline: dt('radiobutton.focus.ring.width') dt('radiobutton.focus.ring.style') dt('radiobutton.focus.ring.color');
        outline-offset: dt('radiobutton.focus.ring.offset');
    }

    .p-radiobutton-checked:not(.p-disabled):has(.p-radiobutton-input:focus-visible) .p-radiobutton-box {
        border-color: dt('radiobutton.checked.focus.border.color');
    }

    .p-radiobutton.p-invalid > .p-radiobutton-box {
        border-color: dt('radiobutton.invalid.border.color');
    }

    .p-radiobutton.p-variant-filled .p-radiobutton-box {
        background: dt('radiobutton.filled.background');
    }

    .p-radiobutton.p-variant-filled.p-radiobutton-checked .p-radiobutton-box {
        background: dt('radiobutton.checked.background');
    }

    .p-radiobutton.p-variant-filled:not(.p-disabled):has(.p-radiobutton-input:hover).p-radiobutton-checked .p-radiobutton-box {
        background: dt('radiobutton.checked.hover.background');
    }

    .p-radiobutton.p-disabled {
        opacity: 1;
    }

    .p-radiobutton.p-disabled .p-radiobutton-box {
        background: dt('radiobutton.disabled.background');
        border-color: dt('radiobutton.checked.disabled.border.color');
    }

    .p-radiobutton-checked.p-disabled .p-radiobutton-box .p-radiobutton-icon {
        background: dt('radiobutton.icon.disabled.color');
    }

    .p-radiobutton-sm,
    .p-radiobutton-sm .p-radiobutton-box {
        width: dt('radiobutton.sm.width');
        height: dt('radiobutton.sm.height');
    }

    .p-radiobutton-sm .p-radiobutton-icon {
        font-size: dt('radiobutton.icon.sm.size');
        width: dt('radiobutton.icon.sm.size');
        height: dt('radiobutton.icon.sm.size');
    }

    .p-radiobutton-lg,
    .p-radiobutton-lg .p-radiobutton-box {
        width: dt('radiobutton.lg.width');
        height: dt('radiobutton.lg.height');
    }

    .p-radiobutton-lg .p-radiobutton-icon {
        font-size: dt('radiobutton.icon.lg.size');
        width: dt('radiobutton.icon.lg.size');
        height: dt('radiobutton.icon.lg.size');
    }
`;var Z=["input"],J=`
    ${U}

    /* For PrimeNG */
    p-radioButton.ng-invalid.ng-dirty .p-radiobutton-box,
    p-radio-button.ng-invalid.ng-dirty .p-radiobutton-box,
    p-radiobutton.ng-invalid.ng-dirty .p-radiobutton-box {
        border-color: dt('radiobutton.invalid.border.color');
    }
`,K={root:({instance:o})=>["p-radiobutton p-component",{"p-radiobutton-checked":o.checked,"p-disabled":o.$disabled(),"p-invalid":o.invalid(),"p-variant-filled":o.$variant()==="filled","p-radiobutton-sm p-inputfield-sm":o.size()==="small","p-radiobutton-lg p-inputfield-lg":o.size()==="large"}],box:"p-radiobutton-box",input:"p-radiobutton-input",icon:"p-radiobutton-icon"},q=(()=>{class o extends H$1{name="radiobutton";style=J;classes=K;static \u0275fac=(()=>{let t;return function(n){return (t||(t=fy(o)))(n||o)}})();static \u0275prov=ee({token:o,factory:o.\u0275fac})}return o})();var H=new C("RADIOBUTTON_INSTANCE"),W={provide:$e,useExisting:Io(()=>P),multi:true},X=(()=>{class o{accessors=[];add(t,i){this.accessors.push([t,i]);}remove(t){this.accessors=this.accessors.filter(i=>i[1]!==t);}select(t){this.accessors.forEach(i=>{this.isSameGroup(i,t)&&i[1]!==t&&i[1].writeValue(t.value);});}isSameGroup(t,i){return t[0].control?t[0].control.root===i.control.control.root&&t[1].name()===i.name():false}static \u0275fac=function(i){return new(i||o)};static \u0275prov=ee({token:o,factory:o.\u0275fac,providedIn:"root"})}return o})(),P=(()=>{class o extends mn{componentName="RadioButton";$pcRadioButton=I(H,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(R,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}value;tabindex;inputId;ariaLabelledBy;ariaLabel;styleClass;autofocus;binary;variant=NL();size=NL();onClick=new Le;onFocus=new Le;onBlur=new Le;inputViewChild;$variant=Yw(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());checked;focused;control;_componentStyle=I(q);injector=I(ve);registry=I(X);onInit(){this.control=this.injector.get(V),this.registry.add(this.control,this);}onChange(t){this.$disabled()||this.select(t);}select(t){this.$disabled()||(this.checked=true,this.writeModelValue(this.checked),this.onModelChange(this.value),this.registry.select(this),this.onClick.emit({originalEvent:t,value:this.value}));}onInputFocus(t){this.focused=true,this.onFocus.emit(t);}onInputBlur(t){this.focused=false,this.onModelTouched(),this.onBlur.emit(t);}focus(){this.inputViewChild.nativeElement.focus();}writeControlValue(t,i){this.checked=this.binary?!!t:t==this.value,i(this.checked),this.cd.markForCheck();}onDestroy(){this.registry.remove(this);}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let t;return function(n){return (t||(t=fy(o)))(n||o)}})();static \u0275cmp=QI({type:o,selectors:[["p-radioButton"],["p-radiobutton"],["p-radio-button"]],viewQuery:function(i,n){if(i&1&&Eh(Z,5),i&2){let r;zD(r=QD())&&(n.inputViewChild=r.first);}},hostVars:5,hostBindings:function(i,n){i&2&&(ch("data-p-disabled",n.$disabled())("data-p-checked",n.checked)("data-p",n.dataP),dw(n.cx("root")));},inputs:{value:"value",tabindex:[2,"tabindex","tabindex",PL],inputId:"inputId",ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",styleClass:"styleClass",autofocus:[2,"autofocus","autofocus",OL],binary:[2,"binary","binary",OL],variant:[1,"variant"],size:[1,"size"]},outputs:{onClick:"onClick",onFocus:"onFocus",onBlur:"onBlur"},features:[xw([W,q,{provide:H,useExisting:o},{provide:he,useExisting:o}]),oD([R]),nh],decls:4,vars:20,consts:[["input",""],["type","radio",3,"focus","blur","change","checked","pAutoFocus","pBind"],[3,"pBind"]],template:function(i,n){i&1&&(Ti(0,"input",1,0),mh("focus",function(d){return n.onInputFocus(d)})("blur",function(d){return n.onInputBlur(d)})("change",function(d){return n.onChange(d)}),Uc(),Ti(2,"div",2),uh(3,"div",2),Uc()),i&2&&(dw(n.cx("input")),lh("checked",n.checked)("pAutoFocus",n.autofocus)("pBind",n.ptm("input")),ch("id",n.inputId)("name",n.name())("required",n.required()?"":void 0)("disabled",n.$disabled()?"":void 0)("value",n.modelValue())("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel)("aria-checked",n.checked)("tabindex",n.tabindex),hE(2),dw(n.cx("box")),lh("pBind",n.ptm("box")),hE(),dw(n.cx("icon")),lh("pBind",n.ptm("icon")));},dependencies:[fe,Pr,Pe,Tr,R],encapsulation:2})}return o})(),kt=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=YI({type:o});static \u0275inj=bs({imports:[P,Pe,Pe]})}return o})();export{P,kt as k};