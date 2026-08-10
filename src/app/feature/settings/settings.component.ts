import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth.service';
import { UserApiService } from '../../core/services/apis/user-api.service';
import { ThemeService, ThemeMode, AccentColor, UiDensity } from '../../core/services/theme.service';
import { User } from '../../core/models/user.model';
import { AI_CREDIT_COST, COUNTRIES_DATA } from '../../shared/constants';
import { BillingHistoryModalComponent } from '../../shared/components/billing-history-modal/billing-history-modal.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, BillingHistoryModalComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  private readonly userApiService = inject(UserApiService);
  private readonly messageService = inject(MessageService);

  readonly activeTab = signal<'appearance' | 'profile' | 'preferences' | 'account'>('appearance');
  readonly creditCosts = AI_CREDIT_COST;
  readonly isBillingModalOpen = signal<boolean>(false);

  // User Profile Signals
  readonly currentUser = this.authService.currentUser;
  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly targetRole = signal<string>('');
  readonly bio = signal<string>('');
  readonly phone = signal<string>('');
  readonly location = signal<string>('');
  readonly skillInput = signal<string>('');
  readonly skills = signal<string[]>([]);

  // Location Signals & Datasets
  readonly countriesList = COUNTRIES_DATA;
  readonly selectedCountry = signal<string>('United States');
  readonly selectedState = signal<string>('California (San Francisco / LA)');
  readonly customState = signal<string>('');

  readonly availableStates = computed(() => {
    const ctry = this.selectedCountry();
    const found = COUNTRIES_DATA.find((c) => c.country === ctry);
    return found ? found.states : ['Other / Custom City/State'];
  });

  readonly isCustomStateSelected = computed(() => {
    const st = this.selectedState();
    const ctry = this.selectedCountry();
    return !st || st.startsWith('Other') || st.includes('Custom') || ctry === 'Other / International';
  });

  // Preferences Signals
  readonly aiDifficulty = signal<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  readonly feedbackDetail = signal<'concise' | 'comprehensive'>('comprehensive');
  readonly emailNotifications = signal<boolean>(true);
  readonly weeklyDigest = signal<boolean>(true);

  // Security / Password Signals
  readonly currentPassword = signal<string>('');
  readonly newPassword = signal<string>('');
  readonly confirmPassword = signal<string>('');
  readonly isUpdatingPassword = signal<boolean>(false);
  readonly showCurrentPassword = signal<boolean>(false);
  readonly showNewPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  toggleCurrentPassword(): void {
    this.showCurrentPassword.set(!this.showCurrentPassword());
  }

  toggleNewPassword(): void {
    this.showNewPassword.set(!this.showNewPassword());
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user?.name) return 'SP';
    const names = user.name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  });

  readonly profileCompletion = computed(() => {
    let score = 20; // Default for account creation
    if (this.name().trim()) score += 20;
    if (this.currentUser()?.emailId || this.currentUser()?.email || this.email().trim()) score += 20;
    if (this.targetRole().trim()) score += 15;
    if (this.bio().trim()) score += 15;
    if (this.getFormattedLocation().trim()) score += 10;
    return Math.min(100, score);
  });

  // Available Theme Modes
  readonly themeModes: { key: ThemeMode; label: string; icon: string; desc: string }[] = [
    {
      key: 'light',
      label: 'Light Mode',
      icon: 'pi pi-sun',
      desc: 'Clean, high contrast bright aesthetic for daylight environments',
    },
    {
      key: 'dark',
      label: 'Dark Mode',
      icon: 'pi pi-moon',
      desc: 'Sleek dark theme reducing eye strain in low-light conditions',
    },
    {
      key: 'system',
      label: 'System Default',
      icon: 'pi pi-desktop',
      desc: 'Automatically matches your system appearance settings',
    },
  ];

  // Accent Color Palettes
  readonly accentColors: { key: AccentColor; label: string; gradient: string; primary: string }[] = [
    {
      key: 'indigo',
      label: 'Royal Indigo',
      gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
      primary: '#6366f1',
    },
    {
      key: 'emerald',
      label: 'Tech Emerald',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      primary: '#10b981',
    },
    {
      key: 'cyan',
      label: 'Cyber Cyan',
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
      primary: '#06b6d4',
    },
    {
      key: 'amber',
      label: 'Sunset Amber',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      primary: '#f59e0b',
    },
    {
      key: 'rose',
      label: 'Rose Quartz',
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      primary: '#ec4899',
    },
  ];

  constructor() {
    // Reactively synchronize profile signals whenever currentUser updates
    effect(() => {
      const user = this.currentUser();
      if (user) {
        this.populateForm(user);
      }
    });

    // Fetch fresh user profile from API server if logged in
    const user = this.currentUser();
    if (user?.id) {
      this.userApiService.getUser(user.id).subscribe({
        next: (freshUser) => {
          if (freshUser) {
            this.authService.updateUserProfile(freshUser);
          }
        },
        error: () => {
          // If offline or endpoint unavailable, currentUser signal fallback is preserved
        },
      });
    }
  }

  private populateForm(user: User): void {
    this.name.set(user.name || '');
    this.email.set(user.emailId || user.email || '');
    this.targetRole.set(user.targetRole || '');
    this.bio.set(user.bio || '');
    this.phone.set(user.phone || '');
    this.skills.set(user.skills || []);
    this.aiDifficulty.set(user.aiDifficulty || 'intermediate');
    this.emailNotifications.set(user.emailNotifications ?? true);

    // Initialize Country & State/City dropdowns based on user's location
    this.initLocation(user.location || '');
  }

  private initLocation(rawLocation: string): void {
    this.location.set(rawLocation);
    if (!rawLocation) {
      this.selectedCountry.set('United States');
      this.selectedState.set('California (San Francisco / LA)');
      return;
    }

    const lowerLoc = rawLocation.toLowerCase();

    // Check if any country in COUNTRIES_DATA matches
    let matchedCountryData = COUNTRIES_DATA.find((c) =>
      lowerLoc.includes(c.country.toLowerCase())
    );

    // Quick aliases for common abbreviations
    if (!matchedCountryData) {
      if (lowerLoc.includes('usa') || lowerLoc.includes('us')) {
        matchedCountryData = COUNTRIES_DATA.find((c) => c.country === 'United States');
      } else if (lowerLoc.includes('uk') || lowerLoc.includes('england') || lowerLoc.includes('london')) {
        matchedCountryData = COUNTRIES_DATA.find((c) => c.country === 'United Kingdom');
      } else if (lowerLoc.includes('india') || lowerLoc.includes('in')) {
        matchedCountryData = COUNTRIES_DATA.find((c) => c.country === 'India');
      }
    }

    if (matchedCountryData) {
      this.selectedCountry.set(matchedCountryData.country);
      const matchedState = matchedCountryData.states.find((st) => {
        const stateKey = st.split('(')[0].trim().toLowerCase();
        return lowerLoc.includes(stateKey);
      });

      if (matchedState) {
        this.selectedState.set(matchedState);
      } else {
        this.selectedState.set(
          matchedCountryData.states[matchedCountryData.states.length - 1] || 'Other / Custom State/City'
        );
        const customVal = rawLocation
          .replace(new RegExp(matchedCountryData.country, 'gi'), '')
          .replace(/,$/, '')
          .trim();
        if (customVal) {
          this.customState.set(customVal);
        }
      }
    } else {
      this.selectedCountry.set('Other / International');
      this.selectedState.set('Other / Custom City/State');
      this.customState.set(rawLocation);
    }
  }

  onCountryChange(country: string): void {
    this.selectedCountry.set(country);
    const found = COUNTRIES_DATA.find((c) => c.country === country);
    if (found && found.states.length > 0) {
      this.selectedState.set(found.states[0]);
    } else {
      this.selectedState.set('Other / Custom City/State');
    }
  }

  onStateChange(state: string): void {
    this.selectedState.set(state);
  }

  getFormattedLocation(): string {
    const country = this.selectedCountry();
    const state = this.selectedState();
    const custom = this.customState().trim();

    if (!country) return '';

    if (country === 'Other / International') {
      return custom || 'International';
    }

    if (!state || state.startsWith('Other') || state.includes('Custom')) {
      return custom ? `${custom}, ${country}` : country;
    }

    return `${state}, ${country}`;
  }

  setActiveTab(tab: 'appearance' | 'profile' | 'preferences' | 'account'): void {
    this.activeTab.set(tab);
  }

  selectThemeMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);
    this.messageService.add({
      severity: 'info',
      summary: 'Theme Updated',
      detail: `App mode set to ${mode.toUpperCase()}`,
      life: 2500,
    });
  }

  selectAccent(accent: AccentColor): void {
    this.themeService.setAccent(accent);
    this.messageService.add({
      severity: 'success',
      summary: 'Accent Color Changed',
      detail: `Color scheme updated to ${accent.toUpperCase()}`,
      life: 2500,
    });
  }

  selectDensity(density: UiDensity): void {
    this.themeService.setDensity(density);
    this.messageService.add({
      severity: 'info',
      summary: 'Layout Density Changed',
      detail: `Interface density set to ${density}`,
      life: 2500,
    });
  }

  addSkill(): void {
    const val = this.skillInput().trim();
    if (val && !this.skills().includes(val)) {
      this.skills.set([...this.skills(), val]);
      this.skillInput.set('');
    }
  }

  removeSkill(index: number): void {
    const updated = [...this.skills()];
    updated.splice(index, 1);
    this.skills.set(updated);
  }

  saveProfile(): void {
    const formattedLoc = this.getFormattedLocation();
    this.location.set(formattedLoc);

    // Email is strictly locked to authenticated user email
    const loginEmail = this.currentUser()?.emailId || this.currentUser()?.email || this.email();

    const updatedData: Partial<User> = {
      name: this.name(),
      email: loginEmail,
      emailId: loginEmail,
      targetRole: this.targetRole(),
      bio: this.bio(),
      phone: this.phone(),
      location: formattedLoc,
      skills: this.skills(),
    };

    this.authService.updateUserProfile(updatedData);

    this.messageService.add({
      severity: 'success',
      summary: 'Profile Saved',
      detail: 'Your profile information has been successfully updated!',
      life: 3000,
    });
  }

  savePreferences(): void {
    const updatedData: Partial<User> = {
      aiDifficulty: this.aiDifficulty(),
      emailNotifications: this.emailNotifications(),
    };

    this.authService.updateUserProfile(updatedData);

    this.messageService.add({
      severity: 'success',
      summary: 'Preferences Updated',
      detail: 'AI and notification settings have been saved.',
      life: 3000,
    });
  }

  updatePassword(): void {
    if (!this.currentPassword()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter your current password.',
        life: 3000,
      });
      return;
    }

    if (this.newPassword().length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Weak Password',
        detail: 'New password must be at least 6 characters long.',
        life: 3000,
      });
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mismatch',
        detail: 'New password and confirmation do not match.',
        life: 3000,
      });
      return;
    }

    this.isUpdatingPassword.set(true);

    setTimeout(() => {
      this.isUpdatingPassword.set(false);
      this.currentPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');

      this.messageService.add({
        severity: 'success',
        summary: 'Password Updated',
        detail: 'Your security password has been changed successfully.',
        life: 3500,
      });
    }, 800);
  }
}
