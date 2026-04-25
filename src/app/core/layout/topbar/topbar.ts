import { Component, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuItem } from 'primeng/api';
import { AuthStateService } from '../../auth';

@Component({
  selector: 'bethel-topbar',
  imports: [RouterLink, NgClass, StyleClassModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  items!: MenuItem[];
  public layoutService = inject(LayoutService);
  protected authState = inject(AuthStateService);
  
  public logout() {
    this.authState.logout();
  }

  public toggleDarkMode(): void {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
