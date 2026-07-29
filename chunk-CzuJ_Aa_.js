import {ad as QI,ae as bs,cr as Ct,I,ah as R,aB as C,aK as ML,az as kL,$ as zw,ai as Le$1,cs as g,b$ as qn,z as qu,cp as KI,ay as th,X as Mw,aC as he$1,aD as nD,g as gh,x as cw,af as Pe$1,ag as Y,aq as ec,ar as uy,W as WI,i as fe,as as Uo,au as In,av as Pn,bR as L,aN as BD,b2 as $D,o as rh,a$ as Uw,b3 as zD,f as fE,u as ch,aO as ah,b0 as sw,aH as yh,k as cr,aF as qD,aG as GD,T as Ti,v as vw,U as Uc,p as kh,aJ as H,e as ee,R as RD,D as Du,d as VD,h as wu,bb as Hf,b4 as Wc,b5 as zc,l as lh,aT as Pu}from'./main-AFRLRH7Y.js';var pe=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`;var Te=["removeicon"],Ie=["*"];function we(e,c){if(e&1){let t=RD();Ti(0,"img",4),gh("error",function(n){Du(t);let a=VD();return wu(a.imageError(n))}),Uc();}if(e&2){let t=VD();cw(t.cx("image")),ch("pBind",t.ptm("image"))("src",t.image,Hf)("alt",t.alt);}}function ke(e,c){if(e&1&&lh(0,"span",6),e&2){let t=VD(2);cw(t.icon),ch("pBind",t.ptm("icon"))("ngClass",t.cx("icon"));}}function Ee(e,c){if(e&1&&rh(0,ke,1,4,"span",5),e&2){let t=VD();ch("ngIf",t.icon);}}function Me(e,c){if(e&1&&(Ti(0,"div",7),vw(1),Uc()),e&2){let t=VD();cw(t.cx("label")),ch("pBind",t.ptm("label")),fE(),kh(t.label);}}function Se(e,c){if(e&1){let t=RD();Ti(0,"span",11),gh("click",function(n){Du(t);let a=VD(3);return wu(a.close(n))})("keydown",function(n){Du(t);let a=VD(3);return wu(a.onKeydown(n))}),Uc();}if(e&2){let t=VD(3);cw(t.removeIcon),ch("pBind",t.ptm("removeIcon"))("ngClass",t.cx("removeIcon")),ah("tabindex",t.disabled?-1:0)("aria-label",t.removeAriaLabel);}}function Be(e,c){if(e&1){let t=RD();Pu(),Ti(0,"svg",12),gh("click",function(n){Du(t);let a=VD(3);return wu(a.close(n))})("keydown",function(n){Du(t);let a=VD(3);return wu(a.onKeydown(n))}),Uc();}if(e&2){let t=VD(3);cw(t.cx("removeIcon")),ch("pBind",t.ptm("removeIcon")),ah("tabindex",t.disabled?-1:0)("aria-label",t.removeAriaLabel);}}function ze(e,c){if(e&1&&(Wc(0),rh(1,Se,1,6,"span",9)(2,Be,1,5,"svg",10),zc()),e&2){let t=VD(2);fE(),ch("ngIf",t.removeIcon),fE(),ch("ngIf",!t.removeIcon);}}function Ne(e,c){}function De(e,c){e&1&&rh(0,Ne,0,0,"ng-template");}function Ae(e,c){if(e&1){let t=RD();Ti(0,"span",13),gh("click",function(n){Du(t);let a=VD(2);return wu(a.close(n))})("keydown",function(n){Du(t);let a=VD(2);return wu(a.onKeydown(n))}),rh(1,De,1,0,null,14),Uc();}if(e&2){let t=VD(2);cw(t.cx("removeIcon")),ch("pBind",t.ptm("removeIcon")),ah("tabindex",t.disabled?-1:0)("aria-label",t.removeAriaLabel),fE(),ch("ngTemplateOutlet",t.removeIconTemplate||t._removeIconTemplate);}}function Fe(e,c){if(e&1&&(Wc(0),rh(1,ze,3,2,"ng-container",3)(2,Ae,2,6,"span",8),zc()),e&2){let t=VD();fE(),ch("ngIf",!t.removeIconTemplate&&!t._removeIconTemplate),fE(),ch("ngIf",t.removeIconTemplate||t._removeIconTemplate);}}var Ve={root:({instance:e})=>({display:!e.visible&&"none"})},Pe={root:({instance:e})=>["p-chip p-component",{"p-disabled":e.disabled}],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},ue=(()=>{class e extends H{name="chip";style=pe;classes=Pe;inlineStyles=Ve;static \u0275fac=(()=>{let t;return function(n){return (t||(t=uy(e)))(n||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var ge=new C("CHIP_INSTANCE"),Re=(()=>{class e extends Y{componentName="Chip";$pcChip=I(ge,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(R,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}label;icon;image;alt;styleClass;disabled=false;removable=false;removeIcon;onRemove=new Le$1;onImageError=new Le$1;visible=true;get removeAriaLabel(){return this.config.getTranslation(ec.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(t){this._chipProps=t,t&&typeof t=="object"&&Object.entries(t).forEach(([i,n])=>this[`_${i}`]!==n&&(this[`_${i}`]=n));}_chipProps;_componentStyle=I(ue);removeIconTemplate;templates;_removeIconTemplate;onAfterContentInit(){this.templates.forEach(t=>{t.getType()==="removeicon"?this._removeIconTemplate=t.template:this._removeIconTemplate=t.template;});}onChanges(t){if(t.chipProps&&t.chipProps.currentValue){let{currentValue:i}=t.chipProps;i.label!==void 0&&(this.label=i.label),i.icon!==void 0&&(this.icon=i.icon),i.image!==void 0&&(this.image=i.image),i.alt!==void 0&&(this.alt=i.alt),i.styleClass!==void 0&&(this.styleClass=i.styleClass),i.removable!==void 0&&(this.removable=i.removable),i.removeIcon!==void 0&&(this.removeIcon=i.removeIcon);}}close(t){this.visible=false,this.onRemove.emit(t);}onKeydown(t){(t.key==="Enter"||t.key==="Backspace")&&this.close(t);}imageError(t){this.onImageError.emit(t);}get dataP(){return this.cn({removable:this.removable})}static \u0275fac=(()=>{let t;return function(n){return (t||(t=uy(e)))(n||e)}})();static \u0275cmp=WI({type:e,selectors:[["p-chip"]],contentQueries:function(i,n,a){if(i&1&&yh(a,Te,4)(a,cr,4),i&2){let g;qD(g=GD())&&(n.removeIconTemplate=g.first),qD(g=GD())&&(n.templates=g);}},hostVars:6,hostBindings:function(i,n){i&2&&(ah("aria-label",n.label)("data-p",n.dataP),sw(n.sx("root")),cw(n.cn(n.cx("root"),n.styleClass)));},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",disabled:[2,"disabled","disabled",kL],removable:[2,"removable","removable",kL],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[Mw([ue,{provide:ge,useExisting:e},{provide:he$1,useExisting:e}]),nD([R]),th],ngContentSelectors:Ie,decls:6,vars:4,consts:[["iconTemplate",""],[3,"pBind","class","src","alt","error",4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"],[4,"ngIf"],[3,"error","pBind","src","alt"],[3,"pBind","class","ngClass",4,"ngIf"],[3,"pBind","ngClass"],[3,"pBind"],["role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"pBind","class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"click","keydown","pBind","ngClass"],["data-p-icon","times-circle","role","button",3,"click","keydown","pBind"],["role","button",3,"click","keydown","pBind"],[4,"ngTemplateOutlet"]],template:function(i,n){if(i&1&&(BD(),$D(0),rh(1,we,1,5,"img",1)(2,Ee,1,1,"ng-template",null,0,Uw)(4,Me,2,4,"div",2)(5,Fe,3,2,"ng-container",3)),i&2){let a=zD(3);fE(),ch("ngIf",n.image)("ngIfElse",a),fE(3),ch("ngIf",n.label),fE(),ch("ngIf",n.removable);}},dependencies:[fe,Uo,In,Pn,L,Pe$1,R],encapsulation:2})}return e})(),mt=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=QI({type:e});static \u0275inj=bs({imports:[Re,Pe$1,Pe$1]})}return e})();var he=`
    .p-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: dt('tag.primary.background');
        color: dt('tag.primary.color');
        font-size: dt('tag.font.size');
        font-weight: dt('tag.font.weight');
        padding: dt('tag.padding');
        border-radius: dt('tag.border.radius');
        gap: dt('tag.gap');
    }

    .p-tag-icon {
        font-size: dt('tag.icon.size');
        width: dt('tag.icon.size');
        height: dt('tag.icon.size');
    }

    .p-tag-rounded {
        border-radius: dt('tag.rounded.border.radius');
    }

    .p-tag-success {
        background: dt('tag.success.background');
        color: dt('tag.success.color');
    }

    .p-tag-info {
        background: dt('tag.info.background');
        color: dt('tag.info.color');
    }

    .p-tag-warn {
        background: dt('tag.warn.background');
        color: dt('tag.warn.color');
    }

    .p-tag-danger {
        background: dt('tag.danger.background');
        color: dt('tag.danger.color');
    }

    .p-tag-secondary {
        background: dt('tag.secondary.background');
        color: dt('tag.secondary.color');
    }

    .p-tag-contrast {
        background: dt('tag.contrast.background');
        color: dt('tag.contrast.color');
    }
