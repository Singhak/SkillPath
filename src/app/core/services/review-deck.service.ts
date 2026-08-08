import { Injectable, signal, computed, inject, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { FlashcardQuestion } from '../models/competency.model';
import { DEFAULT_FLASHCARDS } from '../../shared/constants';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewDeckService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/review-decks`;
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  readonly flashcards = signal<FlashcardQuestion[]>(DEFAULT_FLASHCARDS);
  readonly selectedDomain = signal<string>('all');
  readonly activeCardIndex = signal<number>(0);
  readonly isCardFlipped = signal<boolean>(false);

  readonly availableDomains = computed<string[]>(() => {
    const categories = this.flashcards().map((c) => c.category || 'General');
    return Array.from(new Set(categories));
  });

  readonly filteredCards = computed<FlashcardQuestion[]>(() => {
    const domain = this.selectedDomain();
    const all = this.flashcards();
    if (domain === 'all') return all;
    return all.filter((c) => (c.category || '').toLowerCase() === domain.toLowerCase());
  });

  readonly currentCard = computed<FlashcardQuestion | null>(() => {
    const list = this.filteredCards();
    const idx = this.activeCardIndex();
    return list[idx] || list[0] || null;
  });

  readonly totalCards = computed(() => this.filteredCards().length);

  constructor() {
    this.loadFromStorage();

    effect(() => {
      if (this.isPlanFit()) {
        this.fetchBackendCards();
      }
    });
  }

  /**
   * Check if user is authenticated and on 'Gold' plan required by /api/review-decks.
   */
  private isPlanFit(): boolean {
    return this.authService.isAuthenticated() && this.authService.currentPlan() === 'Gold';
  }

  fetchBackendCards(): void {
    if (!this.isPlanFit()) {
      return;
    }

    this.http.get<any[]>(this.apiUrl).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (cards) => {
        if (cards && cards.length > 0) {
          const mapped = cards.map((c) => ({
            id: c.cardId || c.id || 'FC-100',
            question: c.question,
            category: c.category || 'General',
            correctAnswer: c.correctAnswer,
            explanation: c.explanation || '',
            codeSnippet: c.codeSnippet || '',
            difficulty: c.difficulty || 'medium',
            nextReviewDate: c.nextReviewDate || new Date().toISOString(),
            intervalDays: c.intervalDays || 1,
            repetitionCount: c.repetitionCount || 0,
          }));
          this.flashcards.set(mapped);
        }
      },
      error: () => { }
    });
  }

  setDomainFilter(domain: string): void {
    this.selectedDomain.set(domain);
    this.activeCardIndex.set(0);
    this.isCardFlipped.set(false);
  }

  flipCard(): void {
    this.isCardFlipped.update((prev) => !prev);
  }

  nextCard(): void {
    this.isCardFlipped.set(false);
    if (this.activeCardIndex() < this.totalCards() - 1) {
      this.activeCardIndex.update((idx) => idx + 1);
    } else {
      this.activeCardIndex.set(0);
    }
  }

  prevCard(): void {
    this.isCardFlipped.set(false);
    if (this.activeCardIndex() > 0) {
      this.activeCardIndex.update((idx) => idx - 1);
    }
  }

  rateCardRecall(grade: 'easy' | 'good' | 'hard'): void {
    const current = this.currentCard();
    if (!current) return;

    let multiplier = 1;
    if (grade === 'easy') multiplier = 2.5;
    if (grade === 'good') multiplier = 1.8;
    if (grade === 'hard') multiplier = 1.1;

    const newInterval = Math.max(1, Math.round(current.intervalDays * multiplier));
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    const updated = this.flashcards().map((card) => {
      if (card.id === current.id) {
        return {
          ...card,
          intervalDays: newInterval,
          nextReviewDate: nextDate.toISOString(),
          repetitionCount: card.repetitionCount + 1,
        };
      }
      return card;
    });

    this.flashcards.set(updated);
    this.saveToStorage();
    this.nextCard();

    if (this.isPlanFit()) {
      this.http.post<any>(`${this.apiUrl}/${current.id}/recall`, { recallGrade: grade }).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({ error: () => { } });
    }
  }

  addFlashcard(cardData: Omit<FlashcardQuestion, 'id' | 'nextReviewDate' | 'intervalDays' | 'repetitionCount'>): void {
    const newCard: FlashcardQuestion = {
      ...cardData,
      id: 'FC-' + Date.now().toString().slice(-4),
      nextReviewDate: new Date().toISOString(),
      intervalDays: 1,
      repetitionCount: 0,
    };
    this.flashcards.update((prev) => [newCard, ...prev]);
    this.saveToStorage();

    if (this.isPlanFit()) {
      this.http.post<any>(this.apiUrl, cardData).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({ error: () => { } });
    }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('imonbench_review_deck');
      if (saved) {
        this.flashcards.set(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('imonbench_review_deck', JSON.stringify(this.flashcards()));
    } catch {
      // Ignore
    }
  }
}
