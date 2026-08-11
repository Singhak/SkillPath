import {D}from'./chunk-CUK9NxT1.js';import {a2 as eD,a3 as Ms,a8 as xL,I,a7 as Ue,a6 as C$1,bW as gr,ai as LL,a as nT,Q as Qu,c9 as rD,ah as oh,L as Lw,ao as at,ap as cD,v as vh,_ as uh,aJ as gw,a5 as z$1,B as Bo,bI as L,aE as gy,aD as A,n as ne}from'./main-KGKRJELG.js';var S=(()=>{class t extends z$1{modelValue=Bo(void 0);$filled=nT(()=>L(this.modelValue()));writeModelValue(e){this.modelValue.set(e);}static \u0275fac=(()=>{let e;return function(i){return (e||(e=gy(t)))(i||t)}})();static \u0275dir=rD({type:t,features:[oh]})}return t})();var P=`
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`;var V=`
    ${P}

    /* For PrimeNG */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,B={root:({instance:t})=>["p-inputtext p-component",{"p-filled":t.$filled(),"p-inputtext-sm":t.pSize==="small","p-inputtext-lg":t.pSize==="large","p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-inputtext-fluid":t.hasFluid}]},z=(()=>{class t extends A{name="inputtext";style=V;classes=B;static \u0275fac=(()=>{let e;return function(i){return (e||(e=gy(t)))(i||t)}})();static \u0275prov=ne({token:t,factory:t.\u0275fac})}return t})();var C=new C$1("INPUTTEXT_INSTANCE"),it=(()=>{class t extends S{componentName="InputText";hostName="";ptInputText=xL();pInputTextPT=xL();pInputTextUnstyled=xL();bindDirectiveInstance=I(Ue,{self:true});$pcInputText=I(C,{optional:true,skipSelf:true})??void 0;ngControl=I(D,{optional:true,self:true});pcFluid=I(gr,{optional:true,host:true,skipSelf:true});pSize;variant=xL();fluid=xL(void 0,{transform:LL});invalid=xL(void 0,{transform:LL});$variant=nT(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());_componentStyle=I(z);constructor(){super(),Qu(()=>{let e=this.ptInputText()||this.pInputTextPT();e&&this.directivePT.set(e);}),Qu(()=>{this.pInputTextUnstyled()&&this.directiveUnstyled.set(this.pInputTextUnstyled());});}onAfterViewInit(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value),this.cd.detectChanges();}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"));}onDoCheck(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value);}onInput(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value);}get hasFluid(){return this.fluid()??!!this.pcFluid}get dataP(){return this.cn({invalid:this.invalid(),fluid:this.hasFluid,filled:this.$variant()==="filled",[this.pSize]:this.pSize})}static \u0275fac=function(n){return new(n||t)};static \u0275dir=rD({type:t,selectors:[["","pInputText",""]],hostVars:3,hostBindings:function(n,i){n&1&&vh("input",function(){return i.onInput()}),n&2&&(uh("data-p",i.dataP),gw(i.cx("root")));},inputs:{hostName:"hostName",ptInputText:[1,"ptInputText"],pInputTextPT:[1,"pInputTextPT"],pInputTextUnstyled:[1,"pInputTextUnstyled"],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},features:[Lw([z,{provide:C,useExisting:t},{provide:at,useExisting:t}]),cD([Ue]),oh]})}return t})(),ot=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=eD({type:t});static \u0275inj=Ms({})}return t})();export{S,it as i,ot as o};