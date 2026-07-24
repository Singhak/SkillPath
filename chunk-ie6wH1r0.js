import {_ as _e,g as ge}from'./chunk-DcW8eZth.js';import {ac as FI,ad as Es,ae as Pe$1,bI as Qe$1,E,aA as C,ag as R,aJ as GL,ah as Pe$2,z as Lo,W as PT,bv as ft$1,bJ as Ie,ap as ec,aR as mt$1,bK as Du,bL as Kt$1,bG as Ou,bM as Ge$1,bA as Ke,bh as Sr,bN as qu,aj as se,L as LI,g as fe,ar as Uo,as as zi,at as In,au as Pn,av as On,bO as bt$1,J as oi,aK as $r,bP as Ar,bQ as L,bR as Mr,aw as Re$1,br as _r,ax as zp,ay as KL,az as JL,D as DD,Z as Zp,v as vi,a4 as Sh,p as pu,a5 as dT,h as hu,e as ah,a_ as RT,F as Fc,w as eh,c as tE,a7 as Nh,aN as Xp,U as mT,bS as _e$1,aB as he,aC as GI,a$ as ZD,K as KD,aD as uh,aE as kD,aF as OD,aG as lh,j as cr,aI as H,aq as Xm,X,N as ND,b3 as Hc,b4 as Bc,l as aT,bf as mh,$ as $c,bt as go,aS as _u,b0 as vT,b as th,b5 as oh,b2 as PD,bp as ET,bq as yT,b8 as IT,u as bh}from'./main-FSOJG4I4.js';import {R as Re}from'./chunk-CsAuN4mW.js';var Pe=`
    .p-autocomplete {
        display: inline-flex;
    }

    .p-autocomplete-loader {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-loader {
        inset-inline-end: calc(dt('autocomplete.dropdown.width') + dt('autocomplete.padding.x'));
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input,
    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input-multiple {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-autocomplete-dropdown {
        cursor: pointer;
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('autocomplete.dropdown.width');
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
        background: dt('autocomplete.dropdown.background');
        border: 1px solid dt('autocomplete.dropdown.border.color');
        border-inline-start: 0 none;
        color: dt('autocomplete.dropdown.color');
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
    }

    .p-autocomplete-dropdown:not(:disabled):hover {
        background: dt('autocomplete.dropdown.hover.background');
        border-color: dt('autocomplete.dropdown.hover.border.color');
        color: dt('autocomplete.dropdown.hover.color');
    }

    .p-autocomplete-dropdown:not(:disabled):active {
        background: dt('autocomplete.dropdown.active.background');
        border-color: dt('autocomplete.dropdown.active.border.color');
        color: dt('autocomplete.dropdown.active.color');
    }

    .p-autocomplete-dropdown:focus-visible {
        box-shadow: dt('autocomplete.dropdown.focus.ring.shadow');
        outline: dt('autocomplete.dropdown.focus.ring.width') dt('autocomplete.dropdown.focus.ring.style') dt('autocomplete.dropdown.focus.ring.color');
        outline-offset: dt('autocomplete.dropdown.focus.ring.offset');
    }

    .p-autocomplete-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('autocomplete.overlay.background');
        color: dt('autocomplete.overlay.color');
        border: 1px solid dt('autocomplete.overlay.border.color');
        border-radius: dt('autocomplete.overlay.border.radius');
        box-shadow: dt('autocomplete.overlay.shadow');
        min-width: 100%;
    }

    .p-autocomplete-list-container {
        overflow: auto;
    }

    .p-autocomplete-list {
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: dt('autocomplete.list.gap');
        padding: dt('autocomplete.list.padding');
    }

    .p-autocomplete-option {
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('autocomplete.option.padding');
        border: 0 none;
        color: dt('autocomplete.option.color');
        background: transparent;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration');
        border-radius: dt('autocomplete.option.border.radius');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled).p-focus {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled):hover {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option-selected {
        background: dt('autocomplete.option.selected.background');
        color: dt('autocomplete.option.selected.color');
    }

    .p-autocomplete-option-selected.p-focus {
        background: dt('autocomplete.option.selected.focus.background');
        color: dt('autocomplete.option.selected.focus.color');
    }

    .p-autocomplete-option-group {
        margin: 0;
        padding: dt('autocomplete.option.group.padding');
        color: dt('autocomplete.option.group.color');
        background: dt('autocomplete.option.group.background');
        font-weight: dt('autocomplete.option.group.font.weight');
    }

    .p-autocomplete-input-multiple {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('autocomplete.padding.y') / 2) dt('autocomplete.padding.x');
        gap: calc(dt('autocomplete.padding.y') / 2);
        color: dt('autocomplete.color');
        background: dt('autocomplete.background');
        border: 1px solid dt('autocomplete.border.color');
        border-radius: dt('autocomplete.border.radius');
        width: 100%;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
        box-shadow: dt('autocomplete.shadow');
    }

    .p-autocomplete-input-multiple.p-disabled {
        opacity: 1;
        background: dt('autocomplete.disabled.background');
        color: dt('autocomplete.disabled.color');
    }

    .p-autocomplete-input-multiple:not(.p-disabled):hover {
        border-color: dt('autocomplete.hover.border.color');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled) {
        border-color: dt('autocomplete.focus.border.color');
        box-shadow: dt('autocomplete.focus.ring.shadow');
        outline: dt('autocomplete.focus.ring.width') dt('autocomplete.focus.ring.style') dt('autocomplete.focus.ring.color');
        outline-offset: dt('autocomplete.focus.ring.offset');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    .p-variant-filled.p-autocomplete-input-multiple {
        background: dt('autocomplete.filled.background');
    }

    .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled):hover {
        background: dt('autocomplete.filled.hover.background');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled) {
        background: dt('autocomplete.filled.focus.background');
    }

    .p-autocomplete-chip.p-chip {
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
        border-radius: dt('autocomplete.chip.border.radius');
    }

    .p-autocomplete-input-multiple:has(.p-autocomplete-chip) {
        padding-inline-start: calc(dt('autocomplete.padding.y') / 2);
        padding-inline-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-chip-item.p-focus .p-autocomplete-chip {
        background: dt('autocomplete.chip.focus.background');
        color: dt('autocomplete.chip.focus.color');
    }

    .p-autocomplete-input-chip {
        flex: 1 1 auto;
        display: inline-flex;
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-input-chip input {
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.placeholder.color');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    .p-autocomplete-empty-message {
        padding: dt('autocomplete.empty.message.padding');
    }

    .p-autocomplete-fluid {
        display: flex;
    }

    .p-autocomplete-fluid:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        width: 1%;
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.sm.width');
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.lg.width');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-autocomplete-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        color: dt('form.field.icon.color');
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-clear-icon {
        inset-inline-end: calc(dt('autocomplete.padding.x') + dt('autocomplete.dropdown.width'));
    }

    .p-autocomplete:has(.p-autocomplete-clear-icon) .p-autocomplete-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputgroup .p-autocomplete-dropdown {
        border-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child:has(.p-autocomplete-dropdown) > .p-autocomplete-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child .p-autocomplete-dropdown {
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
    }
`;var We=["item"],Ze=["empty"],Je=["header"],Xe=["footer"],Ye=["selecteditem"],et=["group"],tt=["loader"],nt=["removeicon"],it=["loadingicon"],ot=["clearicon"],lt=["dropdownicon"],at=["focusInput"],pt=["multiIn"],rt=["multiContainer"],st=["ddBtn"],ct=["items"],ut=["scroller"],dt=["overlay"],mt=i=>({i}),Ue=i=>({$implicit:i}),ht=(i,p,e)=>({removeCallback:i,index:p,class:e}),U=i=>({height:i}),Ne=(i,p)=>({$implicit:i,options:p}),_t=i=>({options:i}),gt=()=>({}),ft=(i,p,e)=>({option:i,i:p,scrollerOptions:e}),yt=(i,p)=>({$implicit:i,index:p});function xt(i,p){if(i&1){let e=DD();vi(0,"input",18,2),ah("input",function(n){pu(e);let o=ND();return hu(o.onInput(n))})("keydown",function(n){pu(e);let o=ND();return hu(o.onKeyDown(n))})("change",function(n){pu(e);let o=ND();return hu(o.onInputChange(n))})("focus",function(n){pu(e);let o=ND();return hu(o.onInputFocus(n))})("blur",function(n){pu(e);let o=ND();return hu(o.onInputBlur(n))})("paste",function(n){pu(e);let o=ND();return hu(o.onInputPaste(n))})("keyup",function(n){pu(e);let o=ND();return hu(o.onInputKeyUp(n))}),Fc();}if(i&2){let e=ND();KD(e.cn(e.cx("pcInputText"),e.inputStyleClass)),eh("pAutoFocus",e.autofocus)("pt",e.ptm("pcInputText"))("ngStyle",e.inputStyle)("variant",e.$variant())("invalid",e.invalid())("pSize",e.size())("fluid",e.hasFluid)("pInputTextUnstyled",e.unstyled()),Xp("type",e.type)("value",e.inputValue())("id",e.inputId)("autocomplete",e.autocomplete)("placeholder",e.placeholder)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??false)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0);}}function bt(i,p){if(i&1){let e=DD();_u(),vi(0,"svg",21),ah("click",function(){pu(e);let n=ND(2);return hu(n.clear())}),Fc();}if(i&2){let e=ND(2);KD(e.cx("clearIcon")),eh("pBind",e.ptm("clearIcon")),Xp("aria-hidden",true);}}function vt(i,p){}function It(i,p){i&1&&Zp(0,vt,0,0,"ng-template");}function wt(i,p){if(i&1){let e=DD();vi(0,"span",22),ah("click",function(){pu(e);let n=ND(2);return hu(n.clear())}),Zp(1,It,1,0,null,23),Fc();}if(i&2){let e=ND(2);KD(e.cx("clearIcon")),eh("pBind",e.ptm("clearIcon")),Xp("aria-hidden",true),tE(),eh("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate);}}function Ct(i,p){if(i&1&&(Hc(0),Zp(1,bt,1,4,"svg",19)(2,wt,2,5,"span",20),Bc()),i&2){let e=ND();tE(),eh("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),tE(),eh("ngIf",e.clearIconTemplate||e._clearIconTemplate);}}function Ot(i,p){i&1&&oh(0);}function Tt(i,p){if(i&1){let e=DD();vi(0,"span",22),ah("click",function(n){pu(e);let o=ND(2).index,l=ND(2);return hu(!l.readonly&&!l.$disabled()?l.removeOption(n,o):"")}),_u(),th(1,"svg",31),Fc();}if(i&2){let e=ND(4);KD(e.cx("chipIcon")),eh("pBind",e.ptm("chipIcon")),tE(),KD(e.cx("chipIcon")),Xp("aria-hidden",true);}}function St(i,p){}function Vt(i,p){i&1&&Zp(0,St,0,0,"ng-template");}function Et(i,p){if(i&1&&(vi(0,"span",32),Zp(1,Vt,1,0,null,29),Fc()),i&2){let e=ND(2).index,t=ND(2);eh("pBind",t.ptm("chipIcon")),Xp("aria-hidden",true),tE(),eh("ngTemplateOutlet",t.removeIconTemplate||t._removeIconTemplate)("ngTemplateOutletContext",IT(4,ht,t.removeOption.bind(t),e,t.cx("chipIcon")));}}function kt(i,p){if(i&1&&Zp(0,Tt,2,6,"span",20)(1,Et,2,8,"span",30),i&2){let e=ND(3);eh("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),tE(),eh("ngIf",e.removeIconTemplate||e._removeIconTemplate);}}function Mt(i,p){if(i&1){let e=DD();vi(0,"li",26,5)(2,"p-chip",28),ah("onRemove",function(n){let o=pu(e).index,l=ND(2);return hu(l.readonly?"":l.removeOption(n,o))}),Zp(3,Ot,1,0,"ng-container",29)(4,kt,2,2,"ng-template",null,6,RT),Fc()();}if(i&2){let e=p.$implicit,t=p.index,n=ND(2);KD(n.cx("chipItem",vT(17,mt,t))),eh("pBind",n.ptm("chipItem")),Xp("id",n.id+"_multiple_option_"+t)("aria-label",n.getOptionLabel(e))("aria-setsize",n.modelValue().length)("aria-posinset",t+1)("aria-selected",true),tE(2),KD(n.cx("pcChip")),eh("pt",n.ptm("pcChip"))("label",!n.selectedItemTemplate&&!n._selectedItemTemplate&&n.getOptionLabel(e))("disabled",n.$disabled())("removable",true)("unstyled",n.unstyled()),tE(),eh("ngTemplateOutlet",n.selectedItemTemplate||n._selectedItemTemplate)("ngTemplateOutletContext",vT(19,Ue,e));}}function At(i,p){if(i&1){let e=DD();vi(0,"ul",24,3),ah("focus",function(n){pu(e);let o=ND();return hu(o.onMultipleContainerFocus(n))})("blur",function(n){pu(e);let o=ND();return hu(o.onMultipleContainerBlur(n))})("keydown",function(n){pu(e);let o=ND();return hu(o.onMultipleContainerKeyDown(n))}),Zp(2,Mt,6,21,"li",25),vi(3,"li",26)(4,"input",27,4),ah("input",function(n){pu(e);let o=ND();return hu(o.onInput(n))})("keydown",function(n){pu(e);let o=ND();return hu(o.onKeyDown(n))})("change",function(n){pu(e);let o=ND();return hu(o.onInputChange(n))})("focus",function(n){pu(e);let o=ND();return hu(o.onInputFocus(n))})("blur",function(n){pu(e);let o=ND();return hu(o.onInputBlur(n))})("paste",function(n){pu(e);let o=ND();return hu(o.onInputPaste(n))})("keyup",function(n){pu(e);let o=ND();return hu(o.onInputKeyUp(n))}),Fc()()();}if(i&2){let e=ND();KD(e.cx("inputMultiple")),eh("pBind",e.ptm("inputMultiple"))("tabindex",-1),Xp("data-p",e.inputMultipleDataP)("aria-orientation","horizontal")("aria-activedescendant",e.focused?e.focusedMultipleOptionId:void 0),tE(2),eh("ngForOf",e.modelValue()),tE(),KD(e.cx("inputChip")),eh("pBind",e.ptm("inputChip")),tE(),KD(e.cx("pcInputText")),eh("pAutoFocus",e.autofocus)("pBind",e.ptm("input"))("ngStyle",e.inputStyle),Xp("type",e.type)("id",e.inputId)("autocomplete",e.autocomplete)("name",e.name())("minlength",e.minlength())("maxlength",e.maxlength())("size",e.size())("min",e.min())("max",e.max())("pattern",e.pattern())("placeholder",e.$filled()?null:e.placeholder)("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??false)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0);}}function Lt(i,p){if(i&1&&(_u(),th(0,"svg",35)),i&2){let e=ND(2);KD(e.cx("loader")),eh("pBind",e.ptm("loader"))("spin",true),Xp("aria-hidden",true);}}function Ft(i,p){}function Bt(i,p){i&1&&Zp(0,Ft,0,0,"ng-template");}function Dt(i,p){if(i&1&&(vi(0,"span",32),Zp(1,Bt,1,0,null,23),Fc()),i&2){let e=ND(2);KD(e.cx("loader")),eh("pBind",e.ptm("loader")),Xp("aria-hidden",true),tE(),eh("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate);}}function Kt(i,p){if(i&1&&(Hc(0),Zp(1,Lt,1,5,"svg",33)(2,Dt,2,5,"span",34),Bc()),i&2){let e=ND();tE(),eh("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate),tE(),eh("ngIf",e.loadingIconTemplate||e._loadingIconTemplate);}}function zt(i,p){if(i&1&&th(0,"span",38),i&2){let e=ND(2);eh("ngClass",e.dropdownIcon),Xp("aria-hidden",true);}}function $t(i,p){if(i&1&&(_u(),th(0,"svg",40)),i&2){let e=ND(3);eh("pBind",e.ptm("dropdown"));}}function Rt(i,p){}function qt(i,p){i&1&&Zp(0,Rt,0,0,"ng-template");}function Ht(i,p){if(i&1&&(Hc(0),Zp(1,$t,1,1,"svg",39)(2,qt,1,0,null,23),Bc()),i&2){let e=ND(2);tE(),eh("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),tE(),eh("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate);}}function Pt(i,p){if(i&1){let e=DD();vi(0,"button",36,7),ah("click",function(n){pu(e);let o=ND();return hu(o.handleDropdownClick(n))}),Zp(2,zt,1,2,"span",37)(3,Ht,3,2,"ng-container",14),Fc();}if(i&2){let e=ND();KD(e.cx("dropdown")),eh("pBind",e.ptm("dropdown"))("disabled",e.$disabled()),Xp("aria-label",e.dropdownAriaLabel)("tabindex",e.tabindex),tE(2),eh("ngIf",e.dropdownIcon),tE(),eh("ngIf",!e.dropdownIcon);}}function Gt(i,p){i&1&&oh(0);}function Qt(i,p){i&1&&oh(0);}function Ut(i,p){if(i&1&&Zp(0,Qt,1,0,"ng-container",29),i&2){let e=p.$implicit,t=p.options;ND(2);let n=PD(6);eh("ngTemplateOutlet",n)("ngTemplateOutletContext",ET(2,Ne,e,t));}}function Nt(i,p){i&1&&oh(0);}function jt(i,p){if(i&1&&Zp(0,Nt,1,0,"ng-container",29),i&2){let e=p.options,t=ND(4);eh("ngTemplateOutlet",t.loaderTemplate||t._loaderTemplate)("ngTemplateOutletContext",vT(2,_t,e));}}function Wt(i,p){i&1&&(Hc(0),Zp(1,jt,1,4,"ng-template",null,10,RT),Bc());}function Zt(i,p){if(i&1){let e=DD();vi(0,"p-scroller",45,9),ah("onLazyLoad",function(n){pu(e);let o=ND(2);return hu(o.onLazyLoad.emit(n))}),Zp(2,Ut,1,5,"ng-template",null,1,RT)(4,Wt,3,0,"ng-container",14),Fc();}if(i&2){let e=ND(2);ZD(vT(10,U,e.scrollHeight)),eh("tabindex",-1)("pt",e.ptm("virtualScroller"))("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",true)("lazy",e.lazy)("options",e.virtualScrollOptions),tE(4),eh("ngIf",e.loaderTemplate||e._loaderTemplate);}}function Jt(i,p){i&1&&oh(0);}function Xt(i,p){if(i&1&&(Hc(0),Zp(1,Jt,1,0,"ng-container",29),Bc()),i&2){ND();let e=PD(6),t=ND();tE(),eh("ngTemplateOutlet",e)("ngTemplateOutletContext",ET(3,Ne,t.visibleOptions(),yT(2,gt)));}}function Yt(i,p){if(i&1&&(vi(0,"span"),aT(1),Fc()),i&2){let e=ND(2).$implicit,t=ND(3);tE(),bh(t.getOptionGroupLabel(e.optionGroup));}}function en(i,p){i&1&&oh(0);}function tn(i,p){if(i&1&&(Hc(0),vi(1,"li",49),Zp(2,Yt,2,1,"span",14)(3,en,1,0,"ng-container",29),Fc(),Bc()),i&2){let e=ND(),t=e.$implicit,n=e.index,o=ND().options,l=ND(2);tE(),KD(l.cx("optionGroup")),eh("pBind",l.ptm("optionGroup"))("ngStyle",vT(8,U,o.itemSize+"px")),Xp("id",l.id+"_"+l.getOptionIndex(n,o)),tE(),eh("ngIf",!l.groupTemplate),tE(),eh("ngTemplateOutlet",l.groupTemplate)("ngTemplateOutletContext",vT(10,Ue,t.optionGroup));}}function nn(i,p){if(i&1&&(vi(0,"span"),aT(1),Fc()),i&2){let e=ND(2).$implicit,t=ND(3);tE(),bh(t.getOptionLabel(e));}}function on(i,p){i&1&&oh(0);}function ln(i,p){if(i&1){let e=DD();Hc(0),vi(1,"li",50),ah("click",function(n){pu(e);let o=ND().$implicit,l=ND(3);return hu(l.onOptionSelect(n,o))})("mouseenter",function(n){pu(e);let o=ND().index,l=ND().options,f=ND(2);return hu(f.onOptionMouseEnter(n,f.getOptionIndex(o,l)))}),Zp(2,nn,2,1,"span",14)(3,on,1,0,"ng-container",29),Fc(),Bc();}if(i&2){let e=ND(),t=e.$implicit,n=e.index,o=ND().options,l=ND(2);tE(),KD(l.cx("option",IT(15,ft,t,n,o))),eh("pBind",l.getPTOptions(t,o,n,"option"))("ngStyle",vT(19,U,o.itemSize+"px")),Xp("id",l.id+"_"+l.getOptionIndex(n,o))("aria-label",l.getOptionLabel(t))("aria-selected",l.isSelected(t))("data-p-selected",l.isSelected(t))("aria-disabled",l.isOptionDisabled(t))("data-p-focused",l.focusedOptionIndex()===l.getOptionIndex(n,o))("aria-setsize",l.ariaSetSize)("aria-posinset",l.getAriaPosInset(l.getOptionIndex(n,o))),tE(),eh("ngIf",!l.itemTemplate&&!l._itemTemplate),tE(),eh("ngTemplateOutlet",l.itemTemplate||l._itemTemplate)("ngTemplateOutletContext",ET(21,yt,t,o.getOptions?o.getOptions(n):n));}}function an(i,p){if(i&1&&Zp(0,tn,4,12,"ng-container",14)(1,ln,4,24,"ng-container",14),i&2){let e=p.$implicit,t=ND(3);eh("ngIf",t.isOptionGroup(e)),tE(),eh("ngIf",!t.isOptionGroup(e));}}function pn(i,p){if(i&1&&(Hc(0),aT(1),Bc()),i&2){let e=ND(4);tE(),$c(" ",e.searchResultMessageText," ");}}function rn(i,p){i&1&&oh(0,null,12);}function sn(i,p){if(i&1&&(vi(0,"li",49),Zp(1,pn,2,1,"ng-container",51)(2,rn,2,0,"ng-container",23),Fc()),i&2){let e=ND().options,t=ND(2);KD(t.cx("emptyMessage")),eh("pBind",t.ptm("emptyMessage"))("ngStyle",vT(7,U,e.itemSize+"px")),tE(),eh("ngIf",!t.emptyTemplate&&!t._emptyTemplate)("ngIfElse",t.empty),tE(),eh("ngTemplateOutlet",t.emptyTemplate||t._emptyTemplate);}}function cn(i,p){if(i&1&&(vi(0,"ul",46,11),Zp(2,an,2,2,"ng-template",47)(3,sn,3,9,"li",48),Fc()),i&2){let e=p.$implicit,t=p.options,n=ND(2);ZD(t.contentStyle),KD(n.cn(n.cx("list"),t.contentStyleClass)),eh("pBind",n.ptm("list")),Xp("id",n.id+"_list")("aria-label",n.listLabel),tE(2),eh("ngForOf",e),tE(),eh("ngIf",!e||e&&e.length===0&&n.showEmptyMessage);}}function un(i,p){i&1&&oh(0);}function dn(i,p){if(i&1&&(vi(0,"div",41),Zp(1,Gt,1,0,"ng-container",23),vi(2,"div",42),Zp(3,Zt,5,12,"p-scroller",43)(4,Xt,2,6,"ng-container",14),Fc(),Zp(5,cn,4,9,"ng-template",null,8,RT)(7,un,1,0,"ng-container",23),Fc(),vi(8,"span",44),aT(9),Fc()),i&2){let e=ND();KD(e.cn(e.cx("overlay"),e.panelStyleClass)),eh("pBind",e.ptm("overlay"))("ngStyle",e.panelStyle),tE(),eh("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),tE(),KD(e.cx("listContainer")),mh("max-height",e.virtualScroll?"auto":e.scrollHeight),eh("pBind",e.ptm("listContainer"))("tabindex",-1),tE(),eh("ngIf",e.virtualScroll),tE(),eh("ngIf",!e.virtualScroll),tE(3),eh("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),tE(2),$c(" ",e.selectedMessageText," ");}}var mn=`
${Pe}

/* For PrimeNG */
p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input,
p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-multiple p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input,
p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple {
    border-color: dt('autocomplete.invalid.border.color');
}

p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
p-autoComplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
p-auto-complete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
p-autocomplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple {
    border-color: dt('autocomplete.focus.border.color');
}

p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder {
    color: dt('autocomplete.invalid.placeholder.color');
}

p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder {
    color: dt('autocomplete.invalid.placeholder.color');
}
`,hn={root:{position:"relative"}},_n={root:({instance:i})=>["p-autocomplete p-component p-inputwrapper",{"p-invalid":i.invalid(),"p-focus":i.focused,"p-inputwrapper-filled":i.$filled(),"p-inputwrapper-focus":i.focused&&!i.$disabled()||i.autofocus||i.overlayVisible,"p-autocomplete-open":i.overlayVisible,"p-autocomplete-clearable":i.showClear&&!i.$disabled(),"p-autocomplete-fluid":i.hasFluid}],pcInputText:"p-autocomplete-input",inputMultiple:({instance:i})=>["p-autocomplete-input-multiple",{"p-disabled":i.$disabled(),"p-variant-filled":i.$variant()==="filled"}],chipItem:({instance:i,i:p})=>["p-autocomplete-chip-item",{"p-focus":i.focusedMultipleOptionIndex()===p}],pcChip:"p-autocomplete-chip",chipIcon:"p-autocomplete-chip-icon",inputChip:"p-autocomplete-input-chip",loader:"p-autocomplete-loader",dropdown:"p-autocomplete-dropdown",overlay:({instance:i})=>["p-autocomplete-overlay p-component-overlay p-component",{"p-input-filled":i.$variant()==="filled","p-ripple-disabled":i.config.ripple()===false}],listContainer:"p-autocomplete-list-container",list:"p-autocomplete-list",optionGroup:"p-autocomplete-option-group",option:({instance:i,option:p,i:e,scrollerOptions:t})=>({"p-autocomplete-option":true,"p-autocomplete-option-selected":i.isSelected(p),"p-focus":i.focusedOptionIndex()===i.getOptionIndex(e,t),"p-disabled":i.isOptionDisabled(p)}),emptyMessage:"p-autocomplete-empty-message",clearIcon:"p-autocomplete-clear-icon"},Ge=(()=>{class i extends H{name="autocomplete";style=mn;classes=_n;inlineStyles=hn;static \u0275fac=(()=>{let e;return function(n){return (e||(e=Xm(i)))(n||i)}})();static \u0275prov=X({token:i,factory:i.\u0275fac})}return i})();var Qe=new C("AUTOCOMPLETE_INSTANCE"),gn={provide:_e$1,useExisting:go(()=>je),multi:true},je=(()=>{class i extends Qe$1{overlayService;zone;componentName="AutoComplete";$pcAutoComplete=E(Qe,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=E(R,{self:true});minLength=1;minQueryLength;delay=300;panelStyle;styleClass;panelStyleClass;inputStyle;inputId;inputStyleClass;placeholder;readonly;scrollHeight="200px";lazy=false;virtualScroll;virtualScrollItemSize;virtualScrollOptions;autoHighlight;forceSelection;type="text";autoZIndex=true;baseZIndex=0;ariaLabel;dropdownAriaLabel;ariaLabelledBy;dropdownIcon;unique=true;group;completeOnFocus=false;showClear=false;dropdown;showEmptyMessage=true;dropdownMode="blank";multiple;addOnTab=false;tabindex;dataKey;emptyMessage;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";autofocus;autocomplete="off";optionGroupChildren="items";optionGroupLabel="label";overlayOptions;get suggestions(){return this._suggestions()}set suggestions(e){this._suggestions.set(e),this.handleSuggestionsChange();}optionLabel;optionValue;id;searchMessage;emptySelectionMessage;selectionMessage;autoOptionFocus=false;selectOnFocus;searchLocale;optionDisabled;focusOnHover=true;typeahead=true;addOnBlur=false;separator;appendTo=GL(void 0);motionOptions=GL(void 0);completeMethod=new Pe$2;onSelect=new Pe$2;onUnselect=new Pe$2;onAdd=new Pe$2;onFocus=new Pe$2;onBlur=new Pe$2;onDropdownClick=new Pe$2;onClear=new Pe$2;onInputKeydown=new Pe$2;onKeyUp=new Pe$2;onShow=new Pe$2;onHide=new Pe$2;onLazyLoad=new Pe$2;inputEL;multiInputEl;multiContainerEL;dropdownButton;itemsViewChild;scroller;overlayViewChild;itemsWrapper;itemTemplate;emptyTemplate;headerTemplate;footerTemplate;selectedItemTemplate;groupTemplate;loaderTemplate;removeIconTemplate;loadingIconTemplate;clearIconTemplate;dropdownIconTemplate;onHostClick(e){this.onContainerClick(e);}value;_suggestions=Lo(null);timeout;overlayVisible;suggestionsUpdated;highlightOption;highlightOptionChanged;focused=false;loading;scrollHandler;listId;searchTimeout;dirty=false;_itemTemplate;_groupTemplate;_selectedItemTemplate;_headerTemplate;_emptyTemplate;_footerTemplate;_loaderTemplate;_removeIconTemplate;_loadingIconTemplate;_clearIconTemplate;_dropdownIconTemplate;focusedMultipleOptionIndex=Lo(-1);focusedOptionIndex=Lo(-1);_componentStyle=E(Ge);$appendTo=PT(()=>this.appendTo()||this.config.overlayAppendTo());visibleOptions=PT(()=>this.group?this.flatOptions(this._suggestions()):this._suggestions()||[]);inputValue=PT(()=>{let e=this.modelValue(),t=this.optionValueSelected?(this.suggestions||[]).find(n=>ft$1(n,e,this.equalityKey())):e;if(Ie(e))if(typeof e=="object"||this.optionValueSelected){let n=this.getOptionLabel(t);return n??e}else return e;else return ""});get focusedMultipleOptionId(){return this.focusedMultipleOptionIndex()!==-1?`${this.id}_multiple_option_${this.focusedMultipleOptionIndex()}`:null}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}get searchResultMessageText(){return Ie(this.visibleOptions())&&this.overlayVisible?this.searchMessageText.replaceAll("{0}",this.visibleOptions().length):this.emptySearchMessageText}get searchMessageText(){return this.searchMessage||this.config.translation.searchMessage||""}get emptySearchMessageText(){return this.emptyMessage||this.config.translation.emptySearchMessage||""}get selectionMessageText(){return this.selectionMessage||this.config.translation.selectionMessage||""}get emptySelectionMessageText(){return this.emptySelectionMessage||this.config.translation.emptySelectionMessage||""}get selectedMessageText(){return this.hasSelectedOption()?this.selectionMessageText.replaceAll("{0}",this.multiple?this.modelValue()?.length:"1"):this.emptySelectionMessageText}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}get listLabel(){return this.config.getTranslation(ec.ARIA).listLabel}get virtualScrollerDisabled(){return !this.virtualScroll}get optionValueSelected(){return typeof this.modelValue()=="string"&&this.optionValue}chipItemClass(e){return this._componentStyle.classes.chipItem({instance:this,i:e})}constructor(e,t){super(),this.overlayService=e,this.zone=t;}onInit(){this.id=this.id||mt$1("pn_id_"),this.cd.detectChanges();}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "item":this._itemTemplate=e.template;break;case "group":this._groupTemplate=e.template;break;case "selecteditem":this._selectedItemTemplate=e.template;break;case "selectedItem":this._selectedItemTemplate=e.template;break;case "header":this._headerTemplate=e.template;break;case "empty":this._emptyTemplate=e.template;break;case "footer":this._footerTemplate=e.template;break;case "loader":this._loaderTemplate=e.template;break;case "removetokenicon":this._removeIconTemplate=e.template;break;case "loadingicon":this._loadingIconTemplate=e.template;break;case "clearicon":this._clearIconTemplate=e.template;break;case "dropdownicon":this._dropdownIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}});}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.suggestionsUpdated&&this.overlayViewChild&&this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay();},1),this.suggestionsUpdated=false;});}handleSuggestionsChange(){if(this.loading){this._suggestions()?.length>0||this.showEmptyMessage||this.emptyTemplate?this.show():this.hide();let e=this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(e),this.suggestionsUpdated=true,this.loading=false,this.cd.markForCheck();}}flatOptions(e){return (e||[]).reduce((t,n,o)=>{t.push({optionGroup:n,group:true,index:o});let l=this.getOptionGroupChildren(n);return l&&l.forEach(f=>t.push(f)),t},[])}isOptionGroup(e){return this.optionGroupLabel&&e.optionGroup&&e.group}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findLastOptionIndex(){return Du(this.visibleOptions(),e=>this.isValidOption(e))}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let t=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(n=>this.isValidOption(n)):-1;return t>-1?t+e+1:e}findPrevOptionIndex(e){let t=e>0?Du(this.visibleOptions().slice(0,e),n=>this.isValidOption(n)):-1;return t>-1?t:e}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}isValidOption(e){return e&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionDisabled(e){return this.optionDisabled?Kt$1(e,this.optionDisabled):false}isSelected(e){return this.multiple?this.unique?this.modelValue()?.some(t=>ft$1(t,e,this.equalityKey())):false:ft$1(this.modelValue(),e,this.equalityKey())}isOptionMatched(e,t){return this.isValidOption(e)&&this.getOptionLabel(e).toLocaleLowerCase(this.searchLocale)===t.toLocaleLowerCase(this.searchLocale)}isInputClicked(e){return e.target===this.inputEL?.nativeElement}isDropdownClicked(e){return this.dropdownButton?.nativeElement?e.target===this.dropdownButton.nativeElement||this.dropdownButton.nativeElement.contains(e.target):false}equalityKey(){return this.optionValue?void 0:this.dataKey}onContainerClick(e){this.$disabled()||this.loading||this.isInputClicked(e)||this.isDropdownClicked(e)||(!this.overlayViewChild||!this.overlayViewChild.overlayViewChild?.nativeElement.contains(e.target))&&Ou(this.inputEL?.nativeElement);}handleDropdownClick(e){let t;this.overlayVisible?this.hide(true):(Ou(this.inputEL?.nativeElement),t=this.inputEL?.nativeElement?.value,this.dropdownMode==="blank"?this.search(e,"","dropdown"):this.dropdownMode==="current"&&this.search(e,t,"dropdown")),this.onDropdownClick.emit({originalEvent:e,query:t});}onInput(e){if(this.typeahead){let t=this.minQueryLength||this.minLength;this.searchTimeout&&clearTimeout(this.searchTimeout);let n=e.target.value;this.maxlength()!==null&&(n=n.split("").slice(0,this.maxlength()).join("")),!this.multiple&&!this.forceSelection&&this.updateModel(n),n.length===0&&!this.multiple?(this.onClear.emit(),setTimeout(()=>{this.hide();},this.delay/2)):n.length>=t?(this.focusedOptionIndex.set(-1),this.searchTimeout=setTimeout(()=>{this.search(e,n,"input");},this.delay)):this.hide();}}onInputChange(e){this.updateInputWithForceSelection(e);}onInputFocus(e){if(this.$disabled())return;!this.dirty&&this.completeOnFocus&&this.search(e,e.target.value,"focus"),this.dirty=true,this.focused=true;let t=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(t),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e);}onMultipleContainerFocus(e){this.$disabled()||(this.focused=true);}onMultipleContainerBlur(e){this.focusedMultipleOptionIndex.set(-1),this.focused=false;}onMultipleContainerKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(e.code){case "ArrowLeft":this.onArrowLeftKeyOnMultiple(e);break;case "ArrowRight":this.onArrowRightKeyOnMultiple(e);break;case "Backspace":this.onBackspaceKeyOnMultiple(e);break;}}onInputBlur(e){if(this.dirty=false,this.focused=false,this.focusedOptionIndex.set(-1),this.addOnBlur&&this.multiple&&!this.typeahead){let t=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="");}this.onModelTouched(),this.onBlur.emit(e);}onInputPaste(e){if(this.separator&&this.multiple&&!this.typeahead){let t=(e.clipboardData||window.clipboardData)?.getData("Text");if(t){let n=t.split(this.separator),o=[...this.modelValue()||[]];if(n.forEach(l=>{let f=l.trim();f&&!this.isSelected(f)&&o.push(f);}),o.length>(this.modelValue()||[]).length){let l=o.slice((this.modelValue()||[]).length);this.updateModel(o),l.forEach(f=>{this.onAdd.emit({originalEvent:e,value:f});}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault();}}}else this.onKeyDown(e);}onInputKeyUp(e){this.onKeyUp.emit(e);}onKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(this.onInputKeydown.emit(e),e.code){case "ArrowDown":this.onArrowDownKey(e);break;case "ArrowUp":this.onArrowUpKey(e);break;case "ArrowLeft":this.onArrowLeftKey(e);break;case "ArrowRight":this.onArrowRightKey(e);break;case "Home":this.onHomeKey(e);break;case "End":this.onEndKey(e);break;case "PageDown":this.onPageDownKey(e);break;case "PageUp":this.onPageUpKey(e);break;case "Enter":case "NumpadEnter":this.onEnterKey(e);break;case "Escape":this.onEscapeKey(e);break;case "Tab":this.onTabKey(e);break;case "Backspace":this.onBackspaceKey(e);break;case "ShiftLeft":case "ShiftRight":break;default:this.handleSeparatorKey(e);break}}handleSeparatorKey(e){if(this.separator&&this.multiple&&!this.typeahead&&(this.separator===e.key||typeof this.separator=="string"&&e.key===this.separator||this.separator instanceof RegExp&&e.key.match(this.separator))){let t=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault());}}onArrowDownKey(e){if(!this.overlayVisible)return;let t=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,t),e.preventDefault(),e.stopPropagation();}onArrowUpKey(e){if(this.overlayVisible)if(e.altKey)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.overlayVisible&&this.hide(),e.preventDefault();else {let t=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,t),e.preventDefault(),e.stopPropagation();}}onArrowLeftKey(e){let t=e.currentTarget;this.focusedOptionIndex.set(-1),this.multiple&&(Ge$1(t.value)&&this.hasSelectedOption()?(Ou(this.multiContainerEL?.nativeElement),this.focusedMultipleOptionIndex.set(this.modelValue().length)):e.stopPropagation());}onArrowRightKey(e){this.focusedOptionIndex.set(-1),this.multiple&&e.stopPropagation();}onHomeKey(e){let{currentTarget:t}=e,n=t.value.length;t.setSelectionRange(0,e.shiftKey?n:0),this.focusedOptionIndex.set(-1),e.preventDefault();}onEndKey(e){let{currentTarget:t}=e,n=t.value.length;t.setSelectionRange(e.shiftKey?0:n,n),this.focusedOptionIndex.set(-1),e.preventDefault();}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault();}onPageUpKey(e){this.scrollInView(0),e.preventDefault();}onEnterKey(e){if(!this.typeahead&&!this.forceSelection&&this.multiple){let t=e.target.value?.trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""));}if(this.overlayVisible)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.hide();else return;e.preventDefault();}onEscapeKey(e){this.overlayVisible&&this.hide(true),e.preventDefault();}onTabKey(e){if(this.focusedOptionIndex()!==-1){this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]);return}if(this.multiple&&!this.typeahead){let t=(this.multiInputEl?.nativeElement?.value||this.inputEL?.nativeElement?.value||"").trim();if(this.addOnTab&&t&&!this.isSelected(t)){this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.updateInputValue(),e.preventDefault(),this.overlayVisible&&this.hide();return}}this.overlayVisible&&this.hide();}onBackspaceKey(e){if(this.multiple){if(Ie(this.modelValue())&&!this.inputEL?.nativeElement?.value){let t=this.modelValue()[this.modelValue().length-1],n=this.modelValue().slice(0,-1);this.updateModel(n),this.onUnselect.emit({originalEvent:e,value:t});}e.stopPropagation();}}onArrowLeftKeyOnMultiple(e){let t=this.focusedMultipleOptionIndex()<1?0:this.focusedMultipleOptionIndex()-1;this.focusedMultipleOptionIndex.set(t);}onArrowRightKeyOnMultiple(e){let t=this.focusedMultipleOptionIndex();t++,this.focusedMultipleOptionIndex.set(t),t>this.modelValue().length-1&&(this.focusedMultipleOptionIndex.set(-1),Ou(this.inputEL?.nativeElement));}onBackspaceKeyOnMultiple(e){this.focusedMultipleOptionIndex()!==-1&&this.removeOption(e,this.focusedMultipleOptionIndex());}onOptionSelect(e,t,n=true){this.multiple?(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.isSelected(t)||this.updateModel([...this.modelValue()||[],t])):this.updateModel(t),this.onSelect.emit({originalEvent:e,value:t}),n&&this.hide(true);}onOptionMouseEnter(e,t){this.focusOnHover&&this.changeFocusedOptionIndex(e,t);}search(e,t,n){t!=null&&(n==="input"&&t.trim().length===0||(this.loading=true,this.completeMethod.emit({originalEvent:e,query:t})));}removeOption(e,t){e.stopPropagation();let n=this.modelValue()[t],o=this.modelValue().filter((l,f)=>f!==t);this.updateModel(o),this.onUnselect.emit({originalEvent:e,value:n}),Ou(this.inputEL?.nativeElement);}updateModel(e){let t=null;e&&(t=this.multiple?e.map(n=>this.getOptionValue(n)):this.getOptionValue(e)),this.value=t,this.writeModelValue(e),this.onModelChange(t),this.updateInputValue(),this.cd.markForCheck();}updateInputValue(){this.inputEL&&this.inputEL.nativeElement&&(this.multiple?this.inputEL.nativeElement.value="":this.inputEL.nativeElement.value=this.inputValue());}updateInputWithForceSelection(e){let t=this.inputEL?.nativeElement,n=!t?.value&&Ie(this.modelValue());if(!this.forceSelection||this.overlayVisible||!t?.value&&!n)return;let o=this.minQueryLength??this.minLength;if(!n&&t.value.length<o)return;let l=this.visibleOptions()?.find(f=>this.isOptionMatched(f,t.value));if(!l){t.value="",this.multiple||this.clear();return}l&&!this.isSelected(l)&&this.onOptionSelect(e,l);}autoUpdateModel(){if((this.selectOnFocus||this.autoHighlight)&&this.autoOptionFocus&&!this.hasSelectedOption()){let e=this.findFirstFocusedOptionIndex();this.focusedOptionIndex.set(e),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],false);}}scrollInView(e=-1){let t=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let n=Ke(this.itemsViewChild.nativeElement,`li[id="${t}"]`);n?n.scrollIntoView&&n.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex());},0);}}changeFocusedOptionIndex(e,t){this.focusedOptionIndex()!==t&&(this.focusedOptionIndex.set(t),this.scrollInView(),this.selectOnFocus&&this.onOptionSelect(e,this.visibleOptions()[t],false));}show(e=false){this.dirty=true,this.overlayVisible=true;let t=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(t),e&&Ou(this.inputEL?.nativeElement),e&&Ou(this.inputEL?.nativeElement),this.onShow.emit(),this.cd.markForCheck();}hide(e=false){let t=()=>{this.dirty=e,this.overlayVisible=false,this.focusedOptionIndex.set(-1),e&&Ou(this.inputEL?.nativeElement),this.onHide.emit(),this.updateInputWithForceSelection(null),this.cd.markForCheck();};setTimeout(()=>{t();},0);}clear(){this.updateModel(null),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.onClear.emit();}hasSelectedOption(){return Ie(this.modelValue())}getAriaPosInset(e){return (this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(t=>this.isOptionGroup(t)).length:e)+1}getOptionLabel(e){return this.optionLabel?Kt$1(e,this.optionLabel):e&&e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?Kt$1(e,this.optionValue):e&&e.value!=null?e.value:e}getOptionIndex(e,t){return this.virtualScrollerDisabled?e:t&&t.getItemOptions(e).index}getOptionGroupLabel(e){return this.optionGroupLabel?Kt$1(e,this.optionGroupLabel):e&&e.label!=null?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren?Kt$1(e,this.optionGroupChildren):e.items}getPTOptions(e,t,n,o){return this.ptm(o,{context:{option:e,index:this.getOptionIndex(n,t),selected:this.isSelected(e),focused:this.focusedOptionIndex()===this.getOptionIndex(n,t),disabled:this.isOptionDisabled(e)}})}onOverlayBeforeEnter(){if(this.itemsWrapper=Ke(this.overlayViewChild.overlayViewChild?.nativeElement,this.virtualScroll?'[data-pc-name="virtualscroller"]':'[data-pc-name="pcoverlay"]'),this.virtualScroll&&(this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.scroller?.viewInit()),this.visibleOptions()&&this.visibleOptions().length)if(this.virtualScroll){let e=this.modelValue()?this.focusedOptionIndex():-1;e!==-1&&this.scroller?.scrollToIndex(e);}else {let e=Ke(this.itemsWrapper,'[data-pc-section="option"][data-p-selected="true"]');e&&e.scrollIntoView({block:"nearest",inline:"center"});}}get containerDataP(){return this.cn({fluid:this.hasFluid})}get overlayDataP(){return this.cn({[`overlay-${this.$appendTo()}`]:true})}get inputMultipleDataP(){return this.cn({invalid:this.invalid(),disabled:this.$disabled(),focus:this.focused,fluid:this.hasFluid,filled:this.$variant()==="filled",empty:!this.$filled(),[this.size()]:this.size()})}writeControlValue(e,t){if(this.multiple){let n=(e||[]).map(o=>this.visibleOptions().find(f=>ft$1(o,f,this.equalityKey()))??o);t(Ge$1(e)?e:n);}else {let n=this.visibleOptions().find(o=>ft$1(e,o,this.equalityKey()));t(Ge$1(n)?e:n);}this.value=e,this.updateInputValue(),this.cd.markForCheck();}onDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null);}static \u0275fac=function(t){return new(t||i)(Sr(qu),Sr(se))};static \u0275cmp=LI({type:i,selectors:[["p-autoComplete"],["p-autocomplete"],["p-auto-complete"]],contentQueries:function(t,n,o){if(t&1&&lh(o,We,5)(o,Ze,5)(o,Je,5)(o,Xe,5)(o,Ye,5)(o,et,5)(o,tt,5)(o,nt,5)(o,it,5)(o,ot,5)(o,lt,5)(o,cr,4),t&2){let l;kD(l=OD())&&(n.itemTemplate=l.first),kD(l=OD())&&(n.emptyTemplate=l.first),kD(l=OD())&&(n.headerTemplate=l.first),kD(l=OD())&&(n.footerTemplate=l.first),kD(l=OD())&&(n.selectedItemTemplate=l.first),kD(l=OD())&&(n.groupTemplate=l.first),kD(l=OD())&&(n.loaderTemplate=l.first),kD(l=OD())&&(n.removeIconTemplate=l.first),kD(l=OD())&&(n.loadingIconTemplate=l.first),kD(l=OD())&&(n.clearIconTemplate=l.first),kD(l=OD())&&(n.dropdownIconTemplate=l.first),kD(l=OD())&&(n.templates=l);}},viewQuery:function(t,n){if(t&1&&uh(at,5)(pt,5)(rt,5)(st,5)(ct,5)(ut,5)(dt,5),t&2){let o;kD(o=OD())&&(n.inputEL=o.first),kD(o=OD())&&(n.multiInputEl=o.first),kD(o=OD())&&(n.multiContainerEL=o.first),kD(o=OD())&&(n.dropdownButton=o.first),kD(o=OD())&&(n.itemsViewChild=o.first),kD(o=OD())&&(n.scroller=o.first),kD(o=OD())&&(n.overlayViewChild=o.first);}},hostVars:5,hostBindings:function(t,n){t&1&&ah("click",function(l){return n.onHostClick(l)}),t&2&&(Xp("data-p",n.containerDataP),ZD(n.sx("root")),KD(n.cn(n.cx("root"),n.styleClass)));},inputs:{minLength:[2,"minLength","minLength",JL],minQueryLength:[2,"minQueryLength","minQueryLength",JL],delay:[2,"delay","delay",JL],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",inputStyle:"inputStyle",inputId:"inputId",inputStyleClass:"inputStyleClass",placeholder:"placeholder",readonly:[2,"readonly","readonly",KL],scrollHeight:"scrollHeight",lazy:[2,"lazy","lazy",KL],virtualScroll:[2,"virtualScroll","virtualScroll",KL],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",JL],virtualScrollOptions:"virtualScrollOptions",autoHighlight:[2,"autoHighlight","autoHighlight",KL],forceSelection:[2,"forceSelection","forceSelection",KL],type:"type",autoZIndex:[2,"autoZIndex","autoZIndex",KL],baseZIndex:[2,"baseZIndex","baseZIndex",JL],ariaLabel:"ariaLabel",dropdownAriaLabel:"dropdownAriaLabel",ariaLabelledBy:"ariaLabelledBy",dropdownIcon:"dropdownIcon",unique:[2,"unique","unique",KL],group:[2,"group","group",KL],completeOnFocus:[2,"completeOnFocus","completeOnFocus",KL],showClear:[2,"showClear","showClear",KL],dropdown:[2,"dropdown","dropdown",KL],showEmptyMessage:[2,"showEmptyMessage","showEmptyMessage",KL],dropdownMode:"dropdownMode",multiple:[2,"multiple","multiple",KL],addOnTab:[2,"addOnTab","addOnTab",KL],tabindex:[2,"tabindex","tabindex",JL],dataKey:"dataKey",emptyMessage:"emptyMessage",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",autofocus:[2,"autofocus","autofocus",KL],autocomplete:"autocomplete",optionGroupChildren:"optionGroupChildren",optionGroupLabel:"optionGroupLabel",overlayOptions:"overlayOptions",suggestions:"suggestions",optionLabel:"optionLabel",optionValue:"optionValue",id:"id",searchMessage:"searchMessage",emptySelectionMessage:"emptySelectionMessage",selectionMessage:"selectionMessage",autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",KL],selectOnFocus:[2,"selectOnFocus","selectOnFocus",KL],searchLocale:[2,"searchLocale","searchLocale",KL],optionDisabled:"optionDisabled",focusOnHover:[2,"focusOnHover","focusOnHover",KL],typeahead:[2,"typeahead","typeahead",KL],addOnBlur:[2,"addOnBlur","addOnBlur",KL],separator:"separator",appendTo:[1,"appendTo"],motionOptions:[1,"motionOptions"]},outputs:{completeMethod:"completeMethod",onSelect:"onSelect",onUnselect:"onUnselect",onAdd:"onAdd",onFocus:"onFocus",onBlur:"onBlur",onDropdownClick:"onDropdownClick",onClear:"onClear",onInputKeydown:"onInputKeydown",onKeyUp:"onKeyUp",onShow:"onShow",onHide:"onHide",onLazyLoad:"onLazyLoad"},features:[mT([gn,Ge,{provide:Qe,useExisting:i},{provide:he,useExisting:i}]),GI([R]),zp],decls:9,vars:14,consts:[["overlay",""],["content",""],["focusInput",""],["multiContainer",""],["focusInput","","multiIn",""],["token",""],["removeicon",""],["ddBtn",""],["buildInItems",""],["scroller",""],["loader",""],["items",""],["empty",""],["pInputText","","aria-autocomplete","list","role","combobox",3,"pAutoFocus","pt","class","ngStyle","variant","invalid","pSize","fluid","pInputTextUnstyled","input","keydown","change","focus","blur","paste","keyup",4,"ngIf"],[4,"ngIf"],["role","listbox",3,"pBind","class","tabindex","focus","blur","keydown",4,"ngIf"],["type","button","pRipple","",3,"pBind","class","disabled","click",4,"ngIf"],[3,"visibleChange","onBeforeEnter","onHide","hostAttrSelector","visible","options","target","appendTo","unstyled","pt","motionOptions"],["pInputText","","aria-autocomplete","list","role","combobox",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pt","ngStyle","variant","invalid","pSize","fluid","pInputTextUnstyled"],["data-p-icon","times",3,"pBind","class","click",4,"ngIf"],[3,"pBind","class","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[3,"click","pBind"],[4,"ngTemplateOutlet"],["role","listbox",3,"focus","blur","keydown","pBind","tabindex"],["role","option",3,"pBind","class",4,"ngFor","ngForOf"],["role","option",3,"pBind"],["role","combobox","aria-autocomplete","list",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pBind","ngStyle"],[3,"onRemove","pt","label","disabled","removable","unstyled"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind",4,"ngIf"],["data-p-icon","times-circle"],[3,"pBind"],["data-p-icon","spinner",3,"pBind","class","spin",4,"ngIf"],[3,"pBind","class",4,"ngIf"],["data-p-icon","spinner",3,"pBind","spin"],["type","button","pRipple","",3,"click","pBind","disabled"],[3,"ngClass",4,"ngIf"],[3,"ngClass"],["data-p-icon","chevron-down",3,"pBind",4,"ngIf"],["data-p-icon","chevron-down",3,"pBind"],[3,"pBind","ngStyle"],[3,"pBind","tabindex"],[3,"tabindex","pt","items","style","itemSize","autoSize","lazy","options","onLazyLoad",4,"ngIf"],["role","status","aria-live","polite",1,"p-hidden-accessible"],[3,"onLazyLoad","tabindex","pt","items","itemSize","autoSize","lazy","options"],["role","listbox",3,"pBind"],["ngFor","",3,"ngForOf"],["role","option",3,"pBind","class","ngStyle",4,"ngIf"],["role","option",3,"pBind","ngStyle"],["pRipple","","role","option",3,"click","mouseenter","pBind","ngStyle"],[4,"ngIf","ngIfElse"]],template:function(t,n){if(t&1){let o=DD();Zp(0,xt,2,32,"input",13)(1,Ct,3,2,"ng-container",14)(2,At,7,37,"ul",15)(3,Kt,3,2,"ng-container",14)(4,Pt,4,8,"button",16),vi(5,"p-overlay",17,0),Sh("visibleChange",function(f){return pu(o),dT(n.overlayVisible,f)||(n.overlayVisible=f),hu(f)}),ah("onBeforeEnter",function(){return n.onOverlayBeforeEnter()})("onHide",function(){return n.hide()}),Zp(7,dn,10,15,"ng-template",null,1,RT),Fc();}t&2&&(eh("ngIf",!n.multiple),tE(),eh("ngIf",n.$filled()&&!n.$disabled()&&n.showClear&&!n.loading),tE(),eh("ngIf",n.multiple),tE(),eh("ngIf",n.loading),tE(),eh("ngIf",n.dropdown),tE(),eh("hostAttrSelector",n.$attrSelector),Nh("visible",n.overlayVisible),eh("options",n.overlayOptions)("target","@parent")("appendTo",n.$appendTo())("unstyled",n.unstyled())("pt",n.ptm("pcOverlay"))("motionOptions",n.motionOptions()),Xp("data-p",n.overlayDataP));},dependencies:[fe,Uo,zi,In,Pn,On,bt$1,oi,$r,_e,Ar,L,Mr,ge,Re,Pe$1,Re$1,_r,R],encapsulation:2})}return i})(),Zn=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=FI({type:i});static \u0275inj=Es({imports:[je,Pe$1,Pe$1]})}return i})();export{Zn as Z,je as j};