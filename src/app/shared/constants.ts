import { Achievement } from '../core/models/achievement.model';
import { JobRoleRequirement, FlashcardQuestion } from '../core/models/competency.model';

export const USER_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
  'Mobile Developer',
  'Software Architect',
  'UI/UX Designer',
  'Project Manager',
  'Scrum Master',
  'Product Owner',
  'QA Engineer',
  'DevOps Engineer',
  'Support Engineer',
  'Security Engineer',
  'Data Engineer',
  'ML/AI Engineer',
];

export const EXPERIENCE_LEVELS = [
  'Intern',
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
  'Principal',
  'Architect',
];

export const INTERVIEW_TIPS = [
  'Explain concepts clearly',
  'Give practical examples',
  'Mention trade-offs',
  'Speak confidently',
];

export const INTERVIEW_STEPS = [
  'Extract Required Skills',
  'Generate Technical Questions',
  'Behavioral Questions',
  'Coding Questions',
  'Difficulty Detection',
];

export function createDownloadLink(url: string, filename: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  return link;
}

export function levelToWeight(level: string) {
  level = level?.toLowerCase()?.trim();
  switch (level) {
    case 'basic':
      return 1;
    case 'intermediate':
      return 1.5;
    case 'advanced':
      return 2;
    case 'critical concept':
      return 3;
    default:
      return '';
  }
}

export const AI_CREDIT_COST = {
  QUESTION_GENERATION: .20,
  QUESTION_EVALUATION: .25,
  JOB_PROFILE_ANALYSIS: 2
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'STREAK_1_DAY',
    title: 'First Step',
    description: 'Log in and complete 1 daily learning activity',
    category: 'streak',
    icon: 'pi-bolt',
    badgeClass: 'from-amber-500 to-orange-500',
    requiredCount: 1,
    currentProgress: 0,
    isUnlocked: false,
    xpReward: 50,
  },
  {
    id: 'STREAK_3_DAYS',
    title: 'Momentum Builder',
    description: 'Maintain a 3-day learning streak',
    category: 'streak',
    icon: 'pi-flame',
    badgeClass: 'from-orange-500 to-red-500',
    requiredCount: 3,
    currentProgress: 0,
    isUnlocked: false,
    xpReward: 150,
  },
  {
    id: 'STREAK_7_DAYS',
    title: 'Unstoppable Force',
    description: 'Maintain a 7-day learning streak',
    category: 'streak',
    icon: 'pi-crown',
    badgeClass: 'from-purple-500 to-indigo-600',
    requiredCount: 7,
    currentProgress: 0,
    isUnlocked: false,
    xpReward: 500,
  },
  {
    id: 'QUIZ_1_COMPLETED',
    title: 'Trivia Challenger',
    description: 'Complete your first practice quiz',
    category: 'quiz',
    icon: 'pi-check-circle',
    badgeClass: 'from-blue-500 to-cyan-500',
    requiredCount: 1,
    currentProgress: 0,
    isUnlocked: false,
    xpReward: 100,
  },
  {
    id: 'QUIZ_5_COMPLETED',
    title: 'Quiz Enthusiast',
    description: 'Complete 5 practice quizzes',
    category: 'quiz',
    icon: 'pi-star-fill',
    badgeClass: 'from-cyan-500 to-teal-500',
    requiredCount: 5,
    currentProgress: 0,
    isUnlocked: false,
    xpReward: 300,
  },
  {
    id: 'AI_INTERVIEW_1',
    title: 'Interview Candidate',
    description: 'Complete 1 AI Mock Interview session',
    category: 'interview',
    icon: 'pi-desktop',
    badgeClass: 'from-emerald-500 to-green-600',
    requiredCount: 1,
    currentProgress: 0,
    isUnlocked: false,
    xpReward: 200,
  },
  {
    id: 'AI_INTERVIEW_5',
    title: 'Interview Prodigy',
    description: 'Complete 5 AI Mock Interview sessions',
    category: 'interview',
    icon: 'pi-verified',
    badgeClass: 'from-violet-600 to-fuchsia-600',
    requiredCount: 5,
    currentProgress: 0,
    isUnlocked: false,
    xpReward: 600,
  },
  {
    id: 'SKILL_5_RATED',
    title: 'Self Evaluator',
    description: 'Rate your proficiency in 5 skills',
    category: 'skill',
    icon: 'pi-chart-bar',
    badgeClass: 'from-pink-500 to-rose-500',
    requiredCount: 5,
    currentProgress: 0,
    isUnlocked: false,
    xpReward: 150,
  },
];

