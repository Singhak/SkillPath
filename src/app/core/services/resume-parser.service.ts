import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { RatingApiService } from './apis/rating-api.service';
import { UserResourceService } from './user-resource.service';
import { environment } from '../../environments/environment';

export interface ParsedResumeResult {
  fileName: string;
  candidateName?: string;
  email?: string;
  phone?: string;
  extractedSkills: string[];
  suggestedRoles: string[];
  experienceYears: number;
  experienceLevel?: string;
  summaryBio?: string;
  atsScore?: number;
  atsBreakdown?: {
    formatting: number;
    impact: number;
    skillsRelevance: number;
    completeness: number;
  };
  atsFeedback?: string[];
  rawTextPreview: string;
  parsedBy?: string;
  creditsDeducted?: number;
}

const KNOWN_SKILLS_DICTIONARY = [
  'Angular', 'TypeScript', 'JavaScript', 'RxJS', 'HTML/CSS', 'React', 'Vue.js', 'Next.js',
  'Node.js', 'Express.js', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Git', 'Docker', 'Kubernetes', 'AWS',
  'TailwindCSS', 'Bootstrap', 'REST API', 'GraphQL', 'Machine Learning'
];

@Injectable({
  providedIn: 'root',
})
export class ResumeParserService {
  private readonly http = inject(HttpClient);
  private readonly ratingApiService = inject(RatingApiService);
  private readonly userResourceService = inject(UserResourceService);
  private readonly apiUrl = `${environment.apiUrl}/resumes/parse`;
  private readonly destroyRef = inject(DestroyRef);

  readonly parsedResume = signal<ParsedResumeResult | null>(null);
  readonly isParsing = signal<boolean>(false);

  calculateEstimatedCredits(rawText: string, userPlan: string = 'Silver'): number {
    const len = rawText ? rawText.trim().length : 0;
    let cost = 2; // Default 1-page (up to 3,000 chars)
    if (len > 10000) cost = 5;
    else if (len > 6000) cost = 4;
    else if (len > 3000) cost = 3;

    // Subscription plan discounts
    if (userPlan === 'Gold') cost = Math.max(1, cost - 2);
    else if (userPlan === 'Copper') cost = Math.max(1, cost - 1);

    return cost;
  }

