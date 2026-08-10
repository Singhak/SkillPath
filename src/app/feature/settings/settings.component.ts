import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../core/services/auth.service';
import { UserApiService } from '../../core/services/apis/user-api.service';
import { ThemeService, ThemeMode, AccentColor, UiDensity } from '../../core/services/theme.service';
import { User } from '../../core/models/user.model';
import { AI_CREDIT_COST } from '../../shared/constants';
import { BillingHistoryModalComponent } from '../../shared/components/billing-history-modal/billing-history-modal.component';
import { LocationApiService, Country, State, City } from '../../core/services/apis/location-api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, SelectModule, BillingHistoryModalComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  private readonly userApiService = inject(UserApiService);
  private readonly locationApiService = inject(LocationApiService);
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

  // Location Signals & Datasets (from Backend Location API)
  readonly countriesList = signal<Country[]>([]);
  readonly statesList = signal<State[]>([]);
  readonly citiesList = signal<City[]>([]);

  readonly selectedCountryCode = signal<string>('');
  readonly selectedStateCode = signal<string>('');
  readonly selectedCityName = signal<string>('');
  readonly customLocationInput = signal<string>('');

  readonly isLoadingCountries = signal<boolean>(false);
  readonly isLoadingStates = signal<boolean>(false);
  readonly isLoadingCities = signal<boolean>(false);

  readonly selectedCountryObj = computed(() =>
    this.countriesList().find((c) => c.iso2 === this.selectedCountryCode())
  );

  readonly selectedStateObj = computed(() =>
    this.statesList().find((s) => s.iso2 === this.selectedStateCode())
  );

  readonly countryOptions = computed(() => {
    const list = this.countriesList().map((c) => ({ label: c.name, value: c.iso2 }));
    return [...list, { label: 'Other / International', value: 'OTHER' }];
  });

  readonly stateOptions = computed(() => {
    const list = this.statesList().map((s) => ({ label: s.name, value: s.iso2 }));
    if (list.length > 0 || this.selectedCountryCode()) {
      return [...list, { label: 'Other / Custom State', value: 'OTHER' }];
    }
    return list;
  });

  readonly cityOptions = computed(() => {
    const list = this.citiesList().map((ct) => ({ label: ct.name, value: ct.name }));
    if (list.length > 0 || this.selectedStateCode()) {
      return [...list, { label: 'Other / Custom City', value: 'OTHER' }];
    }
    return list;
  });

  readonly isCustomLocationSelected = computed(() => {
    return (
      this.selectedCountryCode() === 'OTHER' ||
      this.selectedStateCode() === 'OTHER' ||
      this.selectedCityName() === 'OTHER'
    );
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
    this.loadCountries();

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

  loadCountries(userLocation?: string): void {
    this.isLoadingCountries.set(true);
    this.locationApiService.getCountries().subscribe({
      next: (data) => {
        this.countriesList.set(data || []);
        this.isLoadingCountries.set(false);
        const locToParse = userLocation !== undefined ? userLocation : (this.currentUser()?.location || '');
        if (locToParse) {
          this.parseAndSetLocation(locToParse);
        }
      },
      error: () => {
        this.isLoadingCountries.set(false);
      },
    });
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
    this.location.set(user.location || '');

    if (this.countriesList().length > 0) {
      this.parseAndSetLocation(user.location || '');
    }
  }

  private parseAndSetLocation(rawLocation: string): void {
    if (!rawLocation) return;
    const parts = rawLocation.split(',').map((p) => p.trim()).filter(Boolean);
    const countries = this.countriesList();
    if (countries.length === 0) return;

    let matchedCountry: Country | undefined;
    for (let i = parts.length - 1; i >= 0; i--) {
      const partLower = parts[i].toLowerCase();
      matchedCountry = countries.find(
        (c) => c.name.toLowerCase() === partLower || c.iso2.toLowerCase() === partLower
      );
      if (matchedCountry) break;
    }

    if (!matchedCountry) {
      const rawLower = rawLocation.toLowerCase();
      if (rawLower.includes('usa') || rawLower.includes('united states')) {
        matchedCountry = countries.find((c) => c.iso2 === 'US');
      } else if (rawLower.includes('india')) {
        matchedCountry = countries.find((c) => c.iso2 === 'IN');
      } else if (rawLower.includes('uk') || rawLower.includes('united kingdom')) {
        matchedCountry = countries.find((c) => c.iso2 === 'GB');
      }
    }

    if (matchedCountry) {
      this.selectedCountryCode.set(matchedCountry.iso2);
      this.isLoadingStates.set(true);
      this.locationApiService.getStatesByCountry(matchedCountry.iso2).subscribe({
        next: (statesData) => {
          this.statesList.set(statesData || []);
          this.isLoadingStates.set(false);

          let matchedState: State | undefined;
          for (const part of parts) {
            const partLower = part.toLowerCase();
            matchedState = (statesData || []).find(
              (s) => s.name.toLowerCase() === partLower || s.iso2.toLowerCase() === partLower
            );
            if (matchedState) break;
          }

          if (matchedState) {
            this.selectedStateCode.set(matchedState.iso2);
            this.isLoadingCities.set(true);
            this.locationApiService
              .getCitiesByState(matchedCountry!.iso2, matchedState.iso2)
              .subscribe({
                next: (citiesData) => {
                  this.citiesList.set(citiesData || []);
                  this.isLoadingCities.set(false);

                  let matchedCity: City | undefined;
                  for (const part of parts) {
                    const partLower = part.toLowerCase();
                    matchedCity = (citiesData || []).find(
                      (ct) => ct.name.toLowerCase() === partLower
                    );
                    if (matchedCity) break;
                  }

                  if (matchedCity) {
                    this.selectedCityName.set(matchedCity.name);
                    this.customLocationInput.set('');
                  } else if (parts.length >= 3) {
                    this.selectedCityName.set(parts[0]);
                  } else {
                    this.customLocationInput.set('');
                  }
                },
                error: () => this.isLoadingCities.set(false),
              });
          } else if (parts.length >= 2) {
            this.customLocationInput.set(parts[0]);
          } else {
            this.customLocationInput.set('');
          }
        },
        error: () => this.isLoadingStates.set(false),
      });
    } else {
      this.customLocationInput.set(rawLocation);
    }
  }

  onCountryChange(countryCode: string): void {
    this.selectedCountryCode.set(countryCode);
    this.selectedStateCode.set('');
    this.statesList.set([]);
    this.selectedCityName.set('');
    this.citiesList.set([]);
    this.customLocationInput.set('');

    if (!countryCode || countryCode === 'OTHER') {
      return;
    }

    this.isLoadingStates.set(true);
    this.locationApiService.getStatesByCountry(countryCode).subscribe({
      next: (data) => {
        this.statesList.set(data || []);
        this.isLoadingStates.set(false);
      },
      error: () => {
        this.statesList.set([]);
        this.isLoadingStates.set(false);
      },
    });
  }

  onStateChange(stateCode: string): void {
    this.selectedStateCode.set(stateCode);
    this.selectedCityName.set('');
    this.citiesList.set([]);
    this.customLocationInput.set('');

    const countryCode = this.selectedCountryCode();
    if (!countryCode || !stateCode || stateCode === 'OTHER') {
      return;
    }

    this.isLoadingCities.set(true);
    this.locationApiService.getCitiesByState(countryCode, stateCode).subscribe({
      next: (data) => {
        this.citiesList.set(data || []);
        this.isLoadingCities.set(false);
      },
      error: () => {
        this.citiesList.set([]);
        this.isLoadingCities.set(false);
      },
    });
  }

  onCityChange(cityName: string): void {
    this.selectedCityName.set(cityName);
    if (cityName !== 'OTHER') {
      this.customLocationInput.set('');
    }
  }

  getFormattedLocation(): string {
    const countryObj = this.selectedCountryObj();
    const stateObj = this.selectedStateObj();
    const city = this.selectedCityName();
    const custom = this.customLocationInput().trim();

    const parts: string[] = [];

    if (city && city !== 'OTHER') {
      parts.push(city);
    } else if (city === 'OTHER' && custom) {
      parts.push(custom);
    }

    if (stateObj && stateObj.iso2 !== 'OTHER') {
      parts.push(stateObj.name);
    } else if (this.selectedStateCode() === 'OTHER' && custom && parts.length === 0) {
      parts.push(custom);
    }

    if (countryObj && countryObj.iso2 !== 'OTHER') {
      parts.push(countryObj.name);
    } else if (this.selectedCountryCode() === 'OTHER' && custom && parts.length === 0) {
      parts.push(custom);
    }

    return parts.join(', ');
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
