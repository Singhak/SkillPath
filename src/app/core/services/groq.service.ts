import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AIQuestion } from './ai-question';

@Injectable({
  providedIn: 'root',
})
export class GroqService {
  private http = inject(HttpClient);
  // In a real app, you'd use environment variables for the API key and URL
  private readonly apiKey = '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';
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly model = 'llama-3.3-70b-versatile';

  getInterviewQuestions(
    topic: string,
    userRole = 'software engineering',
  ): Observable<AIQuestion[]> {
    return of<any>([
      { id: 1, text: 'What is dependency injection in Angular?' },
      { id: 2, text: 'Explain the difference between a component and a directive.' },
    ]);
    const systemPrompt = `You are an AI interviewer. Your task is to generate 5 interview questions based on the provided topic.
    The questions should be suitable for a technical interview for a ${userRole} role.
    Return the questions as a JSON object with a "questions" property containing an array of objects, where each object has an "id" and a "text" property.
    Do not include any other text or explanations in your response, just the JSON object.
    Example format:
    {
      "questions": [
        { "id": 1, "text": "What is dependency injection in Angular?" },
        { "id": 2, "text": "Explain the difference between a component and a directive." }
      ]
    }`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `The topic is: ${topic}`,
        },
      ],
      model: this.model,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((response) => {
        try {
          const content = JSON.parse(response.choices[0].message.content);
          return content.questions || [];
        } catch (error) {
          console.error('Error parsing JSON from Groq API:', error);
          return [];
        }
      }),
    );
  }

  evaluateAnswer(question: string, answer: string): Observable<AIEvaluationResult> {
    return of({
      score: 0,
      feedback: 'Sorry, there was an error evaluating your answer. Please                                                                                                                                                   try again.',
      idealAnswer: 'No ideal answer available due to an error.',
    });
    const systemPrompt = `You are an AI interviewer evaluating a candidate's answer to a technical question.
    Provide feedback on the answer, suggest improvements, and give a score from 0 to 100.
    Also, provide an ideal answer for the question.
    Return the evaluation as a JSON object with three properties: "score", "feedback", and "idealAnswer".
    The "score" should be a number.
    The "feedback" should be a string of constructive criticism and suggestions.
    The "idealAnswer" should be a string containing a well-explained, ideal answer to the question.
    Do not include any other text or explanations in your response, just the JSON object.`;                           

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Question: "${question}"\n\nCandidate's Answer: "${answer}"`,
        },
      ],
      model: this.model,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((response) => {
        try {
          return JSON.parse(response.choices[0].message.content);
        } catch (error) {
          console.error('Error parsing JSON from Groq API for evaluation:', error);
          return {
            score: 0,
            feedback: 'Sorry, there was an error evaluating your answer. Please try again.',
            idealAnswer: 'No ideal answer available due to an error.',
          };
        }
      }),
    );
  }

  getInterviewQuestions1(topic: string, role: string) {
    return this.http.post<AIQuestion[]>('/api/interview/getQuestions.php', {
      topic,
      userRole: role,
    });
  }

  evaluateAnswer1(question: string, answer: string) {
    return this.http.post<AIEvaluationResult>('/api/interview/evaluateAnswer.php', {
      question,
      answer,
    });
  }
}