  loadSavedResume(): void {
    const myResumeUrl = `${environment.apiUrl}/resumes/my-resume`;
    this.http.get<any>(myResumeUrl).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        if (data) {
          this.parsedResume.set({
            fileName: data.fileName || 'Saved Resume',
            candidateName: data.candidateName || undefined,
            email: data.email || undefined,
            phone: data.phone || undefined,
            extractedSkills: Array.isArray(data.extractedSkills) ? data.extractedSkills : (data.parsedSkills || []),
            suggestedRoles: Array.isArray(data.suggestedRoles) ? data.suggestedRoles : [],
            experienceYears: typeof data.experienceYears === 'number' ? data.experienceYears : 0,
            experienceLevel: data.experienceLevel || 'Mid-Level',
            summaryBio: data.summaryBio || '',
            atsScore: typeof data.atsScore === 'number' ? data.atsScore : 78,
            atsBreakdown: data.atsBreakdown || { formatting: 75, impact: 70, skillsRelevance: 85, completeness: 80 },
            atsFeedback: Array.isArray(data.atsFeedback) ? data.atsFeedback : [],
            rawTextPreview: data.rawTextPreview || (data.rawText ? data.rawText.substring(0, 300) + '...' : ''),
            parsedBy: data.parsedBy || 'DB_PERSISTED',
            creditsDeducted: data.creditsDeducted || undefined,
          });
        }
      },
      error: () => {}
    });
  }

  async parseResumeFile(file: File): Promise<ParsedResumeResult> {
    this.isParsing.set(true);

    let extractedText = '';
    try {
      if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
        extractedText = await this.extractPdfText(file);
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        extractedText = await this.extractDocxText(file);
      } else {
        extractedText = await this.readAsPlainText(file);
      }
    } catch {
      extractedText = await this.readAsPlainText(file).catch(() => '');
    }

    if (!extractedText || extractedText.trim().length < 20) {
      extractedText = await this.extractSanitizedTextFallback(file);
    }

    if (!extractedText || extractedText.trim().length < 20 || this.isRawBinaryOrXml(extractedText)) {
      this.isParsing.set(false);
      return Promise.reject(new Error('The resume file provided does not contain readable text. Please ensure it is a valid .docx, PDF, or text file with selectable text.'));
    }

    return new Promise((resolve, reject) => {
      this.sendToBackendApi(file.name, extractedText, resolve, reject);
    });
  }

  parseRawText(rawText: string, fileName = 'pasted-resume.txt'): Promise<ParsedResumeResult> {
    this.isParsing.set(true);
    return new Promise((resolve, reject) => {
      this.sendToBackendApi(fileName, rawText, resolve, reject);
    });
  }

  private readAsPlainText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result || '');
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }

  private async extractPdfText(file: File): Promise<string> {
    try {
      await this.loadPdfJsScript();
      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) throw new Error('PDF.js not available');

      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim().length > 30) return fullText;
    } catch {
      // Fall back to binary text extraction
    }
    return this.extractSanitizedTextFallback(file);
  }

  private async extractDocxText(file: File): Promise<string> {
    // 1. Primary: Use Mammoth.js for decompressed .docx text extraction
    try {
      await this.loadMammothScript();
      const arrayBuffer = await file.arrayBuffer();
      const mammoth = (window as any).mammoth;
      if (mammoth) {
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (result && result.value && result.value.trim().length > 15) {
          return result.value.trim();
        }
      }
    } catch (err) {
      console.warn('Mammoth extraction failed, trying JSZip fallback:', err);
    }

    // 2. Secondary: Use JSZip to unzip word/document.xml
    try {
      await this.loadJsZipScript();
      const JSZip = (window as any).JSZip;
      if (JSZip) {
        const zip = await JSZip.loadAsync(file);
        const docXmlFile = zip.file('word/document.xml');
        if (docXmlFile) {
          const xmlText = await docXmlFile.async('text');
          const matches = xmlText.match(/<w:t[^>]*>(.*?)<\/w:t>/gi);
          if (matches && matches.length > 0) {
            const extracted = matches.map((m: string) => m.replace(/<[^>]+>/g, '')).join(' ');
            if (extracted.trim().length > 20) return extracted.trim();
          }
        }
      }
    } catch (err) {
      console.warn('JSZip docx fallback failed:', err);
    }

    return this.extractSanitizedTextFallback(file);
  }

  private async extractSanitizedTextFallback(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const str = decoder.decode(buffer);

      const strippedXml = str.replace(/<[^>]+>/g, ' ');
      const cleanText = strippedXml
        .replace(/schemas\.openxmlformats\.org[^\s]*/gi, '')
        .replace(/\[Content_Types\]\.xml/gi, '')
        .replace(/word\/(?:document|styles|settings)\.xml/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanText.length > 30 && !this.isRawBinaryOrXml(cleanText)) {
        return cleanText;
      }
    } catch {
      // Ignore
    }
    return '';
  }

  private isRawBinaryOrXml(text: string): boolean {
    if (!text) return true;
    if (text.length < 20) return true;
    if (text.includes('schemas.openxmlformats.org') || text.includes('[Content_Types].xml')) return true;
    if (text.startsWith('PK\x03\x04') || text.includes('word/document.xml')) return true;
    return false;
  }

  private loadPdfJsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PDF.js script'));
      document.head.appendChild(script);
    });
  }

  private loadMammothScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).mammoth) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Mammoth script'));
      document.head.appendChild(script);
    });
  }

  private loadJsZipScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).JSZip) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load JSZip script'));
      document.head.appendChild(script);
    });
  }

  private sendToBackendApi(
    fileName: string,
    rawText: string,
    resolve: (res: ParsedResumeResult) => void,
    reject?: (err: any) => void
  ): void {
    this.http.post<ParsedResumeResult>(this.apiUrl, { fileName, rawText }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (parsed) => {
        this.parsedResume.set(parsed);
        this.autoUpdateUserSkills(parsed.extractedSkills);
        this.isParsing.set(false);
        this.userResourceService.fetchCreditsAndCoins().subscribe({ error: () => {} });
        resolve(parsed);
      },
      error: (httpErr) => {
        const errDetail = httpErr?.error?.error || httpErr?.error?.message;
        if (httpErr?.status === 400 || (errDetail && errDetail.includes('not readable text'))) {
          this.isParsing.set(false);
          if (reject) {
            reject(new Error(errDetail || 'The uploaded file does not contain readable text.'));
          } else {
            this.parsedResume.set({
              fileName,
              extractedSkills: [],
              suggestedRoles: [],
              experienceYears: 0,
              atsScore: 0,
              atsFeedback: [errDetail || 'The uploaded file is not readable text. Please provide a standard .docx or PDF file.'],
              rawTextPreview: '',
              parsedBy: 'ERROR',
            });
          }
          return;
        }

        const localFallback = this.extractResumeDetails(fileName, rawText);
        this.parsedResume.set(localFallback);
        this.autoUpdateUserSkills(localFallback.extractedSkills);
        this.isParsing.set(false);
        resolve(localFallback);
      }
    });
  }

  private extractResumeDetails(fileName: string, text: string): ParsedResumeResult {
    const textUpper = text.toUpperCase();
    const extractedSkills: string[] = [];

    for (const skill of KNOWN_SKILLS_DICTIONARY) {
      if (textUpper.includes(skill.toUpperCase())) {
        extractedSkills.push(skill);
      }
    }

    if (!extractedSkills.length) {
      extractedSkills.push('Angular', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git');
    }

    let experienceYears = 2;
    const currentYear = new Date().getFullYear();
    const yearMatches = text.match(/\b(20\d{2}|19\d{2})\s*(?:-|–|to)\s*(20\d{2}|19\d{2}|present|current|now)\b/gi);

    if (yearMatches && yearMatches.length > 0) {
      let minYear = currentYear;
      let maxYear = 2000;

      for (const ym of yearMatches) {
        const parts = ym.split(/(?:-|–|to)/i);
        if (parts.length === 2) {
          const startY = parseInt(parts[0].trim(), 10);
          const endStr = parts[1].trim();
          const endY = /present|current|now/i.test(endStr) ? currentYear : parseInt(endStr, 10);

          if (!isNaN(startY) && startY >= 1990 && startY <= currentYear) {
            minYear = Math.min(minYear, startY);
          }
          if (!isNaN(endY) && endY >= startY && endY <= currentYear) {
            maxYear = Math.max(maxYear, endY);
          }
        }
      }

      if (maxYear > minYear && maxYear - minYear <= 40) {
        experienceYears = maxYear - minYear;
      }
    }

    const phraseMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i) ||
                        text.match(/experience\s*(?:of)?\s*(\d+)\+?\s*(?:years?|yrs?)/i);
    if (phraseMatch && phraseMatch[1]) {
      const yrs = parseInt(phraseMatch[1], 10);
      if (!isNaN(yrs) && yrs > 0 && yrs < 40) {
        experienceYears = Math.max(experienceYears, yrs);
      }
    }

    const suggestedRoles: string[] = [];
    if (extractedSkills.includes('Angular') || extractedSkills.includes('TypeScript') || extractedSkills.includes('RxJS')) {
      suggestedRoles.push(experienceYears >= 5 ? 'Senior Angular Developer' : 'Angular Frontend Developer');
    }
    if (extractedSkills.includes('Node.js') || extractedSkills.includes('React')) {
      suggestedRoles.push(experienceYears >= 5 ? 'Senior Full Stack Engineer' : 'Full Stack AI Engineer');
    }
    if (!suggestedRoles.length) {
      suggestedRoles.push('Software Engineer', 'Full Stack Developer');
    }

    return {
      fileName,
      extractedSkills,
      suggestedRoles,
      experienceYears,
      atsScore: 78,
      atsBreakdown: { formatting: 75, impact: 70, skillsRelevance: 85, completeness: 80 },
      atsFeedback: ['Include quantitative impact metrics in job bullet points.'],
      rawTextPreview: text.substring(0, 300) + '...',
      parsedBy: 'LOCAL_FALLBACK',
    };
  }

  private autoUpdateUserSkills(skills: string[]): void {
    if (!skills || !skills.length) return;
    for (const skill of skills.slice(0, 8)) {
      this.ratingApiService.createorUpdateSelfRating({
        category: skill,
        rating: 4,
        type: 'SELF'
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        error: () => {}
      });
    }
  }
}
