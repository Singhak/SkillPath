import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, DividerModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePageComponent implements OnInit {
  constructor(private meta: Meta, private title: Title) {}

  ngOnInit() {
    this.title.setTitle('SkillPath - Master Your Interviews');
    this.meta.addTags([
      { name: 'description', content: 'Practice with confidence. Answer interview-style questions, receive guidance, and sharpen your communication rhythm.' },
      { name: 'keywords', content: 'interview, practice, AI, skills, gamification, software engineering' },
      { property: 'og:title', content: 'SkillPath - Master Your Interviews' },
      { property: 'og:description', content: 'Practice with confidence and improve every session with SkillPath.' }
    ]);
  }

  readonly features = [
    {
      title: 'Practice with confidence',
      description: 'Answer interview-style questions, receive guidance, and sharpen your communication rhythm.',
      icon: 'pi pi-check-circle',
    },
    {
      title: 'Track your progress',
      description: 'See your quiz history, accuracy, and performance trends in one calm dashboard.',
      icon: 'pi pi-chart-line',
    },
    {
      title: 'Improve every session',
      description: 'Use hints, review your score, and return stronger with a focused learning loop.',
      icon: 'pi pi-lightbulb',
    },
    {
      title: 'Stay ready for real interviews',
      description: 'Prepare for technical and behavioral conversations with practical, bite-sized practice.',
      icon: 'pi pi-microchip-ai',
    },
  ];
}
