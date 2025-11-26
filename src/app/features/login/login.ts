import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ThemeService } from '../../core/services/theme.service';
import { AuthStateService } from '../../core/auth/state/auth.state';

@Component({
  selector: 'bethel-login',
  imports: [
    ButtonModule, 
    CheckboxModule, 
    InputTextModule, 
    PasswordModule, 
    FormsModule, 
    RippleModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private authState = inject(AuthStateService);
  private fb = inject(FormBuilder);
  public loginForm!: FormGroup;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.initForm();
  }

  public get isDarkMode() {
    return this.themeService.isDarkMode;
  }

  private initForm(){
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    })
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { identifier, password, rememberMe } = this.loginForm.value;
    this.authState.login({ identifier, password }, rememberMe);
  }
}
