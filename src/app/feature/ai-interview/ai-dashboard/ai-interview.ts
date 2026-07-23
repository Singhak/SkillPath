import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button'; 
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { MockInterviewComponent } from './mock-interview.component';


interface InterviewCard {
  title: string;
  description: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-ai-interview',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterLink, DialogModule],
  templateUrl: './ai-interview.html',
  styleUrls: ['./ai-interview.css'],
})
export class AiInterviewComponent {
  showMockInterviewDialog = false;

  interviewCards: InterviewCard[] = [
    {
      title: 'AI Mock Interview',
      description: 'Simulate a real interview with an AI interviewer. Get instant feedback on your answers, communication, and confidence.',
      icon: 'pi pi-android',
      link: 'mock',
    },
    {
      title: 'AI Interview Practice',
      description: 'Practice common interview questions for your role. The AI will guide you through different topics and scenarios.',
      icon: 'pi pi-sparkles',
      link: 'interview',
    },
    {
      title: 'AI Job Profile Based Interview',
      description: 'Tailor your practice to a specific job description. Upload a job profile and get relevant questions.',
      icon: 'pi pi-briefcase',
      link: 'job-profile',
    },
    {
      title: 'Behavioral Interview Practice',
      description: 'Master the STAR method and answer behavioral questions effectively with AI-driven scenarios and feedback.',
      icon: 'pi pi-users',
      link: 'behavioral',
    },
  ];

}