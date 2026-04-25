import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, signal } from '@angular/core';
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
import { form, FormField, required } from '@angular/forms/signals';
import { Youth } from '../../models/youth.model';
import { YouthService } from '../../services/youth.service';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { YouthFacade } from '../../facades/youth.facade';


interface YouthForm {
  firstName: string;
  lastName: string;
  patronymicName: string;
  phoneNumber: string;
  bdate: Date;
  isMarried: boolean;
  avatar?: number;
  additionalInfo: string;
}

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
    FormField,
    NgStyle,
    MessageModule
  ],
  templateUrl: './add-edit-youth-form.html',
  styleUrl: './add-edit-youth-form.scss',
  providers: [MediaService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditYouthForm {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter();
  private readonly mediaUploader = inject(MediaService);
  private readonly youthService = inject(YouthService);
  private readonly messageService = inject(MessageService);
  protected readonly youthFacade = inject(YouthFacade);

  protected bdateDisplay = signal<Date>(new Date());
  protected phoneNumberDisplay = signal<string>('');
  protected youthData = signal<YouthForm>({
    firstName: '',
    lastName: '',
    patronymicName: '',
    phoneNumber: '',
    bdate: new Date(),
    isMarried: false,
    additionalInfo: ''
  });
  protected form = form(this.youthData, (schemaPath) => {
     required(schemaPath.firstName);
     required(schemaPath.lastName);
  });
  protected avatar = signal<string>('');

  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if(!file)
      return

    this.mediaUploader.uploadMedia(file).subscribe({
      next: (res) => {
        this.avatar.set(environment.uploadsUrl + res[0].url);
        this.youthData.update(v => ({ ...v, avatar: res[0].id }));
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Սխալ', 
          detail: 'Չհաջողվեց բեռնել նկարը, կրկին փորձեք'
        });
      }
    })
  }

  protected onDateChange(date: Date) {
    this.bdateDisplay.set(date);
    this.youthData.update(v => ({ ...v, bdate: date }));
  }

  protected onPhoneChange(value: string) {
    this.youthData.update(v => ({ ...v, phoneNumber: value }));
  }

  protected onAdditionalInfoChange(value: string) {
    this.youthData.update(v => ({ ...v, additionalInfo: value }));
  }

  protected onSubmit(event: Event) {
    if(!this.form().valid())
      return;
    
    const payload: Youth = {
      fullName: [
        this.youthData().firstName,
        this.youthData().lastName,
        this.youthData().patronymicName
      ].filter(Boolean).join(' '),
      phoneNumber: this.youthData().phoneNumber,
      bdate: this.youthData().bdate,
      familyStatus: this.youthData().isMarried ? 'Ամուսնացած' : '-',
      avatar: this.youthData().avatar,
      additionalInfo: this.youthData().additionalInfo
    }
    
    this.youthService.createYouth(payload).subscribe({
      next: () => {
        this.youthFacade.loadYouthList();
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Ու՜ռա', 
          detail: 'Ավելացվել է նոր երիտասարդ' 
        });
        this.formSubmitted.emit();
      },
      error: () => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Սխալ', 
          detail: 'Ինչ որ բան այն չէ, կրկին փորձեք' 
        });
      }
    })
  }
}
