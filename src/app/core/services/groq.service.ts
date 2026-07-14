import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AIQuestion } from './question';

@Injectable({
  providedIn: 'root'
})
export class GroqService {
  private http = inject(HttpClient);
  // In a real app, you'd use environment variables for the API key and URL
  private readonly apiKey = 'YOUR_GROQ_API_KEY';
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  getInterviewQuestions(topic: string): Observable<AIQuestion[]> {
    // This is a mocked response.
    // In a real implementation, you would make an HTTP POST request to Groq API
    // to generate questions based on the topic.
    console.log(`Fetching questions for topic: ${topic}`);
    const mockQuestions: AIQuestion[] = [
      { id: 1, text: `What is the core concept of ${topic}?` },
      { id: 2, text: `How does ${topic} handle state management?` },
      { id: 3, text: `Describe a challenging problem you solved with ${topic}.` }
    ];
    return of(mockQuestions);
  }

  evaluateAnswer(question: string, answer: string): Observable<string> {
    // This is a mocked response for evaluation.
    console.log(`Evaluating answer for: "${question}"\nAnswer: "${answer}"`);
    const mockFeedback = `That's a solid start. To make your answer even stronger, you could elaborate on the practical applications and also mention potential drawbacks or alternative approaches. Keep it up!`;
    return of(mockFeedback);
  }
}