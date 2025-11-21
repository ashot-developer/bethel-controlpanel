# Angular 20 Standalone Architecture Guide

## Project Overview

This is a **modern Angular 20.x application** using the **standalone components architecture** - no NgModules required!

**Key Technologies:**
- Angular 20.3.0 (Standalone Components)
- PrimeNG 20.3.0 (UI Component Library)
- TypeScript 5.9.2
- RxJS 7.8.0

---

## Project Structure

```
src/app/
  core/
    services/           # App-wide services
    models/            # Shared TypeScript interfaces/types
    guards/            # Route guards
    interceptors/      # HTTP interceptors

  features/            # Feature modules (lazy-loaded)
    login/
    dashboard/
    [feature-name]/

  shared/              # Reusable UI components
    components/
    directives/
    pipes/
    utils/

  app.ts              # Root component
  app.config.ts       # Application configuration
  app.routes.ts       # Route definitions
```

---

## Core Folder (`/core`)

Contains application-wide services, models, guards, and interceptors that are used across multiple features.

### Services (`core/services/`)

Business logic and data management services.

**Example: Authentication Service**

```typescript
// core/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { LoginCredentials, LoginResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'  // ← Available everywhere
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);

  // Signals for reactive state
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        this.storage.setToken(response.token);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    this.storage.clearToken();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  checkAuth(): boolean {
    const token = this.storage.getToken();
    const isValid = !!token && !this.isTokenExpired(token);
    this.isAuthenticated.set(isValid);
    return isValid;
  }

  private isTokenExpired(token: string): boolean {
    // JWT token expiration logic
    return false;
  }
}
```

**Example: Storage Service**

```typescript
// core/services/storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
```

### Models (`core/models/`)

TypeScript interfaces and types shared across the application.

```typescript
// core/models/auth.model.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
```

```typescript
// core/models/user.model.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}
```

```typescript
// core/models/api.model.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
```

### Guards (`core/guards/`)

Route protection logic.

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.checkAuth()) {
    return true;
  }

  // Redirect to login with return URL
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

```typescript
// core/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.currentUser();

    if (currentUser && allowedRoles.includes(currentUser.role)) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
```

### Interceptors (`core/interceptors/`)

HTTP middleware for requests/responses.

```typescript
// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

```typescript
// core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden
        router.navigate(['/unauthorized']);
      } else if (error.status === 500) {
        // Server error
        console.error('Server error:', error);
      }

      return throwError(() => error);
    })
  );
};
```

---

## Features Folder (`/features`)

Self-contained feature modules with their own components, services, and models.

### Feature Structure Example: Login

```
features/
  login/
    login-page.component.ts         # Container/Smart component
    login-page.component.html
    login-page.component.scss

    components/
      login-form/                   # Presentational component
        login-form.component.ts
        login-form.component.html
        login-form.component.scss
```

### Container Component (Smart/Page Component)

```typescript
// features/login/login-page.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../core/models/auth.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    MessageModule,
    LoginFormComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  handleLogin(credentials: LoginCredentials) {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Login failed';
        this.isLoading = false;
      }
    });
  }
}
```

```html
<!-- features/login/login-page.component.html -->
<div class="login-page">
  <p-card header="Welcome Back">
    <p-message
      *ngIf="errorMessage"
      severity="error"
      [text]="errorMessage"
    />

    <app-login-form
      (loginSubmit)="handleLogin($event)"
    />

    <div *ngIf="isLoading" class="loading">
      Logging in...
    </div>
  </p-card>
</div>
```

### Presentational Component (Dumb Component)

```typescript
// features/login/components/login-form/login-form.component.ts
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  email = '';
  password = '';

  // Output event to parent
  loginSubmit = output<{ email: string; password: string }>();

  onSubmit() {
    this.loginSubmit.emit({
      email: this.email,
      password: this.password
    });
  }
}
```

```html
<!-- features/login/components/login-form/login-form.component.html -->
<form (ngSubmit)="onSubmit()">
  <div class="form-field">
    <p-floatlabel>
      <input
        pInputText
        id="email"
        [(ngModel)]="email"
        name="email"
        type="email"
        required
      />
      <label for="email">Email</label>
    </p-floatlabel>
  </div>

  <div class="form-field">
    <p-floatlabel>
      <p-password
        [(ngModel)]="password"
        name="password"
        [feedback]="false"
        required
      />
      <label for="password">Password</label>
    </p-floatlabel>
  </div>

  <p-button
    type="submit"
    label="Login"
    [disabled]="!email || !password"
  />
</form>
```

---

## Shared Folder (`/shared`)

Reusable UI components, directives, pipes, and utilities used across multiple features.

### Components (`shared/components/`)

```typescript
// shared/components/loading-spinner/loading-spinner.component.ts
import { Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <div class="spinner-container">
      <p-progressSpinner [style]="{ width: size(), height: size() }" />
      @if (message()) {
        <p>{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  size = input<string>('50px');
  message = input<string>('');
}
```

### Directives (`shared/directives/`)

```typescript
// shared/directives/highlight.directive.ts
import { Directive, ElementRef, input, effect } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  color = input<string>('yellow');

  constructor(private el: ElementRef) {
    effect(() => {
      this.el.nativeElement.style.backgroundColor = this.color();
    });
  }
}
```

### Pipes (`shared/pipes/`)

```typescript
// shared/pipes/truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
```

### Utilities (`shared/utils/`)

```typescript
// shared/utils/validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isLongEnough = value.length >= 8;

      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isLongEnough;

      return passwordValid ? null : { strongPassword: true };
    };
  }

  static matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null
        : { matching: true };
    };
  }
}
```

---

## Application Configuration

### App Config (`app.config.ts`)

```typescript
// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    })
  ]
};
```

### Routes (`app.routes.ts`)

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard, roleGuard([UserRole.Admin])]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
```

