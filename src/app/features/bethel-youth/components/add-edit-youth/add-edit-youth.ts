import { Component, Input, OnInit, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Youth } from '../../models/youth.model';
import { initaialYouth } from '../../state/youth.state';
import { AddEditYouthForm } from '../add-edit-youth-form/add-edit-youth-form';

@Component({
  selector: 'bethel-add-edit-youth',
  imports: [DialogModule, AddEditYouthForm],
  templateUrl: './add-edit-youth.html',
  styleUrl: './add-edit-youth.scss',
})
export class AddEditYouth implements OnInit {
  @Input() youth = signal<Youth>(initaialYouth);
  @Input() visible = signal<boolean>(false);
  protected header = signal('Ավելացնել երիտասարդ');

  ngOnInit(): void {
    if(this.youth().id === -1) {
      this.header.set('Ավելացնել երիտասարդ');
    } else {
      this.header.set(`Փոփոխել ${this.youth().fullName}-ի տվյալները`);
    }
  }
}
