import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Youth, YouthResponse, YouthSingleResponse } from '../models/youth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YouthService {
  private readonly http: HttpClient = inject(HttpClient);

  public getYouthList(): Observable<YouthResponse> {
    return this.http.get<YouthResponse>(`${environment.apiUrl}/youths?pagination[start]=0&pagination[limit]=99999&sort[0]=createdAt:desc&populate=*`);
  }

  public createYouth(payload: Youth): Observable<YouthSingleResponse> {
    return this.http.post<YouthSingleResponse>(`${environment.apiUrl}/youths`, { data: { ...payload } });
  }

  public deleteYouth(documentId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/youths/${documentId}`);
  }

  public updateYouth(payload: Youth, documentId: string): Observable<YouthSingleResponse> {
    return this.http.put<YouthSingleResponse>(`${environment.apiUrl}/youths/${documentId}`, { data: { ...payload } });
  }
}
