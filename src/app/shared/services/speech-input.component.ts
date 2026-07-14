import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Assuming PrimeNG buttons based on other files
import { SpeechToTextService } from './speech-to-text-service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-speech-input',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
    <div class="speech-input-container">
      <button pButton type="button" label="Start Recording" (click)="startRecording()" [disabled]="isListening()"></button>
      <button pButton type="button" label="Stop Recording" (click)="stopRecording()" [disabled]="!isListening()"></button>
      <p class="output-text">{{ outputText() }}</p>
      <p *ngIf="errorMessage()" class="error-message">{{ errorMessage() }}</p>
    </div>
  `,
    styles: [`
    .speech-input-container {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 20px;
    }
    .output-text {
      margin: 0;
      font-weight: bold;
    }
    .error-message {
      color: red;
      margin: 0;
    }
  `]
})
export class SpeechInputComponent implements OnInit, OnDestroy {
    private speechToTextService = inject(SpeechToTextService);
    private messageService = inject(MessageService);

    outputText = signal('Press "Start Recording" to begin.');
    errorMessage = signal('');
    isListening = signal(false);

    ngOnInit(): void {
        this.speechToTextService.listening$.subscribe(() => {
            this.outputText.set('Listening...');
            this.errorMessage.set('');
            this.isListening.set(true);
        });

        this.speechToTextService.transcript$.subscribe(() => {
            this.outputText.set('Stopped listening.');
            this.isListening.set(false);
        });

        this.speechToTextService.transcript$.subscribe((transcript: string) => {
            this.outputText.set('You said: ' + transcript);
            this.isListening.set(false);
        });

        this.speechToTextService.error$.subscribe(message => {
            this.messageService.add({
                severity: 'warn',
                summary: 'Speech Recognition',
                detail: message
            });
        });
    }

    startRecording(): void {
        this.speechToTextService.start();
    }

    stopRecording(): void {
        this.speechToTextService.stop();
    }

    ngOnDestroy(): void {
        // The service is providedIn: 'root', so its instance persists.
        // Subscriptions from this component will be garbage collected when the component is destroyed.
        // For more complex scenarios or if the service wasn't root-provided, explicit unsubscription
        // using takeUntil or similar patterns would be recommended.
    }
}