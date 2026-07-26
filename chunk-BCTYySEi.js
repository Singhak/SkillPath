import {bb as On,r as r$1,bc as ye,aj as se$1,e as ee$1,I,S as Se,bd as $g,be as x,ac as QI,ad as bs,ae as Pe,af as Y$1,aA as C,ag as R,aq as uy,W as WI,i as fe,at as In,au as Pn,ax as th,ay as kL,az as OL,o as rh,u as ch,f as fE,P as Mw,aB as he,aC as nD,aN as ah,x as cw,aG as yh,k as cr,aE as qD,aF as GD,aI as H,T as Ti,U as Uc,d as VD,bf as Ch,b0 as Sw,l as lh,v as vw,a9 as Oh,b5 as fh}from'./main-OFIOEN4F.js';function Ie(t){t||(t=I(Se));let r=new x(e=>{if(t.destroyed){e.next();return}return t.onDestroy(e.next.bind(e))});return e=>e.pipe($g(r))}var Y=`
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
`;var re=["content"],se=t=>({$implicit:t});function oe(t,r){if(t&1&&(Ti(0,"div"),vw(1),Uc()),t&2){let e=VD(2);Ch("display",e.value!=null&&e.value!==0?"flex":"none"),fE(),Oh("",e.value,"",e.unit);}}function ae(t,r){t&1&&fh(0);}function le(t,r){if(t&1&&(Ti(0,"div",2)(1,"div",2),rh(2,oe,2,4,"div",3)(3,ae,1,0,"ng-container",4),Uc()()),t&2){let e=VD();cw(e.cn(e.cx("value"),e.valueStyleClass)),Ch("width",e.value+"%")("display","flex")("background",e.color),ch("pBind",e.ptm("value")),ah("data-p",e.dataP),fE(),cw(e.cx("label")),ch("pBind",e.ptm("label")),ah("data-p",e.dataP),fE(),ch("ngIf",e.showValue&&!e.contentTemplate&&!e._contentTemplate),fE(),ch("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Sw(17,se,e.value));}}function ce(t,r){if(t&1&&lh(0,"div",2),t&2){let e=VD();cw(e.cn(e.cx("value"),e.valueStyleClass)),Ch("background",e.color),ch("pBind",e.ptm("value")),ah("data-p",e.dataP);}}var ue={root:({instance:t})=>["p-progressbar p-component",{"p-progressbar-determinate":t.mode=="determinate","p-progressbar-indeterminate":t.mode=="indeterminate"}],value:"p-progressbar-value",label:"p-progressbar-label"},ee=(()=>{class t extends H{name="progressbar";style=Y;classes=ue;static \u0275fac=(()=>{let e;return function(i){return (e||(e=uy(t)))(i||t)}})();static \u0275prov=ee$1({token:t,factory:t.\u0275fac})}return t})();var te=new C("PROGRESSBAR_INSTANCE"),de=(()=>{class t extends Y$1{componentName="ProgressBar";$pcProgressBar=I(te,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(R,{self:true});value;showValue=true;styleClass;valueStyleClass;unit="%";mode="determinate";color;contentTemplate;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}_componentStyle=I(ee);templates;_contentTemplate;onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="content"?this._contentTemplate=e.template:this._contentTemplate=e.template;});}get dataP(){return this.cn({determinate:this.mode==="determinate",indeterminate:this.mode==="indeterminate"})}static \u0275fac=(()=>{let e;return function(i){return (e||(e=uy(t)))(i||t)}})();static \u0275cmp=WI({type:t,selectors:[["p-progressBar"],["p-progressbar"],["p-progress-bar"]],contentQueries:function(n,i,a){if(n&1&&yh(a,re,4)(a,cr,4),n&2){let s;qD(s=GD())&&(i.contentTemplate=s.first),qD(s=GD())&&(i.templates=s);}},hostAttrs:["role","progressbar"],hostVars:7,hostBindings:function(n,i){n&2&&(ah("aria-valuemin",0)("aria-valuenow",i.value)("aria-valuemax",100)("aria-level",i.value+i.unit)("data-p",i.dataP),cw(i.cn(i.cx("root"),i.styleClass)));},inputs:{value:[2,"value","value",OL],showValue:[2,"showValue","showValue",kL],styleClass:"styleClass",valueStyleClass:"valueStyleClass",unit:"unit",mode:"mode",color:"color"},features:[Mw([ee,{provide:te,useExisting:t},{provide:he,useExisting:t}]),nD([R]),th],decls:2,vars:2,consts:[[3,"class","pBind","width","display","background",4,"ngIf"],[3,"class","pBind","background",4,"ngIf"],[3,"pBind"],[3,"display",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,i){n&1&&rh(0,le,4,19,"div",0)(1,ce,1,6,"div",1),n&2&&(ch("ngIf",i.mode==="determinate"),fE(),ch("ngIf",i.mode==="indeterminate"));},dependencies:[fe,In,Pn,Pe,R],encapsulation:2})}return t})(),Ze=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=QI({type:t});static \u0275inj=bs({imports:[de,Pe,Pe]})}return t})();var ne=class t{constructor(r){this.zone=r;this.initializeSpeechRecognition();}zone;recognition;synthesis=window.speechSynthesis;state=new On({idle:true,listening:false,speaking:false,transcript:"",error:null});state$=this.state.asObservable();initializeSpeechRecognition(){let r=window.SpeechRecognition||webkitSpeechRecognition;r&&(this.recognition=new r,this.recognition.continuous=true,this.recognition.interimResults=true,this.recognition.lang="en-US",this.recognition.onstart=()=>{this.updateState({idle:false,listening:true,error:null});},this.recognition.onend=()=>{this.updateState({listening:false});},this.recognition.onresult=e=>{let n="",i="";for(let s=0;s<e.results.length;s++){let C=e.results[s][0].transcript;e.results[s].isFinal?n+=C:i+=C;}let a=n+i;this.updateState({transcript:a});},this.recognition.onerror=e=>{let n={"not-allowed":"Microphone permission denied.","audio-capture":"Microphone not found.",network:"Network error.","no-speech":"No speech detected.",aborted:"Recognition stopped."};this.updateState({idle:true,error:n[e.error]??"Speech recognition failed.",listening:false});});}startListening(r="en-US"){if(!this.recognition){this.updateState({error:"Speech recognition is not supported in this browser."});return}this.recognition.lang=r;try{this.recognition.start();}catch{}}stopListening(){this.recognition?.stop();}speak(r,e){if(!("speechSynthesis"in window)){this.updateState({error:"Text-to-Speech is not supported."});return}this.stopSpeaking();let n=new SpeechSynthesisUtterance(r);if(n.lang=e?.lang??"en-US",n.rate=e?.rate??1,n.pitch=e?.pitch??1,n.volume=e?.volume??1,e?.voiceName){let i=this.getVoices().find(a=>a.name===e.voiceName);i&&(n.voice=i);}n.onstart=()=>{this.updateState({speaking:true});},n.onend=()=>{this.updateState({speaking:false});},n.onerror=()=>{this.updateState({speaking:false,error:"Unable to speak."});},this.synthesis.speak(n);}stopSpeaking(){this.synthesis.cancel(),this.updateState({speaking:false});}pauseSpeaking(){this.synthesis.pause();}resumeSpeaking(){this.synthesis.resume();}getVoices(){return this.synthesis.getVoices()}isSpeechRecognitionSupported(){return !!this.recognition}isTextToSpeechSupported(){return "speechSynthesis"in window}updateState(r){this.zone.run(()=>{this.state.next(r$1(r$1({},this.state.value),r));});}setStateIdle(){this.updateState({idle:true});}static \u0275fac=function(e){return new(e||t)(ye(se$1))};static \u0275prov=ee$1({token:t,factory:t.\u0275fac,providedIn:"root"})};export{Ie as I,Ze as Z,de as d,ne as n};