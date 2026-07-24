import {ac as FI,ad as Es,ae as Pe,af as Y,E,aA as C,ag as R,aq as Xm,L as LI,g as fe$1,ax as zp,aS as _u,v as vi,b as th,F as Fc,K as KD,bf as mh,w as eh,c as tE,aN as Xp,U as mT,aB as he$1,aC as GI,bT as li,ak as oo,a0 as fg,bU as Nn,aI as H$1,X}from'./main-B5QUTO7D.js';var L=`
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
`;var j={root:()=>["p-progressspinner"],spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},F=(()=>{class e extends H$1{name="progressspinner";style=L;classes=j;static \u0275fac=(()=>{let n;return function(t){return (n||(n=Xm(e)))(t||e)}})();static \u0275prov=X({token:e,factory:e.\u0275fac})}return e})();var P=new C("PROGRESSSPINNER_INSTANCE"),H=(()=>{class e extends Y{componentName="ProgressSpinner";$pcProgressSpinner=E(P,{optional:true,skipSelf:true})??void 0;bindDirectiveInstance=E(R,{self:true});styleClass;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]));}_componentStyle=E(F);static \u0275fac=(()=>{let n;return function(t){return (n||(n=Xm(e)))(t||e)}})();static \u0275cmp=LI({type:e,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],hostVars:5,hostBindings:function(o,t){o&2&&(Xp("aria-label",t.ariaLabel)("role","progressbar")("aria-busy",true),KD(t.cn(t.cx("root"),t.styleClass)));},inputs:{styleClass:"styleClass",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[mT([F,{provide:P,useExisting:e},{provide:he$1,useExisting:e}]),GI([R]),zp],decls:2,vars:10,consts:[["viewBox","25 25 50 50",3,"pBind"],["cx","50","cy","50","r","20","stroke-miterlimit","10",3,"pBind"]],template:function(o,t){o&1&&(_u(),vi(0,"svg",0),th(1,"circle",1),Fc()),o&2&&(KD(t.cx("spin")),mh("animation-duration",t.animationDuration),eh("pBind",t.ptm("spin")),tE(),KD(t.cx("circle")),eh("pBind",t.ptm("circle")),Xp("fill",t.fill)("stroke-width",t.strokeWidth));},dependencies:[fe$1,Pe,R],encapsulation:2})}return e})(),te=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=FI({type:e});static \u0275inj=Es({imports:[H,Pe,Pe]})}return e})();var T=class e{apiUrl=`${li.apiUrl}`;http=E(oo);generateEvaluation(i){return this.http.post(`${this.apiUrl}/ai-evaluations`,i)}generateMockEvaluation(i){return this.http.post(`${this.apiUrl}/ai-evaluations/mock-evaluation`,i)}genrateFromTopic(i,n,o){return fg([{question:"Explain the concept of dependency injection in Java Spring Boot and how it enhances the maintainability of the application.",type:"technical",skill:"Java Spring Boot",level:"intermediate"},{question:"Can you describe a situation where you had to provide technical direction to a development team? How did you ensure the team adhered to architectural guidelines and best practices?",type:"behavioral",skill:"Leadership",level:"advanced"}])}generateFromJobDescription(i,n,o){return fg([{question:"How would you approach designing a scalable system landscape for currency adaptation in banknote processing machines, considering factors like security, maintainability, and performance?",type:"scenario",skill:"System Design",level:"advanced"},{question:"Explain the concept of dependency injection in Java Spring Boot and how it enhances the maintainability of the application.",type:"technical",skill:"Java Spring Boot",level:"intermediate"},{question:"Can you describe a situation where you had to provide technical direction to a development team? How did you ensure the team adhered to architectural guidelines and best practices?",type:"behavioral",skill:"Leadership",level:"advanced"},{question:"How do you optimize the performance of a Docker container in a Microsoft Azure environment, and what tools or methods do you use for monitoring?",type:"technical",skill:"Docker and Azure",level:"intermediate"},{question:"Tell me about a time when you had to troubleshoot a complex technical issue in a production environment. How did you resolve it, and what did you learn from the experience?",type:"behavioral",skill:"Problem Solving",level:"advanced"},{question:"Explain the differences between RDBMS and NoSQL databases, and how you would decide which to use in a given scenario.",type:"technical",skill:"Database Systems",level:"intermediate"},{question:"Describe your experience with Agile methodologies and how you contribute to Agile ceremonies. How do you ensure that technical documentation is up-to-date and relevant?",type:"behavioral",skill:"Agile Methodologies",level:"intermediate"},{question:"How do you approach the design of a full-stack application, integrating backend, frontend, and relational database systems? What considerations do you take into account for scalability and security?",type:"technical",skill:"Full-stack Development",level:"advanced"},{question:"Can you walk me through your process for conducting a code review, including what aspects you focus on and how you provide constructive feedback to the development team?",type:"behavioral",skill:"Code Review",level:"intermediate"},{question:"Explain how you would guide the implementation of a new technology, such as image processing or machine learning capabilities, within an existing application platform.",type:"scenario",skill:"Technical Innovation",level:"advanced"},{question:"Describe your experience with Angular and how you would lead the design and implementation of Angular components within a larger application framework.",type:"technical",skill:"Angular",level:"intermediate"}])}getAiGeneratedQuestion(i,n){return fg([{question:"Explain the concept of dependency injection in Java Spring Boot and how it enhances the maintainability of the application.",type:"technical",skill:"Java Spring Boot",level:"intermediate"},{question:"Can you describe a situation where you had to provide technical direction to a development team? How did you ensure the team adhered to architectural guidelines and best practices?",type:"behavioral",skill:"Leadership",level:"advanced"}])}static \u0275fac=function(n){return new(n||e)};static \u0275prov=Nn({token:e,factory:e.\u0275fac})};var de=["Frontend Developer","Backend Developer","Full-Stack Developer","Mobile Developer","Software Architect","UI/UX Designer","Project Manager","Scrum Master","Product Owner","QA Engineer","DevOps Engineer","Support Engineer","Security Engineer","Data Engineer","ML/AI Engineer"],ue=["Intern","Junior","Mid-Level","Senior","Lead","Principal","Architect"],he=["Explain concepts clearly","Give practical examples","Mention trade-offs","Speak confidently"],me=["Extract Required Skills","Generate Technical Questions","Behavioral Questions","Coding Questions","Difficulty Detection"];function ge(e,i){let n=document.createElement("a");return n.setAttribute("href",e),n.setAttribute("download",i),document.body.appendChild(n),n}function fe(e){switch(e=e?.toLowerCase()?.trim(),e){case "basic":return 1;case "intermediate":return 1.5;case "advanced":return 2;case "critical concept":return 3;default:return ""}}export{H,T,de as d,fe as f,ge as g,he as h,me as m,te as t,ue as u};