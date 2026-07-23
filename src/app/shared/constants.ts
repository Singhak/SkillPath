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