export const DEFAULT_JOB_ROLES: JobRoleRequirement[] = [
  {
    roleId: 'ANGULAR_SR',
    title: 'Senior Angular Developer',
    category: 'Frontend Architecture',
    description: 'Mastery over RxJS, Signals, State Management, Custom Directives, Performance & Angular CLI.',
    icon: 'pi-desktop',
    competencies: [
      { skillName: 'Angular', requiredRating: 5 },
      { skillName: 'TypeScript', requiredRating: 5 },
      { skillName: 'RxJS', requiredRating: 4 },
      { skillName: 'HTML/CSS', requiredRating: 4 },
      { skillName: 'Git', requiredRating: 4 },
    ],
  },
  {
    roleId: 'FULLSTACK_AI',
    title: 'Full Stack AI Engineer',
    category: 'AI & Enterprise Apps',
    description: 'Building modern reactive web apps integrated with LLMs, Node.js microservices, and databases.',
    icon: 'pi-microchip-ai',
    competencies: [
      { skillName: 'Angular', requiredRating: 4 },
      { skillName: 'TypeScript', requiredRating: 5 },
      { skillName: 'Node.js', requiredRating: 5 },
      { skillName: 'PostgreSQL', requiredRating: 4 },
      { skillName: 'Git', requiredRating: 4 },
    ],
  },
  {
    roleId: 'BACKEND_SR',
    title: 'Senior Backend Engineer',
    category: 'Microservices & Distributed Systems',
    description: 'Expertise in Node.js, Express, PostgreSQL, Redis caching, Sequelize ORM, and REST APIs.',
    icon: 'pi-server',
    competencies: [
      { skillName: 'Node.js', requiredRating: 5 },
      { skillName: 'Express.js', requiredRating: 5 },
      { skillName: 'PostgreSQL', requiredRating: 5 },
      { skillName: 'REST API', requiredRating: 5 },
      { skillName: 'Docker', requiredRating: 4 },
    ],
  },
  {
    roleId: 'FRONTEND_LEAD',
    title: 'Frontend UI/UX Specialist',
    category: 'Web Design & Performance',
    description: 'Mastery over CSS architectures, TailwindCSS, component accessibility, responsiveness, and UX design.',
    icon: 'pi-palette',
    competencies: [
      { skillName: 'HTML/CSS', requiredRating: 5 },
      { skillName: 'TailwindCSS', requiredRating: 5 },
      { skillName: 'TypeScript', requiredRating: 4 },
      { skillName: 'Angular', requiredRating: 4 },
      { skillName: 'Git', requiredRating: 4 },
    ],
  },
  {
    roleId: 'DEVOPS_SR',
    title: 'DevOps & Cloud Systems Engineer',
    category: 'Cloud Infrastructure & Automation',
    description: 'Proficiency in Docker containers, CI/CD deployment pipelines, Linux server administration, and Git.',
    icon: 'pi-cloud',
    competencies: [
      { skillName: 'Docker', requiredRating: 5 },
      { skillName: 'Git', requiredRating: 5 },
      { skillName: 'Linux', requiredRating: 4 },
      { skillName: 'CI/CD', requiredRating: 4 },
      { skillName: 'Node.js', requiredRating: 3 },
    ],
  },
  {
    roleId: 'AI_DATA_SPEC',
    title: 'AI & Data Science Specialist',
    category: 'Machine Learning & Analytics',
    description: 'Experience with Python, Prompt Engineering, SQL queries, REST APIs, and Machine Learning models.',
    icon: 'pi-chart-line',
    competencies: [
      { skillName: 'Python', requiredRating: 5 },
      { skillName: 'SQL', requiredRating: 4 },
      { skillName: 'REST API', requiredRating: 4 },
      { skillName: 'Machine Learning', requiredRating: 4 },
      { skillName: 'Node.js', requiredRating: 3 },
    ],
  },
];

