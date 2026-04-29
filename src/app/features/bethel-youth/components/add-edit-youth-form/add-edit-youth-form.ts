import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
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
import { Youth, YouthUI } from '../../models/youth.model';
import { MessageModule } from 'primeng/message';
import { YouthFacade } from '../../facades/youth.facade';
import { initialYouth } from '../../state/youth.state';
import { NotificationService } from '../../../../shared/services/notification/notification.service';


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
  providers: [MediaService, NotificationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditYouthForm implements OnInit {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter();
  @Input() youth: YouthUI = initialYouth;
  private readonly mediaUploader = inject(MediaService);
  protected readonly youthFacade = inject(YouthFacade);
  protected readonly notificationService = inject(NotificationService);

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
  protected formInvalid = computed(() => this.form().invalid());

  ngOnInit(): void {
    this.initForm();
  }

  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if(!file)
      return

    this.mediaUploader.uploadMedia(file).subscribe({
      next: (res) => {
        this.avatar.set(environment.uploadsUrl + res[0].url);
        this.youthData.update(v => ({ ...v, avatar: res[0].id }));
      },
      error: () => {
        this.notificationService.error('Չհաջողվեց բեռնել նկարը, կրկին փորձեք');
      }
    })
  }

  protected onDateChange(date: Date) {
    this.youthData.update(v => ({ ...v, bdate: date }));
  }

  protected onPhoneChange(value: string) {
    this.youthData.update(v => ({ ...v, phoneNumber: value }));
  }

  protected onAdditionalInfoChange(value: string) {
    this.youthData.update(v => ({ ...v, additionalInfo: value }));
  }

  protected onSubmit() {
    if (!this.form().valid())
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

    if (this.youth.id === -1) {
      this.youthFacade.createYouth(payload).subscribe({
        next: () => {
          this.notificationService.success('Ավելացվել է նոր երիտասարդ');
          this.formSubmitted.emit();
        },
        error: () => {
          this.notificationService.error('Ինչ որ բան այն չէ, կրկին փորձեք');
        }
      })
    } else {
      this.youthFacade.updateYouth(payload, this.youth.documentId ?? '').subscribe({
        next: () => {
          this.notificationService.success('Երիտասարդի տվյալները թարմացվել են');
          this.formSubmitted.emit();
        },
        error: () => {
          this.notificationService.error('Ինչ որ բան այն չէ, կրկին փորձեք');
        }
      })
    }

  }

  private initForm() {
    const fullNameArray = this.youth.fullName.split(' ');
    const firstName = fullNameArray[0] ?? '';
    const lastName = fullNameArray[1] ?? '';
    const patronymicName = fullNameArray?.[2] ?? '';
    if(typeof this.youth.avatar === 'object') {
      this.avatar.set(this.youth.avatarUrl ?? '')
    }
    this.youthData.set({
      firstName: firstName,
      lastName: lastName,
      patronymicName: patronymicName,
      phoneNumber: this.youth.phoneNumber ?? '',
      bdate: this.youth.bdate ? new Date(this.youth.bdate) : new Date(),
      isMarried: this.youth.familyStatus.toLowerCase() === 'ամուսնացած',
      additionalInfo: this.youth.additionalInfo ?? '',
      avatar: this.youth.avatarData?.id
    });
  }
}
