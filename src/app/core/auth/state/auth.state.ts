import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginCredentials, User } from '../../models/user.model';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    rememberMe: false
  }

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private authApi = inject(AuthService);
  private router = inject(Router);

  private state = signal<AuthState>(initialState);

  readonly userRole = computed(() => this.state().user?.role.type);
  readonly token = computed(() => this.state().token);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);

  constructor() {
    this.initAuth();
  }

  public login(credentials: LoginCredentials, rememberMe: boolean): void {
    this.updateState({ isLoading: true, error: null });

    this.authApi.login(credentials).subscribe({
      next: (res) => {
        this.updateState({
          user: res.user,
          token: res.jwt,
          rememberMe,
          isLoading: false,
          error: null,
          isAuthenticated: true
        })
        localStorage.setItem('auth_token', res.jwt);

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        const errorMessage = error.error?.error?.message || 'Invalid credentials. Please try again.';
        this.updateState({
          isLoading: false,
          error: errorMessage
        });
      }
    })
  }

  private initAuth() {
    const token = localStorage.getItem('auth_token');
    if(token) {
      // Set authenticated immediately based on token presence
      this.updateState({ token, isAuthenticated: true, isLoading: true });

      // Verify token and get user data
      this.authApi.getCurrentUser().subscribe({
        next: (res: User) => {
          this.updateState({user: res, isLoading: false, isAuthenticated: true});
        },
        error: (error) => {
          if (error.status === 401 || error.status === 403) {
            this.updateState({isLoading: false, isAuthenticated: false});
            this.logout();
          } else {
            this.updateState({isLoading: false, isAuthenticated: false});
          }
        }
      })
    } else {
      this.updateState({ isAuthenticated: false });
    }
  }

  private updateState(partial: Partial<AuthState>) {
    this.state.update(current => ({...current, ...partial}))
  }

  public logout(): void {
    localStorage.removeItem('auth_token');
    this.state.set(initialState);
    this.router.navigate(['/login']);
  }
}
