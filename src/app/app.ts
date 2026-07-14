import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  readonly mobileMenuOpen = signal(false);
  protected readonly title = signal('mordenec');
  readonly sidebarCollapsed = signal(true);
  constructor(private messageService: MessageService) { }
  ngOnInit(): void {
  }
  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.mobileMenuOpen.set(!this.mobileMenuOpen());
      return;
    }

    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  closeSidebar(): void {
    this.mobileMenuOpen.set(false);
  }
}
