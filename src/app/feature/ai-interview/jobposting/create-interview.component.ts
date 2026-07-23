import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { Panel } from "primeng/panel";

type UploadMode = 'text' | 'upload';

@Component({
  selector: 'app-create-interview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TextareaModule,
    TabsModule,
    ProgressSpinnerModule,
    TagModule,
    Panel
],
  templateUrl: './create-interview.component.html',
})
export class CreateInterviewComponent {
  readonly stepstoFollow = [
    'Extract Required Skills',
    'Generate Technical Questions',
    'Behavioral Questions',
    'Coding Questions',
    'Difficulty Detection',
  ];
  mode = signal<UploadMode>('text');

  loading = signal(false);

  selectedFile = signal<File | null>(null);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      jobDescription: ['', Validators.required],
    });
  }

  changeMode(mode: UploadMode) {
    this.mode.set(mode);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedFile.set(input.files[0]);
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  generateQuestions() {
    if (this.mode() === 'text' && this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    // Backend API

    setTimeout(() => {
      this.loading.set(false);

      console.log({
        mode: this.mode(),
        jobDescription: this.form.value.jobDescription,
        file: this.selectedFile(),
      });
    }, 2000);
  }
}
