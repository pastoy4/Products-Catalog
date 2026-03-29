import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>

    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Brand -->
          <div class="footer-col">
            <div class="footer-brand">
              <span class="footer-brand-icon">📦</span>
              <span class="footer-brand-text">Product Catalog</span>
            </div>
            <p class="footer-desc">Your one-stop destination for premium products. Browse, discover, and shop with confidence.</p>
          </div>

          <!-- Contact Info -->
          <div class="footer-col">
            <h4 class="footer-heading">Contact Us</h4>
            <ul class="footer-list">
              <li><span class="footer-li-icon">📧</span> info&#64;productcatalog.com</li>
              <li><span class="footer-li-icon">📞</span> +855 12 345 678</li>
              <li><span class="footer-li-icon">📍</span> Phnom Penh, Cambodia</li>
            </ul>
          </div>

          <!-- Social Media -->
          <div class="footer-col">
            <h4 class="footer-heading">Follow Us</h4>
            <div class="social-links">
              <a href="https://t.me/" target="_blank" rel="noopener" aria-label="Telegram" class="social-link">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 1 0 24 12.056A12.014 12.014 0 0 0 11.944 0Zm5.654 7.645l-1.906 8.955c-.144.636-.536.79-1.085.492l-3-2.21-1.447 1.39c-.16.16-.295.295-.605.295l.213-3.053 5.556-5.023c.242-.213-.054-.334-.374-.121l-6.869 4.326-2.96-.924c-.644-.204-.657-.644.135-.953l11.566-4.458c.539-.196 1.006.131.776.984Z"/></svg>
                <span>Telegram</span>
              </a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="TikTok" class="social-link">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16Z"/></svg>
                <span>TikTok</span>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook" class="social-link">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 Product Catalog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 70px);
      padding: 0;
    }

    /* Footer */
    .site-footer {
      background: rgba(10, 10, 20, 0.95);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 48px 24px 24px;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 48px;
      margin-bottom: 40px;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .footer-brand-icon { font-size: 1.5rem; }

    .footer-brand-text {
      font-size: 1.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .footer-desc {
      color: rgba(255, 255, 255, 0.45);
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 0;
    }

    .footer-heading {
      color: #fff;
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 16px;
      letter-spacing: 0.5px;
    }

    .footer-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-list li {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .footer-li-icon { font-size: 0.9rem; }

    .social-links {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 10px;
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 8px 14px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(30, 30, 50, 0.4);
      transition: all 0.2s;
    }

    .social-link:hover {
      color: #fff;
      border-color: rgba(167, 139, 250, 0.4);
      background: rgba(167, 139, 250, 0.08);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 20px;
      text-align: center;
    }

    .footer-bottom p {
      color: rgba(255, 255, 255, 0.3);
      font-size: 0.85rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
  `],
})
export class App { }

