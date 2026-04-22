import { Component, inject, signal } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { MediaService } from '../../../../shared/services/media/media.service';
import { environment } from '../../../../../environments/environment';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { NgStyle } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bethel-add-edit-youth-form',
  imports: [
    FormsModule,
    FileUploadModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule,
    InputMaskModule,
    CheckboxModule,
    TextareaModule,
    ButtonModule,
    NgStyle
  ],
  templateUrl: './add-edit-youth-form.html',
  styleUrl: './add-edit-youth-form.scss',
  providers: [MediaService]
})
export class AddEditYouthForm {
  private readonly mediaUploader = inject(MediaService);
  avatarUrl = signal<string>('')
  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if(!file)
      return

    this.mediaUploader.uploadMedia(file).subscribe({
      next: (res) => {
        this.avatarUrl.set(`${environment.uploadsUrl}${res[0].url}`)
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
