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
import { MessageService } from 'primeng/api';
import { YouthFacade } from './facades/youth.facade';
import { AddEditYouth } from './components/add-edit-youth/add-edit-youth';

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
    AddEditYouth
  ],
  templateUrl: './bethel-youth.html',
  styleUrl: './bethel-youth.scss',
  providers: [MessageService]
})
export class BethelYouth {
  private readonly utilsService = inject(UtilsService);
  private readonly messageService = inject(MessageService);
  protected readonly youthFacade = inject(YouthFacade);

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
  showAddYouthModal = signal<boolean>(false);

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
    this.showAddYouthModal.set(true);
  }
}
