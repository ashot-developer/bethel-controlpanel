import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YouthResponse } from '../models/youth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YouthService {
  private readonly http: HttpClient = inject(HttpClient);

  public getYouthList(): Observable<YouthResponse> {
    return this.http.get<YouthResponse>(`${environment.apiUrl}/youths?pagination[start]=0&pagination[limit]=99999`);
  }
}
