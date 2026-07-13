import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRate } from './skill-rate';

describe('SkillRate', () => {
  let component: SkillRate;
  let fixture: ComponentFixture<SkillRate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillRate],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillRate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
