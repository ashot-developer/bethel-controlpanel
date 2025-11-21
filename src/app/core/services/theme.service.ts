import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    // Detect OS theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode.set(prefersDark);

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.isDarkMode.set(e.matches);
    });

    // Apply theme changes to document root
    effect(() => {
      const root = document.documentElement;
      if (this.isDarkMode()) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    });
  }
}