### Root Component (`app.ts`)

```typescript
// app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bethel-controlpanel');
}
```

### Bootstrap (`main.ts`)

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

---

## Standalone Components: Key Concepts

### 1. Component Imports

Every standalone component declares its dependencies in the `imports` array:

```typescript
@Component({
  selector: 'my-component',
  standalone: true,  // ← Required for standalone components
  imports: [
    // Angular built-ins
    CommonModule,        // *ngIf, *ngFor, pipes
    FormsModule,         // [(ngModel)]
    ReactiveFormsModule, // [formControl], [formGroup]
    RouterLink,          // [routerLink]
    RouterOutlet,        // <router-outlet>

    // PrimeNG components
    ButtonModule,
    InputTextModule,

    // Your components
    MyChildComponent,

    // Pipes
    TruncatePipe,

    // Directives
    HighlightDirective
  ],
  templateUrl: './my-component.html'
})
export class MyComponent { }
```

### 2. Services (No Import Needed)

Services with `providedIn: 'root'` are automatically available everywhere:

```typescript
@Injectable({
  providedIn: 'root'  // ← Auto-registered
})
export class MyService { }

// Usage in component:
export class MyComponent {
  private myService = inject(MyService);  // ← Just inject it
}
```

### 3. Common Imports Quick Reference

| What you need | Import this |
|--------------|-------------|
| `*ngIf`, `*ngFor`, `*ngSwitch` | `CommonModule` |
| `[(ngModel)]` | `FormsModule` |
| `[formControl]`, `[formGroup]` | `ReactiveFormsModule` |
| `[routerLink]` | `RouterLink` |
| `<router-outlet>` | `RouterOutlet` |
| PrimeNG Button | `ButtonModule` |
| Custom component | The component class |
| Custom pipe | The pipe class |
| Custom directive | The directive class |

### 4. Component Communication

**Parent to Child:**
```typescript
// Child component
export class ChildComponent {
  data = input<string>('');  // Input signal (Angular 19+)
}

// Parent template
<app-child [data]="myData" />
```

**Child to Parent:**
```typescript
// Child component
export class ChildComponent {
  itemClicked = output<string>();  // Output (Angular 19+)

  onClick() {
    this.itemClicked.emit('value');
  }
}

// Parent template
<app-child (itemClicked)="handleClick($event)" />
```

### 5. Signals (Reactive State)

```typescript
export class MyComponent {
  // Writable signal
  count = signal(0);

  // Computed signal
  doubleCount = computed(() => this.count() * 2);

  // Effect
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  increment() {
    this.count.update(c => c + 1);  // or this.count.set(5)
  }
}
```

---

## Common Patterns

### 1. Reusable Imports Array

```typescript
// shared/common-imports.ts
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export const COMMON_IMPORTS = [
  CommonModule,
  FormsModule,
  RouterLink
];

// Usage in component:
@Component({
  imports: [
    ...COMMON_IMPORTS,
    ButtonModule,
    MySpecificComponent
  ]
})
```

### 2. Smart vs Presentational Components

**Smart Component (Container):**
- Manages state and business logic
- Injects services
- Communicates with APIs
- Passes data to presentational components

**Presentational Component (Dumb):**
- Only displays data
- Emits events to parent
- No service injection
- Reusable and testable

### 3. Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private dataSubject = new BehaviorSubject<Data[]>([]);

  data$ = this.dataSubject.asObservable();

  loadData(): void {
    this.http.get<Data[]>('/api/data').subscribe({
      next: (data) => this.dataSubject.next(data),
      error: (error) => console.error('Error loading data', error)
    });
  }

  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data');
  }
}
```

### 4. Form Handling

**Template-driven:**
```typescript
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule]
})
export class MyComponent {
  formData = {
    name: '',
    email: ''
  };

  onSubmit() {
    console.log(this.formData);
  }
}
```

**Reactive:**
```typescript
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule]
})
export class MyComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

---

## Best Practices

### 1. Folder Organization
- Keep related files together
- Feature folders should be self-contained
- Shared code goes in `/shared`
- App-wide logic goes in `/core`

### 2. Component Design
- Keep components small and focused
- Extract reusable logic into services
- Use signals for reactive state
- Prefer OnPush change detection for performance

### 3. Service Design
- Use `providedIn: 'root'` for app-wide services
- Return Observables from async operations
- Handle errors consistently
- Use RxJS operators for data transformation

### 4. Type Safety
- Define interfaces for all data structures
- Use strict TypeScript settings
- Avoid `any` type
- Leverage type inference

### 5. Performance
- Use lazy loading for routes
- Use trackBy with *ngFor
- Unsubscribe from Observables (or use async pipe)
- Use OnPush change detection where possible

### 6. Testing
- Write unit tests for services and components
- Mock dependencies in tests
- Test user interactions
- Aim for good code coverage

---

## Quick Start Checklist

### Creating a New Feature:

1. Create feature folder: `features/[feature-name]/`
2. Create page component: `[feature]-page.component.ts`
3. Create child components in `components/` subfolder
4. Add models to `core/models/` if shared across features
5. Add services to `core/services/` if used by multiple features
6. Add route to `app.routes.ts`
7. Add guard if needed in `core/guards/`

### Creating a New Component:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],  // Add what you need
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
export class MyComponent {
  // Component logic
}
```

### Creating a New Service:

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  // Service logic
}
```

---

## Resources

- **Angular Docs**: https://angular.dev
- **PrimeNG Docs**: https://primeng.org
- **RxJS Docs**: https://rxjs.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
