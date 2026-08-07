import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  features = [
    {
      icon: 'pi-microchip-ai',
      title: 'AI Mock Interview Studio',
      description: 'Simulate real-world technical and behavioral rounds with instant speech-to-text transcriptions and STAR scoring.'
    },
    {
      icon: 'pi-file-check',
      title: 'ATS & STAR Resume Optimizer',
      description: 'Extract skills, fix formatting gaps, and transform ordinary resume bullet points into impact-driven STAR achievements.'
    },
    {
      icon: 'pi-bolt',
      title: 'Skill Benchmark Quizzes',
      description: 'Validate your tech stack proficiency with timed quizzes and dynamic skill matrix rating system.'
    },
    {
      icon: 'pi-shield',
      title: 'Confidence Engine',
      description: 'Walk into real interview panels with total clarity, knowing your answers are honed and field-tested.'
    }
  ];

  stats = [
    { value: '100%', label: 'AI Driven Feedback' },
    { value: 'STAR', label: 'Framework Aligned' },
    { value: '24/7', label: 'Practice Studio' },
    { value: '0$', label: 'Free Trial Available' }
  ];
}
