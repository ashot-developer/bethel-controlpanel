import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Login } from './features/login/login';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, Login],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bethel-controlpanel');

  constructor(private themeService: ThemeService) {
    // Initialize theme service
  }
}
