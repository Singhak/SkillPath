import { Injectable } from '@angular/core';
import { ParsedResumeResult } from './resume-parser.service';

export interface LackingArea {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface JobFitResult {
  fitScore: number; // 0 - 100
  verdict: 'Strong Match' | 'Good Fit' | 'Moderate Match' | 'Gap Identified';
  seniorityMatch: 'Perfect Match' | 'Slight Stretch' | 'Overqualified' | 'Underqualified';
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  experienceRequired: number;
  experienceCandidate: number;
  lackingAreas: LackingArea[];
  strengths: string[];
  recommendations: string[];
  atsKeywordMatchPercentage: number;
}

const COMMON_TECH_DICTIONARY = [
  'Angular', 'TypeScript', 'JavaScript', 'RxJS', 'HTML/CSS', 'HTML', 'CSS', 'Sass', 'LESS',
  'React', 'Next.js', 'Vue.js', 'Vue', 'Redux', 'Ngrx', 'TailwindCSS', 'Bootstrap',
  'Node.js', 'Node', 'Express.js', 'Express', 'NestJS', 'Python', 'Django', 'FastAPI', 'Flask',
  'Java', 'Spring Boot', 'Spring', 'C#', '.NET', 'ASP.NET', 'Go', 'Golang', 'PHP', 'Laravel',
  'REST API', 'RESTful APIs', 'GraphQL', 'gRPC', 'WebSockets', 'Microservices', 'System Design',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Sequelize', 'Prisma', 'TypeORM',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Cloud', 'DevOps', 'CI/CD', 'Git', 'GitHub', 'GitLab',
  'Unit Testing', 'Jest', 'Jasmine', 'Cypress', 'Playwright', 'Agile', 'Scrum', 'Jira',
  'Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'OpenAI', 'LLM'
];

@Injectable({
  providedIn: 'root',
})
export class JobFitService {

  calculateJobFit(
    jobDescription: string,
    candidateResume: ParsedResumeResult | null,
    userRole: string = '',
    experienceLevel: string = ''
  ): JobFitResult {
    const jdText = jobDescription || '';

    // 1. Extract Required Skills from Job Description
    const requiredSkills: string[] = [];
    for (const skill of COMMON_TECH_DICTIONARY) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(jdText)) {
        if (!requiredSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
          requiredSkills.push(skill);
        }
      }
    }

    if (requiredSkills.length === 0) {
      if (userRole) requiredSkills.push(userRole);
      requiredSkills.push('Problem Solving', 'Communication', 'Software Development');
    }

    // 2. Determine Required Experience from JD / Inputs
    let experienceRequired = 3;
    const expMatch = jdText.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
    if (expMatch && expMatch[1]) {
      const val = parseInt(expMatch[1], 10);
      if (!isNaN(val) && val > 0 && val <= 30) {
        experienceRequired = val;
      }
    } else {
      const levelLower = (experienceLevel || jdText).toLowerCase();
      if (levelLower.includes('senior') || levelLower.includes('lead')) experienceRequired = 5;
      else if (levelLower.includes('principal') || levelLower.includes('staff')) experienceRequired = 8;
      else if (levelLower.includes('junior') || levelLower.includes('entry')) experienceRequired = 1;
    }

    // Candidate Info
    const candidateSkills = candidateResume?.extractedSkills || ['TypeScript', 'JavaScript', 'HTML/CSS', 'Angular', 'Git'];
    const experienceCandidate = candidateResume?.experienceYears ?? 2;

