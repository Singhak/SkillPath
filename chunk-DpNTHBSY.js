import {_ as _e,g as ge}from'./chunk-DXBqkqQ9.js';import {ad as QI,ae as bs,af as Pe$1,bJ as Qe$1,I,aB as C,ah as R,aK as ML,ai as Le,H as Ho,$ as zw,bw as ft$1,bK as Ie,aq as ec,aS as mt$1,bL as Du,bM as Kt$1,bH as Ou,bN as Ge$1,bB as Ke,bi as Ar,bO as qu,ak as se,W as WI,i as fe,as as Uo,at as zi,au as In,av as Pn,aw as On,bP as bt$1,M as oi,aL as $r,bQ as Ar$1,bR as L,bS as Mr,ax as Re$1,bs as _r,ay as th,az as kL,aA as OL,R as RD,o as rh,T as Ti,a5 as Fh,D as Du$1,a6 as ww,h as wu,g as gh,a$ as Uw,U as Uc,u as ch,f as fE,a8 as Lh,aO as ah,X as Mw,bT as _e$1,aC as he,aD as nD,b0 as sw,x as cw,aE as vh,aF as qD,aG as GD,aH as yh,k as cr,aJ as H,ar as uy,e as ee,d as VD,b4 as Wc,b5 as zc,v as vw,bg as Ch,Q as Qc,bu as Io,aT as Pu,b1 as Sw,l as lh,b6 as fh,b3 as zD,bq as xw,br as Nw,b9 as Aw,p as kh}from'./main-AFRLRH7Y.js';import {R as Re}from'./chunk-CzuJ_Aa_.js';var Pe=`
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
`;var We=["item"],Ze=["empty"],Je=["header"],Xe=["footer"],Ye=["selecteditem"],et=["group"],tt=["loader"],nt=["removeicon"],it=["loadingicon"],ot=["clearicon"],lt=["dropdownicon"],at=["focusInput"],pt=["multiIn"],rt=["multiContainer"],st=["ddBtn"],ct=["items"],ut=["scroller"],dt=["overlay"],mt=i=>({i}),Ue=i=>({$implicit:i}),ht=(i,p,e)=>({removeCallback:i,index:p,class:e}),U=i=>({height:i}),Ne=(i,p)=>({$implicit:i,options:p}),_t=i=>({options:i}),gt=()=>({}),ft=(i,p,e)=>({option:i,i:p,scrollerOptions:e}),yt=(i,p)=>({$implicit:i,index:p});function xt(i,p){if(i&1){let e=RD();Ti(0,"input",18,2),gh("input",function(n){Du$1(e);let o=VD();return wu(o.onInput(n))})("keydown",function(n){Du$1(e);let o=VD();return wu(o.onKeyDown(n))})("change",function(n){Du$1(e);let o=VD();return wu(o.onInputChange(n))})("focus",function(n){Du$1(e);let o=VD();return wu(o.onInputFocus(n))})("blur",function(n){Du$1(e);let o=VD();return wu(o.onInputBlur(n))})("paste",function(n){Du$1(e);let o=VD();return wu(o.onInputPaste(n))})("keyup",function(n){Du$1(e);let o=VD();return wu(o.onInputKeyUp(n))}),Uc();}if(i&2){let e=VD();cw(e.cn(e.cx("pcInputText"),e.inputStyleClass)),ch("pAutoFocus",e.autofocus)("pt",e.ptm("pcInputText"))("ngStyle",e.inputStyle)("variant",e.$variant())("invalid",e.invalid())("pSize",e.size())("fluid",e.hasFluid)("pInputTextUnstyled",e.unstyled()),ah("type",e.type)("value",e.inputValue())("id",e.inputId)("autocomplete",e.autocomplete)("placeholder",e.placeholder)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??false)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0);}}function bt(i,p){if(i&1){let e=RD();Pu(),Ti(0,"svg",21),gh("click",function(){Du$1(e);let n=VD(2);return wu(n.clear())}),Uc();}if(i&2){let e=VD(2);cw(e.cx("clearIcon")),ch("pBind",e.ptm("clearIcon")),ah("aria-hidden",true);}}function vt(i,p){}function It(i,p){i&1&&rh(0,vt,0,0,"ng-template");}function wt(i,p){if(i&1){let e=RD();Ti(0,"span",22),gh("click",function(){Du$1(e);let n=VD(2);return wu(n.clear())}),rh(1,It,1,0,null,23),Uc();}if(i&2){let e=VD(2);cw(e.cx("clearIcon")),ch("pBind",e.ptm("clearIcon")),ah("aria-hidden",true),fE(),ch("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate);}}function Ct(i,p){if(i&1&&(Wc(0),rh(1,bt,1,4,"svg",19)(2,wt,2,5,"span",20),zc()),i&2){let e=VD();fE(),ch("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),fE(),ch("ngIf",e.clearIconTemplate||e._clearIconTemplate);}}function Ot(i,p){i&1&&fh(0);}function Tt(i,p){if(i&1){let e=RD();Ti(0,"span",22),gh("click",function(n){Du$1(e);let o=VD(2).index,l=VD(2);return wu(!l.readonly&&!l.$disabled()?l.removeOption(n,o):"")}),Pu(),lh(1,"svg",31),Uc();}if(i&2){let e=VD(4);cw(e.cx("chipIcon")),ch("pBind",e.ptm("chipIcon")),fE(),cw(e.cx("chipIcon")),ah("aria-hidden",true);}}function St(i,p){}function Vt(i,p){i&1&&rh(0,St,0,0,"ng-template");}function Et(i,p){if(i&1&&(Ti(0,"span",32),rh(1,Vt,1,0,null,29),Uc()),i&2){let e=VD(2).index,t=VD(2);ch("pBind",t.ptm("chipIcon")),ah("aria-hidden",true),fE(),ch("ngTemplateOutlet",t.removeIconTemplate||t._removeIconTemplate)("ngTemplateOutletContext",Aw(4,ht,t.removeOption.bind(t),e,t.cx("chipIcon")));}}function kt(i,p){if(i&1&&rh(0,Tt,2,6,"span",20)(1,Et,2,8,"span",30),i&2){let e=VD(3);ch("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),fE(),ch("ngIf",e.removeIconTemplate||e._removeIconTemplate);}}function Mt(i,p){if(i&1){let e=RD();Ti(0,"li",26,5)(2,"p-chip",28),gh("onRemove",function(n){let o=Du$1(e).index,l=VD(2);return wu(l.readonly?"":l.removeOption(n,o))}),rh(3,Ot,1,0,"ng-container",29)(4,kt,2,2,"ng-template",null,6,Uw),Uc()();}if(i&2){let e=p.$implicit,t=p.index,n=VD(2);cw(n.cx("chipItem",Sw(17,mt,t))),ch("pBind",n.ptm("chipItem")),ah("id",n.id+"_multiple_option_"+t)("aria-label",n.getOptionLabel(e))("aria-setsize",n.modelValue().length)("aria-posinset",t+1)("aria-selected",true),fE(2),cw(n.cx("pcChip")),ch("pt",n.ptm("pcChip"))("label",!n.selectedItemTemplate&&!n._selectedItemTemplate&&n.getOptionLabel(e))("disabled",n.$disabled())("removable",true)("unstyled",n.unstyled()),fE(),ch("ngTemplateOutlet",n.selectedItemTemplate||n._selectedItemTemplate)("ngTemplateOutletContext",Sw(19,Ue,e));}}function At(i,p){if(i&1){let e=RD();Ti(0,"ul",24,3),gh("focus",function(n){Du$1(e);let o=VD();return wu(o.onMultipleContainerFocus(n))})("blur",function(n){Du$1(e);let o=VD();return wu(o.onMultipleContainerBlur(n))})("keydown",function(n){Du$1(e);let o=VD();return wu(o.onMultipleContainerKeyDown(n))}),rh(2,Mt,6,21,"li",25),Ti(3,"li",26)(4,"input",27,4),gh("input",function(n){Du$1(e);let o=VD();return wu(o.onInput(n))})("keydown",function(n){Du$1(e);let o=VD();return wu(o.onKeyDown(n))})("change",function(n){Du$1(e);let o=VD();return wu(o.onInputChange(n))})("focus",function(n){Du$1(e);let o=VD();return wu(o.onInputFocus(n))})("blur",function(n){Du$1(e);let o=VD();return wu(o.onInputBlur(n))})("paste",function(n){Du$1(e);let o=VD();return wu(o.onInputPaste(n))})("keyup",function(n){Du$1(e);let o=VD();return wu(o.onInputKeyUp(n))}),Uc()()();}if(i&2){let e=VD();cw(e.cx("inputMultiple")),ch("pBind",e.ptm("inputMultiple"))("tabindex",-1),ah("data-p",e.inputMultipleDataP)("aria-orientation","horizontal")("aria-activedescendant",e.focused?e.focusedMultipleOptionId:void 0),fE(2),ch("ngForOf",e.modelValue()),fE(),cw(e.cx("inputChip")),ch("pBind",e.ptm("inputChip")),fE(),cw(e.cx("pcInputText")),ch("pAutoFocus",e.autofocus)("pBind",e.ptm("input"))("ngStyle",e.inputStyle),ah("type",e.type)("id",e.inputId)("autocomplete",e.autocomplete)("name",e.name())("minlength",e.minlength())("maxlength",e.maxlength())("size",e.size())("min",e.min())("max",e.max())("pattern",e.pattern())("placeholder",e.$filled()?null:e.placeholder)("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??false)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0);}}function Lt(i,p){if(i&1&&(Pu(),lh(0,"svg",35)),i&2){let e=VD(2);cw(e.cx("loader")),ch("pBind",e.ptm("loader"))("spin",true),ah("aria-hidden",true);}}function Ft(i,p){}function Bt(i,p){i&1&&rh(0,Ft,0,0,"ng-template");}function Dt(i,p){if(i&1&&(Ti(0,"span",32),rh(1,Bt,1,0,null,23),Uc()),i&2){let e=VD(2);cw(e.cx("loader")),ch("pBind",e.ptm("loader")),ah("aria-hidden",true),fE(),ch("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate);}}function Kt(i,p){if(i&1&&(Wc(0),rh(1,Lt,1,5,"svg",33)(2,Dt,2,5,"span",34),zc()),i&2){let e=VD();fE(),ch("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate),fE(),ch("ngIf",e.loadingIconTemplate||e._loadingIconTemplate);}}function zt(i,p){if(i&1&&lh(0,"span",38),i&2){let e=VD(2);ch("ngClass",e.dropdownIcon),ah("aria-hidden",true);}}function $t(i,p){if(i&1&&(Pu(),lh(0,"svg",40)),i&2){let e=VD(3);ch("pBind",e.ptm("dropdown"));}}function Rt(i,p){}function qt(i,p){i&1&&rh(0,Rt,0,0,"ng-template");}function Ht(i,p){if(i&1&&(Wc(0),rh(1,$t,1,1,"svg",39)(2,qt,1,0,null,23),zc()),i&2){let e=VD(2);fE(),ch("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),fE(),ch("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate);}}function Pt(i,p){if(i&1){let e=RD();Ti(0,"button",36,7),gh("click",function(n){Du$1(e);let o=VD();return wu(o.handleDropdownClick(n))}),rh(2,zt,1,2,"span",37)(3,Ht,3,2,"ng-container",14),Uc();}if(i&2){let e=VD();cw(e.cx("dropdown")),ch("pBind",e.ptm("dropdown"))("disabled",e.$disabled()),ah("aria-label",e.dropdownAriaLabel)("tabindex",e.tabindex),fE(2),ch("ngIf",e.dropdownIcon),fE(),ch("ngIf",!e.dropdownIcon);}}function Gt(i,p){i&1&&fh(0);}function Qt(i,p){i&1&&fh(0);}function Ut(i,p){if(i&1&&rh(0,Qt,1,0,"ng-container",29),i&2){let e=p.$implicit,t=p.options;VD(2);let n=zD(6);ch("ngTemplateOutlet",n)("ngTemplateOutletContext",xw(2,Ne,e,t));}}function Nt(i,p){i&1&&fh(0);}function jt(i,p){if(i&1&&rh(0,Nt,1,0,"ng-container",29),i&2){let e=p.options,t=VD(4);ch("ngTemplateOutlet",t.loaderTemplate||t._loaderTemplate)("ngTemplateOutletContext",Sw(2,_t,e));}}function Wt(i,p){i&1&&(Wc(0),rh(1,jt,1,4,"ng-template",null,10,Uw),zc());}function Zt(i,p){if(i&1){let e=RD();Ti(0,"p-scroller",45,9),gh("onLazyLoad",function(n){Du$1(e);let o=VD(2);return wu(o.onLazyLoad.emit(n))}),rh(2,Ut,1,5,"ng-template",null,1,Uw)(4,Wt,3,0,"ng-container",14),Uc();}if(i&2){let e=VD(2);sw(Sw(10,U,e.scrollHeight)),ch("tabindex",-1)("pt",e.ptm("virtualScroller"))("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",true)("lazy",e.lazy)("options",e.virtualScrollOptions),fE(4),ch("ngIf",e.loaderTemplate||e._loaderTemplate);}}function Jt(i,p){i&1&&fh(0);}function Xt(i,p){if(i&1&&(Wc(0),rh(1,Jt,1,0,"ng-container",29),zc()),i&2){VD();let e=zD(6),t=VD();fE(),ch("ngTemplateOutlet",e)("ngTemplateOutletContext",xw(3,Ne,t.visibleOptions(),Nw(2,gt)));}}function Yt(i,p){if(i&1&&(Ti(0,"span"),vw(1),Uc()),i&2){let e=VD(2).$implicit,t=VD(3);fE(),kh(t.getOptionGroupLabel(e.optionGroup));}}function en(i,p){i&1&&fh(0);}function tn(i,p){if(i&1&&(Wc(0),Ti(1,"li",49),rh(2,Yt,2,1,"span",14)(3,en,1,0,"ng-container",29),Uc(),zc()),i&2){let e=VD(),t=e.$implicit,n=e.index,o=VD().options,l=VD(2);fE(),cw(l.cx("optionGroup")),ch("pBind",l.ptm("optionGroup"))("ngStyle",Sw(8,U,o.itemSize+"px")),ah("id",l.id+"_"+l.getOptionIndex(n,o)),fE(),ch("ngIf",!l.groupTemplate),fE(),ch("ngTemplateOutlet",l.groupTemplate)("ngTemplateOutletContext",Sw(10,Ue,t.optionGroup));}}function nn(i,p){if(i&1&&(Ti(0,"span"),vw(1),Uc()),i&2){let e=VD(2).$implicit,t=VD(3);fE(),kh(t.getOptionLabel(e));}}function on(i,p){i&1&&fh(0);}function ln(i,p){if(i&1){let e=RD();Wc(0),Ti(1,"li",50),gh("click",function(n){Du$1(e);let o=VD().$implicit,l=VD(3);return wu(l.onOptionSelect(n,o))})("mouseenter",function(n){Du$1(e);let o=VD().index,l=VD().options,f=VD(2);return wu(f.onOptionMouseEnter(n,f.getOptionIndex(o,l)))}),rh(2,nn,2,1,"span",14)(3,on,1,0,"ng-container",29),Uc(),zc();}if(i&2){let e=VD(),t=e.$implicit,n=e.index,o=VD().options,l=VD(2);fE(),cw(l.cx("option",Aw(15,ft,t,n,o))),ch("pBind",l.getPTOptions(t,o,n,"option"))("ngStyle",Sw(19,U,o.itemSize+"px")),ah("id",l.id+"_"+l.getOptionIndex(n,o))("aria-label",l.getOptionLabel(t))("aria-selected",l.isSelected(t))("data-p-selected",l.isSelected(t))("aria-disabled",l.isOptionDisabled(t))("data-p-focused",l.focusedOptionIndex()===l.getOptionIndex(n,o))("aria-setsize",l.ariaSetSize)("aria-posinset",l.getAriaPosInset(l.getOptionIndex(n,o))),fE(),ch("ngIf",!l.itemTemplate&&!l._itemTemplate),fE(),ch("ngTemplateOutlet",l.itemTemplate||l._itemTemplate)("ngTemplateOutletContext",xw(21,yt,t,o.getOptions?o.getOptions(n):n));}}function an(i,p){if(i&1&&rh(0,tn,4,12,"ng-container",14)(1,ln,4,24,"ng-container",14),i&2){let e=p.$implicit,t=VD(3);ch("ngIf",t.isOptionGroup(e)),fE(),ch("ngIf",!t.isOptionGroup(e));}}function pn(i,p){if(i&1&&(Wc(0),vw(1),zc()),i&2){let e=VD(4);fE(),Qc(" ",e.searchResultMessageText," ");}}function rn(i,p){i&1&&fh(0,null,12);}function sn(i,p){if(i&1&&(Ti(0,"li",49),rh(1,pn,2,1,"ng-container",51)(2,rn,2,0,"ng-container",23),Uc()),i&2){let e=VD().options,t=VD(2);cw(t.cx("emptyMessage")),ch("pBind",t.ptm("emptyMessage"))("ngStyle",Sw(7,U,e.itemSize+"px")),fE(),ch("ngIf",!t.emptyTemplate&&!t._emptyTemplate)("ngIfElse",t.empty),fE(),ch("ngTemplateOutlet",t.emptyTemplate||t._emptyTemplate);}}function cn(i,p){if(i&1&&(Ti(0,"ul",46,11),rh(2,an,2,2,"ng-template",47)(3,sn,3,9,"li",48),Uc()),i&2){let e=p.$implicit,t=p.options,n=VD(2);sw(t.contentStyle),cw(n.cn(n.cx("list"),t.contentStyleClass)),ch("pBind",n.ptm("list")),ah("id",n.id+"_list")("aria-label",n.listLabel),fE(2),ch("ngForOf",e),fE(),ch("ngIf",!e||e&&e.length===0&&n.showEmptyMessage);}}function un(i,p){i&1&&fh(0);}function dn(i,p){if(i&1&&(Ti(0,"div",41),rh(1,Gt,1,0,"ng-container",23),Ti(2,"div",42),rh(3,Zt,5,12,"p-scroller",43)(4,Xt,2,6,"ng-container",14),Uc(),rh(5,cn,4,9,"ng-template",null,8,Uw)(7,un,1,0,"ng-container",23),Uc(),Ti(8,"span",44),vw(9),Uc()),i&2){let e=VD();cw(e.cn(e.cx("overlay"),e.panelStyleClass)),ch("pBind",e.ptm("overlay"))("ngStyle",e.panelStyle),fE(),ch("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),fE(),cw(e.cx("listContainer")),Ch("max-height",e.virtualScroll?"auto":e.scrollHeight),ch("pBind",e.ptm("listContainer"))("tabindex",-1),fE(),ch("ngIf",e.virtualScroll),fE(),ch("ngIf",!e.virtualScroll),fE(3),ch("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),fE(2),Qc(" ",e.selectedMessageText," ");}}var mn=`
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
`,hn={root:{position:"relative"}},_n={root:({instance:i})=>["p-autocomplete p-component p-inputwrapper",{"p-invalid":i.invalid(),"p-focus":i.focused,"p-inputwrapper-filled":i.$filled(),"p-inputwrapper-focus":i.focused&&!i.$disabled()||i.autofocus||i.overlayVisible,"p-autocomplete-open":i.overlayVisible,"p-autocomplete-clearable":i.showClear&&!i.$disabled(),"p-autocomplete-fluid":i.hasFluid}],pcInputText:"p-autocomplete-input",inputMultiple:({instance:i})=>["p-autocomplete-input-multiple",{"p-disabled":i.$disabled(),"p-variant-filled":i.$variant()==="filled"}],chipItem:({instance:i,i:p})=>["p-autocomplete-chip-item",{"p-focus":i.focusedMultipleOptionIndex()===p}],pcChip:"p-autocomplete-chip",chipIcon:"p-autocomplete-chip-icon",inputChip:"p-autocomplete-input-chip",loader:"p-autocomplete-loader",dropdown:"p-autocomplete-dropdown",overlay:({instance:i})=>["p-autocomplete-overlay p-component-overlay p-component",{"p-input-filled":i.$variant()==="filled","p-ripple-disabled":i.config.ripple()===false}],listContainer:"p-autocomplete-list-container",list:"p-autocomplete-list",optionGroup:"p-autocomplete-option-group",option:({instance:i,option:p,i:e,scrollerOptions:t})=>({"p-autocomplete-option":true,"p-autocomplete-option-selected":i.isSelected(p),"p-focus":i.focusedOptionIndex()===i.getOptionIndex(e,t),"p-disabled":i.isOptionDisabled(p)}),emptyMessage:"p-autocomplete-empty-message",clearIcon:"p-autocomplete-clear-icon"},Ge=(()=>{class i extends H{name="autocomplete";style=mn;classes=_n;inlineStyles=hn;static \u0275fac=(()=>{let e;return function(n){return (e||(e=uy(i)))(n||i)}})();static \u0275prov=ee({token:i,factory:i.\u0275fac})}return i})();var Qe=new C("AUTOCOMPLETE_INSTANCE"),gn={provide:_e$1,useExisting:Io(()=>je),multi:true},je=(()=>{class i extends Qe$1{overlayService;zone;componentName="AutoComplete";$pcAutoComplete=I(Qe,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(R,{self:true});minLength=1;minQueryLength;delay=300;panelStyle;styleClass;panelStyleClass;inputStyle;inputId;inputStyleClass;placeholder;readonly;scrollHeight="200px";lazy=false;virtualScroll;virtualScrollItemSize;virtualScrollOptions;autoHighlight;forceSelection;type="text";autoZIndex=true;baseZIndex=0;ariaLabel;dropdownAriaLabel;ariaLabelledBy;dropdownIcon;unique=true;group;completeOnFocus=false;showClear=false;dropdown;showEmptyMessage=true;dropdownMode="blank";multiple;addOnTab=false;tabindex;dataKey;emptyMessage;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";autofocus;autocomplete="off";optionGroupChildren="items";optionGroupLabel="label";overlayOptions;get suggestions(){return this._suggestions()}set suggestions(e){this._suggestions.set(e),this.handleSuggestionsChange();}optionLabel;optionValue;id;searchMessage;emptySelectionMessage;selectionMessage;autoOptionFocus=false;selectOnFocus;searchLocale;optionDisabled;focusOnHover=true;typeahead=true;addOnBlur=false;separator;appendTo=ML(void 0);motionOptions=ML(void 0);completeMethod=new Le;onSelect=new Le;onUnselect=new Le;onAdd=new Le;onFocus=new Le;onBlur=new Le;onDropdownClick=new Le;onClear=new Le;onInputKeydown=new Le;onKeyUp=new Le;onShow=new Le;onHide=new Le;onLazyLoad=new Le;inputEL;multiInputEl;multiContainerEL;dropdownButton;itemsViewChild;scroller;overlayViewChild;itemsWrapper;itemTemplate;emptyTemplate;headerTemplate;footerTemplate;selectedItemTemplate;groupTemplate;loaderTemplate;removeIconTemplate;loadingIconTemplate;clearIconTemplate;dropdownIconTemplate;onHostClick(e){this.onContainerClick(e);}value;_suggestions=Ho(null);timeout;overlayVisible;suggestionsUpdated;highlightOption;highlightOptionChanged;focused=false;loading;scrollHandler;listId;searchTimeout;dirty=false;_itemTemplate;_groupTemplate;_selectedItemTemplate;_headerTemplate;_emptyTemplate;_footerTemplate;_loaderTemplate;_removeIconTemplate;_loadingIconTemplate;_clearIconTemplate;_dropdownIconTemplate;focusedMultipleOptionIndex=Ho(-1);focusedOptionIndex=Ho(-1);_componentStyle=I(Ge);$appendTo=zw(()=>this.appendTo()||this.config.overlayAppendTo());visibleOptions=zw(()=>this.group?this.flatOptions(this._suggestions()):this._suggestions()||[]);inputValue=zw(()=>{let e=this.modelValue(),t=this.optionValueSelected?(this.suggestions||[]).find(n=>ft$1(n,e,this.equalityKey())):e;if(Ie(e))if(typeof e=="object"||this.optionValueSelected){let n=this.getOptionLabel(t);return n??e}else return e;else return ""});get focusedMultipleOptionId(){return this.focusedMultipleOptionIndex()!==-1?`${this.id}_multiple_option_${this.focusedMultipleOptionIndex()}`:null}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}get searchResultMessageText(){return Ie(this.visibleOptions())&&this.overlayVisible?this.searchMessageText.replaceAll("{0}",this.visibleOptions().length):this.emptySearchMessageText}get searchMessageText(){return this.searchMessage||this.config.translation.searchMessage||""}get emptySearchMessageText(){return this.emptyMessage||this.config.translation.emptySearchMessage||""}get selectionMessageText(){return this.selectionMessage||this.config.translation.selectionMessage||""}get emptySelectionMessageText(){return this.emptySelectionMessage||this.config.translation.emptySelectionMessage||""}get selectedMessageText(){return this.hasSelectedOption()?this.selectionMessageText.replaceAll("{0}",this.multiple?this.modelValue()?.length:"1"):this.emptySelectionMessageText}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}get listLabel(){return this.config.getTranslation(ec.ARIA).listLabel}get virtualScrollerDisabled(){return !this.virtualScroll}get optionValueSelected(){return typeof this.modelValue()=="string"&&this.optionValue}chipItemClass(e){return this._componentStyle.classes.chipItem({instance:this,i:e})}constructor(e,t){super(),this.overlayService=e,this.zone=t;}onInit(){this.id=this.id||mt$1("pn_id_"),this.cd.detectChanges();}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case "item":this._itemTemplate=e.template;break;case "group":this._groupTemplate=e.template;break;case "selecteditem":this._selectedItemTemplate=e.template;break;case "selectedItem":this._selectedItemTemplate=e.template;break;case "header":this._headerTemplate=e.template;break;case "empty":this._emptyTemplate=e.template;break;case "footer":this._footerTemplate=e.template;break;case "loader":this._loaderTemplate=e.template;break;case "removetokenicon":this._removeIconTemplate=e.template;break;case "loadingicon":this._loadingIconTemplate=e.template;break;case "clearicon":this._clearIconTemplate=e.template;break;case "dropdownicon":this._dropdownIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}});}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.suggestionsUpdated&&this.overlayViewChild&&this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay();},1),this.suggestionsUpdated=false;});}handleSuggestionsChange(){if(this.loading){this._suggestions()?.length>0||this.showEmptyMessage||this.emptyTemplate?this.show():this.hide();let e=this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(e),this.suggestionsUpdated=true,this.loading=false,this.cd.markForCheck();}}flatOptions(e){return (e||[]).reduce((t,n,o)=>{t.push({optionGroup:n,group:true,index:o});let l=this.getOptionGroupChildren(n);return l&&l.forEach(f=>t.push(f)),t},[])}isOptionGroup(e){return this.optionGroupLabel&&e.optionGroup&&e.group}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findLastOptionIndex(){return Du(this.visibleOptions(),e=>this.isValidOption(e))}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let t=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(n=>this.isValidOption(n)):-1;return t>-1?t+e+1:e}findPrevOptionIndex(e){let t=e>0?Du(this.visibleOptions().slice(0,e),n=>this.isValidOption(n)):-1;return t>-1?t:e}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}isValidOption(e){return e&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionDisabled(e){return this.optionDisabled?Kt$1(e,this.optionDisabled):false}isSelected(e){return this.multiple?this.unique?this.modelValue()?.some(t=>ft$1(t,e,this.equalityKey())):false:ft$1(this.modelValue(),e,this.equalityKey())}isOptionMatched(e,t){return this.isValidOption(e)&&this.getOptionLabel(e).toLocaleLowerCase(this.searchLocale)===t.toLocaleLowerCase(this.searchLocale)}isInputClicked(e){return e.target===this.inputEL?.nativeElement}isDropdownClicked(e){return this.dropdownButton?.nativeElement?e.target===this.dropdownButton.nativeElement||this.dropdownButton.nativeElement.contains(e.target):false}equalityKey(){return this.optionValue?void 0:this.dataKey}onContainerClick(e){this.$disabled()||this.loading||this.isInputClicked(e)||this.isDropdownClicked(e)||(!this.overlayViewChild||!this.overlayViewChild.overlayViewChild?.nativeElement.contains(e.target))&&Ou(this.inputEL?.nativeElement);}handleDropdownClick(e){let t;this.overlayVisible?this.hide(true):(Ou(this.inputEL?.nativeElement),t=this.inputEL?.nativeElement?.value,this.dropdownMode==="blank"?this.search(e,"","dropdown"):this.dropdownMode==="current"&&this.search(e,t,"dropdown")),this.onDropdownClick.emit({originalEvent:e,query:t});}onInput(e){if(this.typeahead){let t=this.minQueryLength||this.minLength;this.searchTimeout&&clearTimeout(this.searchTimeout);let n=e.target.value;this.maxlength()!==null&&(n=n.split("").slice(0,this.maxlength()).join("")),!this.multiple&&!this.forceSelection&&this.updateModel(n),n.length===0&&!this.multiple?(this.onClear.emit(),setTimeout(()=>{this.hide();},this.delay/2)):n.length>=t?(this.focusedOptionIndex.set(-1),this.searchTimeout=setTimeout(()=>{this.search(e,n,"input");},this.delay)):this.hide();}}onInputChange(e){this.updateInputWithForceSelection(e);}onInputFocus(e){if(this.$disabled())return;!this.dirty&&this.completeOnFocus&&this.search(e,e.target.value,"focus"),this.dirty=true,this.focused=true;let t=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(t),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e);}onMultipleContainerFocus(e){this.$disabled()||(this.focused=true);}onMultipleContainerBlur(e){this.focusedMultipleOptionIndex.set(-1),this.focused=false;}onMultipleContainerKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(e.code){case "ArrowLeft":this.onArrowLeftKeyOnMultiple(e);break;case "ArrowRight":this.onArrowRightKeyOnMultiple(e);break;case "Backspace":this.onBackspaceKeyOnMultiple(e);break;}}onInputBlur(e){if(this.dirty=false,this.focused=false,this.focusedOptionIndex.set(-1),this.addOnBlur&&this.multiple&&!this.typeahead){let t=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="");}this.onModelTouched(),this.onBlur.emit(e);}onInputPaste(e){if(this.separator&&this.multiple&&!this.typeahead){let t=(e.clipboardData||window.clipboardData)?.getData("Text");if(t){let n=t.split(this.separator),o=[...this.modelValue()||[]];if(n.forEach(l=>{let f=l.trim();f&&!this.isSelected(f)&&o.push(f);}),o.length>(this.modelValue()||[]).length){let l=o.slice((this.modelValue()||[]).length);this.updateModel(o),l.forEach(f=>{this.onAdd.emit({originalEvent:e,value:f});}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault();}}}else this.onKeyDown(e);}onInputKeyUp(e){this.onKeyUp.emit(e);}onKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(this.onInputKeydown.emit(e),e.code){case "ArrowDown":this.onArrowDownKey(e);break;case "ArrowUp":this.onArrowUpKey(e);break;case "ArrowLeft":this.onArrowLeftKey(e);break;case "ArrowRight":this.onArrowRightKey(e);break;case "Home":this.onHomeKey(e);break;case "End":this.onEndKey(e);break;case "PageDown":this.onPageDownKey(e);break;case "PageUp":this.onPageUpKey(e);break;case "Enter":case "NumpadEnter":this.onEnterKey(e);break;case "Escape":this.onEscapeKey(e);break;case "Tab":this.onTabKey(e);break;case "Backspace":this.onBackspaceKey(e);break;case "ShiftLeft":case "ShiftRight":break;default:this.handleSeparatorKey(e);break}}handleSeparatorKey(e){if(this.separator&&this.multiple&&!this.typeahead&&(this.separator===e.key||typeof this.separator=="string"&&e.key===this.separator||this.separator instanceof RegExp&&e.key.match(this.separator))){let t=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault());}}onArrowDownKey(e){if(!this.overlayVisible)return;let t=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,t),e.preventDefault(),e.stopPropagation();}onArrowUpKey(e){if(this.overlayVisible)if(e.altKey)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.overlayVisible&&this.hide(),e.preventDefault();else {let t=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,t),e.preventDefault(),e.stopPropagation();}}onArrowLeftKey(e){let t=e.currentTarget;this.focusedOptionIndex.set(-1),this.multiple&&(Ge$1(t.value)&&this.hasSelectedOption()?(Ou(this.multiContainerEL?.nativeElement),this.focusedMultipleOptionIndex.set(this.modelValue().length)):e.stopPropagation());}onArrowRightKey(e){this.focusedOptionIndex.set(-1),this.multiple&&e.stopPropagation();}onHomeKey(e){let{currentTarget:t}=e,n=t.value.length;t.setSelectionRange(0,e.shiftKey?n:0),this.focusedOptionIndex.set(-1),e.preventDefault();}onEndKey(e){let{currentTarget:t}=e,n=t.value.length;t.setSelectionRange(e.shiftKey?0:n,n),this.focusedOptionIndex.set(-1),e.preventDefault();}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault();}onPageUpKey(e){this.scrollInView(0),e.preventDefault();}onEnterKey(e){if(!this.typeahead&&!this.forceSelection&&this.multiple){let t=e.target.value?.trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""));}if(this.overlayVisible)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.hide();else return;e.preventDefault();}onEscapeKey(e){this.overlayVisible&&this.hide(true),e.preventDefault();}onTabKey(e){if(this.focusedOptionIndex()!==-1){this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]);return}if(this.multiple&&!this.typeahead){let t=(this.multiInputEl?.nativeElement?.value||this.inputEL?.nativeElement?.value||"").trim();if(this.addOnTab&&t&&!this.isSelected(t)){this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.updateInputValue(),e.preventDefault(),this.overlayVisible&&this.hide();return}}this.overlayVisible&&this.hide();}onBackspaceKey(e){if(this.multiple){if(Ie(this.modelValue())&&!this.inputEL?.nativeElement?.value){let t=this.modelValue()[this.modelValue().length-1],n=this.modelValue().slice(0,-1);this.updateModel(n),this.onUnselect.emit({originalEvent:e,value:t});}e.stopPropagation();}}onArrowLeftKeyOnMultiple(e){let t=this.focusedMultipleOptionIndex()<1?0:this.focusedMultipleOptionIndex()-1;this.focusedMultipleOptionIndex.set(t);}onArrowRightKeyOnMultiple(e){let t=this.focusedMultipleOptionIndex();t++,this.focusedMultipleOptionIndex.set(t),t>this.modelValue().length-1&&(this.focusedMultipleOptionIndex.set(-1),Ou(this.inputEL?.nativeElement));}onBackspaceKeyOnMultiple(e){this.focusedMultipleOptionIndex()!==-1&&this.removeOption(e,this.focusedMultipleOptionIndex());}onOptionSelect(e,t,n=true){this.multiple?(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.isSelected(t)||this.updateModel([...this.modelValue()||[],t])):this.updateModel(t),this.onSelect.emit({originalEvent:e,value:t}),n&&this.hide(true);}onOptionMouseEnter(e,t){this.focusOnHover&&this.changeFocusedOptionIndex(e,t);}search(e,t,n){t!=null&&(n==="input"&&t.trim().length===0||(this.loading=true,this.completeMethod.emit({originalEvent:e,query:t})));}removeOption(e,t){e.stopPropagation();let n=this.modelValue()[t],o=this.modelValue().filter((l,f)=>f!==t);this.updateModel(o),this.onUnselect.emit({originalEvent:e,value:n}),Ou(this.inputEL?.nativeElement);}updateModel(e){let t=null;e&&(t=this.multiple?e.map(n=>this.getOptionValue(n)):this.getOptionValue(e)),this.value=t,this.writeModelValue(e),this.onModelChange(t),this.updateInputValue(),this.cd.markForCheck();}updateInputValue(){this.inputEL&&this.inputEL.nativeElement&&(this.multiple?this.inputEL.nativeElement.value="":this.inputEL.nativeElement.value=this.inputValue());}updateInputWithForceSelection(e){let t=this.inputEL?.nativeElement,n=!t?.value&&Ie(this.modelValue());if(!this.forceSelection||this.overlayVisible||!t?.value&&!n)return;let o=this.minQueryLength??this.minLength;if(!n&&t.value.length<o)return;let l=this.visibleOptions()?.find(f=>this.isOptionMatched(f,t.value));if(!l){t.value="",this.multiple||this.clear();return}l&&!this.isSelected(l)&&this.onOptionSelect(e,l);}autoUpdateModel(){if((this.selectOnFocus||this.autoHighlight)&&this.autoOptionFocus&&!this.hasSelectedOption()){let e=this.findFirstFocusedOptionIndex();this.focusedOptionIndex.set(e),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],false);}}scrollInView(e=-1){let t=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let n=Ke(this.itemsViewChild.nativeElement,`li[id="${t}"]`);n?n.scrollIntoView&&n.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex());},0);}}changeFocusedOptionIndex(e,t){this.focusedOptionIndex()!==t&&(this.focusedOptionIndex.set(t),this.scrollInView(),this.selectOnFocus&&this.onOptionSelect(e,this.visibleOptions()[t],false));}show(e=false){this.dirty=true,this.overlayVisible=true;let t=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(t),e&&Ou(this.inputEL?.nativeElement),e&&Ou(this.inputEL?.nativeElement),this.onShow.emit(),this.cd.markForCheck();}hide(e=false){let t=()=>{this.dirty=e,this.overlayVisible=false,this.focusedOptionIndex.set(-1),e&&Ou(this.inputEL?.nativeElement),this.onHide.emit(),this.updateInputWithForceSelection(null),this.cd.markForCheck();};setTimeout(()=>{t();},0);}clear(){this.updateModel(null),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.onClear.emit();}hasSelectedOption(){return Ie(this.modelValue())}getAriaPosInset(e){return (this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(t=>this.isOptionGroup(t)).length:e)+1}getOptionLabel(e){return this.optionLabel?Kt$1(e,this.optionLabel):e&&e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?Kt$1(e,this.optionValue):e&&e.value!=null?e.value:e}getOptionIndex(e,t){return this.virtualScrollerDisabled?e:t&&t.getItemOptions(e).index}getOptionGroupLabel(e){return this.optionGroupLabel?Kt$1(e,this.optionGroupLabel):e&&e.label!=null?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren?Kt$1(e,this.optionGroupChildren):e.items}getPTOptions(e,t,n,o){return this.ptm(o,{context:{option:e,index:this.getOptionIndex(n,t),selected:this.isSelected(e),focused:this.focusedOptionIndex()===this.getOptionIndex(n,t),disabled:this.isOptionDisabled(e)}})}onOverlayBeforeEnter(){if(this.itemsWrapper=Ke(this.overlayViewChild.overlayViewChild?.nativeElement,this.virtualScroll?'[data-pc-name="virtualscroller"]':'[data-pc-name="pcoverlay"]'),this.virtualScroll&&(this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.scroller?.viewInit()),this.visibleOptions()&&this.visibleOptions().length)if(this.virtualScroll){let e=this.modelValue()?this.focusedOptionIndex():-1;e!==-1&&this.scroller?.scrollToIndex(e);}else {let e=Ke(this.itemsWrapper,'[data-pc-section="option"][data-p-selected="true"]');e&&e.scrollIntoView({block:"nearest",inline:"center"});}}get containerDataP(){return this.cn({fluid:this.hasFluid})}get overlayDataP(){return this.cn({[`overlay-${this.$appendTo()}`]:true})}get inputMultipleDataP(){return this.cn({invalid:this.invalid(),disabled:this.$disabled(),focus:this.focused,fluid:this.hasFluid,filled:this.$variant()==="filled",empty:!this.$filled(),[this.size()]:this.size()})}writeControlValue(e,t){if(this.multiple){let n=(e||[]).map(o=>this.visibleOptions().find(f=>ft$1(o,f,this.equalityKey()))??o);t(Ge$1(e)?e:n);}else {let n=this.visibleOptions().find(o=>ft$1(e,o,this.equalityKey()));t(Ge$1(n)?e:n);}this.value=e,this.updateInputValue(),this.cd.markForCheck();}onDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null);}static \u0275fac=function(t){return new(t||i)(Ar(qu),Ar(se))};static \u0275cmp=WI({type:i,selectors:[["p-autoComplete"],["p-autocomplete"],["p-auto-complete"]],contentQueries:function(t,n,o){if(t&1&&yh(o,We,5)(o,Ze,5)(o,Je,5)(o,Xe,5)(o,Ye,5)(o,et,5)(o,tt,5)(o,nt,5)(o,it,5)(o,ot,5)(o,lt,5)(o,cr,4),t&2){let l;qD(l=GD())&&(n.itemTemplate=l.first),qD(l=GD())&&(n.emptyTemplate=l.first),qD(l=GD())&&(n.headerTemplate=l.first),qD(l=GD())&&(n.footerTemplate=l.first),qD(l=GD())&&(n.selectedItemTemplate=l.first),qD(l=GD())&&(n.groupTemplate=l.first),qD(l=GD())&&(n.loaderTemplate=l.first),qD(l=GD())&&(n.removeIconTemplate=l.first),qD(l=GD())&&(n.loadingIconTemplate=l.first),qD(l=GD())&&(n.clearIconTemplate=l.first),qD(l=GD())&&(n.dropdownIconTemplate=l.first),qD(l=GD())&&(n.templates=l);}},viewQuery:function(t,n){if(t&1&&vh(at,5)(pt,5)(rt,5)(st,5)(ct,5)(ut,5)(dt,5),t&2){let o;qD(o=GD())&&(n.inputEL=o.first),qD(o=GD())&&(n.multiInputEl=o.first),qD(o=GD())&&(n.multiContainerEL=o.first),qD(o=GD())&&(n.dropdownButton=o.first),qD(o=GD())&&(n.itemsViewChild=o.first),qD(o=GD())&&(n.scroller=o.first),qD(o=GD())&&(n.overlayViewChild=o.first);}},hostVars:5,hostBindings:function(t,n){t&1&&gh("click",function(l){return n.onHostClick(l)}),t&2&&(ah("data-p",n.containerDataP),sw(n.sx("root")),cw(n.cn(n.cx("root"),n.styleClass)));},inputs:{minLength:[2,"minLength","minLength",OL],minQueryLength:[2,"minQueryLength","minQueryLength",OL],delay:[2,"delay","delay",OL],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",inputStyle:"inputStyle",inputId:"inputId",inputStyleClass:"inputStyleClass",placeholder:"placeholder",readonly:[2,"readonly","readonly",kL],scrollHeight:"scrollHeight",lazy:[2,"lazy","lazy",kL],virtualScroll:[2,"virtualScroll","virtualScroll",kL],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",OL],virtualScrollOptions:"virtualScrollOptions",autoHighlight:[2,"autoHighlight","autoHighlight",kL],forceSelection:[2,"forceSelection","forceSelection",kL],type:"type",autoZIndex:[2,"autoZIndex","autoZIndex",kL],baseZIndex:[2,"baseZIndex","baseZIndex",OL],ariaLabel:"ariaLabel",dropdownAriaLabel:"dropdownAriaLabel",ariaLabelledBy:"ariaLabelledBy",dropdownIcon:"dropdownIcon",unique:[2,"unique","unique",kL],group:[2,"group","group",kL],completeOnFocus:[2,"completeOnFocus","completeOnFocus",kL],showClear:[2,"showClear","showClear",kL],dropdown:[2,"dropdown","dropdown",kL],showEmptyMessage:[2,"showEmptyMessage","showEmptyMessage",kL],dropdownMode:"dropdownMode",multiple:[2,"multiple","multiple",kL],addOnTab:[2,"addOnTab","addOnTab",kL],tabindex:[2,"tabindex","tabindex",OL],dataKey:"dataKey",emptyMessage:"emptyMessage",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",autofocus:[2,"autofocus","autofocus",kL],autocomplete:"autocomplete",optionGroupChildren:"optionGroupChildren",optionGroupLabel:"optionGroupLabel",overlayOptions:"overlayOptions",suggestions:"suggestions",optionLabel:"optionLabel",optionValue:"optionValue",id:"id",searchMessage:"searchMessage",emptySelectionMessage:"emptySelectionMessage",selectionMessage:"selectionMessage",autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",kL],selectOnFocus:[2,"selectOnFocus","selectOnFocus",kL],searchLocale:[2,"searchLocale","searchLocale",kL],optionDisabled:"optionDisabled",focusOnHover:[2,"focusOnHover","focusOnHover",kL],typeahead:[2,"typeahead","typeahead",kL],addOnBlur:[2,"addOnBlur","addOnBlur",kL],separator:"separator",appendTo:[1,"appendTo"],motionOptions:[1,"motionOptions"]},outputs:{completeMethod:"completeMethod",onSelect:"onSelect",onUnselect:"onUnselect",onAdd:"onAdd",onFocus:"onFocus",onBlur:"onBlur",onDropdownClick:"onDropdownClick",onClear:"onClear",onInputKeydown:"onInputKeydown",onKeyUp:"onKeyUp",onShow:"onShow",onHide:"onHide",onLazyLoad:"onLazyLoad"},features:[Mw([gn,Ge,{provide:Qe,useExisting:i},{provide:he,useExisting:i}]),nD([R]),th],decls:9,vars:14,consts:[["overlay",""],["content",""],["focusInput",""],["multiContainer",""],["focusInput","","multiIn",""],["token",""],["removeicon",""],["ddBtn",""],["buildInItems",""],["scroller",""],["loader",""],["items",""],["empty",""],["pInputText","","aria-autocomplete","list","role","combobox",3,"pAutoFocus","pt","class","ngStyle","variant","invalid","pSize","fluid","pInputTextUnstyled","input","keydown","change","focus","blur","paste","keyup",4,"ngIf"],[4,"ngIf"],["role","listbox",3,"pBind","class","tabindex","focus","blur","keydown",4,"ngIf"],["type","button","pRipple","",3,"pBind","class","disabled","click",4,"ngIf"],[3,"visibleChange","onBeforeEnter","onHide","hostAttrSelector","visible","options","target","appendTo","unstyled","pt","motionOptions"],["pInputText","","aria-autocomplete","list","role","combobox",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pt","ngStyle","variant","invalid","pSize","fluid","pInputTextUnstyled"],["data-p-icon","times",3,"pBind","class","click",4,"ngIf"],[3,"pBind","class","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[3,"click","pBind"],[4,"ngTemplateOutlet"],["role","listbox",3,"focus","blur","keydown","pBind","tabindex"],["role","option",3,"pBind","class",4,"ngFor","ngForOf"],["role","option",3,"pBind"],["role","combobox","aria-autocomplete","list",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pBind","ngStyle"],[3,"onRemove","pt","label","disabled","removable","unstyled"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind",4,"ngIf"],["data-p-icon","times-circle"],[3,"pBind"],["data-p-icon","spinner",3,"pBind","class","spin",4,"ngIf"],[3,"pBind","class",4,"ngIf"],["data-p-icon","spinner",3,"pBind","spin"],["type","button","pRipple","",3,"click","pBind","disabled"],[3,"ngClass",4,"ngIf"],[3,"ngClass"],["data-p-icon","chevron-down",3,"pBind",4,"ngIf"],["data-p-icon","chevron-down",3,"pBind"],[3,"pBind","ngStyle"],[3,"pBind","tabindex"],[3,"tabindex","pt","items","style","itemSize","autoSize","lazy","options","onLazyLoad",4,"ngIf"],["role","status","aria-live","polite",1,"p-hidden-accessible"],[3,"onLazyLoad","tabindex","pt","items","itemSize","autoSize","lazy","options"],["role","listbox",3,"pBind"],["ngFor","",3,"ngForOf"],["role","option",3,"pBind","class","ngStyle",4,"ngIf"],["role","option",3,"pBind","ngStyle"],["pRipple","","role","option",3,"click","mouseenter","pBind","ngStyle"],[4,"ngIf","ngIfElse"]],template:function(t,n){if(t&1){let o=RD();rh(0,xt,2,32,"input",13)(1,Ct,3,2,"ng-container",14)(2,At,7,37,"ul",15)(3,Kt,3,2,"ng-container",14)(4,Pt,4,8,"button",16),Ti(5,"p-overlay",17,0),Fh("visibleChange",function(f){return Du$1(o),ww(n.overlayVisible,f)||(n.overlayVisible=f),wu(f)}),gh("onBeforeEnter",function(){return n.onOverlayBeforeEnter()})("onHide",function(){return n.hide()}),rh(7,dn,10,15,"ng-template",null,1,Uw),Uc();}t&2&&(ch("ngIf",!n.multiple),fE(),ch("ngIf",n.$filled()&&!n.$disabled()&&n.showClear&&!n.loading),fE(),ch("ngIf",n.multiple),fE(),ch("ngIf",n.loading),fE(),ch("ngIf",n.dropdown),fE(),ch("hostAttrSelector",n.$attrSelector),Lh("visible",n.overlayVisible),ch("options",n.overlayOptions)("target","@parent")("appendTo",n.$appendTo())("unstyled",n.unstyled())("pt",n.ptm("pcOverlay"))("motionOptions",n.motionOptions()),ah("data-p",n.overlayDataP));},dependencies:[fe,Uo,zi,In,Pn,On,bt$1,oi,$r,_e,Ar$1,L,Mr,ge,Re,Pe$1,Re$1,_r,R],encapsulation:2})}return i})(),Zn=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=QI({type:i});static \u0275inj=bs({imports:[je,Pe$1,Pe$1]})}return i})();export{Zn as Z,je as j};