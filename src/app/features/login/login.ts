import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'bethel-login',
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RippleModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(public themeService: ThemeService) {}

  public get isDarkMode() {
    return this.themeService.isDarkMode;
  }
}
