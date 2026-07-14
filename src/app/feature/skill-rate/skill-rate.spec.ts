import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizService } from '../service/quiz-service';
import { SkillRate } from './skill-rate';

describe('SkillRate', () => {
  let component: SkillRate;
  let fixture: ComponentFixture<SkillRate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillRate],
      providers: [QuizService],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillRate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a new self rating entry when the user saves one', () => {
    component.selectedSkill.set('React');
    component.selectedRating.set(5);

    component.onClickAdd();

    expect(component.skillRatings().some((entry) => entry.skill === 'React' && entry.rating === 5)).toBeTrue();
  });
});
