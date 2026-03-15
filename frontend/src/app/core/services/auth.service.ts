import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse {
    success: boolean;
    data: {
        _id: string;
        username: string;
        email: string;
        token: string;
    };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = environment.apiUrl;
    private tokenSignal = signal<string | null>(this.getStoredToken());

    isLoggedIn = computed(() => !!this.tokenSignal());
    token = computed(() => this.tokenSignal());

    constructor(private http: HttpClient, private router: Router) { }

    private getStoredToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    login(username: string, password: string): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
            .pipe(
                tap((res) => {
                    if (res.success && res.data.token) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('user', JSON.stringify(res.data));
                        this.tokenSignal.set(res.data.token);
                    }
                })
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.tokenSignal.set(null);
        this.router.navigate(['/']);
    }

    getToken(): string | null {
        return this.tokenSignal();
    }
}