`;var je=["icon"],He=["*"];function $e(e,c){if(e&1&&lh(0,"span",4),e&2){let t=VD(2);cw(t.cx("icon")),ch("ngClass",t.icon)("pBind",t.ptm("icon"));}}function Qe(e,c){if(e&1&&(Wc(0),rh(1,$e,1,4,"span",3),zc()),e&2){let t=VD();fE(),ch("ngIf",t.icon);}}function Oe(e,c){}function Ue(e,c){e&1&&rh(0,Oe,0,0,"ng-template");}function Le(e,c){if(e&1&&(Ti(0,"span",2),rh(1,Ue,1,0,null,5),Uc()),e&2){let t=VD();cw(t.cx("icon")),ch("pBind",t.ptm("icon")),fE(),ch("ngTemplateOutlet",t.iconTemplate||t._iconTemplate);}}var Ke={root:({instance:e})=>["p-tag p-component",{"p-tag-info":e.severity==="info","p-tag-success":e.severity==="success","p-tag-warn":e.severity==="warn","p-tag-danger":e.severity==="danger","p-tag-secondary":e.severity==="secondary","p-tag-contrast":e.severity==="contrast","p-tag-rounded":e.rounded}],icon:"p-tag-icon",label:"p-tag-label"},_e=(()=>{class e extends H{name="tag";style=he;classes=Ke;static \u0275fac=(()=>{let t;return function(n){return (t||(t=uy(e)))(n||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var ve=new C("TAG_INSTANCE"),qe=(()=>{class e extends Y{componentName="Tag";$pcTag=I(ve,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(R,{self:true});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_componentStyle=I(_e);onAfterContentInit(){this.templates?.forEach(t=>{t.getType()==="icon"&&(this._iconTemplate=t.template);});}get dataP(){return this.cn({rounded:this.rounded,[this.severity]:this.severity})}static \u0275fac=(()=>{let t;return function(n){return (t||(t=uy(e)))(n||e)}})();static \u0275cmp=WI({type:e,selectors:[["p-tag"]],contentQueries:function(i,n,a){if(i&1&&yh(a,je,4)(a,cr,4),i&2){let g;qD(g=GD())&&(n.iconTemplate=g.first),qD(g=GD())&&(n.templates=g);}},hostVars:3,hostBindings:function(i,n){i&2&&(ah("data-p",n.dataP),cw(n.cn(n.cx("root"),n.styleClass)));},inputs:{styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",kL]},features:[Mw([_e,{provide:ve,useExisting:e},{provide:he$1,useExisting:e}]),nD([R]),th],ngContentSelectors:He,decls:5,vars:6,consts:[[4,"ngIf"],[3,"class","pBind",4,"ngIf"],[3,"pBind"],[3,"class","ngClass","pBind",4,"ngIf"],[3,"ngClass","pBind"],[4,"ngTemplateOutlet"]],template:function(i,n){i&1&&(BD(),$D(0),rh(1,Qe,2,1,"ng-container",0)(2,Le,2,4,"span",1),Ti(3,"span",2),vw(4),Uc()),i&2&&(fE(),ch("ngIf",!n.iconTemplate&&!n._iconTemplate),fE(),ch("ngIf",n.iconTemplate||n._iconTemplate),fE(),cw(n.cx("label")),ch("pBind",n.ptm("label")),fE(),kh(n.value));},dependencies:[fe,Uo,In,Pn,Pe$1,R],encapsulation:2})}return e})(),Dt=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=QI({type:e});static \u0275inj=bs({imports:[qe,Pe$1,Pe$1]})}return e})();var xe=`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`;var Ge=`
    ${xe}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,Xe={root:({instance:e})=>["p-textarea p-component",{"p-filled":e.$filled(),"p-textarea-resizable ":e.autoResize,"p-variant-filled":e.$variant()==="filled","p-textarea-fluid":e.hasFluid,"p-inputfield-sm p-textarea-sm":e.pSize==="small","p-textarea-lg p-inputfield-lg":e.pSize==="large","p-invalid":e.invalid()}]},ye=(()=>{class e extends H{name="textarea";style=Ge;classes=Xe;static \u0275fac=(()=>{let t;return function(n){return (t||(t=uy(e)))(n||e)}})();static \u0275prov=ee({token:e,factory:e.\u0275fac})}return e})();var be=new C("TEXTAREA_INSTANCE"),Jt=(()=>{class e extends Ct{componentName="Textarea";bindDirectiveInstance=I(R,{self:true});$pcTextarea=I(be,{optional:true,skipSelf:true})??void 0;pTextareaPT=ML();pTextareaUnstyled=ML();autoResize;pSize;variant=ML();fluid=ML(void 0,{transform:kL});invalid=ML(void 0,{transform:kL});$variant=zw(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new Le$1;ngControlSubscription;_componentStyle=I(ye);ngControl=I(g,{optional:true,self:true});pcFluid=I(qn,{optional:true,host:true,skipSelf:true});get hasFluid(){return this.fluid()??!!this.pcFluid}constructor(){super(),qu(()=>{let t=this.pTextareaPT();t&&this.directivePT.set(t);}),qu(()=>{this.pTextareaUnstyled()&&this.directiveUnstyled.set(this.pTextareaUnstyled());});}onInit(){this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState();}));}onAfterViewInit(){this.autoResize&&this.resize(),this.cd.detectChanges();}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.autoResize&&this.resize(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value);}onInput(t){this.writeModelValue(t.target?.value),this.updateState();}resize(t){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(t||{});}updateState(){this.autoResize&&this.resize();}onDestroy(){this.ngControlSubscription&&this.ngControlSubscription.unsubscribe();}static \u0275fac=function(i){return new(i||e)};static \u0275dir=KI({type:e,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(i,n){i&1&&gh("input",function(g){return n.onInput(g)}),i&2&&cw(n.cx("root"));},inputs:{pTextareaPT:[1,"pTextareaPT"],pTextareaUnstyled:[1,"pTextareaUnstyled"],autoResize:[2,"autoResize","autoResize",kL],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[Mw([ye,{provide:be,useExisting:e},{provide:he$1,useExisting:e}]),nD([R]),th]})}return e})(),Wt=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=QI({type:e});static \u0275inj=bs({})}return e})();export{Dt as D,Jt as J,Re as R,Wt as W,mt as m,qe as q};