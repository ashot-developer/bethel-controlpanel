import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'bethel-info-card-widget',
  imports: [CardModule, NgClass],
  templateUrl: './info-card-widget.html',
  styleUrl: './info-card-widget.scss'
})
export class InfoCardWidget {
  public iconClass = input<string>('');
}
