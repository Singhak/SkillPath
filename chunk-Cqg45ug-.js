import {m}from'./chunk-CmVjBcAv.js';import {aa as YI,ab as bs,aG as NL,I,ae as Hc,ax as C,bM as Et,av as OL,Y as Yw,G as Gu,c9 as XI,au as nh,a3 as xw,ay as wo,az as oD,m as mh,aK as ch,B as dw,ao as fy,ad as hr,bO as Me$1,r,af as Le$1,aj as Qa,cI as Ns,bu as Au,al as _i,am as Fi,H as Ho,c0 as pt,c5 as vu,bp as Du,cm as Eu,cl as mu,cn as ie,co as xu,bc as Ar,bB as Zu,ah as se,Q as QI,c as cn,aq as us,ar as cs,ac as el,aI as dt,cp as _e,aJ as qD,C as CD,f as bD,aA as Eh,aB as zD,aC as QD,aD as vh,b as Qu,bx as Le$2,aF as ve,e as ee,a_ as GD,o as oh,$ as $D,h as hE,l as lh,aY as Rw,A as Aw,b2 as ph,i as PD,T as Ti,k as Du$1,p as wu,U as Uc,aX as lw}from'./main-3QSGXNYS.js';var $=(()=>{class t extends hr{modelValue=Ho(void 0);$filled=Yw(()=>Le$2(this.modelValue()));writeModelValue(e){this.modelValue.set(e);}static \u0275fac=(()=>{let e;return function(n){return (e||(e=fy(t)))(n||t)}})();static \u0275dir=XI({type:t,features:[nh]})}return t})();var we=`
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
`;var Fe=`
    ${we}

    /* For PrimeNG */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,Re={root:({instance:t})=>["p-inputtext p-component",{"p-filled":t.$filled(),"p-inputtext-sm":t.pSize==="small","p-inputtext-lg":t.pSize==="large","p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-inputtext-fluid":t.hasFluid}]},Me=(()=>{class t extends ve{name="inputtext";style=Fe;classes=Re;static \u0275fac=(()=>{let e;return function(n){return (e||(e=fy(t)))(n||t)}})();static \u0275prov=ee({token:t,factory:t.\u0275fac})}return t})();var Se=new C("INPUTTEXT_INSTANCE"),mt=(()=>{class t extends ${componentName="InputText";hostName="";ptInputText=NL();pInputTextPT=NL();pInputTextUnstyled=NL();bindDirectiveInstance=I(Hc,{self:true});$pcInputText=I(Se,{optional:true,skipSelf:true})??void 0;ngControl=I(m,{optional:true,self:true});pcFluid=I(Et,{optional:true,host:true,skipSelf:true});pSize;variant=NL();fluid=NL(void 0,{transform:OL});invalid=NL(void 0,{transform:OL});$variant=Yw(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());_componentStyle=I(Me);constructor(){super(),Gu(()=>{let e=this.ptInputText()||this.pInputTextPT();e&&this.directivePT.set(e);}),Gu(()=>{this.pInputTextUnstyled()&&this.directiveUnstyled.set(this.pInputTextUnstyled());});}onAfterViewInit(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value),this.cd.detectChanges();}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"));}onDoCheck(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value);}onInput(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value);}get hasFluid(){return this.fluid()??!!this.pcFluid}get dataP(){return this.cn({invalid:this.invalid(),fluid:this.hasFluid,filled:this.$variant()==="filled",[this.pSize]:this.pSize})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=XI({type:t,selectors:[["","pInputText",""]],hostVars:3,hostBindings:function(i,n){i&1&&mh("input",function(){return n.onInput()}),i&2&&(ch("data-p",n.dataP),dw(n.cx("root")));},inputs:{hostName:"hostName",ptInputText:[1,"ptInputText"],pInputTextPT:[1,"pInputTextPT"],pInputTextUnstyled:[1,"pInputTextUnstyled"],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},features:[xw([Me,{provide:Se,useExisting:t},{provide:wo,useExisting:t}]),oD([Hc]),nh]})}return t})(),ft=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=YI({type:t});static \u0275inj=bs({})}return t})();var Ie=(()=>{class t extends ${required=NL(void 0,{transform:OL});invalid=NL(void 0,{transform:OL});disabled=NL(void 0,{transform:OL});name=NL();_disabled=Ho(false);$disabled=Yw(()=>this.disabled()||this._disabled());onModelChange=()=>{};onModelTouched=()=>{};writeDisabledState(e){this._disabled.set(e);}writeControlValue(e,i){}writeValue(e){this.writeControlValue(e,this.writeModelValue.bind(this));}registerOnChange(e){this.onModelChange=e;}registerOnTouched(e){this.onModelTouched=e;}setDisabledState(e){this.writeDisabledState(e),this.cd.markForCheck();}static \u0275fac=(()=>{let e;return function(n){return (e||(e=fy(t)))(n||t)}})();static \u0275dir=XI({type:t,inputs:{required:[1,"required"],invalid:[1,"invalid"],disabled:[1,"disabled"],name:[1,"name"]},features:[nh]})}return t})();var Tt=(()=>{class t extends Ie{pcFluid=I(Et,{optional:true,host:true,skipSelf:true});fluid=NL(void 0,{transform:OL});variant=NL();size=NL();inputSize=NL();pattern=NL();min=NL();max=NL();step=NL();minlength=NL();maxlength=NL();$variant=Yw(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=(()=>{let e;return function(n){return (e||(e=fy(t)))(n||t)}})();static \u0275dir=XI({type:t,inputs:{fluid:[1,"fluid"],variant:[1,"variant"],size:[1,"size"],inputSize:[1,"inputSize"],pattern:[1,"pattern"],min:[1,"min"],max:[1,"max"],step:[1,"step"],minlength:[1,"minlength"],maxlength:[1,"maxlength"]},features:[nh]})}return t})();var Le=["content"],ze=["overlay"],ke=["*","*"],je=()=>({mode:null}),Be=t=>({$implicit:t}),He=t=>({mode:t});function $e(t,w){t&1&&ph(0);}function Pe(t,w){if(t&1&&(GD(0),oh(1,$e,1,0,"ng-container",3)),t&2){let e=$D();hE(),lh("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Rw(3,Be,Aw(2,je)));}}function Ze(t,w){t&1&&ph(0);}function Ue(t,w){if(t&1){let e=PD();Ti(0,"div",5,0),mh("click",function(){Du$1(e);let n=$D(2);return wu(n.onOverlayClick())}),Ti(2,"p-motion",6),mh("onBeforeEnter",function(n){Du$1(e);let r=$D(2);return wu(r.onOverlayBeforeEnter(n))})("onEnter",function(n){Du$1(e);let r=$D(2);return wu(r.onOverlayEnter(n))})("onAfterEnter",function(n){Du$1(e);let r=$D(2);return wu(r.onOverlayAfterEnter(n))})("onBeforeLeave",function(n){Du$1(e);let r=$D(2);return wu(r.onOverlayBeforeLeave(n))})("onLeave",function(n){Du$1(e);let r=$D(2);return wu(r.onOverlayLeave(n))})("onAfterLeave",function(n){Du$1(e);let r=$D(2);return wu(r.onOverlayAfterLeave(n))}),Ti(3,"div",5,1),mh("click",function(n){Du$1(e);let r=$D(2);return wu(r.onOverlayContentClick(n))}),GD(5,1),oh(6,Ze,1,0,"ng-container",3),Uc()()();}if(t&2){let e=$D(2);lw(e.sx("root")),dw(e.cn(e.cx("root"),e.styleClass)),lh("pBind",e.ptm("root")),hE(2),lh("visible",e.visible)("appear",true)("options",e.computedMotionOptions()),hE(),dw(e.cn(e.cx("content"),e.contentStyleClass)),lh("pBind",e.ptm("content")),hE(3),lh("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Rw(15,Be,Rw(13,He,e.overlayMode)));}}function Ke(t,w){if(t&1&&oh(0,Ue,7,17,"div",4),t&2){let e=$D();lh("ngIf",e.modalVisible);}}var Qe={root:()=>({position:"absolute",top:"0"})},qe=`
