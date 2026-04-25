import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../core/auth/state/auth.state';
import { InfoCardWidget } from '../../shared/widgets/info-card-widget/info-card-widget';

@Component({
  selector: 'bethel-dashboard',
  imports: [InfoCardWidget],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private authState = inject(AuthStateService);

  public logout() {
    this.authState.logout();
  }
}
