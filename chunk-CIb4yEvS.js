import {bm as On,r,bn as ye,ab as ae$1,e as ee,U as JI,W as bs,$ as st,a0 as z,I,a1 as C,a2 as Ue,aB as hy,Y as YI,ac as oh,ad as PL,ae as LL,b as rr,af as Wn,ag as Zn,s as sh,n as dh,m as mE,y as kw,aj as at,ak as sD,P as uh,aJ as pw,al as Ih,d as rt,Z as ZD,z as YD,aA as A,T as Ti,G as Gc,an as qD,M as Mh,aI as Pw,g as fh,h as Tw,ao as jh,aH as gh}from'./main-H2DRMQCD.js';var K=`
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
`;var te=["content"],ne=t=>({$implicit:t});function ie(t,r){if(t&1&&(Ti(0,"div"),Tw(1),Gc()),t&2){let e=qD(2);Mh("display",e.value!=null&&e.value!==0?"flex":"none"),mE(),jh("",e.value,"",e.unit);}}function re(t,r){t&1&&gh(0);}function se(t,r){if(t&1&&(Ti(0,"div",2)(1,"div",2),sh(2,ie,2,4,"div",3)(3,re,1,0,"ng-container",4),Gc()()),t&2){let e=qD();pw(e.cn(e.cx("value"),e.valueStyleClass)),Mh("width",e.value+"%")("display","flex")("background",e.color),dh("pBind",e.ptm("value")),uh("data-p",e.dataP),mE(),pw(e.cx("label")),dh("pBind",e.ptm("label")),uh("data-p",e.dataP),mE(),dh("ngIf",e.showValue&&!e.contentTemplate&&!e._contentTemplate),mE(),dh("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Pw(17,ne,e.value));}}function ae(t,r){if(t&1&&fh(0,"div",2),t&2){let e=qD();pw(e.cn(e.cx("value"),e.valueStyleClass)),Mh("background",e.color),dh("pBind",e.ptm("value")),uh("data-p",e.dataP);}}var oe={root:({instance:t})=>["p-progressbar p-component",{"p-progressbar-determinate":t.mode=="determinate","p-progressbar-indeterminate":t.mode=="indeterminate"}],value:"p-progressbar-value",label:"p-progressbar-label"},W=(()=>{class t extends A{name="progressbar";style=K;classes=oe;static \u0275fac=(()=>{let e;return function(i){return (e||(e=hy(t)))(i||t)}})();static \u0275prov=ee({token:t,factory:t.\u0275fac})}return t})();var X=new C("PROGRESSBAR_INSTANCE"),le=(()=>{class t extends z{componentName="ProgressBar";$pcProgressBar=I(X,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=I(Ue,{self:true});value;showValue=true;styleClass;valueStyleClass;unit="%";mode="determinate";color;contentTemplate;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}_componentStyle=I(W);templates;_contentTemplate;onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="content"?this._contentTemplate=e.template:this._contentTemplate=e.template;});}get dataP(){return this.cn({determinate:this.mode==="determinate",indeterminate:this.mode==="indeterminate"})}static \u0275fac=(()=>{let e;return function(i){return (e||(e=hy(t)))(i||t)}})();static \u0275cmp=YI({type:t,selectors:[["p-progressBar"],["p-progressbar"],["p-progress-bar"]],contentQueries:function(n,i,o){if(n&1&&Ih(o,te,4)(o,rt,4),n&2){let s;ZD(s=YD())&&(i.contentTemplate=s.first),ZD(s=YD())&&(i.templates=s);}},hostAttrs:["role","progressbar"],hostVars:7,hostBindings:function(n,i){n&2&&(uh("aria-valuemin",0)("aria-valuenow",i.value)("aria-valuemax",100)("aria-level",i.value+i.unit)("data-p",i.dataP),pw(i.cn(i.cx("root"),i.styleClass)));},inputs:{value:[2,"value","value",LL],showValue:[2,"showValue","showValue",PL],styleClass:"styleClass",valueStyleClass:"valueStyleClass",unit:"unit",mode:"mode",color:"color"},features:[kw([W,{provide:X,useExisting:t},{provide:at,useExisting:t}]),sD([Ue]),oh],decls:2,vars:2,consts:[[3,"class","pBind","width","display","background",4,"ngIf"],[3,"class","pBind","background",4,"ngIf"],[3,"pBind"],[3,"display",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,i){n&1&&sh(0,se,4,19,"div",0)(1,ae,1,6,"div",1),n&2&&(dh("ngIf",i.mode==="determinate"),mE(),dh("ngIf",i.mode==="indeterminate"));},dependencies:[rr,Wn,Zn,st,Ue],encapsulation:2})}return t})(),Be=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=JI({type:t});static \u0275inj=bs({imports:[le,st,st]})}return t})();var Y=class t{constructor(r){this.zone=r;this.initializeSpeechRecognition();}zone;recognition;synthesis=window.speechSynthesis;state=new On({idle:true,listening:false,speaking:false,transcript:"",error:null});state$=this.state.asObservable();initializeSpeechRecognition(){let r=window.SpeechRecognition||webkitSpeechRecognition;r&&(this.recognition=new r,this.recognition.continuous=true,this.recognition.interimResults=true,this.recognition.lang="en-US",this.recognition.onstart=()=>{this.updateState({idle:false,listening:true,error:null});},this.recognition.onend=()=>{this.updateState({listening:false});},this.recognition.onresult=e=>{let n="",i="";for(let s=0;s<e.results.length;s++){let x=e.results[s][0].transcript;e.results[s].isFinal?n+=x:i+=x;}let o=n+i;this.updateState({transcript:o});},this.recognition.onerror=e=>{let n={"not-allowed":"Microphone permission denied.","audio-capture":"Microphone not found.",network:"Network error.","no-speech":"No speech detected.",aborted:"Recognition stopped."};this.updateState({idle:true,error:n[e.error]??"Speech recognition failed.",listening:false});});}startListening(r="en-US"){if(!this.recognition){this.updateState({error:"Speech recognition is not supported in this browser."});return}this.recognition.lang=r;try{this.recognition.start();}catch{}}stopListening(){this.recognition?.stop();}speak(r,e){if(!("speechSynthesis"in window)){this.updateState({error:"Text-to-Speech is not supported."});return}this.stopSpeaking();let n=new SpeechSynthesisUtterance(r);if(n.lang=e?.lang??"en-US",n.rate=e?.rate??1,n.pitch=e?.pitch??1,n.volume=e?.volume??1,e?.voiceName){let i=this.getVoices().find(o=>o.name===e.voiceName);i&&(n.voice=i);}n.onstart=()=>{this.updateState({speaking:true});},n.onend=()=>{this.updateState({speaking:false});},n.onerror=()=>{this.updateState({speaking:false,error:"Unable to speak."});},this.synthesis.speak(n);}stopSpeaking(){this.synthesis.cancel(),this.updateState({speaking:false});}pauseSpeaking(){this.synthesis.pause();}resumeSpeaking(){this.synthesis.resume();}getVoices(){return this.synthesis.getVoices()}isSpeechRecognitionSupported(){return !!this.recognition}isTextToSpeechSupported(){return "speechSynthesis"in window}updateState(r$1){this.zone.run(()=>{this.state.next(r(r({},this.state.value),r$1));});}setStateIdle(){this.updateState({idle:true});}static \u0275fac=function(e){return new(e||t)(ye(ae$1))};static \u0275prov=ee({token:t,factory:t.\u0275fac,providedIn:"root"})};export{Be as B,Y,le as l};