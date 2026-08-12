import {a2 as eD,a3 as Ms,a4 as st,a5 as z,I,a6 as C,a7 as Ue,aE as gy,c as JI,ah as oh,ai as LL,aj as FL,s as sr,ak as Xn,al as Yn,j as sh,u as dh,k as vE,L as Lw,ao as at,ap as cD,_ as uh,aJ as gw,aq as Ih,d as rt,E as KD,G as JD,aD as A,n as ne$1,C as Ci,h as Wc,as as WD,M as Mh,aN as jw,f as fh,g as bw,at as jh,aM as gh}from'./main-UMGO3TEL.js';var $=`
    .p-progressbar {
        display: block;
        position: relative;
        overflow: hidden;
        height: dt('progressbar.height');
        background: dt('progressbar.background');
        border-radius: dt('progressbar.border.radius');
    }

    .p-progressbar-value {
        margin: 0;
        background: dt('progressbar.value.background');
    }

    .p-progressbar-label {
        color: dt('progressbar.label.color');
        font-size: dt('progressbar.label.font.size');
        font-weight: dt('progressbar.label.font.weight');
    }

    .p-progressbar-determinate .p-progressbar-value {
        height: 100%;
        width: 0%;
        position: absolute;
        display: none;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: width 1s ease-in-out;
    }

    .p-progressbar-determinate .p-progressbar-label {
        display: inline-flex;
    }

    .p-progressbar-indeterminate .p-progressbar-value::before {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }

    .p-progressbar-indeterminate .p-progressbar-value::after {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
    }

    @keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }

    @keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
`;var L=["content"],U=n=>({$implicit:n});function W(n,g){if(n&1&&(Ci(0,"div"),bw(1),Wc()),n&2){let e=WD(2);Mh("display",e.value!=null&&e.value!==0?"flex":"none"),vE(),jh("",e.value,"",e.unit);}}function X(n,g){n&1&&gh(0);}function Y(n,g){if(n&1&&(Ci(0,"div",2)(1,"div",2),sh(2,W,2,4,"div",3)(3,X,1,0,"ng-container",4),Wc()()),n&2){let e=WD();gw(e.cn(e.cx("value"),e.valueStyleClass)),Mh("width",e.value+"%")("display","flex")("background",e.color),dh("pBind",e.ptm("value")),uh("data-p",e.dataP),vE(),gw(e.cx("label")),dh("pBind",e.ptm("label")),uh("data-p",e.dataP),vE(),dh("ngIf",e.showValue&&!e.contentTemplate&&!e._contentTemplate),vE(),dh("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",jw(17,U,e.value));}}function Z(n,g){if(n&1&&fh(0,"div",2),n&2){let e=WD();gw(e.cn(e.cx("value"),e.valueStyleClass)),Mh("background",e.color),dh("pBind",e.ptm("value")),uh("data-p",e.dataP);}}var ee={root:({instance:n})=>["p-progressbar p-component",{"p-progressbar-determinate":n.mode=="determinate","p-progressbar-indeterminate":n.mode=="indeterminate"}],value:"p-progressbar-value",label:"p-progressbar-label"},J=(()=>{class n extends A{name="progressbar";style=$;classes=ee;static \u0275fac=(()=>{let e;return function(t){return (e||(e=gy(n)))(t||n)}})();static \u0275prov=ne$1({token:n,factory:n.\u0275fac})}return n})();var K=new C("PROGRESSBAR_INSTANCE"),ne=(()=>{class n extends z{componentName="ProgressBar";$pcProgressBar=I(K,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Ue,{self:true});value;showValue=true;styleClass;valueStyleClass;unit="%";mode="determinate";color;contentTemplate;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}_componentStyle=I(J);templates;_contentTemplate;onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="content"?this._contentTemplate=e.template:this._contentTemplate=e.template;});}get dataP(){return this.cn({determinate:this.mode==="determinate",indeterminate:this.mode==="indeterminate"})}static \u0275fac=(()=>{let e;return function(t){return (e||(e=gy(n)))(t||n)}})();static \u0275cmp=JI({type:n,selectors:[["p-progressBar"],["p-progressbar"],["p-progress-bar"]],contentQueries:function(i,t,C){if(i&1&&Ih(C,L,4)(C,rt,4),i&2){let p;KD(p=JD())&&(t.contentTemplate=p.first),KD(p=JD())&&(t.templates=p);}},hostAttrs:["role","progressbar"],hostVars:7,hostBindings:function(i,t){i&2&&(uh("aria-valuemin",0)("aria-valuenow",t.value)("aria-valuemax",100)("aria-level",t.value+t.unit)("data-p",t.dataP),gw(t.cn(t.cx("root"),t.styleClass)));},inputs:{value:[2,"value","value",FL],showValue:[2,"showValue","showValue",LL],styleClass:"styleClass",valueStyleClass:"valueStyleClass",unit:"unit",mode:"mode",color:"color"},features:[Lw([J,{provide:K,useExisting:n},{provide:at,useExisting:n}]),cD([Ue]),oh],decls:2,vars:2,consts:[[3,"class","pBind","width","display","background",4,"ngIf"],[3,"class","pBind","background",4,"ngIf"],[3,"pBind"],[3,"display",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,t){i&1&&sh(0,Y,4,19,"div",0)(1,Z,1,6,"div",1),i&2&&(dh("ngIf",t.mode==="determinate"),vE(),dh("ngIf",t.mode==="indeterminate"));},dependencies:[sr,Xn,Yn,st,Ue],encapsulation:2})}return n})(),Ce=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=eD({type:n});static \u0275inj=Ms({imports:[ne,st,st]})}return n})();export{Ce as C,ne as n};