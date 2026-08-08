import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

declare const webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class SpeechToTextService {

    private recognition: any;

    readonly transcript$ = new Subject<string>();
    readonly listening$ = new Subject<boolean>();
    readonly error$ = new Subject<string>();

    constructor(private readonly zone: NgZone) {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();

            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.zone.run(() => this.listening$.next(true));
            };

            this.recognition.onend = () => {
                this.zone.run(() => this.listening$.next(false));
            };

            this.recognition.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = 0; i < event.results.length; i++) {
                    const transcriptPiece = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcriptPiece;
                    } else {
                        interimTranscript += transcriptPiece;
                    }
                }

                this.zone.run(() => {
                    this.transcript$.next(finalTranscript + interimTranscript);
                });
            };

            this.recognition.onerror = (event: any) => {
                this.zone.run(() => {
                    switch (event.error) {
                        case 'not-allowed':
                            this.error$.next(
                                'Microphone permission was denied. Please allow microphone access.'
                            );
                            break;

                        case 'audio-capture':
                            this.error$.next(
                                'No microphone was found. Please connect a microphone.'
                            );
                            break;

                        case 'network':
                            this.error$.next(
                                'A network error occurred during speech recognition.'
                            );
                            break;

                        case 'no-speech':
                            this.error$.next(
                                'No speech was detected. Please try speaking again.'
                            );
                            break;

                        case 'aborted':
                            this.error$.next('Speech recognition was stopped.');
                            break;

                        default:
                            this.error$.next(
                                'Speech recognition failed. Please try again.'
                            );
                    }
                });
            };
        }
    }

    start(lang = 'en-US') {
        if (!this.recognition) {
            this.error$.next(
                'Speech recognition is not supported in this browser. Please use the latest version of Chrome or Microsoft Edge.'
            );
            return;
        }

        this.recognition.lang = lang;

        try {
            this.recognition.start();
        } catch {
            this.error$.next('Speech recognition is already running.');
        }
    }

    stop() {
        this.recognition?.stop();
    }
}