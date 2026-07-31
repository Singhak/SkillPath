import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobRoleRequirement, SkillGapItem } from '../models/competency.model';
import { RatingApiService, Rating } from './apis/rating-api.service';
import { DEFAULT_JOB_ROLES } from '../../shared/constants';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobCompetencyService {
  private readonly http = inject(HttpClient);
  private readonly ratingApiService = inject(RatingApiService);
  private readonly apiUrl = `${environment.apiUrl}/job-roles`;

  readonly availableRoles = signal<JobRoleRequirement[]>(DEFAULT_JOB_ROLES);
  readonly selectedRoleId = signal<string>('ANGULAR_SR');
  readonly userRatings = signal<Map<string, number>>(new Map());

  readonly activeRole = computed(() => {
    return (
      this.availableRoles().find((r) => r.roleId === this.selectedRoleId()) ||
      this.availableRoles()[0]
    );
  });

  readonly skillGapAnalysis = computed<SkillGapItem[]>(() => {
    const role = this.activeRole();
    const userRatingsMap = this.userRatings();

    return role.competencies.map((comp) => {
      const current = userRatingsMap.get(comp.skillName) || 0;
      const gap = Math.max(0, comp.requiredRating - current);
      const percentage = Math.round((current / comp.requiredRating) * 100);

      let status: 'Mastered' | 'On Track' | 'Needs Practice' | 'Critical Gap' = 'Needs Practice';
      if (current >= comp.requiredRating) status = 'Mastered';
      else if (current === comp.requiredRating - 1) status = 'On Track';
      else if (current === 0) status = 'Critical Gap';

      return {
        skillName: comp.skillName,
        currentRating: current,
        requiredRating: comp.requiredRating,
        gapAmount: gap,
        readinessPercentage: Math.min(100, percentage),
        status,
      };
    });
  });

  readonly overallReadiness = computed<number>(() => {
    const gaps = this.skillGapAnalysis();
    if (!gaps.length) return 0;
    const totalPercentage = gaps.reduce((sum, item) => sum + item.readinessPercentage, 0);
    return Math.round(totalPercentage / gaps.length);
  });

  constructor() {
    this.fetchBackendRoles();
    this.refreshUserRatings();
  }

  fetchBackendRoles(): void {
    this.http.get<JobRoleRequirement[]>(this.apiUrl).subscribe({
      next: (roles) => {
        if (roles && roles.length > 0) {
          this.availableRoles.set(roles);
        }
      },
      error: () => { }
    });
  }

  refreshUserRatings(): void {
    this.ratingApiService.getSelfRating().subscribe((ratings: Rating[]) => {
      const map = new Map<string, number>();
      for (const r of ratings) {
        if (r.category && r.rating) {
          map.set(r.category, Number(r.rating));
        }
      }
      this.userRatings.set(map);
    });
  }

  setSelectedRole(roleId: string): void {
    this.selectedRoleId.set(roleId);
  }
}
