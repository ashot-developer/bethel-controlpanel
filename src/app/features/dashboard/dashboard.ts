import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../core/auth/state/auth.state';

@Component({
  selector: 'bethel-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected authState = inject(AuthStateService);

  public userRole = this.authState.userRole;

  public logout() {
    this.authState.logout();
  }
}
