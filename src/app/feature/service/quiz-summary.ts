import { Component, computed, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { QuizStatsService } from './quiz-stats.service';

@Component({
  selector: 'app-quiz-summary',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  template: ` 
    <p-dialog
      header="Quiz Finished!"
      [visible]="visible()"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="close.emit()"
    >
      <div class="summary-grid">
        <div *ngFor="let stat of summaryStats()" class="stat-card">
          <div class="stat-icon" [ngClass]="stat.iconClass">
            <i [class]="stat.icon"></i>
          </div>
          <div class="stat-details">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-cyan-500">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-details">
            <div class="stat-value">{{ formattedTime() }}</div>
            <div class="stat-label">Total Time</div>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button
          (click)="restart.emit()"
          label="Restart Quiz"
          icon="pi pi-refresh"
          styleClass="p-button-text"
        ></p-button>
        <p-button (click)="close.emit()" label="Close" icon="pi pi-times"></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1.5rem;
        padding: 1rem 0;
      }

      .stat-card {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-left: 5px solid;
      }

      .stat-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: #fff;
      }

      .stat-details {
        display: flex;
        flex-direction: column;
      }

      .stat-value {
        font-size: 1.75rem;
        font-weight: bold;
      }

      .stat-label {
        font-size: 0.9rem;
        color: #6c757d;
      }
    `,
  ],
})
export class QuizSummaryComponent {
  visible = input.required<boolean>();
  totalQuestions = input.required<number>();
  statsService = inject(QuizStatsService);
  close = output<void>();
  restart = output<void>();

  summaryStats = computed(() => [
    {
      label: 'Total Questions',
      value: this.totalQuestions(),
      icon: 'pi pi-question-circle',
      iconClass: 'bg-blue-500',
    },
    { label: 'Correct', value: this.statsService.totalCorrect(), icon: 'pi pi-check-circle', iconClass: 'bg-green-500' },
    {
      label: 'Incorrect',
      value: this.statsService.totalIncorrect(),
      icon: 'pi pi-times-circle',
      iconClass: 'bg-red-500',
    },
    { label: 'Skipped', value: this.statsService.totalSkipped(), icon: 'pi pi-forward', iconClass: 'bg-orange-500' },
    { label: 'Hints Used', value: this.statsService.totalHintsUsed(), icon: 'pi pi-lightbulb', iconClass: 'bg-yellow-500' },
  ]);

  formattedTime = computed(() => {
    const totalSeconds = this.statsService.totalTimeTaken();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}m ${seconds}s`;
  });
}