.p-overlay-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-content {
    transform-origin: inherit;
    will-change: transform;
}

/* Github Issue #18560 */
.p-component-overlay.p-component {
    position: relative;
}

.p-overlay-modal > .p-overlay-content {
    z-index: 1;
    width: 90%;
}

/* Position */
/* top */
.p-overlay-top {
    align-items: flex-start;
}
.p-overlay-top-start {
    align-items: flex-start;
    justify-content: flex-start;
}
.p-overlay-top-end {
    align-items: flex-start;
    justify-content: flex-end;
}

/* bottom */
.p-overlay-bottom {
    align-items: flex-end;
}
.p-overlay-bottom-start {
    align-items: flex-end;
    justify-content: flex-start;
}
.p-overlay-bottom-end {
    align-items: flex-end;
    justify-content: flex-end;
}

/* left */
.p-overlay-left {
    justify-content: flex-start;
}
.p-overlay-left-start {
    justify-content: flex-start;
    align-items: flex-start;
}
.p-overlay-left-end {
    justify-content: flex-start;
    align-items: flex-end;
}

/* right */
.p-overlay-right {
    justify-content: flex-end;
}
.p-overlay-right-start {
    justify-content: flex-end;
    align-items: flex-start;
}
.p-overlay-right-end {
    justify-content: flex-end;
    align-items: flex-end;
}

