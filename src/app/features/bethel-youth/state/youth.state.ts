import { computed, Injectable, signal } from '@angular/core';
import { Youth } from '../models/youth.model';

@Injectable({
  providedIn: 'root',
})
export class YouthState {
  youths = signal<Youth[]>([]);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  searchQuery = signal('');

  filteredYouths = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    console.log(query);
    if(!query) return this.youths();

    return this.youths().filter(youth => youth.fullName.toLowerCase().includes(query))
  })
}
