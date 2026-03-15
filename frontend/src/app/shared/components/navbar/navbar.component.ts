import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a routerLink="/" class="navbar-brand">
          <span class="brand-icon">📦</span>
          <span class="brand-text">Product Catalog</span>
        </a>

        <button class="mobile-toggle" (click)="toggleMenu()" [class.active]="menuOpen">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav-links" [class.open]="menuOpen">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="menuOpen = false">
              <span class="nav-icon">🏠</span> Catalog
            </a>
          </li>
          @if (auth.isLoggedIn()) {
            <li>
              <a routerLink="/admin/dashboard" routerLinkActive="active" (click)="menuOpen = false">
                <span class="nav-icon">⚙️</span> Dashboard
              </a>
            </li>
            <li>
              <button class="btn-logout" (click)="auth.logout(); menuOpen = false">
                <span class="nav-icon">🚪</span> Logout
              </button>
            </li>
          } @else {
            <li>
              <a routerLink="/admin/login" routerLinkActive="active" (click)="menuOpen = false">
                <span class="nav-icon">🔑</span> Admin
              </a>
            </li>
          }
        </ul>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      background: rgba(15, 15, 25, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 70px;
      display: flex;
      align-items: center;
    }

    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #fff;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-icon {
      font-size: 1.5rem;
    }

    .brand-text {
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      list-style: none;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 0;
    }

    .nav-links a, .btn-logout {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 10px;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      border: none;
      background: none;
      cursor: pointer;
      font-family: inherit;
    }

    .nav-links a:hover, .btn-logout:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .nav-links a.active {
      color: #a78bfa;
      background: rgba(167, 139, 250, 0.12);
    }

    .btn-logout:hover {
      color: #f87171;
      background: rgba(248, 113, 113, 0.12);
    }

    .nav-icon { font-size: 1rem; }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }

    .mobile-toggle span {
      display: block;
      width: 24px;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: all 0.3s;
    }

    .mobile-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .mobile-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    .mobile-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    @media (max-width: 768px) {
      .mobile-toggle { display: flex; }
      .nav-links {
        display: none;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        flex-direction: column;
        background: rgba(15, 15, 25, 0.98);
        backdrop-filter: blur(20px);
        padding: 16px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        gap: 4px;
      }
      .nav-links.open { display: flex; }
      .nav-links a, .btn-logout {
        width: 100%;
        padding: 12px 16px;
        justify-content: flex-start;
      }
    }
  `],
})
export class NavbarComponent {
    menuOpen = false;

    constructor(public auth: AuthService) { }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }
}