.p-overlay-content ~ .p-overlay-content {
    display: none;
}
`,Ye={host:"p-overlay-host",root:({instance:t})=>["p-overlay p-component",{"p-overlay-modal p-overlay-mask p-overlay-mask-enter-active":t.modal,"p-overlay-center":t.modal&&t.overlayResponsiveDirection==="center","p-overlay-top":t.modal&&t.overlayResponsiveDirection==="top","p-overlay-top-start":t.modal&&t.overlayResponsiveDirection==="top-start","p-overlay-top-end":t.modal&&t.overlayResponsiveDirection==="top-end","p-overlay-bottom":t.modal&&t.overlayResponsiveDirection==="bottom","p-overlay-bottom-start":t.modal&&t.overlayResponsiveDirection==="bottom-start","p-overlay-bottom-end":t.modal&&t.overlayResponsiveDirection==="bottom-end","p-overlay-left":t.modal&&t.overlayResponsiveDirection==="left","p-overlay-left-start":t.modal&&t.overlayResponsiveDirection==="left-start","p-overlay-left-end":t.modal&&t.overlayResponsiveDirection==="left-end","p-overlay-right":t.modal&&t.overlayResponsiveDirection==="right","p-overlay-right-start":t.modal&&t.overlayResponsiveDirection==="right-start","p-overlay-right-end":t.modal&&t.overlayResponsiveDirection==="right-end"}],content:"p-overlay-content"},Ne=(()=>{class t extends ve{name="overlay";style=qe;classes=Ye;inlineStyles=Qe;static \u0275fac=(()=>{let e;return function(n){return (e||(e=fy(t)))(n||t)}})();static \u0275prov=ee({token:t,factory:t.\u0275fac})}return t})(),Ve=new C("OVERLAY_INSTANCE"),Wt=(()=>{class t extends hr{overlayService;zone;componentName="Overlay";$pcOverlay=I(Ve,{optional:true,skipSelf:true})??void 0;hostName="";get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.modalVisible&&(this.modalVisible=true);}get mode(){return this._mode||this.overlayOptions?.mode}set mode(e){this._mode=e;}get style(){return Me$1.merge(this._style,this.modal?this.overlayResponsiveOptions?.style:this.overlayOptions?.style)}set style(e){this._style=e;}get styleClass(){return Me$1.merge(this._styleClass,this.modal?this.overlayResponsiveOptions?.styleClass:this.overlayOptions?.styleClass)}set styleClass(e){this._styleClass=e;}get contentStyle(){return Me$1.merge(this._contentStyle,this.modal?this.overlayResponsiveOptions?.contentStyle:this.overlayOptions?.contentStyle)}set contentStyle(e){this._contentStyle=e;}get contentStyleClass(){return Me$1.merge(this._contentStyleClass,this.modal?this.overlayResponsiveOptions?.contentStyleClass:this.overlayOptions?.contentStyleClass)}set contentStyleClass(e){this._contentStyleClass=e;}get target(){let e=this._target||this.overlayOptions?.target;return e===void 0?"@prev":e}set target(e){this._target=e;}get autoZIndex(){let e=this._autoZIndex||this.overlayOptions?.autoZIndex;return e===void 0?true:e}set autoZIndex(e){this._autoZIndex=e;}get baseZIndex(){let e=this._baseZIndex||this.overlayOptions?.baseZIndex;return e===void 0?0:e}set baseZIndex(e){this._baseZIndex=e;}get showTransitionOptions(){let e=this._showTransitionOptions||this.overlayOptions?.showTransitionOptions;return e===void 0?".12s cubic-bezier(0, 0, 0.2, 1)":e}set showTransitionOptions(e){this._showTransitionOptions=e;}get hideTransitionOptions(){let e=this._hideTransitionOptions||this.overlayOptions?.hideTransitionOptions;return e===void 0?".1s linear":e}set hideTransitionOptions(e){this._hideTransitionOptions=e;}get listener(){return this._listener||this.overlayOptions?.listener}set listener(e){this._listener=e;}get responsive(){return this._responsive||this.overlayOptions?.responsive}set responsive(e){this._responsive=e;}get options(){return this._options}set options(e){this._options=e;}appendTo=NL(void 0);inline=NL(false);motionOptions=NL(void 0);computedMotionOptions=Yw(()=>r(r({},this.ptm("motion")),this.motionOptions()||this.overlayOptions?.motionOptions));visibleChange=new Le$1;onBeforeShow=new Le$1;onShow=new Le$1;onBeforeHide=new Le$1;onHide=new Le$1;onAnimationStart=new Le$1;onAnimationDone=new Le$1;onBeforeEnter=new Le$1;onEnter=new Le$1;onAfterEnter=new Le$1;onBeforeLeave=new Le$1;onLeave=new Le$1;onAfterLeave=new Le$1;overlayViewChild;contentViewChild;contentTemplate;templates;hostAttrSelector=NL();$appendTo=Yw(()=>this.appendTo()||this.config.overlayAppendTo());_contentTemplate;_visible=false;_mode;_style;_styleClass;_contentStyle;_contentStyleClass;_target;_autoZIndex;_baseZIndex;_showTransitionOptions;_hideTransitionOptions;_listener;_responsive;_options;modalVisible=false;isOverlayClicked=false;isOverlayContentClicked=false;scrollHandler;documentClickListener;documentResizeListener;_componentStyle=I(Ne);bindDirectiveInstance=I(Hc,{self:true});documentKeyboardListener;parentDragSubscription=null;window;transformOptions={default:"scaleY(0.8)",center:"scale(0.7)",top:"translate3d(0px, -100%, 0px)","top-start":"translate3d(0px, -100%, 0px)","top-end":"translate3d(0px, -100%, 0px)",bottom:"translate3d(0px, 100%, 0px)","bottom-start":"translate3d(0px, 100%, 0px)","bottom-end":"translate3d(0px, 100%, 0px)",left:"translate3d(-100%, 0px, 0px)","left-start":"translate3d(-100%, 0px, 0px)","left-end":"translate3d(-100%, 0px, 0px)",right:"translate3d(100%, 0px, 0px)","right-start":"translate3d(100%, 0px, 0px)","right-end":"translate3d(100%, 0px, 0px)"};get modal(){if(Qa(this.platformId))return this.mode==="modal"||this.overlayResponsiveOptions&&this.document.defaultView?.matchMedia(this.overlayResponsiveOptions.media?.replace("@media","")||`(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches}get overlayMode(){return this.mode||(this.modal?"modal":"overlay")}get overlayOptions(){return r(r({},this.config?.overlayOptions),this.options)}get overlayResponsiveOptions(){return r(r({},this.overlayOptions?.responsive),this.responsive)}get overlayResponsiveDirection(){return this.overlayResponsiveOptions?.direction||"center"}get overlayEl(){return this.overlayViewChild?.nativeElement}get contentEl(){return this.contentViewChild?.nativeElement}get targetEl(){return Ns(this.target,this.el?.nativeElement)}constructor(e,i){super(),this.overlayService=e,this.zone=i;}onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="content"?this._contentTemplate=e.template:this._contentTemplate=e.template;});}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"));}show(e,i=false){this.onVisibleChange(true),this.handleEvents("onShow",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&Au(this.targetEl),this.modal&&_i(this.document?.body,"p-overflow-hidden");}hide(e,i=false){if(this.visible)this.onVisibleChange(false),this.handleEvents("onHide",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&Au(this.targetEl),this.modal&&Fi(this.document?.body,"p-overflow-hidden");else return}onVisibleChange(e){this._visible=e,this.visibleChange.emit(e);}onOverlayClick(){this.isOverlayClicked=true;}onOverlayContentClick(e){this.overlayService.add({originalEvent:e,target:this.targetEl}),this.isOverlayContentClicked=true;}container=Ho(void 0);onOverlayBeforeEnter(e){this.handleEvents("onBeforeShow",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.container.set(this.overlayEl||e.element),this.show(this.overlayEl,true),this.hostAttrSelector()&&this.overlayEl&&this.overlayEl.setAttribute(this.hostAttrSelector(),""),this.appendOverlay(),this.alignOverlay(),this.bindParentDragListener(),this.setZIndex(),this.handleEvents("onBeforeEnter",e);}onOverlayEnter(e){this.handleEvents("onEnter",e);}onOverlayAfterEnter(e){this.bindListeners(),this.handleEvents("onAfterEnter",e);}onOverlayBeforeLeave(e){this.handleEvents("onBeforeHide",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.handleEvents("onBeforeLeave",e);}onOverlayLeave(e){this.handleEvents("onLeave",e);}onOverlayAfterLeave(e){this.hide(this.overlayEl,true),this.container.set(null),this.unbindListeners(),this.appendOverlay(),pt.clear(this.overlayEl),this.modalVisible=false,this.cd.markForCheck(),this.handleEvents("onAfterLeave",e);}handleEvents(e,i){this[e].emit(i),this.options&&this.options[e]&&this.options[e](i),this.config?.overlayOptions&&(this.config?.overlayOptions)[e]&&(this.config?.overlayOptions)[e](i);}setZIndex(){this.autoZIndex&&pt.set(this.overlayMode,this.overlayEl,this.baseZIndex+this.config?.zIndex[this.overlayMode]);}appendOverlay(){this.$appendTo()&&this.$appendTo()!=="self"&&(this.$appendTo()==="body"?vu(this.document.body,this.overlayEl):vu(this.$appendTo(),this.overlayEl));}alignOverlay(){this.modal||this.overlayEl&&this.targetEl&&(this.overlayEl.style.minWidth=Du(this.targetEl)+"px",this.$appendTo()==="self"?Eu(this.overlayEl,this.targetEl):mu(this.overlayEl,this.targetEl));}bindListeners(){this.bindScrollListener(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindDocumentKeyboardListener();}unbindListeners(){this.unbindScrollListener(),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindDocumentKeyboardListener(),this.unbindParentDragListener();}bindParentDragListener(){!this.parentDragSubscription&&this.$appendTo()!=="self"&&this.targetEl&&(this.parentDragSubscription=this.overlayService.parentDragObservable.subscribe(e=>{e.contains(this.targetEl)&&this.hide(this.overlayEl,true);}));}unbindParentDragListener(){this.parentDragSubscription&&(this.parentDragSubscription.unsubscribe(),this.parentDragSubscription=null);}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new ie(this.targetEl,e=>{(!this.listener||this.listener(e,{type:"scroll",mode:this.overlayMode,valid:true}))&&this.hide(e,true);})),this.scrollHandler.bindScrollListener();}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener();}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.document,"click",e=>{let n=!(this.targetEl&&(this.targetEl.isSameNode(e.target)||!this.isOverlayClicked&&this.targetEl.contains(e.target)))&&!this.isOverlayContentClicked;(this.listener?this.listener(e,{type:"outside",mode:this.overlayMode,valid:e.which!==3&&n}):n)&&this.hide(e),this.isOverlayClicked=this.isOverlayContentClicked=false;}));}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null);}bindDocumentResizeListener(){this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.document.defaultView,"resize",e=>{(this.listener?this.listener(e,{type:"resize",mode:this.overlayMode,valid:!xu()}):!xu())&&this.hide(e,true);}));}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null);}bindDocumentKeyboardListener(){this.documentKeyboardListener||this.zone.runOutsideAngular(()=>{this.documentKeyboardListener=this.renderer.listen(this.document.defaultView,"keydown",e=>{if(this.overlayOptions.hideOnEscape===false||e.code!=="Escape")return;(this.listener?this.listener(e,{type:"keydown",mode:this.overlayMode,valid:!xu()}):!xu())&&this.zone.run(()=>{this.hide(e,true);});});});}unbindDocumentKeyboardListener(){this.documentKeyboardListener&&(this.documentKeyboardListener(),this.documentKeyboardListener=null);}onDestroy(){this.hide(this.overlayEl,true),this.overlayEl&&this.$appendTo()!=="self"&&(this.renderer.appendChild(this.el.nativeElement,this.overlayEl),pt.clear(this.overlayEl)),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindListeners();}static \u0275fac=function(i){return new(i||t)(Ar(Zu),Ar(se))};static \u0275cmp=QI({type:t,selectors:[["p-overlay"]],contentQueries:function(i,n,r){if(i&1&&vh(r,Le,4)(r,Qu,4),i&2){let M;zD(M=QD())&&(n.contentTemplate=M.first),zD(M=QD())&&(n.templates=M);}},viewQuery:function(i,n){if(i&1&&Eh(ze,5)(Le,5),i&2){let r;zD(r=QD())&&(n.overlayViewChild=r.first),zD(r=QD())&&(n.contentViewChild=r.first);}},inputs:{hostName:"hostName",visible:"visible",mode:"mode",style:"style",styleClass:"styleClass",contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",target:"target",autoZIndex:"autoZIndex",baseZIndex:"baseZIndex",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",listener:"listener",responsive:"responsive",options:"options",appendTo:[1,"appendTo"],inline:[1,"inline"],motionOptions:[1,"motionOptions"],hostAttrSelector:[1,"hostAttrSelector"]},outputs:{visibleChange:"visibleChange",onBeforeShow:"onBeforeShow",onShow:"onShow",onBeforeHide:"onBeforeHide",onHide:"onHide",onAnimationStart:"onAnimationStart",onAnimationDone:"onAnimationDone",onBeforeEnter:"onBeforeEnter",onEnter:"onEnter",onAfterEnter:"onAfterEnter",onBeforeLeave:"onBeforeLeave",onLeave:"onLeave",onAfterLeave:"onAfterLeave"},features:[xw([Ne,{provide:Ve,useExisting:t},{provide:wo,useExisting:t}]),oD([Hc]),nh],ngContentSelectors:ke,decls:2,vars:1,consts:[["overlay",""],["content",""],[3,"class","style","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class","style","pBind","click",4,"ngIf"],[3,"click","pBind"],["name","p-anchored-overlay",3,"onBeforeEnter","onEnter","onAfterEnter","onBeforeLeave","onLeave","onAfterLeave","visible","appear","options"]],template:function(i,n){i&1&&(qD(ke),CD(0,Pe,2,5)(1,Ke,1,1,"div",2)),i&2&&bD(n.inline()?0:1);},dependencies:[cn,us,cs,el,Hc,dt,_e],encapsulation:2})}return t})();export{$,Ie as I,Tt as T,Wt as W,ft as f,mt as m};