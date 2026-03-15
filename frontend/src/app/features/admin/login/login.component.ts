import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule],
    template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <span class="login-icon">🔐</span>
          <h1>Admin Login</h1>
          <p>Sign in to manage your product catalog</p>
        </div>

        @if (error()) {
          <div class="error-msg">{{ error() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                id="username"
                type="text"
                [(ngModel)]="username"
                name="username"
                placeholder="Enter username"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter password"
                required
                autocomplete="current-password"
              />
            </div>
          </div>

          <button type="submit" class="btn-login" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .login-page {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      background: radial-gradient(ellipse at 50% 30%, rgba(167, 139, 250, 0.08), transparent 60%);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: rgba(30, 30, 50, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 48px 40px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-icon {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 16px;
    }

    .login-header h1 {
      margin: 0 0 8px;
      font-size: 1.6rem;
      font-weight: 700;
      color: #fff;
    }

    .login-header p {
      margin: 0;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.9rem;
    }

    .error-msg {
      background: rgba(248, 113, 113, 0.12);
      border: 1px solid rgba(248, 113, 113, 0.3);
      color: #f87171;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.85rem;
      margin-bottom: 20px;
      text-align: center;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 8px;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      background: rgba(15, 15, 25, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 0 16px;
      transition: border-color 0.3s;
    }

    .input-wrapper:focus-within {
      border-color: rgba(167, 139, 250, 0.5);
    }

    .input-icon { font-size: 0.9rem; }

    .input-wrapper input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      padding: 14px 10px;
      color: #fff;
      font-size: 0.95rem;
      font-family: inherit;
    }

    .input-wrapper input::placeholder {
      color: rgba(255, 255, 255, 0.25);
    }

    .btn-login {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 8px;
      font-family: inherit;
    }

    .btn-login:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `],
})
export class LoginComponent {
    username = '';
    password = '';
    loading = signal(false);
    error = signal('');

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit() {
        if (!this.username || !this.password) {
            this.error.set('Please enter username and password');
            return;
        }

        this.loading.set(true);
        this.error.set('');

        this.auth.login(this.username, this.password).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate(['/admin/dashboard']);
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err.error?.message || 'Login failed. Please try again.');
            },
        });
    }
}
