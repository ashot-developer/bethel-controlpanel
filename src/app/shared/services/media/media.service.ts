import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly http: HttpClient = inject(HttpClient);

  uploadMedia(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);
    return this.http.post(`${environment.apiUrl}/upload`, formData);
  }
}
