import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from "primeng/floatlabel"
import { PanelModule } from 'primeng/panel';
import { MeterGroup } from 'primeng/metergroup';
import { ChartView } from "../../shared/components/chart-view/chart-view";
import { Fieldset } from "primeng/fieldset";

@Component({
  selector: 'app-skill-rate',
  standalone: true,
  imports: [ButtonModule, SelectModule, FormsModule, FloatLabel, PanelModule, MeterGroup, ChartView,  Fieldset],
  templateUrl: './skill-rate.html',
  styleUrl: './skill-rate.css',
})
export class SkillRate implements OnInit {
  onClickAdd() {
    throw new Error('Method not implemented.');
  }

  rating = signal('');
  skill = signal('');
  ratings = signal<string[]>([])
  skills = signal<string[]>([])
  value = [
    { label: 'Space used', value: 15, color: 'var(--p-primary-color)' }
  ];

  ngOnInit(): void {
    // throw new Error('Method not implemented.');

  }


}
