import { Injectable, signal, computed, inject, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { StarStory, DEFAULT_COMPETENCY_CATEGORIES } from '../models/star-story.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

const LOCAL_STORAGE_KEY = 'imonbench_star_stories_bank';

const INITIAL_DEMO_STORIES: StarStory[] = [
  {
    id: 'STORY-1001',
    title: 'Resolving Critical DB Lock Contention under High Traffic',
    competency: 'Technical Failure',
    situation: 'During a Black Friday spike, our core transactional API experienced severe database lock escalation resulting in 504 timeouts.',
    task: 'My goal was to isolate the lock root cause and deploy an automated zero-downtime fix within 2 hours.',
    action: 'I analyzed query execution plans, converted inline synchronous updates to optimistic queue-based batching, and introduced Redis read-through caching.',
    result: 'Reduced DB CPU utilization from 98% to 22%, eliminated API timeouts, and processed 150k transactions error-free.',
    tags: ['PostgreSQL', 'Redis', 'Node.js', 'System Optimization'],
    impactScore: 95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'STORY-1002',
    title: 'Aligning Engineering & Product Specs on Breaking Changes',
    competency: 'Conflict Resolution',
    situation: 'Engineering leadership and Product managers clashed over pushing a major schema refactor that threatened Q4 feature deliverables.',
    task: 'My objective was to mediate a technical compromise that preserved architectural scalability without delaying product release deadlines.',
    action: 'I proposed an incremental feature-flagged dual-write migration strategy with backward-compatible API versions, organizing paired design workshops with both teams.',
    result: 'Delivered all required Q4 product features on schedule while safely migrating 100% of user data to the new schema without downtime.',
    tags: ['Architecture', 'Conflict Resolution', 'Agile', 'Migration'],
    impactScore: 92,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class StarStoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/star-stories`;
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly stories = signal<StarStory[]>([]);
  readonly selectedCompetency = signal<string>('all');
  readonly searchQuery = signal<string>('');
  readonly sortBy = signal<'newest' | 'oldest' | 'impact' | 'title'>('newest');
  readonly viewLayout = signal<'grid' | 'compact'>('grid');
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = signal<number>(1);

  readonly availableCompetencies = computed<string[]>(() => {
    const list = this.stories().map((s) => s.competency || 'General');
    const merged = Array.from(new Set([...DEFAULT_COMPETENCY_CATEGORIES, ...list]));
    return merged.sort();
  });

  readonly filteredStories = computed<StarStory[]>(() => {
    const category = this.selectedCompetency().toLowerCase();
    const query = this.searchQuery().trim().toLowerCase();

    return this.stories().filter((story) => {
      // Category Filter
      if (category !== 'all' && (story.competency || '').toLowerCase() !== category) {
        return false;
      }
      // Search Query Filter
      if (query) {
        const fullText = `${story.title} ${story.competency} ${story.situation} ${story.task} ${story.action} ${story.result} ${(story.tags || []).join(' ')}`.toLowerCase();
        if (!fullText.includes(query)) {
          return false;
        }
      }
      return true;
    });
  });

  readonly sortedStories = computed<StarStory[]>(() => {
    const list = [...this.filteredStories()];
    const sort = this.sortBy();

    return list.sort((a, b) => {
      if (sort === 'impact') {
        return (b.impactScore || 0) - (a.impactScore || 0);
      }
      if (sort === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sort === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      // Default: 'newest'
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  });

  readonly totalPages = computed<number>(() => {
    const total = this.sortedStories().length;
    const perPage = this.itemsPerPage();
    return Math.max(1, Math.ceil(total / perPage));
  });

  readonly paginatedStories = computed<StarStory[]>(() => {
    const list = this.sortedStories();
    const page = Math.min(this.currentPage(), this.totalPages());
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    return list.slice(start, start + perPage);
  });

  setCompetencyFilter(category: string): void {
    this.selectedCompetency.set(category);
    this.currentPage.set(1);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  setSortBy(sort: 'newest' | 'oldest' | 'impact' | 'title'): void {
    this.sortBy.set(sort);
    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  constructor() {
    this.loadFromStorage();

    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.fetchBackendStories();
      }
    });
  }

  fetchBackendStories(): void {
    if (!this.authService.isAuthenticated()) return;

    this.http
      .get<StarStory[]>(this.apiUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            this.stories.set(res);
            this.saveToStorage();
          }
        },
        error: () => {},
      });
  }

  addStory(
    storyData: Omit<StarStory, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): StarStory {
    const id = storyData.id || `STORY-${Date.now()}`;
    const newStory: StarStory = {
      ...storyData,
      id,
      customId: id,
      tags: storyData.tags || [],
      impactScore: storyData.impactScore || 85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.stories.update((prev) => [newStory, ...prev]);
    this.saveToStorage();

    if (this.authService.isAuthenticated()) {
      this.http
        .post<StarStory>(this.apiUrl, newStory)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ error: () => {} });
    }

    return newStory;
  }

  updateStory(id: string, updatedFields: Partial<StarStory>): void {
    this.stories.update((prev) =>
      prev.map((s) => {
        if (s.id === id || String(s.storyId) === String(id)) {
          return {
            ...s,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      })
    );
    this.saveToStorage();

    if (this.authService.isAuthenticated()) {
      this.http
        .put<StarStory>(`${this.apiUrl}/${id}`, updatedFields)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ error: () => {} });
    }
  }

  deleteStory(id: string): void {
    this.stories.update((prev) => prev.filter((s) => s.id !== id && String(s.storyId) !== String(id)));
    this.saveToStorage();

    if (this.authService.isAuthenticated()) {
      this.http
        .delete(`${this.apiUrl}/${id}`)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ error: () => {} });
    }
  }

  saveFromEvaluation(
    title: string,
    competency: string,
    situation: string,
    task: string,
    action: string,
    result: string,
    impactScore: number = 88
  ): StarStory {
    return this.addStory({
      title: title || 'Evaluated STAR Achievement',
      competency: competency || 'Problem Solving',
      situation: situation || '',
      task: task || '',
      action: action || '',
      result: result || '',
      tags: ['AI Evaluated', competency || 'Behavioral'],
      impactScore: impactScore || 88,
    });
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.stories.set(parsed);
          return;
        }
      }
    } catch {
      // Fallback to initial demo stories
    }
    this.stories.set(INITIAL_DEMO_STORIES);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.stories()));
    } catch {
      // Ignore
    }
  }
}
