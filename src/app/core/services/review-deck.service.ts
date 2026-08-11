import { Injectable, signal, computed, inject, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { FlashcardQuestion } from '../models/competency.model';
import { DEFAULT_FLASHCARDS } from '../../shared/constants';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { VoiceService } from '../../shared/services/voice-service';

export type RecallGrade = 'again' | 'hard' | 'good' | 'easy';

@Injectable({
  providedIn: 'root',
})
export class ReviewDeckService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/review-decks`;
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly voiceService = inject(VoiceService);

  readonly flashcards = signal<FlashcardQuestion[]>([]);
  readonly selectedDomain = signal<string>('all');
  readonly filterDueOnly = signal<boolean>(false);
  readonly cardTypeFilter = signal<'all' | 'standard' | 'cloze'>('all');
  readonly activeCardIndex = signal<number>(0);
  readonly isCardFlipped = signal<boolean>(false);

  // Cloze State
  readonly clozeUserAnswer = signal<string>('');
  readonly clozeSubmitted = signal<boolean>(false);
  readonly clozeIsCorrect = signal<boolean | null>(null);

  // Voice Hands-Free Mode State
  readonly isAudioModeActive = signal<boolean>(false);

  readonly availableDomains = computed<string[]>(() => {
    const categories = this.flashcards().map((c) => c.category || 'General');
    return Array.from(new Set(categories));
  });

  readonly dueCardsCount = computed<number>(() => {
    const now = new Date().getTime();
    return this.flashcards().filter((c) => {
      const reviewTime = new Date(c.nextReviewDate).getTime();
      return reviewTime <= now;
    }).length;
  });

  readonly masteredCardsCount = computed<number>(() => {
    return this.flashcards().filter((c) => (c.masteryLevel || 0) >= 80).length;
  });

  readonly overallMasteryPercentage = computed<number>(() => {
    const cards = this.flashcards();
    if (!cards.length) return 0;
    const totalMastery = cards.reduce((sum, c) => sum + (c.masteryLevel || 0), 0);
    return Math.round(totalMastery / cards.length);
  });

  readonly filteredCards = computed<FlashcardQuestion[]>(() => {
    const domain = this.selectedDomain().toLowerCase();
    const dueOnly = this.filterDueOnly();
    const typeFilter = this.cardTypeFilter();
    const now = new Date().getTime();

    return this.flashcards().filter((c) => {
      // Domain filter
      if (domain !== 'all' && (c.category || '').toLowerCase() !== domain) {
        return false;
      }
      // Due filter
      if (dueOnly) {
        const reviewTime = new Date(c.nextReviewDate).getTime();
        if (reviewTime > now) return false;
      }
      // Card type filter
      if (typeFilter !== 'all' && (c.cardType || 'standard') !== typeFilter) {
        return false;
      }
      return true;
    });
  });

  readonly currentCard = computed<FlashcardQuestion | null>(() => {
    const list = this.filteredCards();
    const idx = this.activeCardIndex();
    const card = list[idx] || list[0] || null;
    if (card && (!card.question || card.question.trim().length === 0)) {
      return null;
    }
    return card;
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
   * Check if user is authenticated and has at least 'Gold' plan for review decks.
   */
  private isPlanFit(): boolean {
    return this.authService.isAuthenticated() && this.authService.hasMinPlan('Gold');
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
          const mapped: FlashcardQuestion[] = cards
            .map((c) => ({
              id: c.cardId || c.id || 'FC-' + Date.now().toString().slice(-4),
              question: c.question || c.questionText || c.title || '',
              category: c.category || 'General',
              correctAnswer: c.correctAnswer || c.answer || c.explanation || 'See explanation.',
              explanation: c.explanation || '',
              codeSnippet: c.codeSnippet || '',
              difficulty: c.difficulty || 'medium',
              nextReviewDate: c.nextReviewDate || new Date().toISOString(),
              intervalDays: c.intervalDays || c.reviewIntervalDays || 1,
              repetitionCount: c.repetitionCount || 0,
              cardType: c.cardType || 'standard',
              clozePrompt: c.clozePrompt || '',
              clozeAnswer: c.clozeAnswer || '',
              clozeOptions: c.clozeOptions || [],
              easeFactor: c.easeFactor || 2.5,
              masteryLevel: c.masteryLevel || 0,
              lastReviewedDate: c.lastReviewedDate,
            }))
            .filter((card) => card.question && card.question.trim().length > 0);
          this.flashcards.set(mapped);
        }
      },
      error: () => { }
    });
  }

  setDomainFilter(domain: string): void {
    this.selectedDomain.set(domain);
    this.resetCardState();
  }

  setFilterDueOnly(dueOnly: boolean): void {
    this.filterDueOnly.set(dueOnly);
    this.resetCardState();
  }

  setCardTypeFilter(type: 'all' | 'standard' | 'cloze'): void {
    this.cardTypeFilter.set(type);
    this.resetCardState();
  }

  private resetCardState(): void {
    this.activeCardIndex.set(0);
    this.isCardFlipped.set(false);
    this.clozeUserAnswer.set('');
    this.clozeSubmitted.set(false);
    this.clozeIsCorrect.set(null);
  }

  flipCard(): void {
    this.isCardFlipped.update((prev) => !prev);
  }

  nextCard(): void {
    this.resetCardState();
    if (this.activeCardIndex() < this.totalCards() - 1) {
      this.activeCardIndex.update((idx) => idx + 1);
    } else {
      this.activeCardIndex.set(0);
    }

    if (this.isAudioModeActive()) {
      this.speakCurrentQuestion();
    }
  }

  prevCard(): void {
    this.resetCardState();
    if (this.activeCardIndex() > 0) {
      this.activeCardIndex.update((idx) => idx - 1);
    }

    if (this.isAudioModeActive()) {
      this.speakCurrentQuestion();
    }
  }

  /**
   * Check Cloze Deletion Answer
   */
  checkClozeAnswer(answerToken: string): boolean {
    const card = this.currentCard();
    if (!card) return false;

    const expected = (card.clozeAnswer || card.correctAnswer || '').trim().toLowerCase();
    const actual = answerToken.trim().toLowerCase();
    const isCorrect = expected.length > 0 && actual === expected;

    this.clozeUserAnswer.set(answerToken);
    this.clozeSubmitted.set(true);
    this.clozeIsCorrect.set(isCorrect);

    if (isCorrect) {
      this.isCardFlipped.set(true);
    }
    return isCorrect;
  }

  /**
   * SM-2 Spaced Repetition Algorithm Implementation
   */
  rateCardRecall(grade: RecallGrade): void {
    const current = this.currentCard();
    if (!current) return;

    // Quality mapping: again = 0, hard = 3, good = 4, easy = 5
    let q = 4;
    if (grade === 'again') q = 0;
    if (grade === 'hard') q = 3;
    if (grade === 'good') q = 4;
    if (grade === 'easy') q = 5;

    let currentEF = current.easeFactor ?? 2.5;
    let currentRep = current.repetitionCount ?? 0;
    let currentInterval = current.intervalDays ?? 1;

    // Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    let newEF = currentEF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (newEF < 1.3) newEF = 1.3;

    // Update Repetition Count & Interval Days
    let newRep = currentRep;
    let newInterval = 1;

    if (q < 3) {
      newRep = 0;
      newInterval = 1;
    } else {
      newRep = currentRep + 1;
      if (newRep === 1) {
        newInterval = 1;
      } else if (newRep === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.max(1, Math.round(currentInterval * newEF));
      }

      if (q === 5) {
        newInterval = Math.max(newInterval + 1, Math.round(newInterval * 1.25));
      }
    }

    // Update Mastery Level (0-100%)
    let currentMastery = current.masteryLevel ?? 0;
    let masteryDelta = 0;
    if (q === 0) masteryDelta = -25;
    else if (q === 3) masteryDelta = 10;
    else if (q === 4) masteryDelta = 20;
    else if (q === 5) masteryDelta = 30;

    const newMastery = Math.min(100, Math.max(0, currentMastery + masteryDelta));

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    const updated = this.flashcards().map((card) => {
      if (card.id === current.id) {
        return {
          ...card,
          easeFactor: Number(newEF.toFixed(2)),
          intervalDays: newInterval,
          repetitionCount: newRep,
          masteryLevel: newMastery,
          nextReviewDate: nextDate.toISOString(),
          lastReviewedDate: new Date().toISOString(),
        };
      }
      return card;
    });

    this.flashcards.set(updated);
    this.saveToStorage();
    this.nextCard();

    if (this.isPlanFit()) {
      this.http.post<any>(`${this.apiUrl}/${current.id}/recall`, {
        recallGrade: grade,
        easeFactor: newEF,
        intervalDays: newInterval,
        repetitionCount: newRep,
        masteryLevel: newMastery,
      }).pipe(
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
      cardType: cardData.cardType || 'standard',
      easeFactor: cardData.easeFactor || 2.5,
      masteryLevel: cardData.masteryLevel || 0,
    };
    this.flashcards.update((prev) => [newCard, ...prev]);
    this.saveToStorage();

    if (this.isPlanFit()) {
      this.http.post<any>(this.apiUrl, newCard).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({ error: () => { } });
    }
  }

  // ----------------------------------------------------
  // Hands-Free Audio Review Mode Methods
  // ----------------------------------------------------
  toggleAudioMode(): void {
    const next = !this.isAudioModeActive();
    this.isAudioModeActive.set(next);
    if (next) {
      this.speakCurrentQuestion();
    } else {
      this.voiceService.stopSpeaking();
      this.voiceService.stopListening();
    }
  }

  speakCurrentQuestion(): void {
    const card = this.currentCard();
    if (!card) return;

    let text = `Question: ${card.question}`;
    if (card.cardType === 'cloze' && card.clozePrompt) {
      text = `Fill in the blank code card. ${card.clozePrompt}`;
    }

    this.voiceService.speak(text, {
      lang: 'en-US',
      rate: 0.95,
    });
  }

  speakCurrentAnswer(): void {
    const card = this.currentCard();
    if (!card) return;

    const text = `Answer: ${card.correctAnswer}. ${card.explanation || ''}`;
    this.voiceService.speak(text, {
      lang: 'en-US',
      rate: 0.95,
    });
  }

  listenForAudioResponse(callback?: (transcript: string) => void): void {
    this.voiceService.startListening('en-US');
  }

  stopAudioListening(): void {
    this.voiceService.stopListening();
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('imonbench_review_deck');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((c: any) => c && typeof c.question === 'string' && c.question.trim().length > 0);
          this.flashcards.set(valid);
        }
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
