import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataViewModule, DataViewPassThrough } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { UtilsService } from '../../shared/services/utils/utils-service';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ToastModule
  ],
  templateUrl: './bethel-youth.html',
  styleUrl: './bethel-youth.scss',
  providers: [MessageService]
})
export class BethelYouth {
  private readonly utilsService = inject(UtilsService);
  private messageService = inject(MessageService);

  options: any[] = ['list', 'grid'];
  layout = this.options[0];
  youths = signal<any[]>([]);
  loading = signal(false);
  searchQuery = signal('');

  ngOnInit() {
    this.loading.set(true);
    setTimeout(() => {
      this.youths.set([
        { 
          id: 1,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 2,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 3,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 4,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 5,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 6,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 7,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 8,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 9,
          full_name: "Մարկոսյան Աշոտ",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 10,
          full_name: "Մարկոսյան",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
        { 
          id: 11,
          full_name: "Մարկոսյան Աշոտ Ռոմենի",
          phone_number: "+37477123456",
          bdate: "2005-05-15",
          family_status: "Ամուսնացած",
          additional_info: "Additional information about Մարկոսյան Աշոտ.",
          avatar: "https://ca.slack-edge.com/T03K3DV30-U03HCHE7QKW-f40495aeab80-512"
        },
      ]);
      this.loading.set(false);
    }, 2000);
  }

  protected counterArray(n: number): any[] {
    return Array(n);
  }

  protected onCopyToClipboard(text: string) {
    this.utilsService.copyToClipboard(text).then(success => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Ու՜ռա', detail: 'Հեռախոսահամարը պատճենվել է' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Սխալ', detail: 'Հեռախոսահամարը չի պատճենվել' });
      }
    });
  }

  protected filteredYouths = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.youths();
    return this.youths().filter(y =>
      y.full_name.toLowerCase().includes(query)
    );
  });
}
