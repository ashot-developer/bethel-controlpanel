import { inject, Injectable } from '@angular/core';
import { YouthState } from '../state/youth.state';
import { YouthService } from '../services/youth.service';
import { YouthResponse } from '../models/youth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YouthFacade {
  private readonly youthService = inject(YouthService);
  private state = inject(YouthState);

  readonly vm = {
    youths: this.state.filteredYouths,
    loading: this.state.loading.asReadonly(),
    error: this.state.error.asReadonly()
  };
  
  setSearchQuery(q: string): void {
    this.state.searchQuery.set(q);
  }

  loadYouthList(): void {
    this.state.loading.set(true);
    this.state.error.set(false);
    this.youthService.getYouthList().subscribe({
      next: (res: YouthResponse) => {
        res.data = res.data.map(y => {
          return { 
            ...y, 
            avatarUrl: typeof y.avatar !== 'number' && y.avatar?.url 
              ? environment.uploadsUrl + y.avatar?.url : 
                'assets/img/no-image.png'
          }
        })
        this.state.youths.set(res.data);
        this.state.loading.set(false);
        this.state.error.set(false);
      },
      error: () => {
        this.state.loading.set(false);
        this.state.error.set(true);
      }
    })
  }
}
