import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare var webkitSpeechRecognition: any;

export interface VoiceState {
    listening: boolean;
    speaking: boolean;
    transcript: string;
    error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class VoiceService {

    private recognition: any;
    private synthesis = window.speechSynthesis;

    private state = new BehaviorSubject<VoiceState>({
        listening: false,
        speaking: false,
        transcript: '',
        error: null
    });

    state$ = this.state.asObservable();

    constructor(private zone: NgZone) {
        this.initializeSpeechRecognition();
    }

    // ------------------------
    // Speech Recognition
    // ------------------------

    private initializeSpeechRecognition() {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            webkitSpeechRecognition;

        if (!SpeechRecognition) {
            return;
        }

        this.recognition = new SpeechRecognition();

        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.updateState({
                listening: true,
                error: null
            });
        };

        this.recognition.onend = () => {
            this.updateState({
                listening: false
            });
        };

        this.recognition.onresult = (event: any) => {

            let transcript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            this.updateState({
                transcript
            });

        };

        this.recognition.onerror = (event: any) => {

            const messages: any = {
                'not-allowed': 'Microphone permission denied.',
                'audio-capture': 'Microphone not found.',
                'network': 'Network error.',
                'no-speech': 'No speech detected.',
                'aborted': 'Recognition stopped.'
            };

            this.updateState({
                error: messages[event.error] ?? 'Speech recognition failed.',
                listening: false
            });

        };
    }

    startListening(lang = 'en-US') {

        if (!this.recognition) {
            this.updateState({
                error: 'Speech recognition is not supported in this browser.'
            });
            return;
        }

        this.recognition.lang = lang;

        try {
            this.recognition.start();
        } catch {
            // already started
        }

    }

    stopListening() {
        this.recognition?.stop();
    }

    // ------------------------
    // Text To Speech
    // ------------------------

    speak(
        text: string,
        options?: {
            lang?: string;
            rate?: number;
            pitch?: number;
            volume?: number;
            voiceName?: string;
        }
    ) {

        if (!('speechSynthesis' in window)) {

            this.updateState({
                error: 'Text-to-Speech is not supported.'
            });

            return;
        }

        this.stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = options?.lang ?? 'en-US';
        utterance.rate = options?.rate ?? 1;
        utterance.pitch = options?.pitch ?? 1;
        utterance.volume = options?.volume ?? 1;

        if (options?.voiceName) {

            const voice = this.getVoices()
                .find(v => v.name === options.voiceName);

            if (voice) {
                utterance.voice = voice;
            }

        }

        utterance.onstart = () => {
            this.updateState({
                speaking: true
            });
        };

        utterance.onend = () => {
            this.updateState({
                speaking: false
            });
        };

        utterance.onerror = () => {
            this.updateState({
                speaking: false,
                error: 'Unable to speak.'
            });
        };

        this.synthesis.speak(utterance);

    }

    stopSpeaking() {
        this.synthesis.cancel();
        this.updateState({
            speaking: false
        });
    }

    pauseSpeaking() {
        this.synthesis.pause();
    }

    resumeSpeaking() {
        this.synthesis.resume();
    }

    getVoices(): SpeechSynthesisVoice[] {
        return this.synthesis.getVoices();
    }

    // ------------------------
    // Helpers
    // ------------------------

    isSpeechRecognitionSupported() {
        return !!this.recognition;
    }

    isTextToSpeechSupported() {
        return 'speechSynthesis' in window;
    }

    private updateState(value: Partial<VoiceState>) {

        this.zone.run(() => {

            this.state.next({
                ...this.state.value,
                ...value
            });

        });

    }

}