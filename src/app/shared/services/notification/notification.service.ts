import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageService = inject(MessageService);

  success(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Ու՜ռա',
      detail: message
    });
  }

  error(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Սխալ',
      detail: message
    });
  }
}
