import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { YouthFacade } from './facades/youth.facade';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { AddEditYouthForm } from './components/add-edit-youth-form/add-edit-youth-form';

@Component({
  selector: 'bethel-youth',
  imports: [
    DataViewModule, 
    SelectButtonModule, 
    TagModule, 
    ButtonModule, 
    FormsModule, 
    NgClass, 
    SkeletonModule, 
    InputTextModule, 
    ToastModule,
    DialogModule, 
    AddEditYouthForm,
    ConfirmDialogModule
  ],
  templateUrl: './bethel-youth.html',
  styleUrl: './bethel-youth.scss',
  providers: [MessageService, ConfirmationService]
})
export class BethelYouth {
  private readonly utilsService = inject(UtilsService);
  private readonly messageService = inject(MessageService);
  protected readonly youthFacade = inject(YouthFacade);
  private confirmationService = inject(ConfirmationService);

  constructor() {
    effect(() => {
      if (this.youthFacade.vm.error()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Սխալ',
          detail: 'Չհաջողվեց բեռնել երիտասարդների ցուցակը'
        });
      }
    });
  }   

  options: any[] = ['list', 'grid'];
  layout = this.options[0];
  visible = signal<boolean>(false);
  header = signal('Ավելացնել երիտասարդ');

  ngOnInit() {
    this.youthFacade.loadYouthList();
  }

  protected counterArray(n: number): any[] {
    return Array(n);
  }

  protected onCopyToClipboard(text: string) {
    this.utilsService.copyToClipboard(text).then(success => {
      if (success) {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Ու՜ռա', 
          detail: 'Հեռախոսահամարը պատճենվել է' 
        });
      } else {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Սխալ', 
          detail: 'Հեռախոսահամարը չի պատճենվել' 
        });
      }
    });
  }

  protected onAddYouth(): void {
    this.youthFacade.setYouthId(-1);
    this.setDialogHeader();
    this.visible.set(true);
    
  }

  protected onEditYouth(id: number): void {
    this.youthFacade.setYouthId(id);
    this.setDialogHeader();
    this.visible.set(true);
  }

  protected onDeleteYouth(e: Event, documentId: string): void {
    this.confirmationService.confirm({
      target: e.target as EventTarget,
      message: 'Իրո՞ք ուզում ես ջնջել երիտասարդին',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Չեղարկել',
      header: 'Համոզվա՞ծ ես',
      rejectButtonProps: {
        label: 'Չեղարկել',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Ջնջել',
        severity: 'danger'
      },
      accept: () => {
        this.youthFacade.deleteYouth(documentId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Ու՜ռա', detail: 'Երիտասարդը ջնջվել է' });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Սխալ', detail: 'Չհաջողվեց ջնջել երիտասարդին' });
          }
        });
      },
    })
  }

  protected onFormSubmit() {
    this.visible.set(false);
  }

  private setDialogHeader() {
    const selectedYouth = this.youthFacade.vm.selectedYouth()
    if(selectedYouth?.id === -1) {
      this.header.set('Ավելացնել երիտասարդ');
    } else {
      this.header.set(`Փոփոխել ${selectedYouth?.fullName}-ի տվյալները`);
    }
  }
}
