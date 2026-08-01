import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InterviewerCopilotService } from '../../../core/services/interviewer-copilot.service';
import {
  InterviewRequirementConfig,
  TechWeightConfig,
  ExperienceLevel,
  InterviewRoundType,
  TeamTemplate,
} from '../../../core/models/interviewer-studio.model';

@Component({
  selector: 'app-studio-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './studio-wizard.html',
  styleUrls: ['./studio-wizard.css'],
})
export class StudioWizardComponent {
  private readonly copilotService = inject(InterviewerCopilotService);
  private readonly router = inject(Router);

  teamTemplates = this.copilotService.teamTemplates;

  // Wizard state
  jobTitle = 'Senior MEAN Stack + AWS Architect';
  candidateName = 'Alex Mercer';
  experienceLevel: ExperienceLevel = 'Senior (5-8 Yrs)';
  roundType: InterviewRoundType = 'Deep Technical (60 Min)';
  totalDurationMinutes = 60;

  experienceLevels: ExperienceLevel[] = [
    'Junior (0-2 Yrs)',
    'Mid-Level (2-5 Yrs)',
    'Senior (5-8 Yrs)',
    'Staff / Lead (8+ Yrs)',
  ];

  roundTypes: InterviewRoundType[] = [
    'Screening (30 Min)',
    'Deep Technical (60 Min)',
    'System Design & Architecture (60 Min)',
    'Behavioral & Leadership (45 Min)',
  ];

  technologies: TechWeightConfig[] = [
    { name: 'JavaScript / Node.js', weightPercentage: 30, questionCount: 3 },
    { name: 'Angular (v15+)', weightPercentage: 25, questionCount: 2 },
    { name: 'MongoDB & Mongoose', weightPercentage: 20, questionCount: 2 },
    { name: 'AWS Cloud Services', weightPercentage: 15, questionCount: 2 },
    { name: 'Behavioral & System Design', weightPercentage: 10, questionCount: 1 },
  ];

  difficultyDistribution = {
    easyPercentage: 20,
    mediumPercentage: 50,
    hardPercentage: 30,
  };

  newTechName = '';
  customNotes = '';

  selectTemplate(template: TeamTemplate): void {
    this.jobTitle = template.role;
    this.experienceLevel = template.experienceLevel;
    this.roundType = template.roundType;
    this.technologies = template.technologies.map((t) => ({ ...t }));
  }

  addTechnology(): void {
    if (!this.newTechName.trim()) return;
    const name = this.newTechName.trim();
    if (!this.technologies.find((t) => t.name.toLowerCase() === name.toLowerCase())) {
      this.technologies.push({
        name,
        weightPercentage: 15,
        questionCount: 2,
      });
      this.normalizeWeights();
    }
    this.newTechName = '';
  }

  removeTechnology(index: number): void {
    if (this.technologies.length > 1) {
      this.technologies.splice(index, 1);
      this.normalizeWeights();
    }
  }

  normalizeWeights(): void {
    const total = this.technologies.reduce((sum, t) => sum + t.weightPercentage, 0);
    if (total > 0 && total !== 100) {
      this.technologies.forEach((t) => {
        t.weightPercentage = Math.round((t.weightPercentage / total) * 100);
      });
    }
  }

  get totalWeight(): number {
    return this.technologies.reduce((sum, t) => sum + t.weightPercentage, 0);
  }

  get totalQuestionsCount(): number {
    return this.technologies.reduce((sum, t) => sum + t.questionCount, 0);
  }

  saveAsTeamTemplate(): void {
    const title = prompt('Enter a title for this Team Template:', `${this.jobTitle} Template`);
    if (!title) return;

    const template: TeamTemplate = {
      id: `custom-${Date.now()}`,
      title,
      description: `Custom team template for ${this.jobTitle} (${this.experienceLevel}).`,
      role: this.jobTitle,
      experienceLevel: this.experienceLevel,
      roundType: this.roundType,
      technologies: [...this.technologies],
      tags: [this.jobTitle, ...this.technologies.map((t) => t.name)],
    };

    this.copilotService.saveCustomTemplate(template);
    alert('✅ Template saved to Team Library!');
  }

  generateAndStartSession(): void {
    const config: InterviewRequirementConfig = {
      jobTitle: this.jobTitle,
      candidateName: this.candidateName,
      experienceLevel: this.experienceLevel,
      roundType: this.roundType,
      totalDurationMinutes: this.totalDurationMinutes,
      technologies: this.technologies,
      difficultyDistribution: this.difficultyDistribution,
      customNotes: this.customNotes,
    };

    this.copilotService.generateInterviewMatrix(config);
    this.router.navigate(['/interviewer-studio/session']);
  }
}