export const DEFAULT_FLASHCARDS: FlashcardQuestion[] = [
  {
    id: 'FC-101',
    question: 'What is the main difference between Angular Signals and RxJS Observables?',
    category: 'Angular',
    correctAnswer:
      'Signals represent synchronous reactive values with built-in fine-grained DOM updates without zone.js, whereas RxJS Observables handle asynchronous streams of events over time.',
    explanation: 'Signals are synchronous push-pull values for local state. Observables stream asynchronous events over time.',
    codeSnippet: `// Signal Example\nconst count = signal(0);\ncount.update(n => n + 1);`,
    difficulty: 'medium',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitionCount: 0,
  },
  {
    id: 'FC-102',
    question: 'How does Event Loop microtask vs macrotask execution order work in Node.js?',
    category: 'Node.js',
    correctAnswer:
      'Microtasks (Promise callbacks, process.nextTick) execute completely before the Event Loop advances to the next Macrotask phase (timers, I/O callbacks).',
    explanation: 'Microtask queues drain completely after each event loop phase before any macrotask executes.',
    difficulty: 'hard',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 2,
    repetitionCount: 1,
  },
  {
    id: 'FC-103',
    question: 'What is the difference between interface and type alias in TypeScript?',
    category: 'TypeScript',
    correctAnswer:
      'Interfaces support declaration merging and are optimized for object shape contracts, whereas Type Aliases can model union types, primitives, and tuples.',
    explanation: 'Use interface for extendable OOP models; use type for unions and primitive alias definitions.',
    difficulty: 'easy',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitionCount: 0,
  },
  {
    id: 'FC-104',
    question: 'When should you use switchMap vs mergeMap vs concatMap in RxJS?',
    category: 'RxJS',
    correctAnswer:
      'switchMap cancels previous inner subscriptions (ideal for autocomplete searches), mergeMap runs inner subscriptions concurrently, and concatMap queues subscriptions sequentially.',
    explanation: 'switchMap = cancel previous; mergeMap = concurrent; concatMap = sequential order preservation.',
    codeSnippet: `this.searchControl.valueChanges.pipe(\n  switchMap(query => this.api.search(query))\n);`,
    difficulty: 'medium',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitionCount: 0,
  },
  {
    id: 'FC-105',
    question: 'What is HTTP Idempotency and which HTTP methods are idempotent?',
    category: 'REST API',
    correctAnswer:
      'An HTTP method is idempotent if executing it multiple times produces the exact same side-effect on the server. GET, PUT, DELETE, HEAD, and OPTIONS are idempotent; POST is NOT.',
    explanation: 'Repeated PUT or DELETE requests result in identical server states; POST creates multiple resources.',
    difficulty: 'easy',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitionCount: 0,
  },
  {
    id: 'FC-106',
    question: 'How does B-Tree indexing speed up SELECT queries in PostgreSQL?',
    category: 'Databases',
    correctAnswer:
      'B-Tree indexes maintain a balanced tree structure where lookup complexity is O(log N) instead of performing full table scans (O(N)).',
    explanation: 'Indexes store sorted keys with direct row pointers, drastically reducing disk I/O operations.',
    difficulty: 'medium',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 2,
    repetitionCount: 0,
  },
  {
    id: 'FC-107',
    question: 'What is the main security difference between JWT and Session-based Authentication?',
    category: 'Security',
    correctAnswer:
      'JWTs are stateless and verified via cryptographic signatures on the server without database lookups, while Sessions store session state in server memory/Redis.',
    explanation: 'JWTs scale easily for microservices; Sessions offer immediate server-side revocation capability.',
    difficulty: 'medium',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitionCount: 0,
  },
  {
    id: 'FC-108',
    question: 'What is the primary architectural difference between Docker Containers and Virtual Machines?',
    category: 'DevOps',
    correctAnswer:
      'Containers share the host operating system kernel and isolate applications at process level, whereas VMs run full independent guest OS instances on a Hypervisor.',
    explanation: 'Containers are lightweight and launch in milliseconds; VMs require heavy OS resources.',
    difficulty: 'easy',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitionCount: 0,
  },
];



