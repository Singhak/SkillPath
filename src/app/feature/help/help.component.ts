import { Component, computed, signal, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface FeatureGuide {
  id: string;
  title: string;
  category: 'interview' | 'learning' | 'analytics' | 'customization';
  badge: string;
  badgeType: 'hot' | 'primary' | 'success' | 'info';
  icon: string;
  description: string;
  timeCommitment: string;
  targetAudience: string;
  route: string;
  useCases: string[];
  howToSteps: { step: number; title: string; detail: string; icon: string }[];
  proTip: string;
  expectedOutput: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'interview' | 'scoring' | 'technical' | 'billing';
  expanded?: boolean;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css',
})
export class HelpComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  // Navigation & Search Signals
  readonly searchQuery = signal<string>('');
  readonly activeCategory = signal<string>('all');
  readonly activeSection = signal<'overview' | 'workflow' | 'features' | 'comparison' | 'faq' | 'star'>('overview');
  readonly selectedFeatureId = signal<string>('ai-interview');
  readonly expandedFaqId = signal<number | null>(1);

  // Dynamic Category Counts
  readonly countAll = computed(() => this.features.length);
  readonly countInterview = computed(() => this.features.filter((f) => f.category === 'interview').length);
  readonly countLearning = computed(() => this.features.filter((f) => f.category === 'learning').length);
  readonly countAnalytics = computed(() => this.features.filter((f) => f.category === 'analytics').length);
  readonly countCustomization = computed(() => this.features.filter((f) => f.category === 'customization').length);

  // Workflow Diagram Nodes
  readonly workflowNodes = [
    {
      step: 1,
      title: 'Job Profile & Resume Input',
      desc: 'Paste JD text, upload PDF/Image resume, or load STAR story bank',
      icon: 'pi pi-file-import',
      badge: 'Input Phase',
    },
    {
      step: 2,
      title: 'AI Extraction & Studio Setup',
      desc: 'AI parses key skills, seniority, or custom interviewer persona',
      icon: 'pi pi-spin pi-cog',
      badge: 'Processing',
    },
    {
      step: 3,
      title: 'Interactive Audio & Text Session',
      desc: 'Live mic recording, speech clarity analysis, & copilot mode',
      icon: 'pi pi-microphone',
      badge: 'Execution',
    },
    {
      step: 4,
      title: 'STAR Method AI Evaluation',
      desc: 'Instant scoring, detailed STAR breakdown, & model answer',
      icon: 'pi pi-chart-line',
      badge: 'Analysis',
    },
    {
      step: 5,
      title: 'XP Rewards & Skill Mastery',
      desc: 'Earn XP points, unlock badges, upgrade skill radar & flashcards',
      icon: 'pi pi-trophy',
      badge: 'Mastery',
    },
  ];

  // Comprehensive Feature Guides
  readonly features: FeatureGuide[] = [
    {
      id: 'ai-interview',
      title: 'AI Mock Interview Simulator',
      category: 'interview',
      badge: 'CORE FEATURE',
      badgeType: 'hot',
      icon: 'pi pi-microchip-ai',
      description: 'Simulates real-world technical and behavioral interviews with an interactive AI interviewer. Offers live audio microphone recording, real-time speech analytics, text response input, instant feedback, and STAR-based scoring.',
      timeCommitment: '15 - 30 Mins',
      targetAudience: 'Job seekers, Developers preparing for company interviews',
      route: '/aiinterview',
      useCases: [
        'Preparing for an upcoming technical or behavioral interview for a specific job posting.',
        'Practicing verbal articulation under time pressure with audio voice answers.',
        'Getting objective, AI-driven evaluation on answer structure (STAR method).',
        'Identifying knowledge gaps in technical concepts before real candidate screenings.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Navigate to AI Interview',
          detail: 'Click "AI Interview" in the sidebar menu under Preparation.',
          icon: 'pi pi-compass',
        },
        {
          step: 2,
          title: 'Provide Role Details or Paste JD',
          detail: 'Choose "Job Profile" to paste a Job Description text or upload a PDF/Image of the job posting.',
          icon: 'pi pi-file-edit',
        },
        {
          step: 3,
          title: 'Configure Role Level',
          detail: 'Select role seniority (Beginner, Intermediate, Senior, Lead) and tech stack priorities.',
          icon: 'pi pi-sliders-h',
        },
        {
          step: 4,
          title: 'Start Practice Session',
          detail: 'Click "Generate Questions" to launch your custom AI mock session.',
          icon: 'pi pi-play-circle',
        },
        {
          step: 5,
          title: 'Answer via Voice or Text',
          detail: 'Read or listen to the AI question, then record your voice answer or type your response.',
          icon: 'pi pi-microphone',
        },
        {
          step: 6,
          title: 'Review Score & AI Feedback',
          detail: 'Receive immediate performance scores, STAR breakdown, missing points, and model answers.',
          icon: 'pi pi-check-square',
        },
      ],
      proTip: 'Use the voice recording mode to practice speaking confidently. Format behavioral answers using STAR: Situation, Task, Action, Result.',
      expectedOutput: 'Detailed Scorecard (0-100), STAR method rating, missing key technical points, and improved model answer recommendation.',
    },
    {
      id: 'jd-parser',
      title: 'Job Description & Resume Parser',
      category: 'interview',
      badge: 'AI POWERED',
      badgeType: 'primary',
      icon: 'pi pi-file-pdf',
      description: 'Extracts critical technical competencies, key responsibilities, and experience requirements automatically from uploaded PDFs, PNG/JPG images, or pasted text JDs.',
      timeCommitment: '2 - 3 Mins',
      targetAudience: 'Candidates customizing prep for specific job postings',
      route: '/aiinterview/job-profile',
      useCases: [
        'Customizing interview prep for an exact job posting you found online.',
        'Extracting top required skills (e.g. Angular, Node.js, AWS, System Design) from a complex JD.',
        'Comparing your current resume skills against target job requirements.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Go to Create / Job Profile',
          detail: 'Access the Job Profile Creator from the AI Interview dashboard.',
          icon: 'pi pi-plus-circle',
        },
        {
          step: 2,
          title: 'Select Input Type',
          detail: 'Choose between "Paste Job Description", "Upload Image", or "Upload PDF".',
          icon: 'pi pi-list',
        },
        {
          step: 3,
          title: 'Upload or Paste Content',
          detail: 'Drag & drop your file or paste the complete job posting text into the box.',
          icon: 'pi pi-upload',
        },
        {
          step: 4,
          title: 'Extract Skills & Generate',
          detail: 'Click "Extract Skills & Create Interview" to let AI generate tailored questions.',
          icon: 'pi pi-sparkles',
        },
      ],
      proTip: 'Include the entire responsibilities and requirements section of the job posting for maximum accuracy in extracted questions.',
      expectedOutput: 'List of detected tech stack skills, difficulty weighting, and customized interview question set.',
    },
    {
      id: 'star-story-bank',
      title: 'STAR Story Bank & AI Behavioral Coach',
      category: 'interview',
      badge: 'NEW FEATURE',
      badgeType: 'hot',
      icon: 'pi pi-star',
      description: 'Dedicated repository to craft, organize, tag, and AI-polish your personal STAR behavioral interview stories (Situation, Task, Action, Result) for quick recall during real interviews.',
      timeCommitment: '5 - 10 Mins per story',
      targetAudience: 'Engineers & professionals preparing behavioral responses',
      route: '/aiinterview',
      useCases: [
        'Organizing past project achievements and conflict resolution stories into clear STAR format.',
        'Using AI polishing to convert raw notes into impactful, high-scoring behavioral answers.',
        'Tagging stories by technical competency (e.g., Leadership, Problem Solving, System Crash, Team Conflict).',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Open AI Tools / STAR Story Bank',
          detail: 'Access the STAR Story Bank widget from AI Tools inside AI Interview.',
          icon: 'pi pi-star-fill',
        },
        {
          step: 2,
          title: 'Add New Story',
          detail: 'Click "Create New Story" and enter Situation, Task, Action, and Result details.',
          icon: 'pi pi-plus',
        },
        {
          step: 3,
          title: 'Apply AI Refinement',
          detail: 'Click "AI Enhance" to let the STAR Coach polish phrasing and highlight metrics.',
          icon: 'pi pi-sparkles',
        },
        {
          step: 4,
          title: 'Tag & Save Story',
          detail: 'Assign relevant skills/categories and save to your personal behavioral bank.',
          icon: 'pi pi-tag',
        },
      ],
      proTip: 'Ensure your Result pillar includes measurable metrics (e.g. "reduced latency by 35%", "saved 10 hours/week").',
      expectedOutput: 'Organized, tagged library of polished behavioral stories ready to use in mock or real interviews.',
    },
    {
      id: 'interviewer-studio',
      title: 'Interviewer Studio & Candidate View',
      category: 'customization',
      badge: 'RECRUITER SUITE',
      badgeType: 'primary',
      icon: 'pi pi-desktop',
      description: 'Comprehensive interviewer studio for creating custom AI interviewer personas, defining evaluation rubrics, conducting candidate screening sessions, and generating detailed candidate reports.',
      timeCommitment: '10 - 20 Mins',
      targetAudience: 'Hiring managers, Technical interviewers, & Recruiters',
      route: '/interviewer-studio',
      useCases: [
        'Creating custom interviewer personas (e.g., Strict System Architect, Friendly HR Lead).',
        'Setting up standardized candidate evaluation rubrics for team interviews.',
        'Running real-time candidate copilot sessions with live AI response evaluation.',
        'Generating comprehensive candidate assessment reports with scoring breakdown.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Launch Interviewer Studio',
          detail: 'Click "Interviewer Studio" in the sidebar navigation.',
          icon: 'pi pi-th-large',
        },
        {
          step: 2,
          title: 'Run Persona Wizard',
          detail: 'Configure role description, difficulty level, rubric weights, and interviewer tone.',
          icon: 'pi pi-sliders-h',
        },
        {
          step: 3,
          title: 'Start Copilot / Candidate Session',
          detail: 'Launch live candidate view room or conduct a copilot-assisted interview.',
          icon: 'pi pi-video',
        },
        {
          step: 4,
          title: 'Review Candidate Report',
          detail: 'Inspect auto-generated candidate assessment report with strengths, weaknesses, and hiring recommendation.',
          icon: 'pi pi-file-check',
        },
      ],
      proTip: 'Define custom rubric criteria to evaluate candidates against exact team standards.',
      expectedOutput: 'Custom interviewer persona template, live candidate interview room, and downloadable Candidate Report.',
    },
    {
      id: 'gamification',
      title: 'Gamification, XP & Badges Engine',
      category: 'analytics',
      badge: 'GAMIFIED PREP',
      badgeType: 'success',
      icon: 'pi pi-trophy',
      description: 'Motivational reward system tracking XP points, level titles (Novice to Master Architect), daily practice streaks, unlockable achievement badges, and offline activity synchronization.',
      timeCommitment: 'Automatic on practice',
      targetAudience: 'All users aiming for consistent daily preparation',
      route: '/',
      useCases: [
        'Building daily practice streaks to maintain momentum before real job interviews.',
        'Earning XP points for completing quizzes, mock interviews, and skill updates.',
        'Unlocking achievement badges as you master key technical milestones.',
        'Syncing offline practice activities automatically once back online.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'View Gamification Bar',
          detail: 'Check top header or Gamification Panel for your level title, current XP, and streak count.',
          icon: 'pi pi-crown',
        },
        {
          step: 2,
          title: 'Complete Daily Activities',
          detail: 'Take quizzes (+50 XP), complete AI mock interviews (+150 XP), or update skill ratings (+20 XP).',
          icon: 'pi pi-check-circle',
        },
        {
          step: 3,
          title: 'Unlock Achievement Badges',
          detail: 'Earn badges like "Interview Novice", "STAR Master", "Quiz Master", or "Streak Champion".',
          icon: 'pi pi-shield',
        },
        {
          step: 4,
          title: 'Level Up',
          detail: 'Accumulate XP to climb rank titles from Novice Explorer up to Master Architect.',
          icon: 'pi pi-chart-line',
        },
      ],
      proTip: 'Practice at least once every 24 hours to keep your streak active and earn streak bonus multiplier XP.',
      expectedOutput: 'Level progression bar, unlocked badge showcase, streak counter, and activity sync status.',
    },
    {
      id: 'ai-tools-widget',
      title: 'AI Speech Analytics & ATS Resume Suite',
      category: 'analytics',
      badge: 'AI WIDGET',
      badgeType: 'info',
      icon: 'pi pi-sliders-v',
      description: 'Multilingual speech analytics tool evaluating speaking pace, clarity, filler words, and vocal confidence alongside an ATS Resume Parser & Optimizer.',
      timeCommitment: '3 - 5 Mins',
      targetAudience: 'Candidates improving verbal clarity & resume ATS match',
      route: '/aiinterview',
      useCases: [
        'Analyzing speaking cadence (WPM) and filler word frequency (e.g. "um", "like") during voice answers.',
        'Testing speech recognition in multiple supported languages.',
        'Parsing uploaded resumes to calculate ATS compatibility scores against target job profiles.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Open AI Tools Widget',
          detail: 'Click the AI Tools floating widget or tab inside AI Interview.',
          icon: 'pi pi-cog',
        },
        {
          step: 2,
          title: 'Select Speech or Resume Tab',
          detail: 'Switch between Speech Analytics or Resume ATS Optimizer.',
          icon: 'pi pi-sliders-h',
        },
        {
          step: 3,
          title: 'Record Speech or Upload Resume',
          detail: 'Speak into microphone or drag-and-drop resume file.',
          icon: 'pi pi-microphone',
        },
        {
          step: 4,
          title: 'Review Detailed Metrics',
          detail: 'Examine WPM speed graph, clarity percentage, filler count, and ATS optimization suggestions.',
          icon: 'pi pi-chart-bar',
        },
      ],
      proTip: 'Aim for a speaking pace of 120-150 words per minute for optimal interviewer engagement.',
      expectedOutput: 'Speech cadence score, filler word breakdown, and ATS Resume optimization score.',
    },
    {
      id: 'review-deck',
      title: 'Review Deck & Flashcard Question Bank',
      category: 'learning',
      badge: 'SMART REVISION',
      badgeType: 'success',
      icon: 'pi pi-book',
      description: 'Flip-card study deck for fast revision of technical interview questions, key concepts, and saved AI interview responses.',
      timeCommitment: '5 - 10 Mins',
      targetAudience: 'Quick daily refreshers, final pre-interview review',
      route: '/aiinterview',
      useCases: [
        'Reviewing tough technical questions 30 minutes before your actual job interview.',
        'Mastering core definitions (e.g., RxJS Observables, Dependency Injection, Closure).',
        'Saving questions you answered poorly during mock interviews for structured revision.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Open Review Deck',
          detail: 'Access the Review Deck tab from the AI Interview layout.',
          icon: 'pi pi-clone',
        },
        {
          step: 2,
          title: 'Filter by Topic or Competency',
          detail: 'Select topics like Frontend, System Design, or Behavioral.',
          icon: 'pi pi-filter',
        },
        {
          step: 3,
          title: 'Flip Flashcards',
          detail: 'Click any card to flip between Question and Sample Answer / Key Points.',
          icon: 'pi pi-refresh',
        },
        {
          step: 4,
          title: 'Mark Mastery Level',
          detail: 'Tag cards as "Need Review" or "Mastered" to track study progress.',
          icon: 'pi pi-bookmark',
        },
      ],
      proTip: 'Focus on cards tagged "Need Review" during your daily 10-minute study session.',
      expectedOutput: 'Personalized flashcard progress, filterable card stack, and quick concept memory reinforcement.',
    },
    {
      id: 'skill-matrix',
      title: 'Skill Rating & Proficiency Matrix',
      category: 'analytics',
      badge: 'ANALYTICS',
      badgeType: 'info',
      icon: 'pi pi-bolt',
      description: 'Comprehensive technical competency breakdown tracking your skill levels from Novice to Expert across major development domains.',
      timeCommitment: '5 Mins setup',
      targetAudience: 'Engineers tracking personal growth & readiness',
      route: '/skills',
      useCases: [
        'Self-evaluating your technical strength across Frontend, Backend, Cloud & Database.',
        'Tracking progression as your AI interview performance improves over time.',
        'Identifying skill gaps blocking promotion or target role qualification.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Open Skills Page',
          detail: 'Click "Skills" in the sidebar navigation.',
          icon: 'pi pi-chart-bar',
        },
        {
          step: 2,
          title: 'Review Domain Breakdown',
          detail: 'Explore categories (Frameworks, Languages, Architecture, Tools).',
          icon: 'pi pi-th-large',
        },
        {
          step: 3,
          title: 'Update Ratings',
          detail: 'Adjust proficiency sliders or log recent completed interviews.',
          icon: 'pi pi-sliders-v',
        },
        {
          step: 4,
          title: 'View Target Readiness',
          detail: 'Check your overall role match percentage against target job profiles.',
          icon: 'pi pi-bullseye',
        },
      ],
      proTip: 'Ratings update automatically when you complete AI mock interviews in corresponding categories.',
      expectedOutput: 'Skill radar chart, proficiency badges, domain percentage completion, and target role readiness gap analysis.',
    },
    {
      id: 'quizzes',
      title: 'Interactive Technical Quizzes',
      category: 'learning',
      badge: 'PRACTICE',
      badgeType: 'primary',
      icon: 'pi pi-play',
      description: 'Fast-paced, timed multiple-choice quizzes designed to test foundational knowledge, syntax, and framework best practices.',
      timeCommitment: '5 - 10 Mins',
      targetAudience: 'Developers testing rapid recall & conceptual speed',
      route: '/quiz',
      useCases: [
        'Testing rapid recall on syntax, framework methods, and API knowledge.',
        'Practicing timed multiple-choice assessments similar to online screening tests (HackerRank/TestGorilla).',
        'Getting quick explanations for tricky code snippets.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Go to Quizzes Page',
          detail: 'Click "Quizzes" from the main menu sidebar.',
          icon: 'pi pi-play',
        },
        {
          step: 2,
          title: 'Choose Category & Topic',
          detail: 'Select tech stack (Angular, TypeScript, JavaScript, Node.js).',
          icon: 'pi pi-tags',
        },
        {
          step: 3,
          title: 'Start Timed Assessment',
          detail: 'Begin quiz and answer questions before timer expires.',
          icon: 'pi pi-clock',
        },
        {
          step: 4,
          title: 'Review Instant Results',
          detail: 'Check your overall score and view correct answer explanations.',
          icon: 'pi pi-file-check',
        },
      ],
      proTip: 'Read the detailed explanations for wrong answers to build deep framework understanding.',
      expectedOutput: 'Quiz score (%), time per question metrics, detailed breakdown of correct/incorrect answers with explanations.',
    },
    {
      id: 'pricing-billing',
      title: 'Plans, Credits & Billing Management',
      category: 'customization',
      badge: 'ACCOUNT',
      badgeType: 'info',
      icon: 'pi pi-wallet',
      description: 'Manage subscription tiers (Free, Pro, Enterprise), track AI credit usage balances, purchase add-on credits, and inspect billing history transaction logs.',
      timeCommitment: '1 - 2 Mins',
      targetAudience: 'All users managing subscription & credit usage',
      route: '/pricing',
      useCases: [
        'Checking remaining AI interview generation and resume parsing credits.',
        'Upgrading from Free tier to Pro tier for unlimited mock interviews.',
        'Viewing invoice logs and transaction history in the Billing History modal.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Open Pricing Page',
          detail: 'Click "Pricing" or Credit badge in header.',
          icon: 'pi pi-credit-card',
        },
        {
          step: 2,
          title: 'Compare Plan Options',
          detail: 'Review features included in Free, Pro, and Enterprise tiers.',
          icon: 'pi pi-list',
        },
        {
          step: 3,
          title: 'View Billing History',
          detail: 'Click "Billing History" to inspect transaction logs and credit receipts.',
          icon: 'pi pi-history',
        },
      ],
      proTip: 'Subscribing to Pro unlocks unlimited AI mock interviews, custom Interviewer Studio personas, and advanced speech analytics.',
      expectedOutput: 'Current credit balance, plan tier status, and billing receipt modal.',
    },
    {
      id: 'dashboard',
      title: 'Performance Overview Dashboard',
      category: 'analytics',
      badge: 'CENTRAL HUB',
      badgeType: 'hot',
      icon: 'pi pi-home',
      description: 'Central command center displaying overall Interview Readiness score, total practice hours, recent sessions, gamification rank, and quick shortcuts.',
      timeCommitment: '1 - 2 Mins check',
      targetAudience: 'All users monitoring preparation health',
      route: '/',
      useCases: [
        'Checking overall preparation progress at a glance.',
        'Monitoring your interview readiness index score trend.',
        'Quickly launching next recommended action (Interview, Quiz, STAR story, or Revision).',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Access Overview',
          detail: 'Click "Overview" at top of sidebar menu.',
          icon: 'pi pi-home',
        },
        {
          step: 2,
          title: 'Check Readiness Index',
          detail: 'Observe composite score calculated from interviews, quizzes, and skills.',
          icon: 'pi pi-gauge',
        },
        {
          step: 3,
          title: 'View Recent Activity',
          detail: 'Review scores from your last 5 interview attempts.',
          icon: 'pi pi-history',
        },
        {
          step: 4,
          title: 'Launch Quick Action',
          detail: 'Click any quick action button to start practicing immediately.',
          icon: 'pi pi-external-link',
        },
      ],
      proTip: 'Aim to keep your Readiness Index above 80% before scheduling real company interviews.',
      expectedOutput: 'Readiness gauge, score history chart, active credits overview, and quick feature shortcuts.',
    },
    {
      id: 'settings',
      title: 'Settings & App Customization',
      category: 'customization',
      badge: 'PERSONALIZATION',
      badgeType: 'info',
      icon: 'pi pi-cog',
      description: 'Customize application theme (Dark/Light/System), accent color palettes, target role preferences, profile settings, and notification options.',
      timeCommitment: '2 Mins setup',
      targetAudience: 'All users customizing their UI & profile',
      route: '/settings',
      useCases: [
        'Switching between Dark Mode and Light Mode depending on lighting environment.',
        'Choosing your favorite accent color palette (Indigo, Emerald, Cyan, Amber, Rose).',
        'Updating your Target Role (e.g. Full-Stack Developer, Frontend Lead) so AI tailors questions accurately.',
      ],
      howToSteps: [
        {
          step: 1,
          title: 'Open Settings',
          detail: 'Click "Settings" under SYSTEM section in sidebar.',
          icon: 'pi pi-cog',
        },
        {
          step: 2,
          title: 'Appearance Tab',
          detail: 'Choose Theme Mode (Light/Dark/System) and pick an Accent Color palette.',
          icon: 'pi pi-palette',
        },
        {
          step: 3,
          title: 'Profile Tab',
          detail: 'Update Target Role, Bio, Location, and add key skills.',
          icon: 'pi pi-user-edit',
        },
        {
          step: 4,
          title: 'Preferences Tab',
          detail: 'Set default AI interview difficulty (Beginner, Intermediate, Senior).',
          icon: 'pi pi-sliders-h',
        },
        {
          step: 5,
          title: 'Save Changes',
          detail: 'Click "Save Profile" or "Save Preferences" to persist settings.',
          icon: 'pi pi-save',
        },
      ],
      proTip: 'Setting your exact Target Role in Profile settings ensures all AI-generated questions match your career goal.',
      expectedOutput: 'Updated visual theme, personalized accent styling, tailored AI interview default difficulty.',
    },
  ];

  // Feature Comparison Matrix
  readonly featureComparison = [
    {
      feature: 'AI Mock Interview',
      time: '15-30 Mins',
      input: 'Voice / Text / JD',
      output: 'STAR Evaluation & Scorecard',
      useCase: 'Full interview preparation',
      icon: 'pi pi-microchip-ai',
    },
    {
      feature: 'Job Description Parser',
      time: '2-3 Mins',
      input: 'PDF / Image / Text JD',
      output: 'Extracted Skills & Custom Qs',
      useCase: 'Company-specific interview prep',
      icon: 'pi pi-file-pdf',
    },
    {
      feature: 'STAR Story Bank & Coach',
      time: '5-10 Mins',
      input: 'Text & Situation Details',
      output: 'Polished STAR Story & Tags',
      useCase: 'Behavioral interview prep',
      icon: 'pi pi-star',
    },
    {
      feature: 'Interviewer Studio & Copilot',
      time: '10-20 Mins',
      input: 'Persona & Rubric Config',
      output: 'Custom Candidate Assessment',
      useCase: 'Recruiter & Hiring screening',
      icon: 'pi pi-desktop',
    },
    {
      feature: 'Gamification & XP Engine',
      time: 'Real-time',
      input: 'Practice Activities',
      output: 'XP, Badges, Level Titles & Streaks',
      useCase: 'Gamified study motivation',
      icon: 'pi pi-trophy',
    },
    {
      feature: 'Speech Analytics & ATS Suite',
      time: '3-5 Mins',
      input: 'Mic Speech / Resume File',
      output: 'Speech Pace/Clarity & ATS Score',
      useCase: 'Vocal & Resume optimization',
      icon: 'pi pi-sliders-v',
    },
    {
      feature: 'Review Deck Flashcards',
      time: '5-10 Mins',
      input: 'Click / Flip Cards',
      output: 'Flashcard Concept Mastery',
      useCase: 'Rapid pre-interview revision',
      icon: 'pi pi-book',
    },
    {
      feature: 'Technical Quizzes',
      time: '5-10 Mins',
      input: 'Multiple Choice',
      output: 'Score % & Explanations',
      useCase: 'Testing technical recall',
      icon: 'pi pi-play',
    },
    {
      feature: 'Skill Matrix & Gap Analysis',
      time: '5 Mins',
      input: 'Self / AI Ratings',
      output: 'Skill Radar & Target Gap Analysis',
      useCase: 'Long-term career tracking',
      icon: 'pi pi-bolt',
    },
    {
      feature: 'Plans, Credits & Billing',
      time: '1-2 Mins',
      input: 'Credit Packages',
      output: 'Credits, Plan Tiers & Invoice Log',
      useCase: 'Subscription & resource management',
      icon: 'pi pi-wallet',
    },
  ];

  // Frequently Asked Questions
  readonly faqs: FaqItem[] = [
    {
      id: 1,
      question: 'How does IMONBENCH AI score my interview answers?',
      answer: 'IMONBENCH AI evaluates your answers across 4 primary vectors: Technical Accuracy, Completeness, Communication Structure (STAR method: Situation, Task, Action, Result), and Problem Solving. It compares your response with industry-standard benchmarks and provides a score from 0-100 alongside concrete improvement suggestions.',
      category: 'scoring',
    },
    {
      id: 2,
      question: 'What file formats can I upload for Job Descriptions or Resumes?',
      answer: 'You can upload PDF files, PNG images, JPG images, or simply copy & paste raw text directly into the Job Profile generator or ATS Resume parser. The AI OCR engine extracts skills and generates role-tailored questions instantly.',
      category: 'interview',
    },
    {
      id: 3,
      question: 'Can I practice interviews using Voice/Audio instead of typing?',
      answer: 'Yes! The AI Mock Interview simulator supports real-time audio microphone input. You can speak naturally, and the system converts your voice to text, analyzes speech pace (WPM), clarity, and filler words, and scores your response.',
      category: 'interview',
    },
    {
      id: 4,
      question: 'How does the STAR Story Bank work and how do I build behavioral stories?',
      answer: 'The STAR Story Bank allows you to record past professional experiences in 4 distinct pillars (Situation, Task, Action, Result). Click "AI Enhance" to polish phrasing, highlight metrics, and tag stories by topic (Leadership, Problem Solving, Incident Management) for quick recall during interviews.',
      category: 'general',
    },
    {
      id: 5,
      question: 'What is the Interviewer Studio and how can I create custom interviewer personas?',
      answer: 'Interviewer Studio is designed for hiring managers and recruiters to build custom AI candidate screening experiences. You can select interviewer tone (Strict, Supportive, Technical), define custom evaluation rubrics, launch live candidate rooms, and receive automated candidate evaluation reports.',
      category: 'technical',
    },
    {
      id: 6,
      question: 'How do XP points, daily streaks, levels, and badges work in Gamification?',
      answer: 'Every time you complete a quiz (+50 XP), finish an AI interview (+150 XP), or log practice sessions, you earn XP. You level up through titles (Novice Explorer to Master Architect), unlock achievement badges, and build daily streaks. Activities completed offline are automatically synced once you reconnect.',
      category: 'general',
    },
    {
      id: 7,
      question: 'How does Speech Analytics evaluate my voice responses?',
      answer: 'Speech Analytics analyzes your microphone recording for words per minute (WPM), articulation clarity percentage, filler word count (such as "um", "uh", "like"), and overall vocal delivery confidence across multiple supported languages.',
      category: 'scoring',
    },
    {
      id: 8,
      question: 'How do AI credits and subscription billing work?',
      answer: 'Each AI interview generation and deep resume analysis consumes credits from your account balance. You can track remaining credits in the app header or Pricing page. Upgrading to Pro unlocks higher credit allocations and advanced recruiter tools.',
      category: 'billing',
    },
    {
      id: 9,
      question: 'How do I change the theme (Dark/Light mode) or accent color?',
      answer: 'Navigate to Settings in the sidebar under SYSTEM. In the "Appearance" tab, you can toggle between Light, Dark, or System Default modes and select from 5 curated color palettes (Indigo, Emerald, Cyan, Amber, Rose).',
      category: 'general',
    },
    {
      id: 10,
      question: 'Are my uploaded job descriptions, resumes, and interview responses private?',
      answer: 'Yes, your uploaded documents, resume text, STAR stories, and mock interview responses are processed securely and stored strictly within your account workspace.',
      category: 'technical',
    },
  ];

  // STAR Method Framework
  readonly starFramework = [
    {
      letter: 'S',
      title: 'Situation',
      desc: 'Set the context by briefly describing the background, project, or challenge.',
      example: '"In my previous role, our Angular app was experiencing slow initial render times..."',
    },
    {
      letter: 'T',
      title: 'Task',
      desc: 'Explain the specific responsibility or problem you needed to solve.',
      example: '"I was tasked with reducing bundle size by 40% and improving Core Web Vitals..."',
    },
    {
      letter: 'A',
      title: 'Action',
      desc: 'Detail the concrete steps and technical decisions YOU took.',
      example: '"I implemented lazy loading routes, optimized tree-shaking, and replaced heavy libs..."',
    },
    {
      letter: 'R',
      title: 'Result',
      desc: 'Share the quantifiable outcome and lessons learned.',
      example: '"Initial bundle size dropped by 48%, page load speed improved by 1.8s, and user retention grew by 15%."',
    },
  ];

  // Computed signal for filtered features
  readonly filteredFeatures = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategory();

    return this.features.filter((f) => {
      const matchesCategory = cat === 'all' || f.category === cat;
      const matchesSearch =
        !query ||
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.useCases.some((u) => u.toLowerCase().includes(query)) ||
        f.howToSteps.some((s) => s.title.toLowerCase().includes(query) || s.detail.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  });

  // Computed signal for filtered FAQs
  readonly filteredFaqs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.faqs;

    return this.faqs.filter(
      (faq) => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
    );
  });

  // Actions & Navigation
  selectSection(section: 'overview' | 'workflow' | 'features' | 'comparison' | 'faq' | 'star'): void {
    this.activeSection.set(section);
    if (isPlatformBrowser(this.platformId)) {
      const elementId = `sec-${section}`;
      const targetElement = document.getElementById(elementId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const sectionIds = ['sec-overview', 'sec-workflow', 'sec-features', 'sec-comparison', 'sec-star', 'sec-faq'];
      
      setTimeout(() => {
        const sections = sectionIds
          .map((id) => document.getElementById(id))
          .filter((el): el is HTMLElement => el !== null);

        if (sections.length > 0 && typeof IntersectionObserver !== 'undefined') {
          this.observer = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  const secName = entry.target.id.replace('sec-', '') as any;
                  this.activeSection.set(secName);
                  break;
                }
              }
            },
            { rootMargin: '-15% 0px -50% 0px', threshold: 0.1 }
          );

          sections.forEach((sec) => this.observer?.observe(sec));
        }
      }, 200);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  selectFeature(featureId: string): void {
    this.selectedFeatureId.set(featureId);
  }

  setCategoryFilter(category: string): void {
    this.activeCategory.set(category);
  }

  toggleFaq(id: number): void {
    this.expandedFaqId.update((prev) => (prev === id ? null : id));
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}

