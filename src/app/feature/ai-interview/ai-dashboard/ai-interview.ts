import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

interface InterviewCard {
  title: string;
  description: string;
  icon: string;
  link: string;
  badge: string;
}

@Component({
  selector: 'app-ai-interview',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink, DialogModule],
  templateUrl: './ai-interview.html',
  styleUrls: ['./ai-interview.css'],
})
export class AiInterviewComponent {

  interviewCards: InterviewCard[] = [
    {
      title: 'AI Mock Interview',
      description:
        'Simulate a real interview with an AI interviewer. Get instant feedback on your answers, communication, and confidence.',
      icon: 'pi pi-android',
      link: 'mock',
      badge: 'Most Popular',
    },
    {
      title: 'AI Interview Practice',
      description:
        'Practice common interview questions for your role. The AI will guide you through different topics and scenarios.',
      icon: 'pi pi-sparkles',
      link: 'interview',
      badge: 'AI Powered',
    },
    {
      title: 'Job Profile Interview',
      description:
        'Tailor your practice to a specific job description. Paste a JD and get hyper-relevant interview questions instantly.',
      icon: 'pi pi-briefcase',
      link: 'job-profile',
      badge: 'Tailored',
    },
  ];
}