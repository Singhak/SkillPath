import {u}from'./chunk-CgKncUux.js';import {I,C as pn,R as g,S,E as e,e as ee}from'./main-H2DRMQCD.js';var v=class n{http=I(pn);userResourceService=I(g);authService=I(S);apiUrl=`${e.apiUrl}/interviews/reports`;createReportData(e){let i="RPT-"+Math.floor(1e5+Math.random()*9e5),r=btoa(i+"-"+Date.now()).substring(0,16),t={reportId:i,sessionId:"SESS-"+Date.now().toString().slice(-6),userName:e.userName||"Candidate User",userEmail:e.userEmail||"info@imonbench.app",roleOrSkill:e.roleOrSkill||"Full Stack Engineer",date:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),overallScore:e.overallScore,technicalAccuracyScore:e.technicalAccuracyScore??e.overallScore,communicationScore:e.communicationScore??e.overallScore,confidenceScore:e.confidenceScore??e.overallScore,summaryFeedback:e.summaryFeedback||"The candidate demonstrated strong foundational knowledge and clear communication throughout the session.",strengths:e.strengths||["Clear articulation of core technical concepts","Effective scenario analysis and problem breakdown"],improvementAreas:e.improvementAreas||["Could provide more concrete production examples"],recommendedTopics:e.recommendedTopics||["Advanced System Architecture","Performance Optimization"],shareToken:r};return this.http.post(this.apiUrl,t).subscribe({error:()=>{}}),t}downloadPdfReport(e){let i=u.AI_PDF_REPORT_GENERATION,r=(this.userResourceService.freeCredits()||0)+(this.userResourceService.paidCredits()||0);if(r<i)return alert(`Insufficient AI Credits. Generating an AI PDF Evaluation Report requires ${i} AI Credit(s). Available: ${r}`),false;this.authService.decrementAiCredits(i).subscribe();let t=window.open("","_blank");if(!t)return  false;let f=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>IMONBENCH Performance Evaluation Report - ${e.userName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            color: #1e293b;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand {
            font-size: 28px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .report-badge {
            background: #e0e7ff;
            color: #3730a3;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
          .score-card {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 24px;
            border-radius: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          .score-num {
            font-size: 48px;
            font-weight: 900;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 30px;
          }
          .metric-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 16px;
            border-radius: 12px;
            text-align: center;
          }
          .metric-val {
            font-size: 24px;
            font-weight: 700;
            color: #4f46e5;
          }
          .section {
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 10px;
            border-left: 4px solid #6366f1;
            padding-left: 10px;
          }
          ul {
            padding-left: 20px;
            line-height: 1.6;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">\u26A1 IMONBENCH AI</div>
          <div class="report-badge">Report ID: ${e.reportId}</div>
        </div>

        <h1 style="margin: 0 0 6px 0;">Official Performance Evaluation</h1>
        <p style="color: #64748b; margin-top: 0;">Candidate: <strong>${e.userName}</strong> | Role/Skill: <strong>${e.roleOrSkill}</strong> | Date: ${e.date}</p>

        <div class="score-card">
          <div>
            <div style="font-size: 14px; opacity: 0.9; text-transform: uppercase;">Overall Assessment Score</div>
            <div style="font-size: 18px; font-weight: 600;">Grade: ${e.overallScore>=80?"EXCELLENT":e.overallScore>=60?"PROFICIENT":"DEVELOPING"}</div>
          </div>
          <div class="score-num">${e.overallScore}%</div>
        </div>

        <div class="metrics-grid">
          <div class="metric-box">
            <div style="font-size: 12px; color: #64748b;">Technical Accuracy</div>
            <div class="metric-val">${e.technicalAccuracyScore}%</div>
          </div>
          <div class="metric-box">
            <div style="font-size: 12px; color: #64748b;">Communication Clarity</div>
            <div class="metric-val">${e.communicationScore}%</div>
          </div>
          <div class="metric-box">
            <div style="font-size: 12px; color: #64748b;">Confidence Level</div>
            <div class="metric-val">${e.confidenceScore}%</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Executive Summary</div>
          <p style="line-height: 1.7; color: #334155;">${e.summaryFeedback}</p>
        </div>

        <div class="section">
          <div class="section-title">Verified Key Strengths</div>
          <ul>
            ${e.strengths.map(c=>`<li>${c}</li>`).join("")}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Growth & Targeted Focus Areas</div>
          <ul>
            ${e.improvementAreas.map(c=>`<li>${c}</li>`).join("")}
          </ul>
        </div>

        <div class="footer">
          <p>Verified by IMONBENCH AI Assessment Engine | Share Token: ${e.shareToken}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>
      </body>
      </html>
    `;return t.document.open(),t.document.write(f),t.document.close(),true}static \u0275fac=function(i){return new(i||n)};static \u0275prov=ee({token:n,factory:n.\u0275fac,providedIn:"root"})};export{v};