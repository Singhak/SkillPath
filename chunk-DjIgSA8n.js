import {ac as FI,ad as Es,ae as Pe,af as Y,E,aA as C,ag as R,aq as Xm,L as LI,g as fe$1,ax as zp,aS as _u,v as vi,b as th,F as Fc,K as KD,bf as mh,w as eh,c as tE,aN as Xp,U as mT,aB as he,aC as GI,bT as li,ak as oo,bU as Nn,aI as H,X}from'./main-EOBJMA6P.js';var F=`
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`;var O={root:()=>["p-progressspinner"],spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},P=(()=>{class e extends H{name="progressspinner";style=F;classes=O;static \u0275fac=(()=>{let n;return function(t){return (n||(n=Xm(e)))(t||e)}})();static \u0275prov=X({token:e,factory:e.\u0275fac})}return e})();var T=new C("PROGRESSSPINNER_INSTANCE"),U=(()=>{class e extends Y{componentName="ProgressSpinner";$pcProgressSpinner=E(T,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=E(R,{self:true});styleClass;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}_componentStyle=E(P);static \u0275fac=(()=>{let n;return function(t){return (n||(n=Xm(e)))(t||e)}})();static \u0275cmp=LI({type:e,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],hostVars:5,hostBindings:function(i,t){i&2&&(Xp("aria-label",t.ariaLabel)("role","progressbar")("aria-busy",true),KD(t.cn(t.cx("root"),t.styleClass)));},inputs:{styleClass:"styleClass",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[mT([P,{provide:T,useExisting:e},{provide:he,useExisting:e}]),GI([R]),zp],decls:2,vars:10,consts:[["viewBox","25 25 50 50",3,"pBind"],["cx","50","cy","50","r","20","stroke-miterlimit","10",3,"pBind"]],template:function(i,t){i&1&&(_u(),vi(0,"svg",0),th(1,"circle",1),Fc()),i&2&&(KD(t.cx("spin")),mh("animation-duration",t.animationDuration),eh("pBind",t.ptm("spin")),tE(),KD(t.cx("circle")),eh("pBind",t.ptm("circle")),Xp("fill",t.fill)("stroke-width",t.strokeWidth));},dependencies:[fe$1,Pe,R],encapsulation:2})}return e})(),ne=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=FI({type:e});static \u0275inj=Es({imports:[U,Pe,Pe]})}return e})();var L=class e{apiUrl=`${li.apiUrl}`;http=E(oo);generateEvaluation(r){return this.http.post(`${this.apiUrl}/ai-evaluations`,r)}generateMockEvaluation(r){return this.http.post(`${this.apiUrl}/ai-evaluations/mock-evaluation`,r)}genrateFromTopic(r,n,i){return this.http.post(`${this.apiUrl}/ai-question-sets/from-topic`,{topic:r,userRole:n,experienceLevel:i})}generateFromJobDescription(r,n,i){return this.http.post(`${this.apiUrl}/ai-question-sets/from-job-description`,{jobDescription:r,userRole:n,experienceLevel:i})}getAiGeneratedQuestion(r,n){return this.http.get(`${this.apiUrl}/ai-questions`,{params:{type:r,level:n}})}static \u0275fac=function(n){return new(n||e)};static \u0275prov=Nn({token:e,factory:e.\u0275fac})};var pe=["Frontend Developer","Backend Developer","Full-Stack Developer","Mobile Developer","Software Architect","UI/UX Designer","Project Manager","Scrum Master","Product Owner","QA Engineer","DevOps Engineer","Support Engineer","Security Engineer","Data Engineer","ML/AI Engineer"],ce=["Intern","Junior","Mid-Level","Senior","Lead","Principal","Architect"],le=["Explain concepts clearly","Give practical examples","Mention trade-offs","Speak confidently"],ue=["Extract Required Skills","Generate Technical Questions","Behavioral Questions","Coding Questions","Difficulty Detection"];function de(e,r){let n=document.createElement("a");return n.setAttribute("href",e),n.setAttribute("download",r),document.body.appendChild(n),n}function fe(e){switch(e=e?.toLowerCase()?.trim(),e){case "basic":return 1;case "intermediate":return 1.5;case "advanced":return 2;case "critical concept":return 3;default:return ""}}export{L,U,ce as c,de as d,fe as f,le as l,ne as n,pe as p,ue as u};