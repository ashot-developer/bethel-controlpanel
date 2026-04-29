import { computed, Injectable, signal } from '@angular/core';
import { Youth, YouthUI } from '../models/youth.model';

export const initialYouth: YouthUI = {
  id: -1,
  fullName: '',
  phoneNumber: '',
  bdate: new Date(),
  familyStatus: '',
  additionalInfo: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  documentId: '',
  publishedAt: new Date(),
}

@Injectable({
  providedIn: 'root',
})
export class YouthState {
  youths = signal<YouthUI[]>([]);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedYouthId = signal<number>(-1);

  filteredYouths = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if(!query) return this.youths();

    return this.youths().filter(youth => youth.fullName.toLowerCase().includes(query));
  })

  selectedYouth = computed(() => {
    const id = this.selectedYouthId();

    if (id === -1) return initialYouth;

    return this.youths().find(y => y.id === id) ?? initialYouth;
  });
}
