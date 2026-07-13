import { Injectable, Service } from '@angular/core';
import { Question } from '../../shared/components/quiz/quiz';
// import jsonData from './quizs.json' with { type: 'json' };


@Service()
export class QuizService {
    async getQuizes(): Promise<Question[]> {
        const response = await fetch('/assests/quizs.json');
        return response.json();
    }

    async getQuizAttempts() {
        const response = await fetch('/assests/dumy_Data.json');
        return response.json().then((data) => {
            return data.filter((item: any) => item["table"] == "quiz_attempts")[0]['records']
        });
    }
    async getRating() {
        const response = await fetch('/assests/dumy_Data.json');
        return response.json().then((data) => {
            return data.filter((item: any) => item["table"] == "rating")[0]['records']
        });
    }
    async getQuizStats() {
        const response = await fetch('/assests/dumy_Data.json');
        return response.json().then((data) => {
            return data.filter((item: any) => item["table"] == "quiz_stats")['records']
        });
    }
    async getUserTable() {
        const response = await fetch('/assests/dumy_Data.json');
        return response.json().then((data) => {
            return data.filter((item: any) => item["table"] == "user_table")['records']
        });
    }
}
