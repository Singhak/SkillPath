import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  category: 'general' | 'interview' | 'scoring' | 'technical';
  expanded?: boolean;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css',
})
export class HelpComponent {
  // Navigation & Search Signals
  readonly searchQuery = signal<string>('');
  readonly activeCategory = signal<string>('all');
  readonly activeSection = signal<'overview' | 'workflow' | 'features' | 'quickstart' | 'comparison' | 'faq' | 'star'>('overview');
  readonly selectedFeatureId = signal<string>('ai-interview');
  readonly expandedFaqId = signal<number | null>(1);

  // Workflow Diagram Nodes
  readonly workflowNodes = [
    {
      step: 1,
      title: 'Job Profile & Resume Input',
      desc: 'Paste a Job Description or upload PDF/Image resume',
      icon: 'pi pi-file-import',
      badge: 'Input Phase',
    },
    {
      step: 2,
      title: 'AI Competency Extraction',
      desc: 'AI parses key skills, seniority, and question matrix',
      icon: 'pi pi-spin pi-cog',
      badge: 'Processing',
    },
    {
      step: 3,
      title: 'Interactive Mock Interview',
      desc: 'Real-time audio & text response simulator',
      icon: 'pi pi-microphone',
      badge: 'Execution',
    },
    {
      step: 4,
      title: 'STAR Method AI Evaluation',
      desc: 'Instant scoring, detailed feedback & sample model answer',
      icon: 'pi pi-chart-line',
      badge: 'Analysis',
    },
    {
      step: 5,
      title: 'Skill Growth & Flashcards',
      desc: 'Skill matrix upgrade, quiz practice & review deck',
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
      description: 'Simulates real-world technical and behavioral interviews with an interactive AI interviewer. Offers audio and text input, live feedback, and STAR-based evaluation.',
      timeCommitment: '15 - 30 Mins',
      targetAudience: 'Job seekers, Developers preparing for interviews',
      route: '/aiinterview',
      useCases: [
        'Preparing for an upcoming interview for a specific job title or company.',
        'Practicing verbal articulation under time pressure with audio voice answers.',
        'Getting objective, AI-driven evaluation on answer structure (STAR method).',
        'Identifying knowledge gaps in technical concepts before real interviews.',
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
      description: 'Extracts critical technical competencies, key responsibilities, and experience requirements automatically from uploaded PDFs, PNG images, or pasted text.',
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
      id: 'review-deck',
      title: 'Review Deck & Flashcard Question Bank',
      category: 'learning',
      badge: 'SMART REVISION',
      badgeType: 'success',
      icon: 'pi pi-book',
      description: 'Flip-card study deck for fast revision of interview questions, key technical concepts, and saved AI interview responses.',
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
      id: 'dashboard',
      title: 'Performance Overview Dashboard',
      category: 'analytics',
      badge: 'CENTRAL HUB',
      badgeType: 'hot',
      icon: 'pi pi-home',
      description: 'Central command center displaying overall Interview Readiness score, total practice hours, recent sessions, and quick shortcuts.',
      timeCommitment: '1 - 2 Mins check',
      targetAudience: 'All users monitoring preparation health',
      route: '/',
      useCases: [
        'Checking overall preparation progress at a glance.',
        'Monitoring your interview readiness index score trend.',
        'Quickly launching next recommended action (Interview, Quiz, or Revision).',
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
      feature: 'Review Deck',
      time: '5-10 Mins',
      input: 'Click / Flip Cards',
      output: 'Flashcards & Concept Mastery',
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
      feature: 'Skill Matrix',
      time: '5 Mins',
      input: 'Self / AI Ratings',
      output: 'Radar & Gap Analysis',
      useCase: 'Long-term career tracking',
      icon: 'pi pi-bolt',
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
      answer: 'You can upload PDF files, PNG images, JPG images, or simply copy & paste raw text directly into the Job Profile generator. The AI OCR engine extracts skills and generates role-tailored questions instantly.',
      category: 'interview',
    },
    {
      id: 3,
      question: 'Can I practice interviews using Voice/Audio instead of typing?',
      answer: 'Yes! The AI Mock Interview simulator supports real-time audio microphone input. You can speak naturally, and the system converts your voice to text, analyzes speech clarity, and scores your response.',
      category: 'interview',
    },
    {
      id: 4,
      question: 'What is the STAR method and why is it important?',
      answer: 'STAR stands for Situation, Task, Action, and Result. It is the universally recommended structure for answering behavioral and technical scenario questions. IMONBENCH AI automatically breaks down your response into these 4 pillars to show you where you excelled or missed context.',
      category: 'general',
    },
    {
      id: 5,
      question: 'How do I change the theme (Dark/Light mode) or accent color?',
      answer: 'Navigate to Settings in the sidebar under SYSTEM. In the "Appearance" tab, you can toggle between Light, Dark, or System Default modes and select from 5 curated color palettes (Indigo, Emerald, Cyan, Amber, Rose).',
      category: 'general',
    },
    {
      id: 6,
      question: 'Are my uploaded job descriptions and interview practice data private?',
      answer: 'Yes, your uploaded documents and mock interview responses are processed securely and stored strictly within your session/account workspace.',
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

  // Actions
  selectSection(section: 'overview' | 'workflow' | 'features' | 'quickstart' | 'comparison' | 'faq' | 'star'): void {
    this.activeSection.set(section);
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
