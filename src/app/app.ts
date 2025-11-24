import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from './core/services/theme.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bethel-controlpanel');

  constructor(private themeService: ThemeService) {
    // Initialize theme service
  }
}
