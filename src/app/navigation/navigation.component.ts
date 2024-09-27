import { Component, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true;
  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.isExpanded = false;
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 600) {
      this.isMobile = true;
      this.isExpanded = false;
    } else {
      this.isMobile = false;
      this.isExpanded = true;
    }
  }

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
    if (this.isMobile) {
      this.sidenav.toggle();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Verifica si el usuario está autenticado
  }
}