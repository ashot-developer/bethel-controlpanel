import { inject, Injectable } from '@angular/core';
import { YouthState } from '../state/youth.state';
import { YouthService } from '../services/youth.service';
import { Youth, YouthResponse, YouthSingleResponse, YouthUI } from '../models/youth.model';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YouthFacade {
  private readonly youthService = inject(YouthService);
  private state = inject(YouthState);

  readonly vm = {
    youths: this.state.filteredYouths,
    selectedYouth: this.state.selectedYouth,
    loading: this.state.loading.asReadonly(),
    error: this.state.error.asReadonly()
  };
  
  setSearchQuery(q: string): void {
    this.state.searchQuery.set(q);
  }

  setYouthId(id: number): void {
    this.state.selectedYouthId.set(id);
  }

  createYouth(payload: Youth): Observable<YouthSingleResponse> {
    return this.youthService.createYouth(payload).pipe(
      tap(() => this.loadYouthList())
    );
  }

  deleteYouth(documentId: string): Observable<void> {
    return this.youthService.deleteYouth(documentId).pipe(
      tap(() => {
        this.state.youths.update(list => list.filter(y => y.documentId !== documentId));
      })
    );
  }

  updateYouth(payload: Youth, documentId: string): Observable<YouthSingleResponse> {
    return this.youthService.updateYouth(payload, documentId).pipe(
      tap(() => this.loadYouthList())
    );
  }

  loadYouthList(): void {
    this.state.loading.set(true);
    this.state.error.set(false);
    this.setSearchQuery('');
    this.youthService.getYouthList().subscribe({
      next: (res: YouthResponse) => {
        res.data = res.data.map(y => {
          return { 
            ...y, 
            avatarUrl: typeof y.avatar !== 'number' && y.avatar?.url 
              ? environment.uploadsUrl + y.avatar?.url : 
                'assets/img/no-image.png',
            avatarData: {
              id: typeof y.avatar === 'number' ? y.avatar : (y.avatar?.id ?? -1),
              url: typeof y.avatar !== 'number' && y.avatar?.url 
                ? environment.uploadsUrl + y.avatar.url 
                : ''
            }
          } as YouthUI
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
