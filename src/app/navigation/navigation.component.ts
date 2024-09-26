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
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav [mode]="isMobile ? 'over' : 'side'"
                   [opened]="!isMobile && isExpanded" 
                   [ngClass]="{'expanded': isExpanded, 'collapsed': !isExpanded}"
                   class="sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/clientes" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            <span *ngIf="isExpanded">Clientes</span>
          </a>
          <a mat-list-item routerLink="/vendedores" routerLinkActive="active">
            <mat-icon>business_center</mat-icon>
            <span *ngIf="isExpanded">Vendedores</span>
          </a>
          <a mat-list-item routerLink="/propiedades" routerLinkActive="active">
            <mat-icon>home</mat-icon>
            <span *ngIf="isExpanded">Propiedades</span>
          </a>
          <a mat-list-item routerLink="/rentas" routerLinkActive="active">
            <mat-icon>attach_money</mat-icon>
            <span *ngIf="isExpanded">Rentas</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="toggleMenu()">
            <mat-icon>{{ isExpanded ? 'menu_open' : 'menu' }}</mat-icon>
          </button>
          <span class="app-title">Inmobiliaria CRM</span>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    
    .sidenav {
      width: 200px;
      transition: width 0.3s ease-in-out;
    }
    
    .sidenav.collapsed {
      width: 60px;
    }
    
    mat-nav-list {
      padding-top: 20px;
    }
    
    .mat-list-item {
      margin-bottom: 10px;
    }
    
    .mat-icon {
      margin-right: 15px;
    }
    
    .app-title {
      margin-left: 20px;
      font-size: 1.2em;
    }
    
    .content {
      padding: 20px;
    }
    
    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 600px) {
      .sidenav {
        width: 0;
      }
      
      .sidenav.expanded {
        width: 200px;
      }
    }
  `]
})
export class NavigationComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true;
  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {
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
}