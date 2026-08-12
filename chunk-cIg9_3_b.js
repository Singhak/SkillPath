import {d}from'./chunk-DH8f7sYN.js';import {I,H as Dn,a0 as g,S,O as n,n as ne}from'./main-UMGO3TEL.js';var u=class c{http=I(Dn);userResourceService=I(g);authService=I(S);apiUrl=`${n.apiUrl}/interviews/reports`;getUserReports(e){let o=e?`${this.apiUrl}?category=${e}`:this.apiUrl;return this.http.get(o)}getReportByShareToken(e){return this.http.get(`${this.apiUrl}/share/${e}`)}sendWeeklyDigestEmail(){return this.http.post(`${this.apiUrl}/send-weekly-digest`,{})}createReportData(e){let o="RPT-"+Math.floor(1e5+Math.random()*9e5),r=btoa(o+"-"+Date.now()).substring(0,16),n={reportId:o,sessionId:"SESS-"+Date.now().toString().slice(-6),userName:e.userName||"Candidate User",userEmail:e.userEmail||"",roleOrSkill:e.roleOrSkill||"Technical Practice",date:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),overallScore:e.overallScore,technicalAccuracyScore:e.technicalAccuracyScore??e.overallScore,communicationScore:e.communicationScore??e.overallScore,confidenceScore:e.confidenceScore??e.overallScore,problemSolvingScore:e.problemSolvingScore??e.overallScore,category:e.category||"mock",technologyScores:e.technologyScores||[],categoryScores:e.categoryScores||[],detailedQuestionScores:e.detailedQuestionScores||[],summaryFeedback:e.summaryFeedback||"Completed evaluation session.",strengths:e.strengths||[],improvementAreas:e.improvementAreas||[],recommendedTopics:e.recommendedTopics||[],shareToken:r};return e.saveToBackend!==false&&e.summaryFeedback&&this.http.post(this.apiUrl,n).subscribe({error:()=>{}}),n}downloadLearnerProgressReport(e){let o=window.open("","_blank");if(!o)return  false;let r=e.topicScores&&e.topicScores.length>0?e.topicScores.map(t=>`
        <tr>
          <td style="font-weight:600;">${t.topic}</td>
          <td>
            <div style="background:#e2e8f0; border-radius:10px; height:8px; width:100%; overflow:hidden; display:inline-block; vertical-align:middle; margin-right:8px; max-width:120px;">
              <div style="background: linear-gradient(90deg, #4f46e5, #7c3aed); width: ${t.score}%; height:100%;"></div>
            </div>
            <strong>${t.score}%</strong>
          </td>
          <td><span style="background:${t.score>=80?"#dcfce7":t.score>=60?"#fef9c3":"#fee2e2"}; color:${t.score>=80?"#166534":t.score>=60?"#854d0e":"#991b1b"}; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700;">${t.status}</span></td>
        </tr>
      `).join(""):`
        <tr>
          <td colspan="3" style="text-align:center; padding: 18px 14px; background:#f8fafc;">
            <div style="font-weight:700; color:#334155; font-size:13px; margin-bottom:4px;">No topic practice or skill ratings recorded yet</div>
            <div style="font-size:12px; color:#64748b;">
              Evaluate your skills or take practice quizzes in the app to populate your proficiency report scores.<br>
              <strong>\u{1F449} Go to Section:</strong> 
              <a href="/skill-rate" style="color:#4f46e5; text-decoration:underline; font-weight:600; margin-right:12px;">Skill Rating (/skill-rate)</a>
              <a href="/quiz-view" style="color:#4f46e5; text-decoration:underline; font-weight:600;">Practice Quizzes (/quiz-view)</a>
            </div>
          </td>
        </tr>
      `,n=e.recentInterviews&&e.recentInterviews.length>0?e.recentInterviews.map(t=>{let i=(t.category||"MOCK").toUpperCase();return `
          <tr>
            <td>
              <span style="background:${i==="REAL"?"#e0e7ff":i==="PRACTICE"?"#fef3c7":"#dcfce7"}; color:${i==="REAL"?"#3730a3":i==="PRACTICE"?"#92400e":"#166534"}; padding:2px 7px; border-radius:6px; font-size:10px; font-weight:700; margin-right:6px; text-transform:uppercase;">${i}</span>
              <strong>${t.role}</strong>
              <br><small style="color:#64748b;">${t.date}</small>
            </td>
            <td style="font-size:16px; font-weight:800; color:#4f46e5;">${t.score}%</td>
            <td style="color:#334155;">${t.feedback}</td>
          </tr>
        `}).join(""):`
        <tr>
          <td colspan="3" style="text-align:center; padding: 18px 14px; background:#f8fafc;">
            <div style="font-weight:700; color:#334155; font-size:13px; margin-bottom:4px;">No AI Mock Interview sessions recorded yet</div>
            <div style="font-size:12px; color:#64748b;">
              Take an AI Mock Interview session to log evaluation scores, AI feedback, and interview performance history.<br>
              <strong>\u{1F449} Go to Section:</strong> 
              <a href="/interviews/create" style="color:#4f46e5; text-decoration:underline; font-weight:600;">Start AI Mock Interview (/interviews/create)</a>
            </div>
          </td>
        </tr>
      `,s=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),l=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>IMONBENCH Weekly Performance & Progress Report - ${e.userName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            color: #0f172a;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .brand {
            font-size: 26px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .report-badge {
            background: #e0e7ff;
            color: #3730a3;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          .hero-card {
            background: linear-gradient(135deg, #1e1b4b, #312e81, #4338ca);
            color: white;
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 24px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin-bottom: 24px;
          }
          .stat-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 16px;
            border-radius: 12px;
            text-align: center;
          }
          .stat-val {
            font-size: 22px;
            font-weight: 800;
            color: #4f46e5;
          }
          .table-style {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .table-style th {
            background: #f1f5f9;
            text-align: left;
            padding: 10px 14px;
            font-size: 12px;
            font-weight: 700;
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
          }
          .table-style td {
            padding: 10px 14px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          .section-title {
            font-size: 17px;
            font-weight: 700;
            color: #0f172a;
            margin: 20px 0 12px 0;
            border-left: 4px solid #4f46e5;
            padding-left: 10px;
          }
          ul {
            padding-left: 20px;
            line-height: 1.6;
            color: #334155;
          }
          .footer {
            margin-top: 36px;
            padding-top: 18px;
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
          <div class="report-badge">Learner Weekly Performance Summary</div>
        </div>

        <div class="hero-card">
          <div style="font-size: 22px; font-weight: 800; margin-bottom: 4px;">${e.userName}</div>
          <div style="font-size: 14px; opacity: 0.9;">Target Role: <strong>${e.targetRole}</strong> | Plan: <strong>${e.userPlan} Plan</strong> | Report Date: <strong>${s}</strong></div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Current Level</div>
            <div class="stat-val">Lvl ${e.level}</div>
            <div style="font-size: 11px; color: #475569;">${e.levelTitle}</div>
          </div>
          <div class="stat-box">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Total XP Points</div>
            <div class="stat-val">${e.totalXp} XP</div>
            <div style="font-size: 11px; color: #475569;">${e.unlockedBadgesCount} Badges</div>
          </div>
          <div class="stat-box">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Practice Streak</div>
            <div class="stat-val">\u{1F525} ${e.currentStreak} Days</div>
            <div style="font-size: 11px; color: #475569;">Active Consistency</div>
          </div>
          <div class="stat-box">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Quizzes & Practice</div>
            <div class="stat-val">\u{1F3AF} ${e.quizCompletedCount}</div>
            <div style="font-size: 11px; color: #475569;">Sessions Completed</div>
          </div>
        </div>

        <div class="section-title">Topic-Wise Practice & Skill Proficiency</div>
        <table class="table-style">
          <thead>
            <tr>
              <th>Topic / Skill Category</th>
              <th>Mastery Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${r}
          </tbody>
        </table>

        <div class="section-title">Mock Interview History</div>
        <table class="table-style">
          <thead>
            <tr>
              <th>Interview Session</th>
              <th>Score</th>
              <th>Evaluator Feedback / Key Notes</th>
            </tr>
          </thead>
          <tbody>
            ${n}
          </tbody>
        </table>

        <div class="section-title">Verified Key Strengths</div>
        ${e.strengths&&e.strengths.length>0?`<ul>${e.strengths.map(t=>`<li>${t}</li>`).join("")}</ul>`:`
              <div style="padding: 12px 16px; background:#f8fafc; border: 1px dashed #cbd5e1; border-radius:8px; font-size:12px; color:#64748b;">
                No verified strengths logged yet. Complete quizzes at <a href="/quiz-view" style="color:#4f46e5; font-weight:600;">Practice Quizzes (/quiz-view)</a> or rate your skills at <a href="/skill-rate" style="color:#4f46e5; font-weight:600;">Skill Rating (/skill-rate)</a> to build your performance profile.
              </div>
            `}

        <div class="section-title">Recommended AI Weekly Focus Topics</div>
        ${e.recommendedFocusTopics&&e.recommendedFocusTopics.length>0?`<ul>${e.recommendedFocusTopics.map(t=>`<li>${t}</li>`).join("")}</ul>`:`
              <div style="padding: 12px 16px; background:#f8fafc; border: 1px dashed #cbd5e1; border-radius:8px; font-size:12px; color:#64748b;">
                No personalized focus recommendations generated yet. Rate your technical skills at <a href="/skill-rate" style="color:#4f46e5; font-weight:600;">Skill Rating (/skill-rate)</a> to receive AI recommendations.
              </div>
            `}

        <div class="footer">
          <p>Generated automatically by IMONBENCH AI Learning & Assessment Platform | ${e.userEmail}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>
      </body>
      </html>
    `;return o.document.open(),o.document.write(l),o.document.close(),true}downloadPdfReport(e,o=false){let r=d.AI_PDF_REPORT_GENERATION,n=(this.userResourceService.freeCredits()||0)+(this.userResourceService.paidCredits()||0);if(n<r)return alert(`Insufficient AI Credits. Generating an AI PDF Evaluation Report requires ${r} AI Credit(s). Available: ${n}`),false;this.authService.decrementAiCredits(r).subscribe();let s=window.open("","_blank");if(!s)return  false;let l=o?`<div style="background: #fef3c7; color: #92400e; border: 2px dashed #f59e0b; padding: 12px 16px; border-radius: 10px; font-weight: 700; text-align: center; margin-bottom: 24px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">
          \u26A0\uFE0F SAMPLE DEMO REPORT - FOR FORMAT PREVIEW ONLY (NOT AN OFFICIAL CANDIDATE EVALUATION)
        </div>`:"",t=`
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

        ${l}

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
            ${e.strengths.map(i=>`<li>${i}</li>`).join("")}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Growth & Targeted Focus Areas</div>
          <ul>
            ${e.improvementAreas.map(i=>`<li>${i}</li>`).join("")}
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
    `;return s.document.open(),s.document.write(t),s.document.close(),true}static \u0275fac=function(o){return new(o||c)};static \u0275prov=ne({token:c,factory:c.\u0275fac,providedIn:"root"})};export{u};