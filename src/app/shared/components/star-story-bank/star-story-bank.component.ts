import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarStoryService } from '../../../core/services/star-story.service';
import { StarStory, DEFAULT_COMPETENCY_CATEGORIES } from '../../../core/models/star-story.model';

@Component({
  selector: 'app-star-story-bank',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './star-story-bank.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class StarStoryBankComponent {
  public readonly storyService = inject(StarStoryService);

  readonly defaultCompetencies = DEFAULT_COMPETENCY_CATEGORIES;
  readonly isModalOpen = signal<boolean>(false);
  readonly editingStoryId = signal<string | null>(null);
  readonly expandedStoryId = signal<string | null>(null);
  readonly copiedStoryId = signal<string | null>(null);

  // Form State
  formTitle = '';
  formCompetency = 'Problem Solving';
  formSituation = '';
  formTask = '';
  formAction = '';
  formResult = '';
  formTagsInput = '';
  formImpactScore = 85;

  openAddModal(): void {
    this.editingStoryId.set(null);
    this.formTitle = '';
    this.formCompetency = 'Problem Solving';
    this.formSituation = '';
    this.formTask = '';
    this.formAction = '';
    this.formResult = '';
    this.formTagsInput = '';
    this.formImpactScore = 85;
    this.isModalOpen.set(true);
  }

  openEditModal(story: StarStory): void {
    this.editingStoryId.set(story.id);
    this.formTitle = story.title;
    this.formCompetency = story.competency || 'Problem Solving';
    this.formSituation = story.situation;
    this.formTask = story.task;
    this.formAction = story.action;
    this.formResult = story.result;
    this.formTagsInput = (story.tags || []).join(', ');
    this.formImpactScore = story.impactScore || 85;
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  saveStoryForm(): void {
    if (!this.formTitle.trim()) {
      return;
    }

    const tagsArr = this.formTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const editId = this.editingStoryId();
    if (editId) {
      this.storyService.updateStory(editId, {
        title: this.formTitle.trim(),
        competency: this.formCompetency,
        situation: this.formSituation.trim(),
        task: this.formTask.trim(),
        action: this.formAction.trim(),
        result: this.formResult.trim(),
        tags: tagsArr,
        impactScore: Number(this.formImpactScore),
      });
    } else {
      this.storyService.addStory({
        title: this.formTitle.trim(),
        competency: this.formCompetency,
        situation: this.formSituation.trim(),
        task: this.formTask.trim(),
        action: this.formAction.trim(),
        result: this.formResult.trim(),
        tags: tagsArr,
        impactScore: Number(this.formImpactScore),
      });
    }

    this.closeModal();
  }

  toggleExpand(id: string): void {
    this.expandedStoryId.update((current: string | null) => (current === id ? null : id));
  }

  deleteStory(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this STAR story from your repository?')) {
      this.storyService.deleteStory(id);
    }
  }

  copyFormattedStar(story: StarStory, event: Event): void {
    event.stopPropagation();
    const formatted = `STAR Achievement: ${story.title}
Competency: ${story.competency}

[SITUATION]
${story.situation}

[TASK]
${story.task}

[ACTION]
${story.action}

[RESULT]
${story.result}`;

    navigator.clipboard.writeText(formatted);
    this.copiedStoryId.set(story.id);
    setTimeout(() => this.copiedStoryId.set(null), 2500);
  }

  getCompetencyBadgeColor(competency: string): string {
    const comp = (competency || '').toLowerCase();
    if (comp.includes('conflict')) return 'bg-rose-500/10 border-rose-500/30 text-rose-300';
    if (comp.includes('leadership')) return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
    if (comp.includes('failure')) return 'bg-purple-500/10 border-purple-500/30 text-purple-300';
    if (comp.includes('problem')) return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
    if (comp.includes('system') || comp.includes('architecture')) return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300';
    if (comp.includes('performance')) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
    return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
  }
}