    // 3. Match Skills
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const reqSkill of requiredSkills) {
      const reqLower = reqSkill.toLowerCase();
      const isMatched = candidateSkills.some(cSkill => {
        const cLower = cSkill.toLowerCase();
        return cLower === reqLower || cLower.includes(reqLower) || reqLower.includes(cLower);
      });

      if (isMatched) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    }

    // 4. Calculate Scores
    const skillRatio = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 0.8;
    const skillScore = Math.min(100, Math.round(skillRatio * 100));

    let expScore = 100;
    if (experienceCandidate < experienceRequired) {
      const diff = experienceRequired - experienceCandidate;
      expScore = Math.max(40, 100 - (diff * 15));
    }

    const fitScore = Math.min(99, Math.max(35, Math.round((skillScore * 0.70) + (expScore * 0.30))));

    // Verdict
    let verdict: 'Strong Match' | 'Good Fit' | 'Moderate Match' | 'Gap Identified' = 'Good Fit';
    if (fitScore >= 82) verdict = 'Strong Match';
    else if (fitScore >= 68) verdict = 'Good Fit';
    else if (fitScore >= 50) verdict = 'Moderate Match';
    else verdict = 'Gap Identified';

    // Seniority Match
    let seniorityMatch: 'Perfect Match' | 'Slight Stretch' | 'Overqualified' | 'Underqualified' = 'Perfect Match';
    if (experienceCandidate >= experienceRequired + 4) seniorityMatch = 'Overqualified';
    else if (experienceCandidate >= experienceRequired) seniorityMatch = 'Perfect Match';
    else if (experienceRequired - experienceCandidate <= 2) seniorityMatch = 'Slight Stretch';
    else seniorityMatch = 'Underqualified';

    // 5. Strengths
    const strengths: string[] = [];
    if (matchedSkills.length > 0) {
      strengths.push(`Core Skill Alignment: Strong match in ${matchedSkills.slice(0, 3).join(', ')}.`);
    }
    if (experienceCandidate >= experienceRequired) {
      strengths.push(`Experience Level: Meets or exceeds the required ${experienceRequired}+ years of experience.`);
    } else {
      strengths.push(`Hands-on Experience: Practical background in active candidate projects.`);
    }
    if (candidateResume?.atsScore && candidateResume.atsScore >= 75) {
      strengths.push(`Resume Quality: Strong ATS resume structure and technical bio.`);
    }

    // 6. Lacking Areas & Gaps
    const lackingAreas: LackingArea[] = [];

    if (missingSkills.length > 0) {
      lackingAreas.push({
        title: 'Missing Technical Keywords',
        description: `The Job Description emphasizes ${missingSkills.slice(0, 4).join(', ')}, which were not prominently highlighted in your uploaded resume profile.`,
        severity: missingSkills.length >= 3 ? 'high' : 'medium',
      });
    }

    if (experienceCandidate < experienceRequired) {
      const gap = experienceRequired - experienceCandidate;
      lackingAreas.push({
        title: 'Experience Duration Gap',
        description: `Role requests approx. ${experienceRequired} years of experience, whereas your profile lists ~${experienceCandidate} years (${gap} yr difference).`,
        severity: gap > 2 ? 'high' : 'medium',
      });
    }

    if (lackingAreas.length === 0) {
      lackingAreas.push({
        title: 'Interview Preparation Edge',
        description: 'Your profile matches the core requirements well! Focus on presenting deep architecture and behavioral STAR scenario examples.',
        severity: 'low',
      });
    }

    // 7. Recommendations
    const recommendations: string[] = [];

    if (missingSkills.length > 0) {
      recommendations.push(`Prepare answers showing your familiarity or transferable concepts related to missing skills like ${missingSkills.slice(0, 3).join(', ')}.`);
    }

    if (experienceCandidate < experienceRequired) {
      recommendations.push('Emphasize high-impact deliverables, lead responsibilities, and project complexity to demonstrate senior-level capability.');
    }

    recommendations.push(`In your interview answers, directly use technical terms from the JD such as ${requiredSkills.slice(0, 4).join(', ')}.`);
    recommendations.push('Practice scenario and architectural questions tailored to this role to boost interviewer confidence.');

    const atsKeywordMatchPercentage = Math.min(100, Math.max(30, Math.round((matchedSkills.length / Math.max(1, requiredSkills.length)) * 100)));

    return {
      fitScore,
      verdict,
      seniorityMatch,
      requiredSkills,
      matchedSkills,
      missingSkills,
      experienceRequired,
      experienceCandidate,
      lackingAreas,
      strengths,
      recommendations,
      atsKeywordMatchPercentage,
    };
  }
}
