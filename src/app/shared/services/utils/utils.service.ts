import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
        .then(() => true)
        .catch(() => false);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;

      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return Promise.resolve(success);
      } catch (err) {
        document.body.removeChild(textarea);
        return Promise.resolve(false);
      }
    }
  }
}
