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
